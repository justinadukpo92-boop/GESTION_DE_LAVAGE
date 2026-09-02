document.addEventListener('DOMContentLoaded', () => {
  // Ombre de la navbar au scroll
  const nav = document.querySelector('.bide-nav');
  if (nav) {
    const toggleShadow = () => {
      if (window.scrollY > 12) {
        nav.style.boxShadow = '0 8px 24px -18px rgba(0,25,70,0.25)';
      } else {
        nav.style.boxShadow = 'none';
      }
    };
    toggleShadow();
    window.addEventListener('scroll', toggleShadow, { passive: true });
  }

  // Validation du formulaire de contact (page contact.html)
  const form = document.getElementById('contact-form');
  if (form) {
    const feedback = document.getElementById('form-feedback');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nom = form.querySelector('#nom');
      const telephone = form.querySelector('#telephone');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');
      let valid = true;

      [nom, telephone, email, message].forEach((field) => field && field.classList.remove('is-invalid'));

      if (!nom.value.trim()) {
        nom.classList.add('is-invalid');
        valid = false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        email.classList.add('is-invalid');
        valid = false;
      }

      if (!telephone.value.trim()) {
        telephone.classList.add('is-invalid');
        valid = false;
      }

      if (message.value.trim().length < 10) {
        message.classList.add('is-invalid');
        valid = false;
      }

      if (!valid) {
        feedback.textContent = "Merci de corriger les champs en rouge avant d'envoyer.";
        feedback.className = 'mt-3 text-danger fw-semibold';
        return;
      }

      feedback.textContent = `Merci ${nom.value.trim()} ! Votre message a bien été reçu, nous revenons vers vous rapidement.`;
      feedback.className = 'mt-3 fw-semibold';
      feedback.style.color = '#167952';
      form.reset();
    });
  }
  // Animation des chiffres clés (compte de 0 jusqu'à la valeur finale)
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-count-to'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        el.textContent = current.toLocaleString('fr-FR') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((el) => observer.observe(el));
  }
});