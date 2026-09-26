/* =====================================================
   KAVYA S — PORTFOLIO JAVASCRIPT
   ===================================================== */


/* ================= MOBILE NAV ================= */

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {

  navToggle.addEventListener("click", () => {

    const isOpen =
      navLinks.classList.toggle("open");

    navToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  });


  navLinks.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

      navLinks.classList.remove("open");

      navToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });

}


/* ================= HEADER SCROLL ================= */

const header =
  document.querySelector(".site-header");

function updateHeader() {

  if (!header) return;

  if (window.scrollY > 30) {

    header.classList.add("scrolled");

  } else {

    header.classList.remove("scrolled");

  }

}

window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);

updateHeader();


/* ================= SCROLL REVEAL ================= */

const revealItems =
  document.querySelectorAll(".reveal");

const revealObserver =
  new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");

        observer.unobserve(entry.target);

      });

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );


revealItems.forEach((item, index) => {

  item.style.transitionDelay =
    `${Math.min(index * 35, 250)}ms`;

  revealObserver.observe(item);

});


/* ================= EMAILJS ================= */

const EMAILJS_CONFIG = {

  serviceId: "service_xppfscw",

  templateId: "template_kw7a97p",

  publicKey: "8QNgTmWWXFyXROLyl"

};


const contactForm =
  document.querySelector("#contact-form");

const nameInput =
  document.querySelector("#name");

const emailInput =
  document.querySelector("#email");

const messageInput =
  document.querySelector("#message");

const submitButton =
  document.querySelector("#contact-submit");

const formAlert =
  document.querySelector("#form-alert");


/* Initialize EmailJS */

function initializeEmailJS() {

  if (
    !window.emailjs ||
    window.location.protocol === "file:"
  ) {

    return false;
  }

  emailjs.init({
    publicKey:
      EMAILJS_CONFIG.publicKey
  });

  return true;
}


/* ================= FORM VALIDATION ================= */

function setFieldValidity(
  field,
  valid
) {

  if (!field) return;

  field.setAttribute(
    "aria-invalid",
    String(!valid)
  );

}


function resetFieldValidity() {

  [
    nameInput,
    emailInput,
    messageInput

  ].forEach((field) => {

    setFieldValidity(
      field,
      true
    );

  });

}


function validateForm() {

  const name =
    nameInput.value.trim();

  const email =
    emailInput.value.trim();

  const message =
    messageInput.value.trim();


  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  resetFieldValidity();


  if (!name) {

    setFieldValidity(
      nameInput,
      false
    );

    return {
      valid: false,
      message:
        "Please enter your name."
    };

  }


  if (
    !email ||
    !emailPattern.test(email)
  ) {

    setFieldValidity(
      emailInput,
      false
    );

    return {
      valid: false,
      message:
        "Please enter a valid email address."
    };

  }


  if (!message) {

    setFieldValidity(
      messageInput,
      false
    );

    return {
      valid: false,
      message:
        "Please enter your message."
    };

  }


  return {

    valid: true,

    data: {
      name,
      email,
      message
    }

  };

}


/* ================= FORM MESSAGE ================= */

function showFormAlert(
  message,
  type = ""
) {

  if (!formAlert) return;

  formAlert.textContent =
    message;

  formAlert.className =
    "form-alert";

  if (type) {

    formAlert.classList.add(
      type
    );

  }

}


/* ================= SUBMIT STATE ================= */

function setSubmittingState(
  submitting
) {

  if (!submitButton) return;

  submitButton.disabled =
    submitting;

  submitButton.innerHTML =
    submitting

      ? `
        Sending...
        <i class="fa-solid fa-spinner fa-spin"></i>
      `

      : `
        Send Message
        <i class="fa-solid fa-paper-plane"></i>
      `;

}


/* ================= SEND EMAIL ================= */

async function sendContactMessage(
  data
) {

  return emailjs.send(

    EMAILJS_CONFIG.serviceId,

    EMAILJS_CONFIG.templateId,

    {
      name: data.name,
      email: data.email,
      message: data.message
    }

  );

}


/* ================= FORM SUBMIT ================= */

async function handleContactSubmit(
  event
) {

  event.preventDefault();


  if (!contactForm) {
    return;
  }


  if (
    window.location.protocol === "file:"
  ) {

    showFormAlert(
      "Please open the website using Live Server or localhost.",
      "error"
    );

    return;
  }


  const validation =
    validateForm();


  if (!validation.valid) {

    showFormAlert(
      validation.message,
      "error"
    );

    return;
  }


  if (!window.emailjs) {

    showFormAlert(
      "Email service could not be loaded. Please try again.",
      "error"
    );

    return;
  }


  setSubmittingState(true);

  showFormAlert("");


  try {

    await sendContactMessage(
      validation.data
    );


    contactForm.reset();

    resetFieldValidity();


    showFormAlert(
      "Message sent successfully! I'll get back to you soon.",
      "success"
    );


  } catch (error) {

    console.error(
      "EmailJS Error:",
      error
    );


    showFormAlert(
      "Something went wrong. Please email me directly instead.",
      "error"
    );


  } finally {

    setSubmittingState(false);

  }

}


/* ================= INITIALIZE ================= */

if (contactForm) {

  initializeEmailJS();

  contactForm.addEventListener(
    "submit",
    handleContactSubmit
  );

}


/* ================= SMOOTH ACTIVE NAV ================= */

const sections =
  document.querySelectorAll(
    "section[id]"
  );

const navigationLinks =
  document.querySelectorAll(
    ".nav-links a"
  );


const activeSectionObserver =
  new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) {
          return;
        }


        navigationLinks.forEach(
          (link) => {

            link.classList.remove(
              "active"
            );

            if (
              link.getAttribute("href") ===
              `#${entry.target.id}`
            ) {

              link.classList.add(
                "active"
              );

            }

          }
        );

      });

    },

    {
      threshold: 0.35
    }

  );


sections.forEach((section) => {

  activeSectionObserver.observe(
    section
  );

});


/* ================= CURSOR EFFECT ================= */

/*
   Very subtle cursor glow.
   Disabled automatically on touch devices.
*/

const finePointer =
  window.matchMedia(
    "(pointer: fine)"
  ).matches;


if (finePointer) {

  const cursorGlow =
    document.createElement("div");

  cursorGlow.style.position =
    "fixed";

  cursorGlow.style.width =
    "180px";

  cursorGlow.style.height =
    "180px";

  cursorGlow.style.borderRadius =
    "50%";

  cursorGlow.style.pointerEvents =
    "none";

  cursorGlow.style.zIndex =
    "-1";

  cursorGlow.style.background =
    "rgba(122,45,58,0.045)";

  cursorGlow.style.filter =
    "blur(30px)";

  cursorGlow.style.transform =
    "translate(-50%, -50%)";

  cursorGlow.style.transition =
    "left 0.15s ease, top 0.15s ease";

  document.body.appendChild(
    cursorGlow
  );


  window.addEventListener(
    "mousemove",
    (event) => {

      cursorGlow.style.left =
        `${event.clientX}px`;

      cursorGlow.style.top =
        `${event.clientY}px`;

    },
    { passive: true }
  );

}