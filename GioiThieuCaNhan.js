// Performance Manager Class
class PerformanceManager {
  constructor() {
    this.animations = new Map();
    this.observers = new Map();
    this.cachedElements = {};
    this.init();
  }

  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.setupGSAPAnimations();
    this.setupTypeIt();
    this.setupLogoClick();
    this.setupCursorEffects();
  }

  cacheElements() {
    this.cachedElements = {
      photos: document.querySelectorAll(".pic"),
      title: document.querySelectorAll(".favorite-title"),
      hobbiesContainer: document.querySelector(".hobbies-container"),
      sections: document.querySelectorAll("#intro,#favorite,#skills"),
      navLinks: document.querySelectorAll(".nav-link"),
      allSections: document.querySelectorAll("section"),
      cursor: document.querySelector(".cursor"),
      logo: document.querySelector(".Logo img"),
    };
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  setupEventListeners() {
    // Scroll highlight menu
    const handleScroll = this.debounce(() => {
      this.updateActiveNavigation();
    }, 16);

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Resize -> refresh ScrollTrigger
    window.addEventListener(
      "resize",
      this.debounce(() => {
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      }, 250),
      { passive: true }
    );

    // Section observers
    this.setupObservers();
  }

  updateActiveNavigation() {
    let current = "";
    const { allSections, navLinks } = this.cachedElements;

    allSections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.dataset.target === current) {
        link.classList.add("active");
      }
    });
  }

  setupObservers() {
    const { photos, title, hobbiesContainer, sections } = this.cachedElements;

    // Show elements sequentially
    const showSequentially = (elements, index = 0, delay = 300, callback) => {
      if (index >= elements.length) {
        if (callback) callback();
        return;
      }
      requestAnimationFrame(() => {
        elements[index].classList.add("show");
        setTimeout(() => {
          showSequentially(elements, index + 1, delay, callback);
        }, delay);
      });
    };

    const showPhotosSequentially = (elements, index = 0) => {
      if (index >= elements.length) return;
      requestAnimationFrame(() => {
        elements[index].classList.add("show");
        setTimeout(() => {
          showPhotosSequentially(elements, index + 1);
        }, 300);
      });
    };

    // Photo observer
    const createPhotoObserver = () => {
      const photoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const photos = entry.target.querySelectorAll(".photo");
              showPhotosSequentially(photos);
              photoObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
      );

      this.observers.set("photo", photoObserver);
      photos.forEach((photo) => photoObserver.observe(photo));
      showPhotosSequentially(photos);
    };

    // Main section observer
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showSequentially(title, 0, 300, () => {
              hobbiesContainer.classList.add("show");
              setTimeout(() => {
                createPhotoObserver();
              }, 400);
            });
            sectionObserver.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    this.observers.set("main", sectionObserver);
    sectionObserver.observe(document.querySelector(".my_favorite"));

    // General observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    this.observers.set("general", observer);
    sections.forEach((sec) => observer.observe(sec));
  }

  setupTypeIt() {
    if (typeof TypeIt !== "undefined") {
      new TypeIt("#type-it", {
        speed: 100,
        deleteSpeed: 50,
        loop: true,
        cursorSpeed: 800,
      })
        .type("💻 BackEnd Developer")
        .pause(1000)
        .delete()
        .type("27 Điện Biên =))")
        .pause(1000)
        .delete()
        .type("Uneti-er :v")
        .pause(1000)
        .delete()
        .go();
    }
  }

  setupLogoClick() {
    const { logo } = this.cachedElements;
    if (logo) {
      logo.addEventListener("click", function () {
        logo.classList.remove("jello-horizontal");
        void logo.offsetWidth; // Force reflow
        logo.classList.add("jello-horizontal");
      });
    }
  }

  setupCursorEffects() {
    const isMobile =
      window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) return;

    const { cursor } = this.cachedElements;
    if (!cursor) return;

    let lastHeartTime = 0;
    let heartPool = [];

    // Create heart pool (10 hearts)
    for (let i = 0; i < 10; i++) {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.innerHTML = "❤️";
      heart.style.fontSize = "16px";
      heart.style.color = "white";
      heart.style.display = "none";
      document.body.appendChild(heart);
      heartPool.push(heart);
    }

    let currentHeartIndex = 0;

    const createHeart = (x, y) => {
      const heart = heartPool[currentHeartIndex];
      currentHeartIndex = (currentHeartIndex + 1) % heartPool.length;

      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.display = "block";
      heart.style.animation = "none";

      requestAnimationFrame(() => {
        heart.style.animation = "heartFloat 2s ease-out forwards";
        setTimeout(() => {
          heart.style.display = "none";
        }, 2000);
      });
    };

    const handleMouseMove = this.throttle((e) => {
      cursor.style.left = `${e.pageX}px`;
      cursor.style.top = `${e.pageY}px`;

      const currentTime = Date.now();
      if (currentTime - lastHeartTime > 200) {
        createHeart(e.pageX, e.pageY);
        lastHeartTime = currentTime;
      }
    }, 16);

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    document.addEventListener(
      "mousedown",
      () => {
        cursor.style.width = "30px";
        cursor.style.height = "30px";
      },
      { passive: true }
    );

    document.addEventListener(
      "mouseup",
      () => {
        cursor.style.width = "20px";
        cursor.style.height = "20px";
      },
      { passive: true }
    );
  }

  setupGSAPAnimations() {
    if (typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    document.addEventListener("DOMContentLoaded", function () {
      const tl = gsap.timeline();

      tl.fromTo(
        "header",
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.2 }
      )
        .fromTo(
          ".Logo img",
          { opacity: 0, scale: 0.8, rotation: -10 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: "back.out(1.7)",
            delay: 0.5,
          },
          "-=0.5"
        )
        .fromTo(
          [".TieuDe h1", ".TieuDe h3", ".TieuDe h4"],
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.2,
          },
          "-=0.8"
        )
        .fromTo(
          ".TieuDe p",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.2,
          },
          "-=0.4"
        )
        .fromTo(
          ".KhoiNut .button",
          { opacity: 0, x: 100, scale: 0.8 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.1,
          },
          "-=0.4"
        );
      gsap.fromTo(
        ".about-me-section",
        {
          opacity: 0,
          x: -100,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".about-me-section",
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".name",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".DongMoTa",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".bio",
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".DongMoTa",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".NutCV button",
        {
          opacity: 0,
          y: 30,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".NutCV",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        ".favorite_content.active li",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".favorite_content.active ",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      ScrollTrigger.batch(".hobbies-container .card", {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 60, rotationX: 15 },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              stagger: 0.3,
              duration: 0.8,
              ease: "power2.out",
            }
          );
        },
        once: true,
        start: "top 80%",
      });

      ScrollTrigger.batch(".KhungKinhNghiem .Khung", {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 50, scale: 0.8 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.2,
              duration: 0.8,
              ease: "back.out(1.7)",
            }
          );
        },
        once: true,
        start: "top 80%",
      });

      ScrollTrigger.refresh();
    });
  }

  cleanup() {
    this.animations.forEach((animation) => {
      if (animation.kill) animation.kill();
    });
    this.animations.clear();

    this.observers.forEach((observer) => {
      if (observer.disconnect) observer.disconnect();
    });
    this.observers.clear();
  }
}

