// ===== HERO SLIDER (seulement si présent sur la page) =====
const slides = document.querySelectorAll('.slide');
if(slides.length > 0){
  let currentSlide = 0;
  const dots = document.querySelectorAll('.dot');
  const flash = document.getElementById('slashFlash');

  window.goToSlide = function(index){
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    if(flash){
      flash.classList.remove('play');
      void flash.offsetWidth;
      flash.classList.add('play');
    }
  };

  function nextSlide(){
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  setInterval(nextSlide, 5000);
}

// ===== FAQ (seulement si présente sur la page) =====
window.toggleFaq = function(button){
  const item = button.closest('.faq-item');
  const wasActive = item.classList.contains('active');

  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

  if(!wasActive){
    item.classList.add('active');
  }
};

// ===== STATS (seulement si présentes sur la page) =====
const statsSection = document.querySelector('.stats-section');
if(statsSection){
  function animateStats(){
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(el => {
      const target = parseInt(el.dataset.target);
      const duration = 1800;
      const startTime = performance.now();

      function update(currentTime){
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * target);

        el.textContent = value.toLocaleString('fr-FR');

        if(progress < 1){
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateStats();
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

// ===== PANIER (à garder tel quel si tu l'as déjà codé) =====
// ... ton code de panier ici s'il existe déjà ...

// ===== BOUTIQUE : produits + filtres + voir plus (seulement si présent sur la page) =====
const grid = document.getElementById('productGrid');
if(grid){
  const allProducts = [
    {id:1, name:"Figurine Goku", price:"€29.99", category:"autre", img:"images/produit-placeholder.jpg", desc:"Figurine de collection édition limitée."},
    {id:2, name:"T-shirt Naruto", price:"€19.99", category:"tshirt", img:"images/produit-placeholder.jpg", desc:"T-shirt stylé inspiré de Naruto."},
    {id:3, name:"Poster Attack on Titan", price:"€9.99", category:"poster", img:"images/produit-placeholder.jpg", desc:"Poster vibrant pour illuminer tes murs."},
    {id:4, name:"Porte-clés Ramen Chibi", price:"€4.99", category:"porte-cles", img:"images/produit-placeholder.jpg", desc:"Petit porte-clés kawaii."},
    {id:5, name:"Sticker Pack Manga", price:"€3.50", category:"sticker", img:"images/produit-placeholder.jpg", desc:"Lot de stickers holographiques."},
    {id:6, name:"Photocard Collector", price:"€2.99", category:"photocard", img:"images/produit-placeholder.jpg", desc:"Carte à collectionner édition rare."},
    {id:7, name:"Jean Streetwear Otaku", price:"€39.99", category:"jean", img:"images/produit-placeholder.jpg", desc:"Jean confortable, coupe moderne."},
    {id:8, name:"T-shirt Dragon Rouge", price:"€21.99", category:"tshirt", img:"images/produit-placeholder.jpg", desc:"Design exclusif dragon rouge."},
    {id:9, name:"Poster One Piece", price:"€9.99", category:"poster", img:"images/produit-placeholder.jpg", desc:"Poster grand format One Piece."},
    {id:10, name:"Porte-clés Katana", price:"€5.99", category:"porte-cles", img:"images/produit-placeholder.jpg", desc:"Mini katana miniature."},
    {id:11, name:"Sticker Sakura", price:"€3.50", category:"sticker", img:"images/produit-placeholder.jpg", desc:"Sticker fleur de cerisier."},
    {id:12, name:"Photocard Édition Nuit", price:"€2.99", category:"photocard", img:"images/produit-placeholder.jpg", desc:"Édition limitée thème nocturne."},
    {id:13, name:"Jean Slim Anime", price:"€37.99", category:"jean", img:"images/produit-placeholder.jpg", desc:"Coupe slim, très demandé."},
    {id:14, name:"T-shirt Kunoichi", price:"€22.99", category:"tshirt", img:"images/produit-placeholder.jpg", desc:"Design exclusif ninja."},
  ];

  const ROWS_INITIAL = 3;
  const ROWS_PER_CLICK = 2;
  const COLUMNS = 4;

  let currentCategory = 'tout';
  let visibleCount = ROWS_INITIAL * COLUMNS;

  const loadMoreBtn = document.getElementById('loadMoreBtn');

  function getFilteredProducts(){
    if(currentCategory === 'tout') return allProducts;
    return allProducts.filter(p => p.category === currentCategory);
  }

  function renderProducts(){
    const filtered = getFilteredProducts();
    const toShow = filtered.slice(0, visibleCount);

    grid.innerHTML = toShow.map(p => `
      <div class="product-card">
        <div class="product-img-wrap">
          <img src="${p.img}" alt="${p.name}">
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <p class="product-price">${p.price}</p>
          <p class="product-desc">${p.desc}</p>
          <button class="buy-btn">Achetez Maintenant</button>
        </div>
      </div>
    `).join('');

    if(visibleCount >= filtered.length){
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentCategory = btn.dataset.category;
      visibleCount = ROWS_INITIAL * COLUMNS;
      renderProducts();
    });
  });

  loadMoreBtn.addEventListener('click', () => {
    visibleCount += ROWS_PER_CLICK * COLUMNS;
    renderProducts();
  });

  renderProducts();
}