(function () {
  'use strict';

  /* ─── YOUR EMAILJS CREDENTIALS ─────────────────────────────────────────── */
  /* Sign up free at https://www.emailjs.com                                  */
  /* Connect girish.eaventures@gmail.com as the Gmail service                 */
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  /* ──────────────────────────────────────────────────────────────────────── */

  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  const form       = document.getElementById('contact-form');
  const loading    = form.querySelector('.loading');
  const errorMsg   = form.querySelector('.error-message');
  const successMsg = form.querySelector('.sent-message');
  const submitBtn  = form.querySelector('button[type="submit"]');

  function showState(state, msg) {
    loading.style.display    = state === 'loading' ? 'block' : 'none';
    errorMsg.style.display   = state === 'error'   ? 'block' : 'none';
    successMsg.style.display = state === 'success' ? 'block' : 'none';
    if (state === 'error' && msg) errorMsg.textContent = msg;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const country = document.getElementById('cf-country').value;
    const service = document.getElementById('cf-service').value;
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !country || !service || !message) {
      showState('error', 'Please fill in all fields before submitting.');
      return;
    }

    showState('loading');
    submitBtn.disabled = true;

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  name,
      from_email: email,
      country:    country,
      service:    service,
      message:    message,
      to_email:   'girish.eaventures@gmail.com'
    })
      .then(function () {
        showState('success');
        form.reset();
      })
      .catch(function (err) {
        console.error('EmailJS error:', err);
        showState('error', 'Failed to send. Please try again or WhatsApp us directly.');
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });

})();
