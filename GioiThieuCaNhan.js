// const photos = document.querySelectorAll(".pic"); // Chọn đúng các phần tử ảnh
// const title = document.querySelectorAll(".favorite-title");
// const hobbiesContainer = document.querySelector(".hobbies-container");

// // Hiển thị ảnh lần lượt khi cuộn tới
// const showPhotosSequentially = (elements, index = 0) => {
//   if (index >= elements.length) return;
//   elements[index].classList.add("show");
//   setTimeout(() => {
//     showPhotosSequentially(elements, index + 1);
//   }, 300);
// };

// const showTextAboutme = (elements, index = 0) => {
//   if (index >= elements.length) return;
//   elements[index].classList.add("show");
//   setTimeout(() => {
//     showTextAboutme(elements, index + 1);
//   }, 300);
// };

// // Tạo Intersection Observer cho từng ảnh với hiệu ứng mượt mà hơn
// const createPhotoObserver = () => {
//   const photoObserver = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry, index) => {
//         if (entry.isIntersecting) {
//           const photo = entry.target;
//           // Thêm độ trễ tăng dần cho mỗi ảnh để tạo hiệu ứng lần lượt
//           const delay = 150 * (index % 3); // Mỗi cột có độ trễ khác nhau
//           setTimeout(() => {
//             photo.classList.add("show");
//           }, delay);
//           photoObserver.unobserve(photo);
//         }
//       });
//     },
//     { threshold: 0.15, rootMargin: "0px 0px -50px 0px" } // Tăng ngưỡng và thêm rootMargin
//   );

//   // Theo dõi tất cả các ảnh
//   photos.forEach((photo) => {
//     photoObserver.observe(photo);
//   });
// };

// // Khi .my_favorite cuộn vào màn hình
// const sectionObserver = new IntersectionObserver(
//   (entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         showTextAboutme(title);
//         // Thêm hiệu ứng cho hobbies-container với độ trễ
//         setTimeout(() => {
//           hobbiesContainer.classList.add("show");
//         }, 300);
//         createPhotoObserver();
//         sectionObserver.disconnect();
//       }
//     });
//   },
//   { threshold: 0.1 }
// );

// sectionObserver.observe(document.querySelector(".my_favorite")); // Bắt đầu theo dõi .my_favorite
const photos = document.querySelectorAll(".pic"); // Chọn đúng các phần tử ảnh
const title = document.querySelectorAll(".favorite-title");
const hobbiesContainer = document.querySelector(".hobbies-container");

// Hiển thị từng phần tử lần lượt
const showSequentially = (elements, index = 0, delay = 300, callback) => {
  if (index >= elements.length) {
    if (callback) callback();
    return;
  }
  elements[index].classList.add("show");
  setTimeout(() => {
    showSequentially(elements, index + 1, delay, callback);
  }, delay);
};

// Hiển thị ảnh lần lượt
const showPhotosSequentially = (elements, index = 0) => {
  if (index >= elements.length) return;
  elements[index].classList.add("show");
  setTimeout(() => {
    showPhotosSequentially(elements, index + 1);
  }, 300);
};

// Intersection Observer cho ảnh
const createPhotoObserver = () => {
  const photoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          photoObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  );

  photos.forEach((photo) => photoObserver.observe(photo));

  // Sau khi đã quan sát, bắt đầu hiện tuần tự
  showPhotosSequentially(photos);
};

