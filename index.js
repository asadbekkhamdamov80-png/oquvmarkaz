/**
 * ENGLISH LIFE O'QUV MARKAZI - ASOSIY JAVASCRIPT KODI (SCRIPT.JS)
 * Funksiyalar:
 * 1. Tun va Kun (Dark/Light) mavzulari va LocalStorage
 * 2. Mobil navigatsiya menyusi (Drawer)
 * 3. Kurslarni filtr qilish
 * 4. Interaktiv darajani aniqlash testi (English Level Quiz)
 * 5. FAQ Accordion tizimi
 * 6. Modal oyna va kurs tanlash
 * 7. Telefon raqami formatlash & Form yuborish (Toast notification)
 * 8. Scrollspy va Yuqoriga qaytish (Back to top)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ================= 1. TUN VA KUN (DARK / LIGHT) MAVZUSI ================= */
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Saqlangan mavzuni olish yoki brauzer tizimiga qarash
  const savedTheme = localStorage.getItem('english_life_theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    htmlRoot.setAttribute('data-theme', 'dark');
  } else {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  // Tugma bosilganda almashtirish
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('english_life_theme', newTheme);

      // Toast orqali foydalanuvchiga bildirish
      const modeName = newTheme === 'dark' ? "Tungi rejim yoqildi 🌙" : "Kunduzgi rejim yoqildi ☀️";
      showToast(modeName, "Mavzu muvaffaqiyatli o'zgartirildi.");
    });
  }


  /* ================= 2. MOBIL MENYU (DRAWER) ================= */
  const mobileToggle = document.getElementById('mobileToggle');
  const closeMobileMenu = document.getElementById('closeMobileMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMenu);
  if (closeMobileMenu) closeMobileMenu.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  /* ================= 3. SCROLLSPY VA HEADER EFFEKTI ================= */
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Headerga soya qo'shish
    if (scrollY > 30) {
      header.style.boxShadow = 'var(--shadow-md)';
    } else {
      header.style.boxShadow = 'none';
    }

    // Yuqoriga chiqish tugmasi
    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Scrollspy: faol havolani belgilash
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* ================= 4. KURSLAR FILTERI ================= */
  const filterTabs = document.querySelectorAll('.course-tab');
  const courseCards = document.querySelectorAll('.course-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Faol tabni belgilash
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      courseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* ================= 5. INTERAKTIV TEST (QUIZ) ================= */
  const quizQuestions = [
    {
      category: "Grammatika (Present Simple)",
      question: "1. She ___ to the gym three times a week.",
      options: [
        "go",
        "goes",
        "going",
        "gone"
      ],
      correctIndex: 1
    },
    {
      category: "Tenses & Conditionals",
      question: "2. If I had known about the meeting yesterday, I ___ attended.",
      options: [
        "would",
        "will have",
        "would have",
        "had"
      ],
      correctIndex: 2
    },
    {
      category: "Vocabulary & Meaning",
      question: "3. Choose the closest synonym for the word 'METICULOUS':",
      options: [
        "Careless and quick",
        "Extremely careful and precise",
        "Very confident",
        "Friendly and talkative"
      ],
      correctIndex: 1
    },
    {
      category: "Future Perfect",
      question: "4. By the time our teacher arrives tomorrow, we ___ the project.",
      options: [
        "finish",
        "have finished",
        "will have finished",
        "are finishing"
      ],
      correctIndex: 2
    },
    {
      category: "Linkers & Conjunctions",
      question: "5. He passed the exam with flying colors ___ having very little preparation time.",
      options: [
        "although",
        "despite",
        "because",
        "whereas"
      ],
      correctIndex: 1
    }
  ];

  let currentQuestionIndex = 0;
  let userScore = 0;

  const quizQuestionBox = document.getElementById('quizQuestionBox');
  const quizProgress = document.getElementById('quizProgress');
  const quizStepText = document.getElementById('quizStepText');
  const quizCategory = document.getElementById('quizCategory');
  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizResultBox = document.getElementById('quizResultBox');
  const resultLevel = document.getElementById('resultLevel');
  const resultComment = document.getElementById('resultComment');
  const restartQuizBtn = document.getElementById('restartQuizBtn');
  const quizEnrollBtn = document.getElementById('quizEnrollBtn');

  function renderQuestion() {
    const qData = quizQuestions[currentQuestionIndex];
    quizStepText.textContent = `Savol: ${currentQuestionIndex + 1} / ${quizQuestions.length}`;
    quizCategory.textContent = qData.category;
    quizQuestion.textContent = qData.question;
    
    // Progress bar
    const progressPercent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    quizProgress.style.width = `${progressPercent}%`;

    // Variantlarni tozalash va yaratish
    quizOptions.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    qData.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="option-prefix">${letters[idx]}</span>
        <span>${optText}</span>
      `;
      btn.addEventListener('click', () => selectOption(idx));
      quizOptions.appendChild(btn);
    });
  }

  function selectOption(selectedIdx) {
    const qData = quizQuestions[currentQuestionIndex];
    if (selectedIdx === qData.correctIndex) {
      userScore++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
      renderQuestion();
    } else {
      showQuizResults();
    }
  }

  function showQuizResults() {
    quizQuestionBox.classList.add('hidden');
    quizStepText.parentElement.classList.add('hidden');
    quizProgress.parentElement.classList.add('hidden');
    quizResultBox.classList.remove('hidden');

    let levelTitle = "";
    let levelAdvice = "";
    let recommendedCourse = "";

    if (userScore <= 1) {
      levelTitle = "Beginner (A1)";
      levelAdvice = "Siz ingliz tilini endi boshlayotgan ekansiz. General English (Starter) guruhimizda alifbodan boshlab mustahkam o'rganishingiz mumkin.";
      recommendedCourse = "General English";
    } else if (userScore === 2) {
      levelTitle = "Elementary (A2)";
      levelAdvice = "Sizda boshlang'ich bilim bor! So'z boyligingizni oshirish va sodda muloqot qilish uchun General English (Pre-Intermediate) kursi sizga mos.";
      recommendedCourse = "General English";
    } else if (userScore === 3) {
      levelTitle = "Intermediate (B1)";
      levelAdvice = "Ajoyib natija! Asosiy grammatikani yaxshi bilasiz. Endi erkin muloqot va IELTS ga tayyorgarlik kurslariga qo'shilishingiz mumkin.";
      recommendedCourse = "Spoken English";
    } else if (userScore === 4) {
      levelTitle = "Upper-Intermediate (B2)";
      levelAdvice = "Juda yuqori natija! Siz uchun IELTS Rocket 7.5+ yoki CEFR B2/C1 kursi ayni muddao. 3-4 oyda xalqaro sertifikat olishingiz mumkin!";
      recommendedCourse = "IELTS Rocket 7.5+";
    } else {
      levelTitle = "Advanced (C1) 🎯";
      levelAdvice = "Muborakbod etamiz, a'lo daraja (5/5)! Siz bemalol IELTS 8.0+ yoki xalqaro nufuzli grantlar uchun Intensive Masterclass guruhimizga qabul qilinasiz.";
      recommendedCourse = "IELTS Rocket 7.5+";
    }

    resultLevel.textContent = levelTitle;
    resultComment.textContent = levelAdvice;

    if (quizEnrollBtn) {
      quizEnrollBtn.setAttribute('data-course', recommendedCourse);
    }
  }

  if (restartQuizBtn) {
    restartQuizBtn.addEventListener('click', () => {
      currentQuestionIndex = 0;
      userScore = 0;
      quizResultBox.classList.add('hidden');
      quizQuestionBox.classList.remove('hidden');
      quizStepText.parentElement.classList.remove('hidden');
      quizProgress.parentElement.classList.remove('hidden');
      renderQuestion();
    });
  }

  // Boshlang'ich savolni chiqarish
  renderQuestion();


  /* ================= 6. FAQ ACCORDION ================= */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Boshqalarini yopish (bittalik akkordeon uslubi)
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });


  /* ================= 7. MODAL POPUP VA KURS TANLASH ================= */
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const openModalButtons = document.querySelectorAll('.open-modal-btn, .btn-enroll');
  const modalCourseSelect = document.getElementById('modalCourse');

  function openModal(courseName = '') {
    if (bookingModal) {
      bookingModal.classList.add('open');
      document.body.style.overflow = 'hidden';

      if (courseName && modalCourseSelect) {
        // Mos keluvchi optionni tanlash
        for (let i = 0; i < modalCourseSelect.options.length; i++) {
          if (modalCourseSelect.options[i].value.toLowerCase().includes(courseName.toLowerCase())) {
            modalCourseSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  }

  function closeModal() {
    if (bookingModal) {
      bookingModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const course = btn.getAttribute('data-course') || '';
      openModal(course);
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('open')) {
      closeModal();
    }
  });


  /* ================= 8. TELEFON RAQAM FORMATLASH & FORMA YUBORISH ================= */
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    // Standart +998 prefiksini qo'yish
    if (!input.value) {
      input.value = '+998 ';
    }

    input.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, ''); // faqat raqamlar
      if (!val.startsWith('998')) {
        val = '998' + val;
      }

      // Format: +998 (90) 123-45-67
      let formatted = '+998';
      if (val.length > 3) {
        formatted += ' (' + val.substring(3, 5);
      }
      if (val.length >= 5) {
        formatted += ') ' + val.substring(5, 8);
      }
      if (val.length >= 8) {
        formatted += '-' + val.substring(8, 10);
      }
      if (val.length >= 10) {
        formatted += '-' + val.substring(10, 12);
      }

      e.target.value = formatted;
    });

    input.addEventListener('focus', () => {
      if (!input.value || input.value.trim() === '') {
        input.value = '+998 ';
      }
    });
  });

  // Asosiy bog'lanish formasi
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('userName').value.trim();
      const course = document.getElementById('userCourse').value;

      showToast(
        "Arizangiz qabul qilindi! 🎉",
        `Hurmatli ${name}, operatorimiz tez orada siz bilan bog'lanadi.`
      );

      contactForm.reset();
      const phoneInput = contactForm.querySelector('input[type="tel"]');
      if (phoneInput) phoneInput.value = '+998 ';
    });
  }

  // Modal oynasidagi forma
  const modalForm = document.getElementById('modalForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value.trim();
      const course = document.getElementById('modalCourse').value;

      closeModal();

      showToast(
        "Muvaffaqiyatli ro'yxatdan o'tdingiz! 🎁",
        `Rahmat, ${name}! "${course}" kursi bo'yicha bepul sinov darsi joyingiz band qilindi.`
      );

      modalForm.reset();
      const phoneInput = modalForm.querySelector('input[type="tel"]');
      if (phoneInput) phoneInput.value = '+998 ';
    });
  }


  /* ================= 9. TOAST XABARNOMALARI (NOTIFICATION) ================= */
  const toast = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  const toastClose = document.getElementById('toastClose');
  let toastTimer = null;

  function showToast(title, message, isError = false) {
    if (!toast) return;

    if (toastTimer) clearTimeout(toastTimer);

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    if (isError) {
      toast.classList.add('toast-error');
    } else {
      toast.classList.remove('toast-error');
    }

    toast.classList.add('show');

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (toastClose) {
    toastClose.addEventListener('click', () => {
      toast.classList.remove('show');
    });
  }

});
