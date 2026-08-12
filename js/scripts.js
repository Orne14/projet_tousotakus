// ===== LIEN DE MENU ACTIF (sur toutes les pages) =====
const navLinks = document.querySelectorAll('nav a');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
  const linkPage = link.getAttribute('href').split('/').pop();
  if(linkPage === currentPage){
    link.classList.add('active');
  }
});

// ===== ANIMATION AU SCROLL (sur toutes les pages) =====
const revealElements = document.querySelectorAll('.reveal');

if(revealElements.length > 0){
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);   // une fois révélé, on arrête d'observer (pas de re-déclenchement)
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));
}

// variante : anime chaque enfant d'une grille avec un léger décalage
const revealGroups = document.querySelectorAll('.reveal-group');

if(revealGroups.length > 0){
  const groupObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          setTimeout(() => {
            child.classList.add('visible');
          }, i * 100);   // 100ms de décalage entre chaque carte
        });
        groupObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealGroups.forEach(el => groupObserver.observe(el));
}

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

// ===== PANIER (présent sur toutes les pages) =====
const WHATSAPP_NUMBER = "22900000000"; // remplace par le vrai numéro

function getCart(){
  const stored = localStorage.getItem('tousotakus_cart');
  return stored ? JSON.parse(stored) : {};
}

function saveCart(cart){
  localStorage.setItem('tousotakus_cart', JSON.stringify(cart));
}

// ajoute un article au panier — id unique (ex: "product-3" ou "pack-1"), name, price affiché, priceValue en nombre
function addToCart(uid, name, priceValue, priceLabel){
  const cart = getCart();
  if(cart[uid]){
    cart[uid].qty += 1;
  } else {
    cart[uid] = { name, priceValue, priceLabel, qty:1 };
  }
  saveCart(cart);
  updateCartUI();
  toggleCart(true);
}

function changeQty(uid, delta){
  const cart = getCart();
  if(!cart[uid]) return;
  cart[uid].qty += delta;
  if(cart[uid].qty <= 0) delete cart[uid];
  saveCart(cart);
  updateCartUI();
}

