/**
 * Home page specific JavaScript
 * Handles animations and interactions specific to the home page
 */

document.addEventListener('DOMContentLoaded', function() {
  const featureCards = document.querySelectorAll('.feature-card');
  
  if (featureCards.length) {
    featureCards.forEach(card => {
      card.style.animation = 'none';
      card.style.opacity = '0';
    });

    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
      );
    }

    function animateOnScroll() {
      featureCards.forEach((card, index) => {
        if (isInViewport(card) && card.style.opacity === '0') {
          setTimeout(() => {
            card.style.animation = 'fadeIn 0.5s ease forwards';
          }, index * 100);
        }
      });
    }

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
  }

  const learnMoreBtn = document.querySelector('a[href="#features"]');
  
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const featuresSection = document.getElementById('features');
      
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const testimonialsContainer = document.querySelector('.testimonials-container');
  
  if (testimonialsContainer) {
    const testimonials = [
      {
        name: "John Smith",
        comment: "MediTrack has made managing my appointments so much easier. I never miss a doctor's visit now!",
        image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
      },
      {
        name: "Sarah Johnson",
        comment: "The medication tracking feature is a lifesaver. I can keep track of all my prescriptions in one place.",
        image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
      },
      {
        name: "Michael Brown",
        comment: "As someone with multiple health conditions, this app has helped me stay organized with all my healthcare needs.",
        image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
      }
    ];
    
    testimonials.forEach(testimonial => {
      const testimonialDiv = document.createElement('div');
      testimonialDiv.className = 'testimonial-card';
      
      testimonialDiv.innerHTML = `
        <div class="testimonial-img">
          <img src="${testimonial.image}" alt="${testimonial.name}">
        </div>
        <p class="testimonial-text">"${testimonial.comment}"</p>
        <p class="testimonial-author">- ${testimonial.name}</p>
      `;
      
      testimonialsContainer.appendChild(testimonialDiv);
    });
  }
});