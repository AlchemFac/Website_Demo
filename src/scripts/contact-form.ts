import { formContent, formMessages } from '../config/contactContent';

interface TurnstileAPI {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      size: 'compact';
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    },
  ): string;
  reset(widgetId: string): void;
}
declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
if (form) {
  const endpoint = form.dataset.endpoint ?? '';
  const siteKey = form.dataset.siteKey ?? '';
  const configured = Boolean(endpoint && siteKey);
  // Defense in depth: never send contact data to an arbitrary configured URL.
  const allowedEndpoint =
    /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]{6,64}$/.test(endpoint);
  const section = form.closest('section')!;
  const controls = Array.from(
    form.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >('input:not([name="_gotcha"]):not([type="hidden"]), textarea, select'),
  );
  const summary = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const status = section.querySelector<HTMLElement>('[data-form-status]')!;
  const submissionError = section.querySelector<HTMLElement>(
    '[data-submission-error]',
  )!;
  const fieldset = form.querySelector<HTMLFieldSetElement>('fieldset')!;
  const submit = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  )!;
  const newInquiry =
    section.querySelector<HTMLButtonElement>('[data-new-inquiry]')!;
  const captchaContainer = form.querySelector<HTMLElement>('[data-turnstile]');
  const captchaMessage = form.querySelector<HTMLElement>(
    '[data-captcha-error]',
  );
  const retryCaptcha = form.querySelector<HTMLButtonElement>(
    '[data-captcha-retry]',
  );
  const touched = new Set<string>();
  let attempted = false;
  let pending = false;
  let completed = false;
  let captchaToken = '';
  let widgetId: string | undefined;
  let loadingCaptcha = false;
  const initialLabel = submit.textContent ?? formContent.configuredSubmit;
  const clearSubmissionError = () => {
    submissionError.hidden = true;
    submissionError.textContent = '';
  };
  const showSubmissionError = (message: string) => {
    submissionError.textContent = message;
    submissionError.hidden = false;
    submissionError.focus();
  };
  const getError = (field: (typeof controls)[number]) => {
    const value = field.value.trim();
    if (field.required && !value) {
      const messages: Record<string, string> = {
        name: 'Enter your name.',
        email: 'Enter your email address.',
        service: 'Choose a service or “Not sure yet”.',
        message: formMessages.requiredMessage,
      };
      return messages[field.name] ?? 'Complete this field.';
    }
    if (field.name === 'email' && field.validity.typeMismatch)
      return 'Enter a valid email address, such as name@example.com.';
    if (
      field.name === 'phone' &&
      value &&
      (!/^[+\d\s().-]+$/.test(value) ||
        value.replace(/\D/g, '').length < 7 ||
        value.replace(/\D/g, '').length > 15)
    )
      return 'Enter 7–15 digits using only +, spaces, parentheses, dots, or hyphens, or leave phone blank.';
    if (
      'maxLength' in field &&
      field.maxLength > 0 &&
      value.length > field.maxLength
    )
      return 'Shorten this entry to the stated maximum length.';
    return '';
  };
  const setFieldError = (field: (typeof controls)[number], message: string) => {
    const output = form.querySelector<HTMLElement>(`#${field.name}-error`)!;
    output.textContent = message;
    output.hidden = !message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
  };
  const validate = (field: (typeof controls)[number]) => {
    const error = getError(field);
    setFieldError(field, error);
    return !error;
  };
  const updateSummary = () => {
    const count = controls.filter((field) => getError(field)).length;
    summary.hidden = !count;
    summary.textContent = count
      ? `Please check ${count} ${count === 1 ? 'field' : 'fields'} below. Nothing has been sent.`
      : '';
  };
  const captchaProblem = () => {
    captchaToken = '';
    if (captchaMessage)
      captchaMessage.textContent =
        'Spam protection is unavailable or expired. Retry it before submitting.';
    if (retryCaptcha) retryCaptcha.hidden = false;
  };
  const resetCaptcha = () => {
    captchaToken = '';
    try {
      if (widgetId !== undefined) window.turnstile?.reset(widgetId);
    } catch {
      captchaProblem();
    }
  };
  const loadCaptcha = async () => {
    if (!configured || !captchaContainer || loadingCaptcha) return;
    loadingCaptcha = true;
    if (retryCaptcha) {
      retryCaptcha.hidden = true;
      retryCaptcha.disabled = true;
    }
    if (captchaMessage) captchaMessage.textContent = 'Loading spam protection…';
    try {
      if (!window.turnstile)
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src =
            'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
          script.async = true;
          const timer = window.setTimeout(() => {
            script.remove();
            reject(new Error('Captcha unavailable'));
          }, 12000);
          script.onload = () => {
            window.clearTimeout(timer);
            if (window.turnstile) resolve();
            else {
              script.remove();
              reject(new Error('Captcha unavailable'));
            }
          };
          script.onerror = () => {
            window.clearTimeout(timer);
            script.remove();
            reject(new Error('Captcha unavailable'));
          };
          document.head.append(script);
        });
      if (widgetId !== undefined) resetCaptcha();
      else
        widgetId = window.turnstile!.render(captchaContainer, {
          sitekey: siteKey,
          size: 'compact',
          callback: (token) => {
            captchaToken = token;
            if (captchaMessage)
              captchaMessage.textContent = 'Spam check complete.';
            if (retryCaptcha) retryCaptcha.hidden = true;
          },
          'expired-callback': captchaProblem,
          'error-callback': captchaProblem,
        });
    } catch {
      captchaProblem();
    } finally {
      loadingCaptcha = false;
      if (retryCaptcha) retryCaptcha.disabled = false;
    }
  };
  retryCaptcha?.addEventListener('click', () => void loadCaptcha());
  controls.forEach((field) => {
    field.addEventListener('blur', () => {
      if (pending || completed) return;
      touched.add(field.name);
      validate(field);
    });
    for (const event of ['input', 'change'])
      field.addEventListener(event, () => {
        if (pending || completed) return;
        status.textContent = '';
        clearSubmissionError();
        if (attempted || touched.has(field.name)) validate(field);
        if (attempted) updateSummary();
      });
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending || completed) return;
    attempted = true;
    status.textContent = '';
    clearSubmissionError();
    const results = controls.map((field) => validate(field));
    updateSummary();
    const invalidIndex = results.indexOf(false);
    if (invalidIndex !== -1) {
      controls[invalidIndex].focus();
      return;
    }
    if (!configured) {
      status.textContent = formMessages.offlineSuccess;
      return;
    }
    if (!allowedEndpoint) {
      showSubmissionError(
        'Sending is unavailable because the form configuration is invalid. Please contact the site owner.',
      );
      return;
    }
    if (!captchaToken) {
      captchaProblem();
      captchaContainer?.focus();
      return;
    }
    const honeypot = form.querySelector<HTMLInputElement>('[name="_gotcha"]')!;
    if (honeypot.value) {
      showSubmissionError(
        'Unable to submit this inquiry. Reload the page and try again.',
      );
      return;
    }
    // Explicit allowlist avoids sending incidental form fields. Never log this payload.
    const payload = new FormData();
    controls.forEach((field) => payload.set(field.name, field.value.trim()));
    payload.set('_gotcha', honeypot.value);
    payload.set('cf-turnstile-response', captchaToken);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);
    pending = true;
    fieldset.disabled = true;
    form.setAttribute('aria-busy', 'true');
    submit.textContent = 'Sending…';
    status.textContent = formMessages.sendingStatus;
    let fieldToFocus: (typeof controls)[number] | undefined;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' },
        credentials: 'omit',
        referrerPolicy: 'origin',
        redirect: 'error',
        signal: controller.signal,
      });
      // Read only structured responses. Never echo raw provider messages or payloads.
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 429)
          showSubmissionError(
            'The form service is receiving too many requests. Please wait before trying again. Your entries are still here.',
          );
        else if (response.status === 400 || response.status === 422) {
          const errors =
            data &&
            typeof data === 'object' &&
            'errors' in data &&
            Array.isArray(data.errors)
              ? data.errors
              : [];
          const rejected = controls.filter((field) =>
            errors.some(
              (error) =>
                error &&
                typeof error === 'object' &&
                'field' in error &&
                error.field === field.name,
            ),
          );
          rejected.forEach((field) =>
            setFieldError(
              field,
              'The form service could not accept this field. Please check it and try again.',
            ),
          );
          showSubmissionError(
            'The form service could not accept the inquiry. Check the fields and spam verification, then try again. Your entries are still here.',
          );
          fieldToFocus = rejected[0];
        } else if ([401, 403, 404].includes(response.status))
          showSubmissionError(
            'The form service could not accept this request. Please ask the site owner to check the form setup and allowed domain. Your entries are still here.',
          );
        else
          showSubmissionError(
            'The form service is unavailable. Your entries are still here. Delivery was not confirmed; please wait before trying again.',
          );
        status.textContent = '';
        return;
      }
      if (
        !data ||
        typeof data !== 'object' ||
        !('ok' in data) ||
        data.ok !== true
      ) {
        status.textContent = '';
        showSubmissionError(
          'The form service returned an unexpected response. Acceptance was not confirmed. Your entries are still here; check with the site owner before resubmitting.',
        );
        return;
      }
      completed = true;
      status.textContent = formMessages.acceptedStatus;
      submit.textContent = formMessages.acceptedLabel;
      newInquiry.hidden = false;
    } catch {
      status.textContent = '';
      showSubmissionError(
        'We could not confirm acceptance. Check your connection and wait before trying again. Your entries are still here; the service may already have received the inquiry.',
      );
    } finally {
      window.clearTimeout(timer);
      pending = false;
      form.setAttribute('aria-busy', 'false');
      fieldset.disabled = completed;
      if (!completed) submit.textContent = initialLabel;
      resetCaptcha();
      if (completed) status.focus();
      else fieldToFocus?.focus();
    }
  });
  newInquiry.addEventListener('click', () => {
    completed = false;
    form.reset();
    fieldset.disabled = false;
    attempted = false;
    touched.clear();
    controls.forEach((field) => {
      field.removeAttribute('aria-invalid');
      const output = form.querySelector<HTMLElement>(`#${field.name}-error`)!;
      output.textContent = '';
      output.hidden = true;
    });
    summary.hidden = true;
    summary.textContent = '';
    clearSubmissionError();
    status.textContent = '';
    newInquiry.hidden = true;
    submit.textContent = initialLabel;
    resetCaptcha();
    controls[0]?.focus();
  });
  form.noValidate = true;
  fieldset.disabled = false;
  if (configured) void loadCaptcha();
}
export {};