function updateCartUI(){
  const cart = getCart();
  const uids = Object.keys(cart);
  const cartCountEl = document.querySelector('.cart-count');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('wa-checkout');

  if(!itemsEl) return; // sécurité si le panier n'est pas présent sur cette page

  const count = uids.reduce((sum, uid) => sum + cart[uid].qty, 0);
  if(cartCountEl) cartCountEl.textContent = count;

  if(uids.length === 0){
    itemsEl.innerHTML = '<div class="cart-empty">Ta sélection est vide pour l\'instant.</div>';
    totalEl.textContent = '0 FCFA';
    checkoutBtn.classList.add('disabled');
    return;
  }

  let total = 0;
  itemsEl.innerHTML = uids.map(uid => {
    const item = cart[uid];
    total += item.priceValue * item.qty;
    return `
      <div class="cart-item">
        <div>
          <div class="ci-name">${item.name}</div>
          <div class="ci-price">${item.priceLabel}</div>
        </div>
        <div class="ci-qty">
          <button onclick="changeQty('${uid}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${uid}', 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  totalEl.textContent = total.toLocaleString('fr-FR') + ' FCFA';
  checkoutBtn.classList.remove('disabled');

  let message = "Bonjour TOUSOTAKUS ! Je voudrais commander :%0A";
  uids.forEach(uid => {
    const item = cart[uid];
    message += `- ${item.name} (x${item.qty})%0A`;
  });
  message += `%0ATotal estimé : ${total.toLocaleString('fr-FR')} FCFA`;
  checkoutBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

function toggleCart(open){
  const panel = document.getElementById('cart-panel');
  const overlay = document.getElementById('overlay');
  if(!panel) return;
  panel.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
}

// initialise l'affichage du panier au chargement de CHAQUE page
updateCartUI();

// end panier//

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

// ===== BOUTIQUE : produits + filtres + voir plus =====
const grid = document.getElementById('productGrid');
if(grid){
  const allProducts = [
    {
      id:1,
      name:"Poster A5",
      price:250,
      priceFrom:false,           // false = prix fixe, true = "à partir de"
      unit:"FCFA",
      category:"posters",
      status:"disponible",       // "disponible" | "sur-commande" | "rupture"
      img:"images/produit-placeholder.jpg",
      desc:"Anime • Décoration • Collection"
    },
    {
      id:2,
      name:"Poster A4",
      price:500,
      priceFrom:false,
      unit:"FCFA",
      category:"posters",
      status:"disponible",
      img:"images/produit-placeholder.jpg",
      desc:"Anime • Décoration • Collection"
    },
    {
      id:3,
      name:"Poster A3",
      price:1000,
      priceFrom:false,
      unit:"FCFA",
      category:"posters",
      status:"disponible",
      img:"images/produit-placeholder.jpg",
      desc:"Grand format • Anime • Décoration"
    },
    {
      id:4,
      name:"Photocard Collector",
      price:100,
      priceFrom:false,
      unit:"FCFA / unité",
      category:"photocards",
      status:"disponible",
      img:"images/produit-placeholder.jpg",
      desc:"Anime • Collection • Souvenir"
    },
    {
      id:5,
      name:"Pack de Stickers Anime",
      price:1000,
      priceFrom:true,
      unit:"FCFA",
      category:"stickers",
      status:"disponible",
      img:"images/produit-placeholder.jpg",
      desc:"Anime • Fun • Personnalisation"
    },
    {
      id:6,
      name:"T-shirt Imprimé",
      price:5500,
      priceFrom:true,
      unit:"FCFA",
      category:"vetements",
      status:"disponible",
      img:"images/produit-placeholder.jpg",
      desc:"Anime • Style • Streetwear"
    },
    {
      id:7,
      name:"T-shirt Brodé",
      price:6000,
      priceFrom:true,
      unit:"FCFA",
      category:"vetements",
      status:"sur-commande",
      img:"images/produit-placeholder.jpg",
      desc:"Broderie • Anime • Qualité"
    },
    {
      id:8,
      name:"Jean InkWear",
      price:6000,
      priceFrom:true,
      unit:"FCFA",
      category:"inkwear",
      status:"sur-commande",
      img:"images/produit-placeholder.jpg",
      desc:"Collection InkWear • Style TOUSOTAKUS"
    },
    {
      id:9,
      name:"Pack de Stickers Anime",
      price:1000,
      priceFrom:true,
      unit:"FCFA",
      category:"stickers",
      status:"disponible",
      img:"images/produit-placeholder.jpg",
      desc:"Anime • Fun • Personnalisation"
    },
    {
      id:10,
      name:"T-shirt Imprimé",
      price:5500,
      priceFrom:true,
      unit:"FCFA",
      category:"vetements",
      status:"disponible",
      img:"images/produit-placeholder.jpg",
      desc:"Anime • Style • Streetwear"
    },
    {
      id:11,
      name:"T-shirt Brodé",
      price:6000,
      priceFrom:true,
      unit:"FCFA",
      category:"vetements",
      status:"sur-commande",
      img:"images/produit-placeholder.jpg",
      desc:"Broderie • Anime • Qualité"
    },
    {
      id:12,
      name:"Jean InkWear",
      price:6000,
      priceFrom:true,
      unit:"FCFA",
      category:"inkwear",
      status:"sur-commande",
      img:"images/produit-placeholder.jpg",
      desc:"Collection InkWear • Style TOUSOTAKUS"
    },
    {
      id:13,
      name:"Pack de Stickers Anime",
      price:1000,
      priceFrom:true,
      unit:"FCFA",
      category:"stickers",
      status:"disponible",
      img:"images/produit-placeholder.jpg",
      desc:"Anime • Fun • Personnalisation"
    },
    {
      id:14,
      name:"T-shirt Imprimé",
      price:5500,
      priceFrom:true,
      unit:"FCFA",
      category:"vetements",
      status:"disponible",
      img:"images/produit-placeholder.jpg",
      desc:"Anime • Style • Streetwear"
    },
    {
      id:15,
      name:"T-shirt Brodé",
      price:6000,
      priceFrom:true,
      unit:"FCFA",
      category:"vetements",
      status:"sur-commande",
      img:"images/produit-placeholder.jpg",
      desc:"Broderie • Anime • Qualité"
    },
    {
      id:16,
      name:"Jean InkWear",
      price:6000,
      priceFrom:true,
      unit:"FCFA",
      category:"inkwear",
      status:"sur-commande",
      img:"images/produit-placeholder.jpg",
      desc:"Collection InkWear • Style TOUSOTAKUS"
    },
    
    
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

  const statusLabels = {
  "disponible": "Disponible",
  "sur-commande": "Sur commande",
  "rupture": "Rupture de stock"
};

function formatPrice(product){
  const prefix = product.priceFrom ? "À partir de " : "";
  return `${prefix}${product.price.toLocaleString('fr-FR')} ${product.unit}`;
}

function buildWhatsAppLink(productName){
  const message = `Bonjour TOUSOTAKUS ! Je suis intéressé(e) par : ${productName}. Est-ce disponible ?`;
  return `https://wa.me/22900000000?text=${encodeURIComponent(message)}`;
}

function renderProducts(){
  const filtered = getFilteredProducts();
  const toShow = filtered.slice(0, visibleCount);

  grid.innerHTML = toShow.map(p => `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}">
        <span class="status-badge status-${p.status}">${statusLabels[p.status]}</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="product-price">${formatPrice(p)}</p>
        <p class="product-desc">${p.desc}</p>
        ${p.status === 'rupture'
            ? `<button class="buy-btn disabled" disabled>Indisponible</button>`
            : `<button class="buy-btn" onclick="addToCart('product-${p.id}', '${p.name}', ${p.price}, '${formatPrice(p)}')">Achetez Maintenant</button>`
          }
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

// ===== PACKS CADEAUX =====
const packsGrid = document.getElementById('packsGrid');
if(packsGrid){
  const allPacks = [
    {id:1, name:"Pack Découverte", price:"9 500 FCFA", img:"images/pack.jpg", contents:["1 T-shirt otaku", "1 Porte-clés", "1 Pin's collector"]},
    {id:2, name:"Pack Collector", price:"24 000 FCFA", img:"images/pack.jpg", contents:["1 Figurine premium", "1 T-shirt exclusif", "Goodies surprise"]},
    {id:3, name:"Pack Duo Fan", price:"14 000 FCFA", img:"images/pack.jpg", contents:["2 T-shirts assortis", "2 Accessoires"]},
    {id:4, name:"Pack Découverte", price:"9 500 FCFA", img:"images/pack.jpg", contents:["1 T-shirt otaku", "1 Porte-clés", "1 Pin's collector"]},
    {id:5, name:"Pack Collector", price:"24 000 FCFA", img:"images/pack.jpg", contents:["1 Figurine premium", "1 T-shirt exclusif", "Goodies surprise"]},
    {id:6, name:"Pack Duo Fan", price:"14 000 FCFA", img:"images/pack.jpg", contents:["2 T-shirts assortis", "2 Accessoires"]},
    {id:7, name:"Pack Découverte", price:"9 500 FCFA", img:"images/pack.jpg", contents:["1 T-shirt otaku", "1 Porte-clés", "1 Pin's collector"]},
    {id:8, name:"Pack Collector", price:"24 000 FCFA", img:"images/pack.jpg", contents:["1 Figurine premium", "1 T-shirt exclusif", "Goodies surprise"]},
    {id:9, name:"Pack Duo Fan", price:"14 000 FCFA", img:"images/pack.jpg", contents:["2 T-shirts assortis", "2 Accessoires"]},
    {id:10, name:"Pack Découverte", price:"9 500 FCFA", img:"images/pack.jpg", contents:["1 T-shirt otaku", "1 Porte-clés", "1 Pin's collector"]},
    {id:11, name:"Pack Collector", price:"24 000 FCFA", img:"images/pack.jpg", contents:["1 Figurine premium", "1 T-shirt exclusif", "Goodies surprise"]},
    {id:12, name:"Pack Duo Fan", price:"14 000 FCFA", img:"images/pack.jpg", contents:["2 T-shirts assortis", "2 Accessoires"]},
    
  ];

  const PACKS_INITIAL = 9;
  const PACKS_PER_CLICK = 6;
  let visiblePacksCount = PACKS_INITIAL;

  const loadMorePacksBtn = document.getElementById('loadMorePacksBtn');

  function renderPacks(){
    const toShow = allPacks.slice(0, visiblePacksCount);

    packsGrid.innerHTML = toShow.map(pack => `
      <div class="pack-card">
        <span class="pack-ribbon">Pack</span>
        <div class="pack-img-wrap">
          <img src="${pack.img}" alt="${pack.name}">
        </div>
        <div class="pack-info">
          <h3>${pack.name}</h3>
          <ul class="pack-contents">
            ${pack.contents.map(item => `<li>${item}</li>`).join('')}
          </ul>
          <p class="pack-price">${pack.price}</p>
          <button class="pack-btn" onclick="addToCart('pack-${pack.id}', '${pack.name}', ${parseInt(pack.price)}, '${pack.price}')">Offrir ce pack</button>
        </div>
      </div>
    `).join('');

    if(visiblePacksCount >= allPacks.length){
      loadMorePacksBtn.classList.add('hidden');
    } else {
      loadMorePacksBtn.classList.remove('hidden');
    }
  }

  loadMorePacksBtn.addEventListener('click', () => {
    visiblePacksCount += PACKS_PER_CLICK;
    renderPacks();
  });

  renderPacks();
}

// ===== FORMULAIRE CONTACT (seulement si présent sur la page) =====
const contactForm = document.getElementById('contactForm');
if(contactForm){
  const CONTACT_WHATSAPP_NUMBER = "22900000000"; // remplace par le vrai numéro

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();   // empêche le comportement par défaut (rechargement de page)

    const nom = document.getElementById('cf-nom').value;
    const prenom = document.getElementById('cf-prenom').value;
    const tel = document.getElementById('cf-tel').value;
    const message = document.getElementById('cf-message').value;

    let waMessage = `Bonjour TOUSOTAKUS, je suis ${prenom} ${nom} (tel: ${tel}).%0A%0A${message}`;
    const waLink = `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage).replace(/%2520/g, '%20')}`;

    window.open(waLink, '_blank');
  });
}