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

setInterval(nextSlide, 5000);