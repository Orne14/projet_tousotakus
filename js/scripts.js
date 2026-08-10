let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const flash = document.getElementById('slashFlash');

function goToSlide(index){
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  currentSlide = index;

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');

  flash.classList.remove('play');
  void flash.offsetWidth;
  flash.classList.add('play');
}

function nextSlide(){
  const next = (currentSlide + 1) % slides.length;
  goToSlide(next);
}

setInterval(nextSlide, 10000);

/* faq */
function toggleFaq(button){
  const item = button.closest('.faq-item');
  const wasActive = item.classList.contains('active');

  // ferme toutes les autres questions ouvertes
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

  // si celle cliquée n'était pas déjà ouverte, on l'ouvre
  if(!wasActive){
    item.classList.add('active');
  }
}

/* ANIMATION DE COMPTAGE */
function animateStats(){
  const statNumbers = document.querySelectorAll('.stat-number');

  statNumbers.forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1800;          // durée totale de l'animation en millisecondes
    const startTime = performance.now();

    function update(currentTime){
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);   // entre 0 et 1
      const value = Math.floor(progress * target);

      el.textContent = value.toLocaleString('fr-FR');

      if(progress < 1){
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

// déclenche l'animation seulement quand la section devient visible à l'écran
const statsSection = document.querySelector('.stats-section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      animateStats();
      observer.disconnect();       // une seule fois, pas à chaque fois qu'on scroll dessus/hors de la section
    }
  });
}, { threshold: 0.5 });

observer.observe(statsSection);