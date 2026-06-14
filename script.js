// Do not open this page via file://. Use Live Server in VS Code or run it on localhost.
// EmailJS setup instructions:
// 1. Use Live Server in VS Code or serve the site from localhost or a deployed domain.
// 2. Replace YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, and YOUR_PUBLIC_KEY with values from the EmailJS dashboard.
// 3. In your EmailJS template, make sure the variables match exactly: {{name}}, {{email}}, and {{message}}.

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.section, .project-card, .skill-card, .timeline-item, .edu-card');

revealItems.forEach((item) => item.classList.add('reveal'));

document.querySelectorAll('[data-placeholder="true"]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const EMAILJS_CONFIG = {
  serviceId: 'service_xppfscw',
  templateId: 'template_kw7a97p',
  publicKey: '8QNgTmWWXFyXROLyl'
};

const contactForm = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const submitButton = document.querySelector('#contact-submit');
const formAlert = document.querySelector('#form-alert');

function initializeEmailJS() {
  if (!window.emailjs || window.location.protocol === 'file:' || !isConfiguredForEmailJS()) {
    return false;
  }

  emailjs.init(EMAILJS_CONFIG.publicKey);
  return true;
}

function setFieldValidity(field, isValid) {
  if (field) {
    field.setAttribute('aria-invalid', String(!isValid));
  }
}

function resetFieldValidity() {
  [nameInput, emailInput, messageInput].forEach((field) => setFieldValidity(field, true));
}

function showFormAlert(message, type) {
  if (!formAlert) {
    return;
  }

  formAlert.textContent = message;
  formAlert.className = 'form-alert';

  if (type) {
    formAlert.classList.add(`is-${type}`, 'is-visible');
  }
}

function setSubmittingState(isSubmitting) {
  if (!submitButton) {
    return;
  }

  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? 'Sending...' : 'Send Message';
}

function isConfiguredForEmailJS() {
  return !Object.values(EMAILJS_CONFIG).some((value) => value.startsWith('YOUR_'));
}

function validateForm() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  resetFieldValidity();

  if (!name) {
    setFieldValidity(nameInput, false);
    return { isValid: false, message: 'Please enter your name.' };
  }

  if (!email || !emailPattern.test(email)) {
    setFieldValidity(emailInput, false);
    return { isValid: false, message: 'Please enter a valid email address.' };
  }

  if (!message) {
    setFieldValidity(messageInput, false);
    return { isValid: false, message: 'Please enter your message.' };
  }

  return {
    isValid: true,
    data: { name, email, message }
  };
}

function sendContactMessage() {
  console.log('Sending EmailJS payload:', {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim()
  });

  return emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim()
  });
}

async function handleContactSubmit(event) {
  event.preventDefault();

  if (!contactForm) {
    return;
  }

  if (window.location.protocol === 'file:') {
    showFormAlert('Open this site using Live Server or localhost. EmailJS will not work from file://.', 'error');
    return;
  }

  const validation = validateForm();

  if (!validation.isValid) {
    showFormAlert(validation.message, 'error');
    return;
  }

  if (!window.emailjs || !isConfiguredForEmailJS()) {
    showFormAlert('Replace the EmailJS placeholder keys in script.js before sending messages.', 'error');
    return;
  }

  setSubmittingState(true);
  showFormAlert('', '');

  try {
    await sendContactMessage();
    contactForm.reset();
    resetFieldValidity();
    showFormAlert('Message sent successfully!', 'success');
  } catch (error) {
    console.error('EmailJS Error:', error);
    showFormAlert('Failed to send. Try again.', 'error');
  } finally {
    setSubmittingState(false);
  }
}

if (contactForm) {
  initializeEmailJS();
  contactForm.addEventListener('submit', handleContactSubmit);
}