// Initialize
const perfManager = new PerformanceManager();

// Smooth Scroll Function
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const headerHeight = 66;
  const sectionTop = target.getBoundingClientRect().top;
  const scrollTop = sectionTop + window.pageYOffset - headerHeight;

  window.scrollTo({
    top: scrollTop,
    behavior: "smooth",
  });
}

// Cleanup before unload
window.addEventListener("beforeunload", () => {
  perfManager.cleanup();
});

//Hàm mở tab
function openTab(event, tabId) {
  // Ẩn tất cả content
  document
    .querySelectorAll(".favorite_content")
    .forEach((c) => c.classList.remove("active"));
  // Bỏ active ở tất cả nút
  document
    .querySelectorAll(".tab-link")
    .forEach((b) => b.classList.remove("active"));

  // Bật tab được chọn
  const actieContent = document.getElementById(tabId);
  actieContent.classList.add("active");
  event.currentTarget.classList.add("active");

  //Gọi animate cho tab vừa mở
  if (tabId === "skills_id") {
    animateTabContent(actieContent);
  } else {
    // 👉 Nếu không phải skills thì kill toàn bộ tween của skills
    gsap.killTweensOf("#skills_id li");
    gsap.set("#skills_id li", { clearProps: "all" }); // reset style nếu cần
  }
}
function animateTabContent(tabEl) {
  // Reset trạng thái ban đầu để GSAP có cái mà animate
  gsap.set(tabEl.querySelectorAll(".favorite_content.active li"), {
    opacity: 0,
    y: 30,
  });

  // Tạo lại animation GSAP cho content đang active
  gsap.fromTo(
    tabEl.querySelectorAll(".favorite_content.active li"),
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.2,
      scrollTrigger: {
        trigger: tabEl,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Refresh lại ScrollTrigger cho chắc chắn
  ScrollTrigger.refresh();
}
