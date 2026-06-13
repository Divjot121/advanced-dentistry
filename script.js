/* ============================
   Dental Clinic Website
   Interactive JavaScript
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  // ===== APPLY SITE CONFIG =====
  const applyConfig = () => {
    if (typeof SITE_CONFIG === 'undefined') return;
    const C = SITE_CONFIG;

    // Helper: replace {{clinicName}} placeholders in a string
    const tpl = (str) => str
      .replace(/\{\{clinicName\}\}/g, C.clinicName)
      .replace(/\{\{clinicFullName\}\}/g, C.clinicFullName);

    // 1) data-config="key" → textContent from SITE_CONFIG[key]
    document.querySelectorAll('[data-config]').forEach(el => {
      const key = el.dataset.config;
      if (C[key] !== undefined) {
        el.textContent = tpl(String(C[key]));
      }
    });

    // 2) data-config-html="key" → innerHTML from SITE_CONFIG[key]
    document.querySelectorAll('[data-config-html]').forEach(el => {
      const key = el.dataset.configHtml;
      if (C[key] !== undefined) {
        el.innerHTML = tpl(String(C[key]));
      }
    });

    // 3) data-config-tpl="template string" → textContent with {{}} replaced
    document.querySelectorAll('[data-config-tpl]').forEach(el => {
      el.textContent = tpl(el.dataset.configTpl);
    });

    // 4) Page title & meta
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = `${C.clinicFullName} | Premier Dental Care in ${C.addressShort}`;

    const metaDesc = document.getElementById('meta-desc');
    if (metaDesc) metaDesc.setAttribute('content',
      `${C.clinicFullName} offers world-class dental care in ${C.addressShort}. Book appointments for dental implants, orthodontics, root canal, cosmetic dentistry, and more.`
    );

    // 5) Phone links
    const phoneClean = C.phone1.replace(/[\s\-()]/g, '');
    const navPhone = document.getElementById('nav-phone-link');
    if (navPhone) navPhone.setAttribute('href', `tel:${phoneClean}`);

    // 6) Stats
    const statYears = document.getElementById('stat-years');
    if (statYears) statYears.dataset.target = C.statYears;

    const statPatients = document.getElementById('stat-patients');
    if (statPatients) statPatients.dataset.target = C.statPatients;

    const statSpecialities = document.getElementById('stat-specialities');
    if (statSpecialities) statSpecialities.dataset.target = C.statSpecialities;

    // 7) WhatsApp FAB
    const waFab = document.getElementById('whatsapp-fab');
    if (waFab) {
      const waMsg = encodeURIComponent(`Hi, I would like to book an appointment at ${C.clinicFullName}`);
      waFab.setAttribute('href', `https://wa.me/${C.whatsappNumber}?text=${waMsg}`);
    }

    // 8) Footer copyright
    const copyright = document.getElementById('footer-copyright');
    if (copyright) copyright.innerHTML = `&copy; ${C.copyrightYear} ${C.clinicFullName}. All Rights Reserved.`;

    // 9) Success message in booking dialog
    const successMsg = document.getElementById('success-message');
    if (successMsg) successMsg.textContent = `Thank you for choosing ${C.clinicFullName}. We will send you a confirmation SMS shortly.`;

    // 10) Contact section — address, phones, email, hours, map
    const contactCards = document.querySelectorAll('.contact-card');
    if (contactCards.length >= 4) {
      // Address card
      const addrP = contactCards[0].querySelector('p');
      if (addrP) addrP.innerHTML = C.address;

      // Phone card
      const phoneDiv = contactCards[1].querySelector('div:last-child');
      if (phoneDiv) {
        const phone1Clean = C.phone1.replace(/[\s\-()]/g, '');
        const phone2Clean = C.phone2.replace(/[\s\-()]/g, '');
        phoneDiv.innerHTML = `<h4>Phone</h4><p><a href="tel:${phone1Clean}">${C.phone1}</a></p><p><a href="tel:${phone2Clean}">${C.phone2}</a></p>`;
      }

      // Hours card
      const hoursGrid = contactCards[2].querySelector('.hours-grid');
      if (hoursGrid && C.hours) {
        hoursGrid.innerHTML = `
          <span>${C.hours.weekdayLabel}</span><span>${C.hours.weekdays}</span>
          <span>${C.hours.weekendLabel}</span><span>${C.hours.weekend}</span>
          <span>Emergencies</span><span>${C.hours.emergency}</span>
        `;
      }

      // Email card
      const emailDiv = contactCards[3].querySelector('div:last-child');
      if (emailDiv) {
        emailDiv.innerHTML = `<h4>Email</h4><p><a href="mailto:${C.email}">${C.email}</a></p>`;
      }
    }

    // 11) Map
    const mapIframe = document.querySelector('.contact-map iframe');
    if (mapIframe && C.mapEmbedUrl) {
      mapIframe.setAttribute('src', C.mapEmbedUrl);
    }

    // 12) Doctors
    const doctorCards = document.querySelectorAll('.doctor-card');
    if (C.doctors && C.doctors.length) {
      C.doctors.forEach((doc, i) => {
        if (doctorCards[i]) {
          const info = doctorCards[i].querySelector('.doctor-info');
          if (info) {
            info.querySelector('h3').textContent = doc.name;
            info.querySelector('.doctor-specialty').textContent = doc.degree;
            info.querySelector('p').textContent = doc.bio;
          }
        }
      });
    }
  };

  applyConfig();

  // ===== NAVBAR =====
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Scroll effect for navbar
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id], header[id]');
  const observeNav = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          allNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
  );
  sections.forEach(section => observeNav.observe(section));

  // ===== ANIMATED COUNTER =====
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    let current = 0;

    const update = () => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        return;
      }
      el.textContent = current.toLocaleString();
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          statNumbers.forEach(el => animateCounter(el));
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) counterObserver.observe(heroStats);

  // ===== REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );
  revealElements.forEach(el => revealObserver.observe(el));

  // ===== TESTIMONIALS SLIDER =====
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  let currentSlide = 0;
  let slidesPerView = 3;
  let autoSlideInterval;

  const updateSlidesPerView = () => {
    if (window.innerWidth <= 768) {
      slidesPerView = 1;
    } else if (window.innerWidth <= 1024) {
      slidesPerView = 2;
    } else {
      slidesPerView = 3;
    }
  };

  const getTotalSlides = () => Math.max(1, cards.length - slidesPerView + 1);

  const updateSlider = () => {
    if (!track || cards.length === 0) return;
    const cardWidth = cards[0].offsetWidth + 24; // + gap
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

    // Update dots
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  };

  const createDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const total = getTotalSlides();
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        currentSlide = i;
        updateSlider();
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % getTotalSlides();
    updateSlider();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + getTotalSlides()) % getTotalSlides();
    updateSlider();
  };

  const startAutoSlide = () => {
    autoSlideInterval = setInterval(nextSlide, 5000);
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  };

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

  const initSlider = () => {
    updateSlidesPerView();
    currentSlide = 0;
    createDots();
    updateSlider();
  };

  initSlider();
  startAutoSlide();
  window.addEventListener('resize', () => {
    updateSlidesPerView();
    currentSlide = Math.min(currentSlide, getTotalSlides() - 1);
    createDots();
    updateSlider();
  });

  // ===== BOOKING DIALOG =====
  const dialog = document.getElementById('booking-dialog');
  const bookingForm = document.getElementById('booking-form');
  const closeBtn = document.getElementById('dialog-close');
  const bookButtons = document.querySelectorAll('#btn-book-nav, #btn-book-hero, #btn-book-cta');
  const serviceLinks = document.querySelectorAll('.service-link');
  const closeSuccessBtn = document.getElementById('btn-close-success');

  let currentFormStep = 1;

  const openDialog = (service = '') => {
    if (!dialog) return;
    currentFormStep = 1;
    updateFormStep(1);
    bookingForm.reset();
    clearAllErrors();

    // Set minimum date to today
    const dateInput = document.getElementById('appt-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    // Pre-select service if provided
    if (service) {
      const serviceSelect = document.getElementById('service-select');
      if (serviceSelect) serviceSelect.value = service;
    }

    dialog.showModal();
  };

  const closeDialog = () => {
    if (dialog) dialog.close();
  };

  bookButtons.forEach(btn => {
    btn.addEventListener('click', () => openDialog());
  });

  serviceLinks.forEach(link => {
    link.addEventListener('click', () => {
      const service = link.dataset.service || '';
      openDialog(service);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDialog);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeDialog);

  // Close on backdrop click
  if (dialog) {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeDialog();
    });
  }

  // Form Step Navigation
  const updateFormStep = (step) => {
    currentFormStep = step;

    // Update form steps visibility
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    const targetStep = document.querySelector(`[data-form-step="${step}"]`);
    if (targetStep) targetStep.classList.add('active');

    // Update step indicators
    document.querySelectorAll('.booking-steps .step').forEach(s => {
      const sNum = parseInt(s.dataset.step, 10);
      s.classList.remove('active', 'completed');
      if (sNum === step) s.classList.add('active');
      else if (sNum < step) s.classList.add('completed');
    });

    // Update step lines
    const stepLines = document.querySelectorAll('.step-line');
    stepLines.forEach((line, i) => {
      line.classList.toggle('completed', i + 1 < step);
    });

    // Populate summary on step 3
    if (step === 3) populateSummary();
  };

  // Next/Prev buttons
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.dataset.next, 10);
      if (validateStep(currentFormStep)) {
        updateFormStep(nextStep);
      }
    });
  });

  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.dataset.prev, 10);
      updateFormStep(prevStep);
    });
  });

  // Validation
  const showError = (fieldId, errorId, message) => {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field) field.classList.add('error');
    if (error) error.textContent = message;
  };

  const clearError = (fieldId, errorId) => {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field) field.classList.remove('error');
    if (error) error.textContent = '';
  };

  const clearAllErrors = () => {
    document.querySelectorAll('.form-error').forEach(e => e.textContent = '');
    document.querySelectorAll('.error').forEach(e => e.classList.remove('error'));
  };

  // Clear error on input
  ['patient-name', 'patient-phone', 'patient-email', 'patient-age', 'service-select', 'appt-date', 'appt-time'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        clearError(id, id.replace('patient-', '').replace('appt-', '').replace('service-select', 'service') + '-error');
      });
      el.addEventListener('change', () => {
        clearError(id, id.replace('patient-', '').replace('appt-', '').replace('service-select', 'service') + '-error');
      });
    }
  });

  const validateStep = (step) => {
    let isValid = true;

    if (step === 1) {
      const name = document.getElementById('patient-name').value.trim();
      const phone = document.getElementById('patient-phone').value.trim();
      const email = document.getElementById('patient-email').value.trim();
      const age = document.getElementById('patient-age').value.trim();

      if (!name) {
        showError('patient-name', 'name-error', 'Please enter your full name');
        isValid = false;
      } else {
        clearError('patient-name', 'name-error');
      }

      if (!phone) {
        showError('patient-phone', 'phone-error', 'Please enter your phone number');
        isValid = false;
      } else if (!/^[\d+\-\s()]{10,15}$/.test(phone)) {
        showError('patient-phone', 'phone-error', 'Please enter a valid phone number');
        isValid = false;
      } else {
        clearError('patient-phone', 'phone-error');
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('patient-email', 'email-error', 'Please enter a valid email address');
        isValid = false;
      } else {
        clearError('patient-email', 'email-error');
      }

      if (!age || age < 1 || age > 120) {
        showError('patient-age', 'age-error', 'Please enter a valid age');
        isValid = false;
      } else {
        clearError('patient-age', 'age-error');
      }
    }

    if (step === 2) {
      const service = document.getElementById('service-select').value;
      const date = document.getElementById('appt-date').value;
      const time = document.getElementById('appt-time').value;

      if (!service) {
        showError('service-select', 'service-error', 'Please select a service');
        isValid = false;
      } else {
        clearError('service-select', 'service-error');
      }

      if (!date) {
        showError('appt-date', 'date-error', 'Please select a date');
        isValid = false;
      } else {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          showError('appt-date', 'date-error', 'Please select a future date');
          isValid = false;
        } else {
          clearError('appt-date', 'date-error');
        }
      }

      if (!time) {
        showError('appt-time', 'time-error', 'Please select a time slot');
        isValid = false;
      } else {
        clearError('appt-time', 'time-error');
      }
    }

    return isValid;
  };

  // Populate summary
  const populateSummary = () => {
    const grid = document.getElementById('summary-grid');
    if (!grid) return;

    const name = document.getElementById('patient-name').value.trim();
    const phone = document.getElementById('patient-phone').value.trim();
    const email = document.getElementById('patient-email').value.trim();
    const age = document.getElementById('patient-age').value.trim();
    const service = document.getElementById('service-select').value;
    const date = document.getElementById('appt-date').value;
    const time = document.getElementById('appt-time').value;
    const notes = document.getElementById('appt-notes').value.trim();

    const formatDate = (dateStr) => {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    let html = `
      <span class="summary-label">Name:</span><span class="summary-value">${name}</span>
      <span class="summary-label">Phone:</span><span class="summary-value">${phone}</span>
    `;
    if (email) html += `<span class="summary-label">Email:</span><span class="summary-value">${email}</span>`;
    html += `
      <span class="summary-label">Age:</span><span class="summary-value">${age} years</span>
      <span class="summary-label">Service:</span><span class="summary-value">${service}</span>
      <span class="summary-label">Date:</span><span class="summary-value">${formatDate(date)}</span>
      <span class="summary-label">Time:</span><span class="summary-value">${time}</span>
    `;
    if (notes) html += `<span class="summary-label">Notes:</span><span class="summary-value">${notes}</span>`;

    grid.innerHTML = html;
  };

  // Form Submit
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patient-name').value.trim();
      const service = document.getElementById('service-select').value;
      const date = document.getElementById('appt-date').value;
      const time = document.getElementById('appt-time').value;

      const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
      };

      // Show success
      const successDetails = document.getElementById('success-details');
      if (successDetails) {
        successDetails.textContent = `${name} — ${service} on ${formatDate(date)} at ${time}`;
      }

      updateFormStep('success');

      // In production, you would send this data to a backend API
      console.log('Appointment booked:', {
        name,
        phone: document.getElementById('patient-phone').value.trim(),
        email: document.getElementById('patient-email').value.trim(),
        age: document.getElementById('patient-age').value.trim(),
        service,
        date,
        time,
        notes: document.getElementById('appt-notes').value.trim()
      });
    });
  }

  // ===== NEWSLETTER FORM =====
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        const originalText = newsletterForm.querySelector('button').textContent;
        newsletterForm.querySelector('button').textContent = '✓ Subscribed!';
        emailInput.value = '';
        setTimeout(() => {
          newsletterForm.querySelector('button').textContent = originalText;
        }, 3000);
      }
    });
  }

  // ===== SMOOTH SCROLL for anchors =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