// Khi .my_favorite cuộn vào màn hình
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // B1: Hiện title
        showSequentially(title, 0, 300, () => {
          // B2: Sau khi title xong thì hiện hobbies-container
          hobbiesContainer.classList.add("show");

          // B3: Delay một chút rồi mới hiện ảnh
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

sectionObserver.observe(document.querySelector(".my_favorite"));

//Hàm cuộn tới section
function scrollToSection(id) {
  const taget = document.getElementById(id);
  if (!taget) return;
  const chieucaoHeader = 66;
  const khoachcachSectionvaDinh = taget.getBoundingClientRect().top;
  const toadocuontoi =
    khoachcachSectionvaDinh + window.pageYOffset - chieucaoHeader;
  window.scrollTo({
    top: toadocuontoi,
    behavior: "smooth",
  });
}
// Hiệu ứng chuột
const cursor = document.querySelector(".cursor");
let lastHeartTime = 0; // tạo biến để lưu thời gian của lần cuối cùng chuột rơi trái tim
document.addEventListener("mousemove", (e) => {
  // sự kiện di chuyển chuột
  cursor.style.left = `${e.pageX}px`; // đặt vị trí của chuột
  cursor.style.top = `${e.pageY}px`; // đặt vị trí của chuột

  const currentTime = Date.now(); // lấy thời gian hiện tại
  if (currentTime - lastHeartTime > 150) {
    // nếu thời gian hiện tại - thời gian lần cuối cùng chuột rơi trái tim lớn hơn 150 giây
    const heart = document.createElement("div"); // tạo phần tử div
    heart.className = "heart"; // đặt tên class cho div
    heart.style.left = `${e.pageX}px`; // đặt vị trí của trái tim
    heart.style.top = `${e.pageY}px`; // đặt vị trí của trái tim
    document.body.appendChild(heart); // thêm trái tim vào body
    setTimeout(() => heart.remove(), 2000); // xóa trái tim sau 2 giây
    lastHeartTime = currentTime; // cập nhật thời gian của lần cuối cùng chuột rơi trái tim
    heart.innerHTML = "❤️"; // thêm biểu tượng trái tim vào phần tử
    heart.style.fontSize = "16px"; // đặt kích thước của trái tim
    heart.style.color = "white"; // đặt màu sắc của trái tim
  }
});
document.addEventListener("mousedown", () => {
  cursor.style.width = "30px";
  cursor.style.height = "30px";
});
document.addEventListener("mouseup", () => {
  cursor.style.width = "20px";
  cursor.style.height = "20px";
});

//Hàm viết xóa chữ
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
//Hàm click vào LoGo
document.addEventListener("DOMContentLoaded", function () {
  const logo = document.querySelector(".Logo img");
  logo.addEventListener("click", function () {
    // Gỡ class cũ nếu có để tái kích hoạt animation
    logo.classList.remove("jello-horizontal");

    // Trigger lại hiệu ứng bằng cách dùng setTimeout
    void logo.offsetWidth; // force reflow
    logo.classList.add("jello-horizontal");
  });
});
//HÀM TÔ MÀU MENU Ở SECTION TƯƠNG ỨNG
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
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
});

// Đăng ký plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Đợi DOM load xong
document.addEventListener("DOMContentLoaded", function () {
  // Hiệu ứng fade in cho header
  gsap.fromTo(
    "header",
    {
      opacity: 0,
      y: -50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      delay: 0.2,
    }
  );

  // Hiệu ứng fade in cho logo trong intro section
  gsap.fromTo(
    ".Logo img",
    {
      opacity: 0,
      scale: 0.8,
      rotation: -10,
    },
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      ease: "back.out(1.7)",
      delay: 0.5,
    }
  );

  // Hiệu ứng fade in cho tiêu đề chính
  gsap.fromTo(
    ".TieuDe h1",
    {
      opacity: 0,
      x: -100,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.7,
    }
  );

  gsap.fromTo(
    ".TieuDe h3",
    {
      opacity: 0,
      x: -80,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.9,
    }
  );

  gsap.fromTo(
    ".TieuDe h4",
    {
      opacity: 0,
      x: -60,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 1.1,
    }
  );

  // Hiệu ứng fade in cho paragraphs
  gsap.fromTo(
    ".TieuDe p",
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 1.3,
      stagger: 0.2,
    }
  );

  // Hiệu ứng fade in cho các nút contact
  gsap.fromTo(
    ".KhoiNut .button",
    {
      opacity: 0,
      x: 100,
      scale: 0.8,
    },
    {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
      delay: 1.5,
      stagger: 0.1,
    }
  );

  // Hiệu ứng fade in cho About Me section khi scroll
  gsap.fromTo(
    ".favorite-title h2",
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".my_favorite",
        start: "top 80%",
        end: "top 30%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Hiệu ứng fade in cho phần About Me content
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

  // Hiệu ứng fade in cho tên và bio
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

  // Hiệu ứng fade in cho các nút CV
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

  // Hiệu ứng fade in cho khung kinh nghiệm
  gsap.fromTo(
    ".KhungKinhNghiem .Khung",
    {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".KhungKinhNghiem",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Hiệu ứng fade in cho phần sở thích
  gsap.fromTo(
    ".interests-container",
    {
      opacity: 0,
      x: 100,
    },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".interests-container",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Hiệu ứng fade in cho tiêu đề sở thích
  gsap.fromTo(
    ".interests-title",
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
        trigger: ".interests-section",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Hiệu ứng fade in cho các card sở thích
  gsap.fromTo(
    ".hobbies-container .card",
    {
      opacity: 0,
      y: 60,
      rotationX: 15,
    },
    {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.3,
      scrollTrigger: {
        trigger: ".hobbies-container",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Hiệu ứng hover cho các card (tùy chọn)
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        scale: 1.05,
        y: -10,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Hiệu ứng fade in cho cursor (nếu có)
  if (document.querySelector(".cursor")) {
    gsap.set(".cursor", {
      opacity: 0,
      scale: 0,
    });

    gsap.to(".cursor", {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
      delay: 2,
    });
  }

  // Animation tổng thể cho toàn bộ trang khi load
  gsap.fromTo(
    "body",
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    }
  );

  // Refresh ScrollTrigger sau khi tất cả animation được thiết lập
  ScrollTrigger.refresh();
});

// Hàm để làm mới ScrollTrigger khi cần thiết
function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

// Gọi refresh khi window resize
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
