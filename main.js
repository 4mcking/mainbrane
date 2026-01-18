document.addEventListener("DOMContentLoaded", () => {
  // Navbar toggle for mobile view
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("mainNav");

  if (hamburger && nav) {
    // Toggle navigation menu visibility on hamburger click
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("active");
    });

    // Close navigation menu when clicking outside of it
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove("active");
      }
    });
  }

  // Scroll fade-in animation for elements with the "reveal" class
  const revealElements = document.querySelectorAll(".reveal");
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    revealElements.forEach((el) => {
      if (el.getBoundingClientRect().top < windowHeight - 100) {
        el.classList.add("fade-in");
      }
    });
  };

  if (revealElements.length > 0) {
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger animation on page load
  }

  // Dynamically update the footer year
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Scroll-to-top button functionality
  const scrollToTopButton = document.getElementById("scrollToTop");
  const toggleScrollToTopButton = () => {
    if (window.scrollY > 300) {
      scrollToTopButton.classList.add("show");
      scrollToTopButton.classList.remove("hide");
    } else {
      scrollToTopButton.classList.add("hide");
      scrollToTopButton.classList.remove("show");
    }
  };

  if (scrollToTopButton) {
    // Smooth scroll to top on button click
    scrollToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", toggleScrollToTopButton);
  }

  // Reusable Typewriter Function with Loop Limit
  const typeWriter = (element, text, speed = 100, pause = 2000, maxLoops = 5) => {
    let index = 0;
    let loopCount = 0;

    const write = () => {
      if (index < text.length) {
        // Add one character at a time
        element.textContent += text.charAt(index);
        index++;
        setTimeout(write, speed);
      } else {
        loopCount++;
        if (loopCount < maxLoops) {
          // Clear content and restart animation after a pause
          setTimeout(() => {
            element.textContent = "";
            index = 0;
            write();
          }, pause);
        }
      }
    };

    element.textContent = ""; // Clear initial content
    write();
  };

  // Apply Typewriter Effect to Elements
  const typewriterConfigs = [
    {
      element: document.querySelector(".profile-text blockquote"),
      text: "Mind sharp as syntax, coded in clarity."
    },
    {
      element: document.querySelector(".hero .tagline"),
      text: "The future written in thought and code."
    },
    {
      element: document.querySelector(".about-mainbrane .tagline"),
      text: "Writing the future in clean lines of logic."
    }
  ];

  // Initialize typewriter effect for each configured element
  typewriterConfigs.forEach(({ element, text }) => {
    if (element) typeWriter(element, text, 100, 2000, 5);
  });
});
