// Add intersection observer for cards
document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = `fadeInUp 0.6s ease forwards ${entry.target.style.getPropertyValue(
              "--animation-delay"
            )}`;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );
  
    cards.forEach((card, index) => {
      card.style.setProperty("--animation-delay", `${index * 0.1}s`);
      observer.observe(card);
    });
  
    // Add pulse animation to book button periodically
    const bookBtn = document.querySelector(".book-button");
    setInterval(() => {
      bookBtn.style.animation = "pulse 1.5s ease";
      setTimeout(() => {
        bookBtn.style.animation = "";
      }, 1500);
    }, 8000);
  });