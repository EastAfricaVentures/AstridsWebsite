(function () {
  'use strict';

  const EMAILJS_PUBLIC_KEY = 'lmGeIihSu3bMa4D-7';
  const EMAILJS_SERVICE_ID = 'service_e4p4g9v';
  const EMAILJS_TEMPLATE_ID = 'template_i3uizcm';
  const CC_EMAILS = ['saninfo3@gmail.com', 'info@eastafricaventures.com'];
  const SUCCESS_MESSAGE = 'Sent. Thank you for your enquiry.';
  const SENDING_MESSAGE = 'Sending...';

  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  const form = document.getElementById('contact-form');
  const loading = form.querySelector('.loading');
  const errorMsg = form.querySelector('.error-message');
  const successMsg = form.querySelector('.sent-message');
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitText = submitBtn.textContent;

  function showState(state, msg) {
    loading.style.display = 'none';
    loading.setAttribute('aria-hidden', 'true');

    errorMsg.style.display = state === 'error' ? 'block' : 'none';
    successMsg.style.display = state === 'success' ? 'block' : 'none';

    if (state === 'error') {
      errorMsg.textContent = msg || 'Failed to send. Please try again.';
      successMsg.textContent = '';
      return;
    }

    if (state === 'success') {
      successMsg.textContent = msg || SUCCESS_MESSAGE;
      errorMsg.textContent = '';
      return;
    }

    errorMsg.textContent = '';
    successMsg.textContent = '';
  }

  function launchConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'contact-confetti';
    confetti.setAttribute('aria-hidden', 'true');

    const colors = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#20c997'];
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 56; index += 1) {
      const piece = document.createElement('span');
      piece.className = 'contact-confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = colors[index % colors.length];
      piece.style.animationDelay = `${Math.random() * 180}ms`;
      piece.style.animationDuration = `${900 + Math.random() * 700}ms`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      fragment.appendChild(piece);
    }

    confetti.appendChild(fragment);
    document.body.appendChild(confetti);
    window.setTimeout(function () {
      confetti.remove();
    }, 1800);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const country = document.getElementById('cf-country').value;
    const service = document.getElementById('cf-service').value;
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !country || !service || !message) {
      showState('error', 'Please fill in all fields before submitting.');
      return;
    }

    showState('loading');
    submitBtn.disabled = true;
    submitBtn.textContent = SENDING_MESSAGE;

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      name: name,
      email: email,
      reply_to: email,
      country: country,
      service: service,
      message: message,
      cc_email: CC_EMAILS[0],
      cc_email_2: CC_EMAILS[1],
      cc_emails: CC_EMAILS.join(', ')
    })
      .then(function () {
        showState('success');
        launchConfetti();
        form.reset();
      })
      .catch(function (err) {
        console.error('EmailJS error:', err);
        showState('error', 'Failed to send. Please try again or WhatsApp us directly.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = submitText;
      });
  });
})();
