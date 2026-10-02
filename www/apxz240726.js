// ============================================================
// SUPABASE
// ============================================================
const supabaseUrl = "https://ercfjeabaeaduilaatyf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY2ZqZWFiYWVhZHVpbGFhdHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTg5ODEsImV4cCI6MjA5MTg5NDk4MX0.7dWxXP-HJ5krJUSo-Vrb7VZD2RJJl4EA59kxRJcNI3o";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ============================================================
// DATA PRODUK
// ============================================================
const products = [
    
    { id: 48, name: "Poster Menarik Spesial Maulid 1448 H", price: 4.26, spec: "Istimewa• Mewah • Ekslusif", category: "desain", img: "maull/postf.png" },
    
    
    { id: 81, name: "Desain Poster Ekslusif HUT RI ke-81", price: 5.26, spec: "Inspiratif• Sejarah • Ekslusif", category: "desain", img: "hut811/po.webp" },
    /*
{ id: 56, name: "Desain Poster Spesial HUT RI ke-81", price: 5.26, spec: "Inspiratif• Sejarah • Ekslusif", category: "desain", img: "hut811/powe.webp" },
    */
    
    { id: 21, name: "Rebranding Desain Logo Baru", price: 13, spec: "Modern • Simple • Estetika", category: "desain", img: "desiign/logoh.jpg" },
    { id: 2, name: "Jasa Pembuatan Desain Logo", price: 10.5, spec: "Profesional • Modern • Spesial Estetik", category: "desain", img: "desiign/logog.jpg" },
    { id: 22, name: "Jasa Desain Logo Anniversary", price: 25, spec: "Bebas Tema • Filosofi • Estetika", category: "desain", img: "desiign/harii.jpg" },
    { id: 23, name: "Jasa Desain Kemasan Produk", price: 6, spec: "Motif Elegan • Simple • Estetika", category: "kemasan", img: "desiign/stic.jpg" },
    { id: 24, name: "Rebranding Desain Kemasan", price: 5, spec: "Mewah • Proses Cepat • Estetika", category: "kemasan", img: "desiign/maddu.jpg" },
    { id: 25, name: "Jasa Pembuatan Poster Iklan", price: 3.6, spec: "Unik • Beda • Estetika", category: "poster", img: "desiign/postt.jpg" }
];

// ============================================================
// STATE
// ============================================================
let cart = [];
let currentCategory = 'all';
let currentNewsCategory = '';
let currentPage = 'home';
let shopCurrentCategory = 'all';

// Stock state
let stockItems = [];
let stockCurrentPage = 1;
let stockCurrentQuery = '';
let stockCurrentCategory = 'random';
let stockIsLoading = false;
let stockHasMore = true;

// Book state
let books = [];
let bookCurrentPage = 1;
let bookCurrentQuery = '';
let bookCurrentCategory = 'random';
let bookIsLoading = false;
let bookHasMore = true;

// AI History state
let aiHistory = [];
let aiSelectedStyle = 'photorealistic';
let aiCurrentPrompt = '';
let aiCurrentImageUrl = '';
let aiIsGenerating = false;  

// ============================================================
// API KEYS
// ============================================================
const PEXELS_API_KEY = "01rGgSbjG2pJg6DzWcE5cdMq21vOMpI2EA8jWMZn3hTOksCSYx3HLwS3";
const PEXELS_BASE = "https://api.pexels.com/v1";

/*
const PEXELS_VIDEO_BASE = "https://api.pexels.com/videos";
*/
const PEXELS_VIDEO_BASE = "https://api.pexels.com/v1/videos";

const OPEN_LIBRARY_BASE = "https://openlibrary.org";
const NEWS_API_KEY = "pub_6b8b47ed35cd4f8fba1703e653088218";

// ============================================================
// QUERIES
// ============================================================
const independenceNewsQueries = [
    'HUT RI ke-81 2026', '17 Agustus 2026 Indonesia', 'Hari Kemerdekaan Indonesia 2026',
    'Upacara 17 Agustus 2026', 'HUT ke-81 Kemerdekaan RI', 'Perayaan 17 Agustus 2026',
    'Dirgahayu Indonesia ke-81', 'Indonesia Merdeka 2026', 'Peringatan HUT RI 2026',
    'Agustusan 2026 Indonesia', 'Lomba 17 Agustus 2026', 'HUT RI 81 tahun',
    'Kemerdekaan RI 2026', '17 Agustus 2026 Istana Merdeka', 'Upacara Bendera 17 Agustus 2026',
    'Pahlawan Indonesia 2026', 'Monumen Nasional 17 Agustus', 'Pidato Presiden 17 Agustus 2026',
    'Karnaval 17 Agustus 2026', 'Festival Kemerdekaan Indonesia 2026', 'Indonesia Emas 2045 persiapan',
    'HUT Kemerdekaan RI 2026', 'Dirgahayu Indonesia 2026', '17 Agustus 2026 upacara',
    'Perayaan kemerdekaan Indonesia 2026', 'HUT RI 2026 Istana Negara', 'Resepsi 17 Agustus 2026',
    'HUT RI', 'HUT', 'Lomba 17', '17 Agustus', 'kemerdekaan',
    'Acara 17 Agustus 2026 Indonesia', 'Semarak 17 Agustus 2026', 'Kontingen 17 Agustus 2026'
];

const independenceQueries = [
    'indonesian flag red white', 'indonesia independence day', 'indonesian heroes',
    'pahlawan indonesia', 'bendera indonesia', 'merah putih indonesia',
    'proklamasi indonesia', 'sukarno', 'soekarno', 'soeharto',
    'pahlawan nasional indonesia', 'indonesian warrior', 'indonesia merdeka',
    '17 agustus indonesia', 'hari kemerdekaan indonesia', 'garuda pancasila',
    'monumen nasional indonesia', 'istana merdeka', 'upacara bendera indonesia',
    'indonesian revolution', 'kemerdekaan RI', 'pahlawan kemerdekaan',
    'bendera merah putih berkibar', 'indonesian flag ceremony', 'proklamator indonesia',
    'teks proklamasi', 'perjuangan kemerdekaan indonesia', 'HUT RI', 'HUT',
    '17 Agustus', 'Lomba 17', 'kemerdekaan', 'bendera merah putih'
];

const indonesiaBookQueries = [
    'sejarah indonesia', 'indonesian history', 'indonesia', 'kemerdekaan indonesia',
    'indonesian independence', 'pahlawan indonesia', 'proklamasi indonesia',
    'perjuangan kemerdekaan indonesia', 'Soekarno', 'Mohammad Hatta',
    'sejarah nasional indonesia', 'indonesian revolution', 'merdeka indonesia',
    'indonesia 1945', 'tokoh proklamasi', 'bendera merah putih', 'pahlawan nasional',
    'sejarah NKRI', 'perang kemerdekaan indonesia', 'sejarah Indonesia lengkap',
    'biografi pahlawan indonesia', 'kebangkitan nasional indonesia', 'sumpah pemuda',
    'histori indonesia', 'perjuangan para pahlawan', 'sejarah proklamasi'
];

const randomQueries = [
    'nature', 'beautiful landscape', 'ocean', 'mountains', 'forest',
    'city', 'architecture', 'people', 'animals', 'food',
    'technology', 'art', 'travel', 'space', 'music',
    'sports', 'fashion', 'business', 'sunset', 'flowers',
    'waterfall', 'beach', 'desert', 'snow', 'stars',
    'abstract', 'vintage', 'minimalist', 'dark', 'colorful'
];

// ============================================================
// FORMAT RUPIAH
// ============================================================
function formatRupiah(usd) {
    const rate = 15500;
    return "Rp " + (usd * rate).toLocaleString("id-ID");
}

// ============================================================
// NAVIGATION - UTAMA
// ============================================================
function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const pageMap = {
        'home': 'homePage',
        'feed': 'feedPage',
        'shop': 'shopPage',
        'news': 'newsPage',
        'stock': 'stockPage',
        'books': 'booksPage',
        'cart': 'cartPage',
        'profile': 'profilePage',
        'settings': 'settingsPage',
        'maulid': 'maulidPage'
    };
    
    const target = document.getElementById(pageMap[page]);
    if (target) target.classList.add('active');

    // Update bottom nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navMap = {
        'home': 'navHome',
        'shop': 'navShop',
        'news': 'navNews',
        'stock': 'navStock',
        'books': 'navBooks',
        'profile': 'navProfile'
    };
    
    const navItem = document.getElementById(navMap[page]);
    if (navItem) navItem.classList.add('active');

    // Update tombol shop di header
    updateShopButtonActive(page);

    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Page specific init
    if (page === 'cart') { renderCart(); renderCheckout(); }
    if (page === 'news') { 
        if (document.getElementById('newsList').innerHTML.includes('Memuat')) {
            loadNews(currentNewsCategory || '');
        }
    }
    if (page === 'stock' && stockItems.length === 0) { loadRandomStock(); }
    if (page === 'books' && books.length === 0) { loadRandomBooks(); }
    if (page === 'shop') { initShop(); }
    if (page === 'profile') { 
        loadUserProfile();
        setTimeout(initChart, 300);
    }
    
    // Track aktivitas
    trackActivity(page);
}

function updateShopButtonActive(page) {
    const btn = document.getElementById('btnShopHeader');
    if (!btn) return;
    if (page === 'shop') {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
}

// ============================================================
// SIDE MENU
// ============================================================

/*
function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('open');
    document.getElementById('menuOverlay').classList.toggle('active');
}

function closeMenu() {
    document.getElementById('sideMenu').classList.remove('open');
    document.getElementById('menuOverlay').classList.remove('active');
}
*/
// ============================================================
// SIDE MENU - TOGGLE LEMBUT
// ============================================================
function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');
    
    if (!menu || !overlay) return;
    
    const isOpen = menu.classList.contains('open');
    
    if (isOpen) {
        // Tutup
        menu.classList.remove('open');
        overlay.classList.remove('active');
        // Prevent body scroll
        document.body.style.overflow = '';
    } else {
        // Buka
        menu.classList.add('open');
        overlay.classList.add('active');
        // Prevent background scroll (iOS-friendly)
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
    }
}

function closeMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');
    
    if (!menu || !overlay) return;
    
    menu.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
}


/*
function openAd(url) { window.location.href = url; }
*/




// ============================================================
// AD POPUP FULLSCREEN
// ============================================================

// Fungsi untuk membuka popup iklan
function openAdPopup(imageUrl) {
    const popup = document.getElementById('adPopup');
    const img = document.getElementById('adPopupImage');
    
    if (!popup || !img) return;
    
    // Set gambar
    img.src = imageUrl;
    img.alt = 'Iklan';
    
    // Tampilkan popup
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fungsi untuk menutup popup iklan
function closeAdPopup() {
    const popup = document.getElementById('adPopup');
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Fungsi untuk menutup popup jika klik di luar
function closeAdPopupOutside(event) {
    if (event.target === document.getElementById('adPopup')) {
        closeAdPopup();
    }
}

// Fungsi openAd - untuk membuka link (tetap dipertahankan untuk kompatibilitas)
function openAd(url) {
    // Jika url adalah gambar, buka popup
    if (url && (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif') || url.endsWith('.webp'))) {
        openAdPopup(url);
    } else if (url) {
        // Jika url adalah link, buka di tab baru
        window.open(url, '_blank');
    }
}



// ============================================================
// AD SLIDER
// ============================================================
/*
let currentAd = 0;
const adTrack = document.getElementById('adTrack');
const adDots = document.querySelectorAll('#adDots .dot');

function goToAd(index) {
    currentAd = index;
    if (adTrack) { adTrack.style.transform = `translateX(-${index * 100}%)`; }
    adDots.forEach((d, i) => d.classList.toggle('active', i === index));
}

setInterval(() => {
    let next = (currentAd + 1) % 7;
    goToAd(next);
}, 4000);
*/

// ============================================================
// AD SLIDER - DENGAN JUMLAH SLIDE YANG BENAR
// ============================================================
let currentAd = 0;
const adTrack = document.getElementById('adTrack');
const adDots = document.querySelectorAll('#adDots .dot');

function goToAd(index) {
    const slides = document.querySelectorAll('.ad-slide');
    const totalSlides = slides.length;
    
    if (index >= totalSlides) {
        index = 0;
    }
    
    currentAd = index;
    if (adTrack) { 
        adTrack.style.transform = `translateX(-${index * 100}%)`; 
    }
    adDots.forEach((d, i) => d.classList.toggle('active', i === index));
}

// Auto slide dengan jumlah slide yang dinamis
setInterval(() => {
    const slides = document.querySelectorAll('.ad-slide');
    const totalSlides = slides.length;
    let next = (currentAd + 1) % totalSlides;
    goToAd(next);
}, 4000);



// ============================================================
// TOAST NOTIFICATION
// ============================================================
/*
function showNotification(msg) {
    const old = document.querySelector('.toast-notif');
    if (old) old.remove();
    const div = document.createElement('div');
    div.className = 'toast-notif';
    div.innerHTML = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}
*/
function showNotification(msg, type = 'info') {
    // Hapus notif lama
    const old = document.querySelector('.toast-notif');
    if (old) {
        old.classList.add('toast-hide');
        setTimeout(() => old.remove(), 350);
    }
    
    // Ikon berdasarkan type (pakai Font Awesome, BUKAN emoji)
    const icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-exclamation',
        warning: 'fa-triangle-exclamation',
        info: 'fa-circle-info',
        like: 'fa-heart',
        bell: 'fa-bell'
    };
    
    const iconClass = icons[type] || icons.info;
    
    const div = document.createElement('div');
    div.className = 'toast-notif';
    div.innerHTML = `<i class="fas ${iconClass}"></i><span>${msg}</span>`;
    
    document.body.appendChild(div);
    
    // Auto-hide dengan animasi lembut
    setTimeout(() => {
        if (div.parentNode) {
            div.classList.add('toast-hide');
            setTimeout(() => div.remove(), 350);
        }
    }, 3000);
}



// ============================================================
// RENDER PRODUCTS (Home)
// ============================================================
function renderProducts(list) {
    const el = document.getElementById("productList");
    if (!el) return;
    el.innerHTML = "";
    if (list.length === 0) {
        el.innerHTML = `<div style="text-align:center;padding:40px 0;color:var(--text-muted);">Tidak ada produk ditemukan</div>`;
        return;
    }
    list.forEach(p => {
        el.innerHTML += `
            <div class="product">
                <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200x200/1a6b3c/fff?text=Design'">
                <h4>${p.name}</h4>
                <small class="spec">${p.spec}</small>
                <p class="price">${formatRupiah(p.price)}</p>
                <div class="buy-links">
                
                
                    <a class="btn-cart" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Keranjang</a>
                    
                    
                
                </div>
            </div>
        `;
    });
}

function getFilteredProducts() {
    if (currentCategory === 'all') return products;
    return products.filter(p => p.category === currentCategory);
}

function filterCategory(cat, btn) {
    document.querySelectorAll(".categories button").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    currentCategory = cat;
    renderProducts(getFilteredProducts());
}

function searchProduct(keyword) {
    const key = keyword.toLowerCase().trim();
    if (key === "") {
        renderProducts(getFilteredProducts());
        return;
    }
    const filtered = getFilteredProducts().filter(p =>
        p.name.toLowerCase().includes(key) ||
        p.category.toLowerCase().includes(key)
    );
    renderProducts(filtered);
}

// ============================================================
// SHOP PRODUCTS
// ============================================================
function renderShopProducts(list) {
    const el = document.getElementById('shopProductList');
    if (!el) return;
    
    if (list.length === 0) {
        el.innerHTML = `
            <div style="text-align:center;padding:40px 0;color:var(--text-muted);grid-column:1/-1;">
                <i class="fas fa-box-open" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                <p>Produk Tidak Ditemukan</p>
            </div>
        `;
        return;
    }
    
    el.innerHTML = list.map(p => `
        <div class="product">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200x200/1a6b3c/fff?text=Design'">
            <h4>${p.name}</h4>
            <small class="spec">${p.spec}</small>
            <p class="price">${formatRupiah(p.price)}</p>
            <div class="buy-links">
            
            
                <a class="btn-cart" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Keranjang</a>
                
                
                <!--
                <a class="btn-cart-shop" onclick="showShopProductDetail(${p.id})">
                    <i class="fas fa-shop"></i>Lihat Produk 
                </a>
                -->
                
                
                
            </div>
        </div>
    `).join('');
}

function getFilteredShopProducts() {
    if (shopCurrentCategory === 'all') return products;
    return products.filter(p => p.category === shopCurrentCategory);
}

function filterShopCategory(cat, btn) {
    document.querySelectorAll('.shop-categories button').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    shopCurrentCategory = cat;
    renderShopProducts(getFilteredShopProducts());
}

function searchShopProduct(keyword) {
    const key = keyword.toLowerCase().trim();
    if (key === "") {
        renderShopProducts(getFilteredShopProducts());
        return;
    }
    const filtered = getFilteredShopProducts().filter(p =>
        p.name.toLowerCase().includes(key) ||
        p.category.toLowerCase().includes(key)
    );
    renderShopProducts(filtered);
}

function initShop() {
    renderShopProducts(products);
}

// ============================================================
// CART FUNCTIONS
// ============================================================
function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        const product = products.find(p => p.id === id);
        if (product) cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    renderCart();
    renderCheckout();
    showNotification('Ditambahkan ke keranjang');
    trackActivity('shop');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    renderCart();
    renderCheckout();
    showNotification('Dihapus dari keranjang');
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(id);
            return;
        }
        updateCartUI();
        renderCart();
        renderCheckout();
    }
}

function updateCartUI() {
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    const headerBadge = document.getElementById('headerCartBadge');
    if (total > 0) {
        if (headerBadge) { headerBadge.style.display = 'flex'; headerBadge.textContent = total; }
    } else {
        if (headerBadge) headerBadge.style.display = 'none';
    }
}

function renderCart() {
    const el = document.getElementById('cartItems');
    if (!el) return;
    if (cart.length === 0) {
        el.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Keranjang Kosong</h3>
                <p>Yuk, pilih desain favoritmu</p>
            </div>
        `;
        return;
    }
    el.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/70x70/1a6b3c/fff?text=Design'">
            <div class="info">
                <h4>${item.name}</h4>
                <small class="spec">${item.spec}</small>
                <p class="price">${formatRupiah(item.price)}</p>
                <div class="qty-control">
                    <button onclick="updateQty(${item.id}, -1)"><i class="fas fa-minus"></i></button>
                    <span>${item.qty}</span>
                    <button onclick="updateQty(${item.id}, 1)"><i class="fas fa-plus"></i></button>
                    <button onclick="removeFromCart(${item.id})" style="background:transparent;color:#ef4444;margin-left:auto;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCheckout() {
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById('subtotal').textContent = formatRupiah(subtotal);
    document.getElementById('totalPrice').textContent = formatRupiah(subtotal);
}

// ============================================================
// SUBMIT ORDER TO SUPABASE
// ============================================================
async function submitOrder() {
    if (cart.length === 0) {
        showNotification('Keranjang kosong. Tambahkan desain terlebih dahulu');
        return;
    }
    
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const design = document.getElementById('customerDesign').value.trim();
    const note = document.getElementById('customerNote').value.trim();
    
    if (!name || !phone || !design) {
        showNotification('Silakan isi semua data pemesan');
        return;
    }
    
    const btn = document.getElementById('submitOrderBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    
    try {
        const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const items = cart.map(i => `${i.name} (${i.qty}x) - ${formatRupiah(i.price)}`).join('\n');
        
        const { data, error } = await supabaseClient
            .from("pesanan")
            .insert([{
                nama_user: name,
                kategori: "desain",
                nama: phone,
                promo: design,
                catatan: `${note}\n\nItem:\n${items}\nTotal: ${formatRupiah(subtotal)}`,
                created_at: new Date().toISOString()
            }]);
          
        if (error) {
            console.error('Supabase error:', error);
            throw new Error(error.message);
        }
        
        btn.innerHTML = 'Berhasil';
        showNotification('Pesanan berhasil dikirim!');
        
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerDesign').value = '';
        document.getElementById('customerNote').value = '';
        
        cart = [];
        updateCartUI();
        renderCart();
        renderCheckout();
        
    } catch (err) {
        console.error('Error submitting order:', err);
        showNotification('Gagal mengirim pesanan: ' + err.message);
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Konfirmasi Pesanan';
        btn.disabled = false;
        return;
    }
    
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Konfirmasi Pesanan';
}

// ============================================================
// NEWS
// ============================================================
async function loadNews(category, btn) {
    currentNewsCategory = category;
    document.querySelectorAll(".news-categories button").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    const list = document.getElementById("newsList");
    list.innerHTML = '<div class="news-loading"><i class="fas fa-spinner fa-spin"></i> Memuat berita...</div>';
    try {
        let url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=id&language=id`;
        
        if (category === 'independence81') {
            const randomIndex = Math.floor(Math.random() * independenceNewsQueries.length);
            const query = independenceNewsQueries[randomIndex];
            url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=id&language=id&q=${encodeURIComponent(query)}`;
            console.log('🇮🇩 Mencari berita HUT RI ke-81:', query);
        } else if (category === "politics") {
            url += "&category=politics";
        } else if (category === "technology") {
            url += "&category=technology";
        } else if (category === "business") {
            url += "&category=business";
        } else if (category === "sports") {
            url += "&category=sports";
        } else if (category === "entertainment") {
            url += "&category=entertainment";
        } else if (category === "islam") {
            url += "&q=islam OR muslim OR middle east";
        } else if (category === "music") {
            url += "&q=music OR song OR album";
        } else if (category === "nature") {
            url += "&q=nature OR environment OR climate";
        } else if (category === "space") {
            url += "&q=space OR NASA OR galaxy OR universe";
        }
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.status === 'error') { 
            list.innerHTML = `<div class="news-empty">${data.message || 'Gagal memuat berita'}</div>`; 
            return; 
        }
        renderNews(data.results);
    } catch (error) {
        console.error(error);
        list.innerHTML = `<div class="news-empty">Gagal memuat berita: ${error.message}</div>`;
    }
    trackActivity('news');
}




/*
// ============================================================
// BERITA HOME - TERPOPULER & TERKINI
// ============================================================

// Data berita populer (hardcoded untuk tampilan awal)
const beritaPopulerData = [
    {
        id: 1,
        title: "Peringatan Maulid Nabi Muhammad SAW 12 Rabiul Awal 2026",
        image: "britta/2.png",
        source: "NU Online",
        date: "2 jam lalu",
        link: "berita1.html"
    },
    {
        id: 2,
        title: "Kisah Teladan Nabi Muhammad SAW untuk Generasi Muda Muslim",
        image: "https://via.placeholder.com/400x200/1a6b3c/fff?text=Teladan+Nabi",
        source: "MUI Pusat",
        date: "5 jam lalu",
        link: "berita1.html"
    },
    {
        id: 3,
        title: "Amalan Sunnah di Bulan Rabiul Awal Menyambut Maulid Nabi",
        image: "https://via.placeholder.com/400x200/1a6b3c/fff?text=Amalan+Sunnah",
        source: "PWMU",
        date: "8 jam lalu",
        link: "berita1.html"
    },
    {
        id: 4,
        title: "Sejarah Perjuangan Rasulullah SAW dalam Menyebarkan Islam",
        image: "https://via.placeholder.com/400x200/1a6b3c/fff?text=Sejarah+Islam",
        source: "Islam Digest",
        date: "12 jam lalu",
        link: "berita1.html"
    }
];

// State
let currentPopulerIndex = 0;
let populerInterval = null;
let terkiniArticles = [];
let isTerkiniLoaded = false;

// ============================================================
// RENDER TERPOPULER
// ============================================================
function renderBeritaPopuler() {
    const slider = document.getElementById('populerSlider');
    const dots = document.getElementById('populerDots');
    if (!slider || !dots) return;

    // Render items
    slider.innerHTML = beritaPopulerData.map((item, index) => `
        <div class="berita-populer-item ${index === 0 ? 'active' : ''}" 
             data-index="${index}"
             onclick="window.location.href='${item.link}'">
            <img src="${item.image}" alt="${item.title}" class="populer-thumb" 
                 onerror="this.src='https://via.placeholder.com/400x200/1a6b3c/fff?text=Berita'">
            <div class="populer-content">
                <span class="populer-badge"><i class="fas fa-fire"></i> Terpopuler</span>
                <div class="populer-title">${item.title}</div>
                <div class="populer-meta">
                    <span><i class="fas fa-user"></i> ${item.source}</span>
                    <span><i class="far fa-clock"></i> ${item.date}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Render dots
    dots.innerHTML = beritaPopulerData.map((_, index) => `
        <span class="dot ${index === 0 ? 'active' : ''}" onclick="goToPopuler(${index})"></span>
    `).join('');

    // Auto slide
    startPopulerAutoSlide();
}

// ============================================================
// TERPOPULER - AUTO SLIDE
// ============================================================
function startPopulerAutoSlide() {
    if (populerInterval) clearInterval(populerInterval);
    
    if (beritaPopulerData.length <= 1) return;
    
    populerInterval = setInterval(() => {
        const nextIndex = (currentPopulerIndex + 1) % beritaPopulerData.length;
        goToPopuler(nextIndex);
    }, 4000);
}

function goToPopuler(index) {
    if (index === currentPopulerIndex) return;
    
    const items = document.querySelectorAll('.berita-populer-item');
    const dots = document.querySelectorAll('.berita-populer-dots .dot');
    
    if (!items.length) return;
    
    // Exit current
    items[currentPopulerIndex].classList.remove('active');
    items[currentPopulerIndex].classList.add('exit');
    
    setTimeout(() => {
        items[currentPopulerIndex].classList.remove('exit');
    }, 600);
    
    // Activate new
    setTimeout(() => {
        items[index].classList.add('active');
    }, 100);
    
    // Update dots
    dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
    
    currentPopulerIndex = index;
}

// ============================================================
// LOAD BERITA TERKINI DARI NEWS API
// ============================================================
async function loadBeritaTerkini() {
    const track = document.getElementById('terkiniTrack');
    const timeLabel = document.getElementById('terkiniTime');
    if (!track) return;

    // Update waktu
    if (timeLabel) {
        const now = new Date();
        timeLabel.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }

    try {
        // Query untuk berita Islami dan Maulid Nabi
        const queries = [
            
            
            'maulid nabi muhammad 2026',
            'peringatan maulid nabi',
            'islam indonesia rabiul awal',
            'teladan nabi muhammad',
            'sejarah nabi muhammad',
            'amalan maulid nabi',
            'kisah nabi muhammad saw',
            'islami',
            'maulid',
            'islam',
            'Alquran',
            'robiul awal',
             'akhlak',
             'masjid',
             'dzalim',
           
            'rabiul awal 1448'
     
        ];
        
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=id&language=id&q=${encodeURIComponent(randomQuery)}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        if (data.status === 'error' || !data.results || data.results.length === 0) {
            // Fallback ke data default
            useDefaultTerkini();
            return;
        }
        
        // Filter berita yang relevan dengan islam
        const filtered = data.results.filter(a => {
            const title = (a.title || '').toLowerCase();
            const desc = (a.description || '').toLowerCase();
            return title.includes('islam') || 
                   title.includes('nabi') || 
                   title.includes('maulid') || 
                   title.includes('muslim') ||
                   desc.includes('islam') ||
                   desc.includes('nabi') ||
                   desc.includes('maulid');
        });
        
        if (filtered.length === 0) {
            useDefaultTerkini();
            return;
        }
        
        terkiniArticles = filtered.slice(0, 15);
        renderTerkini(terkiniArticles);
        isTerkiniLoaded = true;
        
    } catch (error) {
        console.error('Gagal memuat berita terkini:', error);
        useDefaultTerkini();
    }
}

function useDefaultTerkini() {
    const defaultArticles = [
        {
            title: "Peringatan Maulid Nabi Muhammad SAW 12 Rabiul Awal",
            image: "britta/1.jpg",
            source_id: "NU Online",
            link: "berita1.html"
        },
        {
            title: "Amalan Sunnah di Bulan Rabiul Awal Menyambut Maulid Nabi",
            image_url: "https://via.placeholder.com/100x100/1a6b3c/fff?text=Sunnah",
            source_id: "MUI",
            link: "berita1.html"
        },
        {
            title: "Kisah Teladan Nabi Muhammad SAW untuk Generasi Muda",
            image_url: "https://via.placeholder.com/100x100/1a6b3c/fff?text=Teladan",
            source_id: "Islam Digest",
            link: "berita1.html"
        },
        {
            title: "Sejarah Perjuangan Rasulullah SAW di Mekkah dan Madinah",
            image_url: "https://via.placeholder.com/100x100/1a6b3c/fff?text=Sejarah",
            source_id: "PWMU",
            link: "berita1.html"
        },
        {
            title: "Kemuliaan Akhlak Nabi Muhammad SAW yang Patut Diteladani",
            image_url: "https://via.placeholder.com/100x100/1a6b3c/fff?text=Akhlak",
            source_id: "MUI Pusat",
            link: "berita1.html"
        }
    ];
    terkiniArticles = defaultArticles;
    renderTerkini(terkiniArticles);
    isTerkiniLoaded = true;
}

// ============================================================
// RENDER TERKINI
// ============================================================
function renderTerkini(articles) {
    const track = document.getElementById('terkiniTrack');
    if (!track) return;

    if (!articles || articles.length === 0) {
        track.innerHTML = `
            <div style="padding:12px 16px;color:var(--text-muted);font-size:13px;">
                <i class="fas fa-info-circle"></i> Tidak ada berita terkini
            </div>
        `;
        return;
    }

    // Buat item untuk setiap artikel
    const itemHTML = articles.map(a => `
        <div class="berita-terkini-item" onclick="window.location.href='${a.link || 'berita1.html'}'">
            <img src="${a.image_url || 'https://via.placeholder.com/100x100/1a6b3c/fff?text=Berita'}" 
                 alt="${a.title || 'Berita'}" 
                 class="terkini-thumb"
                 onerror="this.src='https://via.placeholder.com/100x100/1a6b3c/fff?text=Berita'">
            <div class="terkini-content">
                <div class="terkini-title">${a.title || 'Judul tidak tersedia'}</div>
                <div class="terkini-source">
                    <i class="fas fa-circle" style="font-size:6px;"></i>
                    ${a.source_id || 'Sumber'}
                </div>
            </div>
        </div>
    `).join('');

    // Duplikat untuk infinite scroll
    track.innerHTML = itemHTML + itemHTML;
}

// ============================================================
// INIT BERITA HOME
// ============================================================
function initBeritaHome() {
    renderBeritaPopuler();
    loadBeritaTerkini();
}

// Panggil saat halaman home dimuat
// Tambahkan ke inisialisasi
const originalInit = initBeritaHome;

// Pastikan dipanggil di DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Berita home akan diinisialisasi setelah produk dimuat
    setTimeout(initBeritaHome, 1000);
});

// ============================================================
// OVERRIDE NAVIGATE UNTUK REFRESH BERITA HOME
// ============================================================
// Tambahkan ke fungsi navigateTo yang sudah ada
const originalNavigateToBerita = navigateTo;
navigateTo = function(page) {
    originalNavigateToBerita(page);
    
    if (page === 'home') {
        // Refresh berita home setelah 500ms
        setTimeout(() => {
            // Hanya refresh jika elemen ada
            if (document.getElementById('populerSlider')) {
                // Reset slider
                if (populerInterval) {
                    clearInterval(populerInterval);
                }
                renderBeritaPopuler();
                // Refresh terkini jika sudah lebih dari 5 menit
                const lastUpdate = localStorage.getItem('terkini_last_update');
                const now = Date.now();
                if (!lastUpdate || (now - parseInt(lastUpdate)) > 300000) {
                    loadBeritaTerkini();
                    localStorage.setItem('terkini_last_update', String(now));
                }
            }
        }, 500);
    }
};
*/
// ============================================================
// BERITA HOME - TEKNOLOGI & AI (BERGESER SEPERTI TV)
// ============================================================

let terkiniArticles = [];
let isTerkiniLoaded = false;
let terkiniUpdateInterval = null;

// ============================================================
// LOAD BERITA TEKNOLOGI & AI DARI NEWS API
// ============================================================
async function loadBeritaTerkini() {
    const track = document.getElementById('terkiniTrack');
    const timeLabel = document.getElementById('terkiniTime');
    if (!track) return;

    // Update waktu
    if (timeLabel) {
        const now = new Date();
        timeLabel.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }

    // Tampilkan loading
    track.innerHTML = `
        <div class="berita-loading">
            <i class="fas fa-spinner fa-spin"></i> Memuat berita teknologi...
        </div>
    `;

    try {
        // Query untuk berita Teknologi dan AI
        const queries = [
            'teknologi AI indonesia',
            'artificial intelligence terbaru',
            'inovasi teknologi 2026',
            'startup teknologi indonesia',
            'AI dan machine learning',
            'teknologi digital terkini',
            'robotik dan AI',
            'metaverse teknologi',
            'kecerdasan buatan indonesia',
            'teknologi masa depan',
            'AI for business',
            'digital transformation',
            'cybersecurity terbaru',
            'teknologi 5G indonesia',
            'cloud computing indonesia'
        ];
        
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=id&language=id&q=${encodeURIComponent(randomQuery)}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        if (data.status === 'error' || !data.results || data.results.length === 0) {
            useDefaultTerkini();
            return;
        }
        
        // Filter berita yang relevan dengan teknologi & AI
        const filtered = data.results.filter(a => {
            const title = (a.title || '').toLowerCase();
            const desc = (a.description || '').toLowerCase();
            return title.includes('ai') || 
                   title.includes('teknologi') || 
                   title.includes('artificial') || 
                   title.includes('digital') || 
                   title.includes('robot') ||
                   title.includes('startup') ||
                   title.includes('inovasi') ||
                   title.includes('metaverse') ||
                   title.includes('kecerdasan') ||
                   title.includes('cyber') ||
                   title.includes('5g') ||
                   title.includes('cloud') ||
                   desc.includes('ai') ||
                   desc.includes('teknologi') ||
                   desc.includes('digital');
        });
        
        if (filtered.length === 0) {
            useDefaultTerkini();
            return;
        }
        
        // Ambil maksimal 12 berita
        terkiniArticles = filtered.slice(0, 12);
        renderTerkini(terkiniArticles);
        isTerkiniLoaded = true;
        
    } catch (error) {
        console.error('Gagal memuat berita teknologi:', error);
        useDefaultTerkini();
    }
}

// ============================================================
// DEFAULT TERKINI (FALLBACK - TEKNOLOGI & AI)
// ============================================================
function useDefaultTerkini() {
    const defaultArticles = [
        {
            title: "Perkembangan AI di Indonesia: Startup Lokal Tumbuh Pesat",
            image_url: "https://via.placeholder.com/100x100/0066cc/fff?text=AI+Indonesia",
            source_id: "Tekno.id",
            link: "berita1.html"
        },
        {
            title: "Google Luncurkan AI Terbaru yang Bisa Berpikir Seperti Manusia",
            image_url: "https://via.placeholder.com/100x100/0066cc/fff?text=Google+AI",
            source_id: "TechCrunch",
            link: "berita1.html"
        },
        {
            title: "5 Tren Teknologi yang Akan Mendominasi Tahun 2026",
            image_url: "https://via.placeholder.com/100x100/0066cc/fff?text=Tren+Teknologi",
            source_id: "DailySocial",
            link: "berita1.html"
        },
        {
            title: "Startup AI Indonesia Raih Pendanaan Rp 500 Miliar",
            image_url: "https://via.placeholder.com/100x100/0066cc/fff?text=Startup+AI",
            source_id: "CNBC Indonesia",
            link: "berita1.html"
        },
        {
            title: "ChatGPT Terbaru Kini Bisa Menganalisis Video Secara Real-time",
            image_url: "https://via.placeholder.com/100x100/0066cc/fff?text=ChatGPT+Video",
            source_id: "Tekno.id",
            link: "berita1.html"
        },
        {
            title: "Transformasi Digital UMKM dengan AI dan Cloud Computing",
            image_url: "https://via.placeholder.com/100x100/0066cc/fff?text=Digital+UMKM",
            source_id: "Bisnis.com",
            link: "berita1.html"
        },
        {
            title: "Robot Humanoid Pertama Buatan Indonesia Siap Dipasarkan",
            image_url: "https://via.placeholder.com/100x100/0066cc/fff?text=Robot+Indonesia",
            source_id: "Sains & Tekno",
            link: "berita1.html"
        },
        {
            title: "Meta Kembangkan AI untuk Metaverse Generasi Baru",
            image_url: "https://via.placeholder.com/100x100/0066cc/fff?text=Meta+AI",
            source_id: "TechInAsia",
            link: "berita1.html"
        }
    ];
    terkiniArticles = defaultArticles;
    renderTerkini(terkiniArticles);
    isTerkiniLoaded = true;
}

// ============================================================
// RENDER TERKINI - BERGESER KE SAMPING
// ============================================================
function renderTerkini(articles) {
    const track = document.getElementById('terkiniTrack');
    if (!track) return;

    if (!articles || articles.length === 0) {
        track.innerHTML = `
            <div class="berita-empty">
                <i class="fas fa-info-circle"></i> Tidak ada berita teknologi
            </div>
        `;
        return;
    }

    // Buat item untuk setiap artikel
    const itemHTML = articles.map(a => `
        <div class="berita-terkini-item" onclick="window.location.href='${a.link || 'berita1.html'}'">
            <img src="${a.image_url || 'https://via.placeholder.com/100x100/0066cc/fff?text=Tech'}" 
                 alt="${a.title || 'Berita'}" 
                 class="terkini-thumb"
                 onerror="this.src='https://via.placeholder.com/100x100/0066cc/fff?text=Tech'">
            <div class="terkini-content">
                <div class="terkini-title">${a.title || 'Judul tidak tersedia'}</div>
                <div class="terkini-source">
                    <i class="fas fa-circle"></i>
                    ${a.source_id || 'Sumber'}
                </div>
            </div>
        </div>
    `).join('');

    // Duplikat untuk infinite scroll (biar terus bergeser)
    track.innerHTML = itemHTML + itemHTML;
}

// ============================================================
// AUTO REFRESH TERKINI
// ============================================================
function startTerkiniAutoRefresh() {
    if (terkiniUpdateInterval) clearInterval(terkiniUpdateInterval);
    
    // Refresh setiap 5 menit
    terkiniUpdateInterval = setInterval(() => {
        loadBeritaTerkini();
    }, 300000); // 5 menit
}

// ============================================================
// INIT BERITA HOME
// ============================================================
function initBeritaHome() {
    loadBeritaTerkini();
    startTerkiniAutoRefresh();
}

// ============================================================
// UPDATE TERKINI TIME
// ============================================================
function updateTerkiniTime() {
    const timeLabel = document.getElementById('terkiniTime');
    if (timeLabel) {
        const now = new Date();
        timeLabel.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
}

// Update time setiap menit
setInterval(updateTerkiniTime, 60000);

// ============================================================
// INISIALISASI SAAT HALAMAN DIMUAT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initBeritaHome, 1000);
});

// ============================================================
// OVERRIDE NAVIGATE UNTUK REFRESH BERITA HOME
// ============================================================
const originalNavigateToBeritaHome = navigateTo;
navigateTo = function(page) {
    originalNavigateToBeritaHome(page);
    
    if (page === 'home') {
        setTimeout(() => {
            if (document.getElementById('terkiniTrack')) {
                const lastUpdate = localStorage.getItem('terkini_last_update');
                const now = Date.now();
                if (!lastUpdate || (now - parseInt(lastUpdate)) > 300000) {
                    loadBeritaTerkini();
                    localStorage.setItem('terkini_last_update', String(now));
                }
                updateTerkiniTime();
            }
        }, 300);
    }
    
    // Di dalam fungsi navigateTo, pada bagian page === 'stock'
if (page === 'stock') {
    // Load semua user posts dulu
    loadAllUserPosts().then(() => {
        if (stockItems.length === 0) {
            loadRandomStock();
        }
    });
}
    
    
    
    
};








// ============================================================
// BERITA SPESIAL MAULID NABI - NEWS PAGE (3 BERITA ASLI)
// ============================================================



/*
// 3 Berita Maulid Asli
const maulidCustomNews = [
    {
        id: 'maulid-1',
        title: "Berhati-hatilah terhadap do'a orang yang terzalimi",
        description: "Umat Islam di seluruh Indonesia merayakan Maulid Nabi Muhammad SAW 12 Rabiul Awal 1448 H dengan berbagai kegiatan keagamaan dan sosial.",
        image: "maull/3.jpg",
        source: "Terpopuler",
        date: "5 Rabiul Awal 1448 H",
        link: "lyd/zalim.html",
        isCustom: true
    },
    {
        id: 'maulid-2',
        title: "Amalan Sunnah di Bulan Rabiul Awal: Meneladani Akhlak Rasulullah",
        description: "Bulan Rabiul Awal adalah momentum untuk meningkatkan kecintaan kepada Nabi Muhammad SAW dengan memperbanyak shalawat dan meneladani akhlak mulia beliau.",
        image: "maull/2.jpg",
        source: "Terpopuler",
        date: "6 Rabiul Awal 1448 H",
        link: "lyd/amal.html",
        isCustom: true
    },
    {
        id: 'maulid-3',
        title: "Kisah Teladan Nabi Muhammad SAW: Dari Mekkah ke Madinah",
        description: "Perjalanan hijrah Nabi Muhammad SAW dari Mekkah ke Madinah menjadi bukti keteguhan dan kesabaran beliau dalam menyebarkan ajaran Islam.",
        image: "maull/1.jpg",
        source: "Terpopuler",
        date: "8 Rabiul Awal 1448 H",
        link: "lyd/teladan.html",
        isCustom: true
    }
];

let maulidCurrentSlide = 0;
let maulidSlideInterval = null;

// ============================================================
// RENDER MAULID SLIDER
// ============================================================
function renderMaulidSlider() {
    const track = document.getElementById('maulidSliderTrack');
    const dots = document.getElementById('maulidDots');
    
    if (!track) return;
    
    // Render slides
    track.innerHTML = maulidCustomNews.map((item, index) => `
        <div class="maulid-slide" data-index="${index}">
            <img src="${item.image}" alt="${item.title}" class="maulid-thumb"
                 onerror="this.src='https://via.placeholder.com/400x300/1a6b3c/fff?text=Maulid'">
            <div class="maulid-content">
                <span class="maulid-tag">
                    <i style="font-size:9px;"></i> News
                </span>
                <div class="maulid-slide-title">${item.title}</div>
                <div class="maulid-slide-desc">${item.description}</div>
                <div class="maulid-slide-meta">
                    <span><i class="fas fa-user"></i> ${item.source}</span>
                    <span><i class="far fa-calendar-alt"></i> ${item.date}</span>
                </div>
                <a href="${item.link}" class="maulid-read-btn" onclick="event.stopPropagation();">
                    <i class="fas fa-book-open"></i> Baca Selengkapnya
                </a>
            </div>
        </div>
    `).join('');
    
    // Update track position
    updateMaulidTrack();
    
    // Render dots
    if (dots) {
        dots.innerHTML = maulidCustomNews.map((_, index) => `
            <span class="dot ${index === maulidCurrentSlide ? 'active' : ''}" 
                  onclick="goToMaulidSlide(${index})"></span>
        `).join('');
    }
}
*/





/*
// ============================================================
// UPDATE MAULID TRACK - SLIDE LANCAR TANPA KOLOM KOSONG
// ============================================================
function updateMaulidTrack() {
    const track = document.getElementById('maulidSliderTrack');
    if (!track) return;
    
    const totalSlides = maulidCustomNews.length;
    
    // Pastikan current slide valid
    if (maulidCurrentSlide >= totalSlides) {
        maulidCurrentSlide = 0;
    }
    
    // Geser track dengan smooth
    track.style.transform = `translateX(-${maulidCurrentSlide * 100}%)`;
    
    // Update dots
    const dots = document.querySelectorAll('#maulidDots .dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === maulidCurrentSlide);
    });
    
    // Update tombol navigasi
    const prevBtn = document.getElementById('maulidPrevBtn');
    const nextBtn = document.getElementById('maulidNextBtn');
    if (prevBtn) prevBtn.disabled = maulidCurrentSlide === 0;
    if (nextBtn) nextBtn.disabled = maulidCurrentSlide >= totalSlides - 1;
}



// ============================================================
// GO TO SLIDE - TANPA KOLOM KOSONG
// ============================================================
function goToMaulidSlide(index) {
    const totalSlides = maulidCustomNews.length;
    if (index < 0 || index >= totalSlides || index === maulidCurrentSlide) return;
    
    maulidCurrentSlide = index;
    updateMaulidTrack();
    resetMaulidAutoSlide();
}

function nextMaulidSlide() {
    const totalSlides = maulidCustomNews.length;
    
    if (maulidCurrentSlide >= totalSlides - 1) {
        // Jika di slide terakhir, kembali ke slide pertama
        goToMaulidSlide(0);
        return;
    }
    goToMaulidSlide(maulidCurrentSlide + 1);
}

function prevMaulidSlide() {
    if (maulidCurrentSlide <= 0) {
        // Jika di slide pertama, ke slide terakhir
        goToMaulidSlide(maulidCustomNews.length - 1);
        return;
    }
    goToMaulidSlide(maulidCurrentSlide - 1);
}

*/




/*

// ============================================================
// AUTO SLIDE
// ============================================================
function startMaulidAutoSlide() {
    if (maulidSlideInterval) clearInterval(maulidSlideInterval);
    
    const totalSlides = maulidCustomNews.length;
    if (totalSlides <= 1) return;
    
    maulidSlideInterval = setInterval(() => {
        // Pindah ke slide berikutnya, jika di akhir kembali ke awal
        if (maulidCurrentSlide >= totalSlides - 1) {
            goToMaulidSlide(0);
        } else {
            goToMaulidSlide(maulidCurrentSlide + 1);
        }
    }, 6000);
}

function resetMaulidAutoSlide() {
    if (maulidSlideInterval) {
        clearInterval(maulidSlideInterval);
        startMaulidAutoSlide();
    }
}

// ============================================================
// INIT MAULID NEWS
// ============================================================
let maulidInitialized = false;

function initMaulidNews() {
    if (maulidInitialized) return;
    maulidInitialized = true;
    
    renderMaulidSlider();
    startMaulidAutoSlide();
}

// ============================================================
// PAUSE SLIDE SAAT HOVER
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.maulid-slider-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', function() {
            if (maulidSlideInterval) {
                clearInterval(maulidSlideInterval);
                maulidSlideInterval = null;
            }
        });
        
        wrapper.addEventListener('mouseleave', function() {
            if (!maulidSlideInterval) {
                startMaulidAutoSlide();
            }
        });
    }
});

// ============================================================
// NAVIGATE OVERRIDE
// ============================================================
const originalNavMaulid = window.navigateTo;
window.navigateTo = function(page) {
    if (typeof originalNavMaulid === 'function') {
        originalNavMaulid(page);
    }
    
    if (page === 'news') {
        setTimeout(() => {
            if (document.getElementById('maulidSliderTrack')) {
                // Pastikan slider tetap berjalan
                if (!maulidSlideInterval) {
                    startMaulidAutoSlide();
                }
            }
        }, 300);
    }
};

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMaulidNews, 500);
});
*/









function renderNews(articles) {
    const list = document.getElementById("newsList");
    const loadMoreWrap = document.getElementById("newsLoadMoreWrap");
    
    if (!articles || articles.length === 0) {
        list.innerHTML = '<div class="news-empty">Tidak ada berita tersedia saat ini</div>';
        if (loadMoreWrap) loadMoreWrap.style.display = 'none';
        return;
    }
    
    if (currentNewsCategory === 'independence81') {
        if (loadMoreWrap) loadMoreWrap.style.display = 'block';
    } else {
        if (loadMoreWrap) loadMoreWrap.style.display = 'none';
    }
    
    let html = "";
    articles.forEach(a => {
        html += `
            <div class="news-card">
                <img src="${a.image_url || 'https://via.placeholder.com/400x200/1a6b3c/fff?text=No+Image'}" alt="${a.title || 'Berita'}">
                <div class="content">
                    <div class="title">${a.title || 'Judul tidak tersedia'}</div>
                    <div class="meta"><i class="far fa-clock"></i> ${a.pubDate ? new Date(a.pubDate).toLocaleString('id-ID') : ''}</div>
                    <a class="read" href="${a.link || '#'}" target="_blank"><i class="fas fa-external-link-alt"></i> Baca Selengkapnya</a>
                </div>
            </div>
        `;
    });
    list.innerHTML = html;
}

async function loadMoreIndependenceNews() {
    if (currentNewsCategory !== 'independence81') return;
    
    const list = document.getElementById("newsList");
    const randomIndex = Math.floor(Math.random() * independenceNewsQueries.length);
    const query = independenceNewsQueries[randomIndex];
    
    try {
        const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=id&language=id&q=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        if (data.status === 'error') {
            showNotification('Gagal memuat berita tambahan');
            return;
        }
        
        const newArticles = data.results || [];
        if (newArticles.length === 0) {
            showNotification('Tidak ada berita tambahan');
            return;
        }
        
        newArticles.forEach(a => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `
                <img src="${a.image_url || 'https://via.placeholder.com/400x200/1a6b3c/fff?text=No+Image'}" alt="${a.title || 'Berita'}">
                <div class="content">
                    <div class="title">${a.title || 'Judul tidak tersedia'}</div>
                    <div class="meta"><i class="far fa-clock"></i> ${a.pubDate ? new Date(a.pubDate).toLocaleString('id-ID') : ''}</div>
                    <a class="read" href="${a.link || '#'}" target="_blank"><i class="fas fa-external-link-alt"></i> Baca Selengkapnya</a>
                </div>
            `;
            list.appendChild(card);
        });
        
        showNotification(newArticles.length + ' berita HUT RI ke-81 dimuat');
        
    } catch (error) {
        console.error(error);
        showNotification('Gagal memuat berita tambahan');
    }
}

// ============================================================
// STOCK - PEXELS API
// ============================================================
function getRandomQuery() {
    return randomQueries[Math.floor(Math.random() * randomQueries.length)];
}

async function loadRandomStock() {
    stockCurrentCategory = 'random';
    stockCurrentQuery = getRandomQuery();
    stockCurrentPage = 1;
    stockHasMore = true;
    stockItems = [];
    
    document.querySelectorAll('.stock-categories button').forEach(b => b.classList.remove('active'));
    document.querySelector('.stock-categories button:first-child')?.classList.add('active');
    
    await fetchStockItems();
}

async function filterStockCategory(category, btn) {
    stockCurrentCategory = category;
    stockCurrentPage = 1;
    stockHasMore = true;
    stockItems = [];
    
    document.querySelectorAll('.stock-categories button').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    if (category === 'random') {
        stockCurrentQuery = getRandomQuery();
    } else if (category === 'independence') {
        const randomIndex = Math.floor(Math.random() * independenceQueries.length);
        stockCurrentQuery = independenceQueries[randomIndex];
        console.log('🇮🇩 Mencari kemerdekaan:', stockCurrentQuery);
    } else {
        stockCurrentQuery = category;
    }
    
    await fetchStockItems();
    trackActivity('stock');
}
/*
async function searchStock() {
    const query = document.getElementById('stockSearchInput').value.trim();
    if (!query) { loadRandomStock(); return; }
    stockCurrentQuery = query;
    stockCurrentCategory = 'search';
    stockCurrentPage = 1;
    stockHasMore = true;
    stockItems = [];
    
    document.querySelectorAll('.stock-categories button').forEach(b => b.classList.remove('active'));
    await fetchStockItems();
}
*/


// ============================================================
// SEARCH STOCK - DENGAN USER POSTS
// ============================================================
async function searchStock() {
    const query = document.getElementById('stockSearchInput').value.trim();
    if (!query) { loadRandomStock(); return; }
    
    stockCurrentQuery = query;
    stockCurrentCategory = 'search';
    stockCurrentPage = 1;
    stockHasMore = true;
    stockItems = [];
    
    document.querySelectorAll('.stock-categories button').forEach(b => b.classList.remove('active'));
    
    stockIsLoading = true;
    const list = document.getElementById('stockList');
    list.innerHTML = '<div class="stock-loading"><i class="fas fa-spinner fa-spin"></i> Mencari...</div>';
    
    try {
        // Load semua user posts
        await loadAllUserPosts();
        
        // Filter user posts berdasarkan query
        const queryLower = query.toLowerCase();
        const matchingUserPosts = allUserPosts.filter(post => {
            const desc = (post.alt || post.description || '').toLowerCase();
            const username = (post.photographer || '').toLowerCase();
            return desc.includes(queryLower) || username.includes(queryLower);
        });
        
        console.log(`🔍 Query: "${query}" - User posts cocok: ${matchingUserPosts.length}`);
        
        // Fetch dari Pexels
        const photoUrl = `${PEXELS_BASE}/search?query=${encodeURIComponent(query)}&page=1&per_page=12`;
        const photoRes = await fetch(photoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!photoRes.ok) throw new Error(`HTTP ${photoRes.status}`);
        const photoData = await photoRes.json();
        
        const videoUrl = `${PEXELS_VIDEO_BASE}/search?query=${encodeURIComponent(query)}&page=1&per_page=8`;
        const videoRes = await fetch(videoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!videoRes.ok) throw new Error(`HTTP ${videoRes.status}`);
        const videoData = await videoRes.json();
        
        const photos = photoData.photos || [];
        const videos = videoData.videos || [];
        
        const photoItems = photos.map(p => ({ ...p, type: 'photo' }));
        const videoItems = videos.map(v => ({ ...v, type: 'video' }));
        
        // Gabungkan: User Posts dulu, lalu Pexels
        let combined = [...matchingUserPosts, ...photoItems, ...videoItems];
        combined = shuffleArray(combined);
        
        stockItems = combined;
        stockHasMore = false;
        renderStockItems(stockItems);
        
        if (stockItems.length === 0) {
            list.innerHTML = '<div class="stock-empty">Tidak ada hasil ditemukan untuk "' + query + '"</div>';
        }
        
    } catch (err) {
        console.error('Search error:', err);
        list.innerHTML = `<div class="stock-empty">Gagal mencari: ${err.message}</div>`;
    }
    
    stockIsLoading = false;
}


/*
async function fetchStockItems() {
    if (stockIsLoading) return;
    stockIsLoading = true;
    
    const list = document.getElementById('stockList');
    list.innerHTML = '<div class="stock-loading"><i class="fas fa-spinner fa-spin"></i> Memuat gallery...</div>';
    document.getElementById('loadMoreWrap').style.display = 'none';
    
    try {
        let queryToUse = stockCurrentQuery;
        
        if (stockCurrentCategory === 'independence') {
            const randomIndex = Math.floor(Math.random() * independenceQueries.length);
            queryToUse = independenceQueries[randomIndex];
            console.log('🇮🇩 Memuat kemerdekaan:', queryToUse);
        }
        
        const photoUrl = `${PEXELS_BASE}/search?query=${encodeURIComponent(queryToUse)}&page=${stockCurrentPage}&per_page=12`;
        const photoRes = await fetch(photoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!photoRes.ok) throw new Error(`HTTP ${photoRes.status}`);
        const photoData = await photoRes.json();
        
        const videoUrl = `${PEXELS_VIDEO_BASE}/search?query=${encodeURIComponent(queryToUse)}&page=${stockCurrentPage}&per_page=8`;
        const videoRes = await fetch(videoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!videoRes.ok) throw new Error(`HTTP ${videoRes.status}`);
        const videoData = await videoRes.json();
        
        const photos = photoData.photos || [];
        const videos = videoData.videos || [];
        
        const photoItems = photos.map(p => ({ ...p, type: 'photo' }));
        const videoItems = videos.map(v => ({ ...v, type: 'video' }));
        
        let combined = [...photoItems, ...videoItems];
        combined = shuffleArray(combined);
        
        stockItems = combined;
        stockHasMore = (photoData.next_page || videoData.next_page) ? true : false;
        renderStockItems(stockItems);
        
        if (stockItems.length === 0) {
            list.innerHTML = '<div class="stock-empty">Tidak ada hasil ditemukan</div>';
        }
        
        if (stockHasMore && stockItems.length > 0) {
            document.getElementById('loadMoreWrap').style.display = 'block';
        } else {
            document.getElementById('loadMoreWrap').style.display = 'none';
        }
        
    } catch (err) {
        console.error(err);
        list.innerHTML = `<div class="stock-empty">Gagal memuat: ${err.message}</div>`;
    }
    
    stockIsLoading = false;
}

*/

// ============================================================
// FETCH STOCK ITEMS - DENGAN SEMUA USER POSTS
// ============================================================

/*
async function fetchStockItems() {
    if (stockIsLoading) return;
    stockIsLoading = true;
    
    const list = document.getElementById('stockList');
    if (!list) {
        stockIsLoading = false;
        return;
    }
    
    list.innerHTML = '<div class="stock-loading"><i class="fas fa-spinner fa-spin"></i> Memuat gallery...</div>';
    document.getElementById('loadMoreWrap').style.display = 'none';
    
    try {
        // Load semua user posts terlebih dahulu
        await loadAllUserPosts();
        
        let queryToUse = stockCurrentQuery;
        
        if (stockCurrentCategory === 'independence') {
            const randomIndex = Math.floor(Math.random() * independenceQueries.length);
            queryToUse = independenceQueries[randomIndex];
            console.log('🇮🇩 Memuat kemerdekaan:', queryToUse);
        }
        
        // Fetch foto dari Pexels
        const photoUrl = `${PEXELS_BASE}/search?query=${encodeURIComponent(queryToUse)}&page=${stockCurrentPage}&per_page=12`;
        const photoRes = await fetch(photoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!photoRes.ok) throw new Error(`HTTP ${photoRes.status}`);
        const photoData = await photoRes.json();
        
        // Fetch video dari Pexels
        const videoUrl = `${PEXELS_VIDEO_BASE}/search?query=${encodeURIComponent(queryToUse)}&page=${stockCurrentPage}&per_page=8`;
        const videoRes = await fetch(videoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!videoRes.ok) throw new Error(`HTTP ${videoRes.status}`);
        const videoData = await videoRes.json();
        
        const photos = photoData.photos || [];
        const videos = videoData.videos || [];
        
        const photoItems = photos.map(p => ({ ...p, type: 'photo' }));
        const videoItems = videos.map(v => ({ ...v, type: 'video' }));
        
        // Gabungkan Pexels + User Posts
        let combined = [...photoItems, ...videoItems, ...allUserPosts];
        combined = shuffleArray(combined);
        
        stockItems = combined;
        stockHasMore = (photoData.next_page || videoData.next_page) ? true : false;
        renderStockItems(stockItems);
        
        if (stockItems.length === 0) {
            list.innerHTML = '<div class="stock-empty">Tidak ada hasil ditemukan</div>';
        }
        
        if (stockHasMore && stockItems.length > 0) {
            document.getElementById('loadMoreWrap').style.display = 'block';
        } else {
            document.getElementById('loadMoreWrap').style.display = 'none';
        }
        
    } catch (err) {
        console.error('Gagal memuat stock:', err);
        const listEl = document.getElementById('stockList');
        if (listEl) {
            listEl.innerHTML = `<div class="stock-empty">Gagal memuat: ${err.message}</div>`;
        }
    }
    
    stockIsLoading = false;
}
*/
// ============================================================
// FETCH STOCK ITEMS - DENGAN SEMUA USER POSTS
// ============================================================
async function fetchStockItems() {
    if (stockIsLoading) return;
    stockIsLoading = true;
    
    const list = document.getElementById('stockList');
    if (!list) {
        stockIsLoading = false;
        return;
    }
    
    list.innerHTML = '<div class="stock-loading"><i class="fas fa-spinner fa-spin"></i> Memuat gallery...</div>';
    document.getElementById('loadMoreWrap').style.display = 'none';
    
    try {
        // Load semua user posts (sudah memiliki field 'id' yang benar)
        await loadAllUserPosts();
        
        let queryToUse = stockCurrentQuery;
        
        if (stockCurrentCategory === 'independence') {
            const randomIndex = Math.floor(Math.random() * independenceQueries.length);
            queryToUse = independenceQueries[randomIndex];
        }
        
        // Fetch Pexels photos
        const photoUrl = `${PEXELS_BASE}/search?query=${encodeURIComponent(queryToUse)}&page=${stockCurrentPage}&per_page=12`;
        const photoRes = await fetch(photoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!photoRes.ok) throw new Error(`HTTP ${photoRes.status}`);
        const photoData = await photoRes.json();
        
        // Fetch Pexels videos
        const videoUrl = `${PEXELS_VIDEO_BASE}/search?query=${encodeURIComponent(queryToUse)}&page=${stockCurrentPage}&per_page=8`;
        const videoRes = await fetch(videoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!videoRes.ok) throw new Error(`HTTP ${videoRes.status}`);
        const videoData = await videoRes.json();
        
        
        
        /*
        const photos = photoData.photos || [];
        const videos = videoData.videos || [];
        
        const photoItems = photos.map(p => ({ ...p, type: 'photo' }));
        const videoItems = videos.map(v => ({ ...v, type: 'video' }));
        
        // Gabungkan: Pexels + User Posts (tanpa mengubah field id)
        let combined = [...photoItems, ...videoItems, ...allUserPosts];
        combined = shuffleArray(combined);
        
        stockItems = combined;
        stockHasMore = (photoData.next_page || videoData.next_page) ? true : false;
        renderStockItems(stockItems);
        
        */
        
        /*USER PALING ATAS
const photos = photoData.photos || [];
const videos = videoData.videos || [];

const photoItems = photos.map(p => ({ ...p, type: 'photo' }));
const videoItems = videos.map(v => ({ ...v, type: 'video' }));

// ============================================================
// GABUNGKAN & ACAK MERATA: Pexels + User Posts
// ============================================================
// Prinsip: user posts TIDAK ditaruh di depan/belakang,
// tapi di-shuffle bareng biar benar-benar random mix.

// 1. Ambil user posts, beri flag type yang benar
const userPostItems = allUserPosts.map(post => ({
    ...post,
    type: post.media_type === 'video' ? 'video' : 'photo'
}));

// 2. Gabungkan SEMUA
let combined = [...photoItems, ...videoItems, ...userPostItems];

// 3. Dedup by unique ID (hindari duplikat kalau fetch dipanggil 2x)
const seenIds = new Set();
combined = combined.filter(item => {
    // Buat unique key: type + id
    const uniqueKey = `${item.type || 'photo'}-${item.id || item.postId || Math.random()}`;
    if (seenIds.has(uniqueKey)) return false;
    seenIds.add(uniqueKey);
    return true;
});

// 4. Shuffle MERATA — user posts & Pexels bercampur random
combined = shuffleArray(combined);

// 5. Batasi proporsi user posts biar tidak mendominasi
//    (maks 30% user posts, sisanya Pexels)
const maxUserPosts = Math.ceil(combined.length * 0.3);
let userPostCount = 0;
const balancedItems = combined.filter(item => {
    if (item.isUserPost) {
        if (userPostCount < maxUserPosts) {
            userPostCount++;
            return true;
        }
        return false; // Skip kalau sudah cukup
    }
    return true;
});

stockItems = balancedItems;
stockHasMore = (photoData.next_page || videoData.next_page) ? true : false;
renderStockItems(stockItems);
*/

const photos = photoData.photos || [];
const videos = videoData.videos || [];

const photoItems = photos.map(p => ({ ...p, type: 'photo' }));
const videoItems = videos.map(v => ({ ...v, type: 'video' }));

// ============================================================
// OPSI A: INTERLEAVE — Pexels dominan, User Posts muncul berkala
// ============================================================
// Rasio: ~80% Pexels + ~20% User Posts
// Pattern: 8 Pexels → 2 User Posts → 8 Pexels → 2 User Posts ...

// 1. Siapkan Pexels items (shuffle)
let pexelsItems = [...photoItems, ...videoItems];
pexelsItems = shuffleArray(pexelsItems);

// 2. Siapkan User Posts (shuffle + dedup)
let userPostItems = allUserPosts.map(post => ({
    ...post,
    type: post.media_type === 'video' ? 'video' : 'photo'
}));

// Dedup by ID
const seenUserIds = new Set();
userPostItems = userPostItems.filter(item => {
    const key = `user-${item.id || item.postId}`;
    if (seenUserIds.has(key)) return false;
    seenUserIds.add(key);
    return true;
});

userPostItems = shuffleArray(userPostItems);

// Batasi maks 12 user posts biar tidak terlalu banyak
userPostItems = userPostItems.slice(0, 12);

// 3. INTERLEAVE: 8 Pexels → 2 User Posts → 8 Pexels → 2 User Posts ...
const PEXELS_PER_BLOCK = 8;
const USER_POSTS_PER_BLOCK = 2;

const combined = [];
let pexelsIndex = 0;
let userPostIndex = 0;

while (pexelsIndex < pexelsItems.length || userPostIndex < userPostItems.length) {
    // Tambahkan 8 Pexels
    for (let i = 0; i < PEXELS_PER_BLOCK && pexelsIndex < pexelsItems.length; i++) {
        combined.push(pexelsItems[pexelsIndex++]);
    }
    
    // Tambahkan 2 User Posts (kalau masih ada)
    for (let i = 0; i < USER_POSTS_PER_BLOCK && userPostIndex < userPostItems.length; i++) {
        combined.push(userPostItems[userPostIndex++]);
    }
}

stockItems = combined;
stockHasMore = (photoData.next_page || videoData.next_page) ? true : false;
renderStockItems(stockItems);





        
        
        if (stockItems.length === 0) {
            list.innerHTML = '<div class="stock-empty">Tidak ada hasil ditemukan</div>';
        }
        
        if (stockHasMore && stockItems.length > 0) {
            document.getElementById('loadMoreWrap').style.display = 'block';
        } else {
            document.getElementById('loadMoreWrap').style.display = 'none';
        }
        
    } catch (err) {
        console.error('Gagal memuat stock:', err);
        const listEl = document.getElementById('stockList');
        if (listEl) {
            listEl.innerHTML = `<div class="stock-empty">Gagal memuat: ${err.message}</div>`;
        }
    }
    
    stockIsLoading = false;
}














/*
async function loadMoreStock() {
    if (stockIsLoading || !stockHasMore) return;
    stockCurrentPage++;
    stockIsLoading = true;
    
    const btn = document.querySelector('#loadMoreWrap .btn-load-more');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat...';
    
    try {
        let queryToUse = stockCurrentQuery;
        
        if (stockCurrentCategory === 'independence') {
            const randomIndex = Math.floor(Math.random() * independenceQueries.length);
            queryToUse = independenceQueries[randomIndex];
            console.log('🇮🇩 Load more kemerdekaan:', queryToUse);
        }
        
        const photoUrl = `${PEXELS_BASE}/search?query=${encodeURIComponent(queryToUse)}&page=${stockCurrentPage}&per_page=12`;
        const photoRes = await fetch(photoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!photoRes.ok) throw new Error(`HTTP ${photoRes.status}`);
        const photoData = await photoRes.json();
        
        const videoUrl = `${PEXELS_VIDEO_BASE}/search?query=${encodeURIComponent(queryToUse)}&page=${stockCurrentPage}&per_page=8`;
        const videoRes = await fetch(videoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!videoRes.ok) throw new Error(`HTTP ${videoRes.status}`);
        const videoData = await videoRes.json();
        
        const photos = photoData.photos || [];
        const videos = videoData.videos || [];
        
        const photoItems = photos.map(p => ({ ...p, type: 'photo' }));
        const videoItems = videos.map(v => ({ ...v, type: 'video' }));
        
        let combined = [...photoItems, ...videoItems];
        combined = shuffleArray(combined);
        
        stockItems = [...stockItems, ...combined];
        stockHasMore = (photoData.next_page || videoData.next_page) ? true : false;
        renderStockItems(stockItems, true);
        
        if (!stockHasMore || combined.length === 0) {
            document.getElementById('loadMoreWrap').style.display = 'none';
        }
        
    } catch (err) {
        console.error(err);
        showNotification('Gagal memuat lebih banyak');
    }
    
    stockIsLoading = false;
    btn.innerHTML = '<i class="fas fa-chevron-down"></i> Muat Lebih Banyak';
}
*/
// ============================================================
// LOAD MORE STOCK
// ============================================================
async function loadMoreStock() {
    if (stockIsLoading || !stockHasMore) return;
    stockCurrentPage++;
    stockIsLoading = true;
    
    const btn = document.querySelector('#loadMoreWrap .btn-load-more');
    if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat...';
    
    try {
        let queryToUse = stockCurrentQuery;
        
        if (stockCurrentCategory === 'independence') {
            const randomIndex = Math.floor(Math.random() * independenceQueries.length);
            queryToUse = independenceQueries[randomIndex];
        }
        
        const photoUrl = `${PEXELS_BASE}/search?query=${encodeURIComponent(queryToUse)}&page=${stockCurrentPage}&per_page=12`;
        const photoRes = await fetch(photoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!photoRes.ok) throw new Error(`HTTP ${photoRes.status}`);
        const photoData = await photoRes.json();
        
        const videoUrl = `${PEXELS_VIDEO_BASE}/search?query=${encodeURIComponent(queryToUse)}&page=${stockCurrentPage}&per_page=8`;
        const videoRes = await fetch(videoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!videoRes.ok) throw new Error(`HTTP ${videoRes.status}`);
        const videoData = await videoRes.json();
        
        const photos = photoData.photos || [];
        const videos = videoData.videos || [];
        
        const photoItems = photos.map(p => ({ ...p, type: 'photo' }));
        const videoItems = videos.map(v => ({ ...v, type: 'video' }));
        
        
        /*
        let combined = [...photoItems, ...videoItems];
        combined = shuffleArray(combined);
        
        stockItems = [...stockItems, ...combined];
        stockHasMore = (photoData.next_page || videoData.next_page) ? true : false;
        renderStockItems(stockItems, true);
        */
// Gabungkan Pexels baru saja (user posts sudah ada di stockItems)


/*
let combined = [...photoItems, ...videoItems];
combined = shuffleArray(combined);

// Dedup dengan yang sudah ada
const existingIds = new Set(
    stockItems.map(item => `${item.type || 'photo'}-${item.id || item.postId}`)
);

const newItems = combined.filter(item => {
    const key = `${item.type || 'photo'}-${item.id || item.postId}`;
    if (existingIds.has(key)) return false;
    existingIds.add(key);
    return true;
});

// Tambahkan item baru ke akhir (biar urutan tetap)
stockItems = [...stockItems, ...newItems];
stockHasMore = (photoData.next_page || videoData.next_page) ? true : false;
renderStockItems(stockItems, true);
*/
// Ambil Pexels baru
let newPexelsItems = [...photoItems, ...videoItems];
newPexelsItems = shuffleArray(newPexelsItems);

// Dedup dengan yang sudah ada
const existingIds = new Set(
    stockItems.map(item => `${item.type || 'photo'}-${item.id || item.postId}`)
);

newPexelsItems = newPexelsItems.filter(item => {
    const key = `${item.type || 'photo'}-${item.id || item.postId}`;
    if (existingIds.has(key)) return false;
    existingIds.add(key);
    return true;
});

// ============================================================
// INTERLEAVE UNTUK LOAD MORE
// ============================================================
// User posts sudah ada di stockItems, jangan ditambah lagi.
// Kita hanya tambahkan Pexels baru ke akhir,
// lalu sisipkan user posts yang lama ke dalam Pexels baru.

// 1. Pisahkan user posts dari stockItems (kita simpan untuk re-interleave)
const currentUserPosts = stockItems.filter(item => item.isUserPost);
const currentPexels = stockItems.filter(item => !item.isUserPost);

// 2. Gabungkan Pexels lama + baru
const allPexels = [...currentPexels, ...newPexelsItems];

// 3. Re-interleave SEMUA (Pexels + User Posts lama)
const PEXELS_PER_BLOCK = 8;
const USER_POSTS_PER_BLOCK = 2;

const combined = [];
let pexelsIndex = 0;
let userPostIndex = 0;

while (pexelsIndex < allPexels.length || userPostIndex < currentUserPosts.length) {
    // Tambahkan 8 Pexels
    for (let i = 0; i < PEXELS_PER_BLOCK && pexelsIndex < allPexels.length; i++) {
        combined.push(allPexels[pexelsIndex++]);
    }
    
    // Tambahkan 2 User Posts (kalau masih ada)
    for (let i = 0; i < USER_POSTS_PER_BLOCK && userPostIndex < currentUserPosts.length; i++) {
        combined.push(currentUserPosts[userPostIndex++]);
    }
}

stockItems = combined;
stockHasMore = (photoData.next_page || videoData.next_page) ? true : false;
renderStockItems(stockItems);



        
        
        
        if (!stockHasMore || combined.length === 0) {
            document.getElementById('loadMoreWrap').style.display = 'none';
        }
        
    } catch (err) {
        console.error(err);
        showNotification('Gagal memuat lebih banyak');
    }
    
    stockIsLoading = false;
    if (btn) btn.innerHTML = '<i class="fas fa-chevron-down"></i> Muat Lebih Banyak';
}






function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


/*
function renderStockItems(items, append = false) {
    const list = document.getElementById('stockList');
    if (!append) list.innerHTML = '';
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'stock-item';
        
        if (item.type === 'photo') {
            div.innerHTML = `
                <img src="${item.src.medium}" alt="${item.alt || 'Photo'}" loading="lazy" />
                <div class="stock-info">
                    <div class="photographer"><i class="fas fa-camera"></i> ${item.photographer || 'Unknown'}</div>
                </div>
            `;
            div.addEventListener('click', () => showStockDetail(item));
        } else {
            const videoFile = item.video_files?.find(f => f.quality === 'hd') || item.video_files?.[0];
            const thumb = item.image || item.video_pictures?.[0]?.picture || '';
            
            div.innerHTML = `
                <video src="${videoFile?.link || ''}" poster="${thumb}" muted loop playsinline loading="lazy"></video>
                <div class="video-badge"><i class="fas fa-video"></i> Video</div>
                <div class="stock-info">
                    <div class="photographer"><i class="fas fa-camera"></i> ${item.user?.name || 'Unknown'}</div>
                </div>
            `;
            
            const videoEl = div.querySelector('video');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        videoEl.play().catch(() => {});
                    } else {
                        videoEl.pause();
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(videoEl);
            
            div.addEventListener('click', () => showVideoDetail(item));
        }
        
        list.appendChild(div);
    });
    
    setTimeout(() => {
        const firstVideo = list.querySelector('video');
        if (firstVideo) {
            firstVideo.play().catch(() => {});
        }
    }, 500);
}
*/
// ============================================================
// RENDER STOCK ITEMS - DENGAN USER POSTS
// ============================================================

/*
function renderStockItems(items, append = false) {
    const list = document.getElementById('stockList');
    if (!list) return;
    
    if (!append) list.innerHTML = '';
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'stock-item';
        
        // Cek apakah ini user post
        if (item.isUserPost) {
            // User post
            if (item.type === 'video') {
                div.innerHTML = `
                    <video src="${item.src.medium}" muted loop playsinline loading="lazy"></video>
                    <div class="video-badge"><i class="fas fa-video"></i> Video</div>
                    <div class="stock-info">
                        <div class="photographer">
                            <i class="fas fa-user"></i> 
                            ${item.photographer || 'User'}
                            <span style="font-size:9px;color:#4ade80;margin-left:4px;"> Community</span>
                        </div>
                    </div>
                `;
                div.addEventListener('click', () => showVideoDetail(item));
            } else {
                div.innerHTML = `
                    <img src="${item.src.medium}" alt="${item.alt || 'User Post'}" loading="lazy" />
                    <div class="stock-info">
                        <div class="photographer">
                            <i class="fas fa-user"></i> 
                            ${item.photographer || 'User'}
                            <span style="font-size:9px;color:#4ade80;margin-left:4px;"> Community</span>
                        </div>
                    </div>
                `;
                div.addEventListener('click', () => showStockDetail(item));
            }
        } else {
            // Pexels
            if (item.type === 'photo') {
                div.innerHTML = `
                    <img src="${item.src.medium}" alt="${item.alt || 'Photo'}" loading="lazy" />
                    <div class="stock-info">
                        <div class="photographer"><i class="fas fa-camera"></i> ${item.photographer || 'Unknown'}</div>
                    </div>
                `;
                div.addEventListener('click', () => showStockDetail(item));
            } else {
                const videoFile = item.video_files?.find(f => f.quality === 'hd') || item.video_files?.[0];
                const thumb = item.image || item.video_pictures?.[0]?.picture || '';
                
                div.innerHTML = `
                    <video src="${videoFile?.link || ''}" poster="${thumb}" muted loop playsinline loading="lazy"></video>
                    <div class="video-badge"><i class="fas fa-video"></i> Video</div>
                    <div class="stock-info">
                        <div class="photographer"><i class="fas fa-camera"></i> ${item.user?.name || 'Unknown'}</div>
                    </div>
                `;
                
                const videoEl = div.querySelector('video');
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            videoEl.play().catch(() => {});
                        } else {
                            videoEl.pause();
                        }
                    });
                }, { threshold: 0.3 });
                observer.observe(videoEl);
                
                div.addEventListener('click', () => showVideoDetail(item));
            }
        }
        
        list.appendChild(div);
    });
    
    setTimeout(() => {
        const firstVideo = list.querySelector('video');
        if (firstVideo) {
            firstVideo.play().catch(() => {});
        }
    }, 500);
}
*/
// ============================================================
// RENDER STOCK ITEMS - DENGAN USER POSTS
// ============================================================
function renderStockItems(items, append = false) {
    const list = document.getElementById('stockList');
    if (!list) return;
    
    if (!append) list.innerHTML = '';
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'stock-item';
        
        
        
        
        
        /*
        if (item.isUserPost) {
            // USER POST
            if (item.type === 'video') {
                div.innerHTML = `
                    <video src="${item.media_url || item.src.medium}" muted loop playsinline loading="lazy"></video>
                    <div class="video-badge"><i class="fas fa-video"></i> Video</div>
                    <div class="stock-info">
                        <div class="photographer">
                            <i class="fas fa-user"></i> 
                            ${item.photographer || 'User'}
                        </div>
                    </div>
                `;
                div.addEventListener('click', () => showVideoDetail(item));
            } else {
                div.innerHTML = `
                    <img src="${item.media_url || item.src.medium}" alt="${item.alt || 'User Post'}" loading="lazy" />
                    <div class="stock-info">
                        <div class="photographer">
                            <i class="fas fa-user"></i> 
                            ${item.photographer || 'User'}
                        </div>
                    </div>
                `;
                div.addEventListener('click', () => showStockDetail(item));
            }
        } else {
            
            */
            
            if (item.isUserPost) {
    // USER POST
    // Deteksi tipe: bisa dari `type`, `media_type`, atau cek extension file
    const mediaUrl = item.media_url || item.src?.medium || item.src?.original;
    const isVideo = item.type === 'video' 
                 || item.media_type === 'video'
                 || (mediaUrl && /\.(mp4|webm|mov|m4v|ogv)$/i.test(mediaUrl));
    
    if (isVideo) {
        // Validasi URL dulu
        if (!mediaUrl) {
            console.warn('⚠️ Video user post tidak punya media_url:', item);
            div.innerHTML = `
                <div class="stock-video-error">
                    <i class="fas fa-video-slash"></i>
                    <span>Video tidak tersedia</span>
                </div>
                <div class="stock-info">
                    <div class="photographer">
                        <i class="fas fa-user"></i> ${item.photographer || 'User'}
                    </div>
                </div>
            `;
            list.appendChild(div);
            return;
        }
        
        div.innerHTML = `
            <div class="stock-video-wrapper">
                <video 
                    src="${mediaUrl}" 
                    muted 
                    loop 
                    playsinline
                    webkit-playsinline
                    preload="metadata"
                    crossorigin="anonymous"
                    onerror="handleStockVideoError(this)"></video>
                <div class="video-badge"><i class="fas fa-video"></i></div>
                <div class="video-play-overlay"><i class="fas fa-play"></i></div>
            </div>
            <div class="stock-info">
                <div class="photographer">
                    <i class="fas fa-user"></i> 
                    ${item.photographer || 'User'}
                </div>
            </div>
        `;
        
        // Autoplay saat masuk viewport (seperti video Pexels)
        const videoEl = div.querySelector('video');
        if (videoEl) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        videoEl.muted = true;
                        videoEl.play().catch(() => {});
                    } else {
                        videoEl.pause();
                    }
                });
            }, { threshold: 0.4 });
            observer.observe(videoEl);
        }
        
        div.addEventListener('click', () => showVideoDetail(item));
    } else {
        div.innerHTML = `
            <img src="${mediaUrl}" alt="${item.alt || 'User Post'}" loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/400x400/1a6b3c/fff?text=No+Image'" />
            <div class="stock-info">
                <div class="photographer">
                    <i class="fas fa-user"></i> 
                    ${item.photographer || 'User'}
                </div>
            </div>
        `;
        div.addEventListener('click', () => showStockDetail(item));
    }
} else {
    
    
            
            
            // PEXELS
            if (item.type === 'photo') {
                div.innerHTML = `
                    <img src="${item.src.medium}" alt="${item.alt || 'Photo'}" loading="lazy" />
                    <div class="stock-info">
                        <div class="photographer"><i class="fas fa-camera"></i> ${item.photographer || 'Unknown'}</div>
                    </div>
                `;
                div.addEventListener('click', () => showStockDetail(item));
            } else {
                const videoFile = item.video_files?.find(f => f.quality === 'hd') || item.video_files?.[0];
                const thumb = item.image || item.video_pictures?.[0]?.picture || '';
                
                div.innerHTML = `
                    <video src="${videoFile?.link || ''}" poster="${thumb}" muted loop playsinline loading="lazy"></video>
                    <div class="video-badge"><i class="fas fa-video"></i> Video</div>
                    <div class="stock-info">
                        <div class="photographer"><i class="fas fa-camera"></i> ${item.user?.name || 'Unknown'}</div>
                    </div>
                `;
                
                const videoEl = div.querySelector('video');
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            videoEl.play().catch(() => {});
                        } else {
                            videoEl.pause();
                        }
                    });
                }, { threshold: 0.3 });
                observer.observe(videoEl);
                
                div.addEventListener('click', () => showVideoDetail(item));
            }
        }
        
        list.appendChild(div);
    });
    
    setTimeout(() => {
        const firstVideo = list.querySelector('video');
        if (firstVideo) {
            firstVideo.play().catch(() => {});
        }
    }, 500);
}


/*
function showStockDetail(photo) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    body.innerHTML = `
        <div class="detail-body">
            <img src="${photo.src.large2x || photo.src.original}" alt="${photo.alt || 'Photo'}" class="book-cover-large" />
            <div class="detail-photographer">
                <div class="book-title-large">${photo.photographer || 'Unknown'}</div>
            </div>
            <div class="book-description">${photo.alt || 'Tidak ada deskripsi'}</div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${photo.src.original}', '${photo.photographer || 'photo'}.jpg')"><i class="fas fa-download"></i> Unduh</button>
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
}

function showVideoDetail(video) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    const videoFile = video.video_files?.find(f => f.quality === 'hd') || video.video_files?.[0];
    const thumb = video.image || video.video_pictures?.[0]?.picture || '';
    
    body.innerHTML = `
        <div class="detail-body">
            <video src="${videoFile?.link || ''}" poster="${thumb}" controls playsinline style="width:100%;border-radius:12px;max-height:400px;background:#000;"></video>
            <div class="detail-photographer">
                <div class="book-title-large">${video.user?.name || 'Unknown'}</div>
            </div>
            <div class="detail-actions">
                <button class="btn-download" onclick="downloadFile('${videoFile?.link || ''}', '${video.user?.name || 'video'}.mp4')"><i class="fas fa-download"></i> Unduh</button>
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('stock');
    
    setTimeout(() => {
        const vid = modal.querySelector('video');
        if (vid) vid.play().catch(() => {});
    }, 300);
}
*/

// ============================================================
// DOWNLOAD FILE
// ============================================================
async function downloadFile(url, filename) {
    if (!url) { showNotification('Link tidak tersedia'); return; }
    
    const btn = document.querySelector('.btn-download');
    if (btn) {
        btn.classList.add('loading');
        btn.innerHTML = '<span class="spinner"></span> Mengunduh...';
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal mengunduh');
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        
        showNotification('Unduhan selesai');
    } catch (err) {
        console.error(err);
        window.open(url, '_blank');
        showNotification('Mengunduh...');
    }
    
    if (btn) {
        btn.classList.remove('loading');
        btn.innerHTML = '<i class="fas fa-download"></i> Unduh';
    }
}















// ============================================================
// MAULID STOCK SLIDER - SPESIAL MAULID NABI (SCROLLABLE)
// ============================================================

/*
// Query khusus Maulid untuk Pexels
const maulidStockQueries = [
    'islamic mosque',
    'masjid indonesia',
    'arabic calligraphy',
    'quran reading',
    'islamic prayer',
    'muslim prayer',
    'ramadan mosque',
    'islamic architecture',
    'muslim people praying',
    'islamic ornament',
    'mosque night',
    'islamic art',
    'muslim community',
    'arabic pattern',
    'islamic geometric',
    'muslim family',
    'islamic education',
    'mosque interior',
    'muslim children',
    'islamic festival',
    'muslim woman hijab',
    'islamic lantern',
    'mosque dome',
    'muslim prayer beads',
    'islamic background'
];
*/
// Query khusus Kreativitas untuk Pexels
const maulidStockQueries = [
    'creative workspace',
    'creative designer',
    'graphic design',
    'graphic designer',
    'digital art',
    'digital artist',
    'creative illustration',
    'illustration artist',
    'creative drawing',
    'drawing ideas',
    'sketching',
    'creative sketch',
    'design inspiration',
    'creative inspiration',
    'creative ideas',
    'brainstorming ideas',
    'creative thinking',
    'innovation ideas',
    'creative process',
    'creative project',
    'modern design',
    'minimalist design',
    'visual design',
    'branding design',
    'logo design',
    'web design',
    'UI UX design',
    'creative technology',
    'artificial intelligence technology',
    'AI creativity',
    'AI technology',
    'future technology',
    'digital technology',
    'creative coding',
    'programming technology',
    'software development',
    'creative developer',
    'architectural design',
    'modern architecture',
    'architecture concept',
    'architect drawing',
    'interior design',
    'creative photography',
    'photography studio',
    'product photography',
    'creative photo editing',
    'photo editing',
    'creative art studio',
    'artist studio',
    'painting artist',
    'abstract art',
    'modern art',
    'art supplies',
    'creative tools',
    'designer working',
    'artist working',
    'creative collaboration',
    'creative team',
    'innovation technology',
    'future creative concept',
    
    
    
    'creative design',
    'graphic design',
    'digital art',
    'artistic photography',
    'creative workspace',
    'design studio',
    'creative process',
    'colorful abstract',
    'minimalist design',
    'modern art',
    
    // Fotografi & Visual
    'beautiful photography',
    'nature photography',
    'urban photography',
    'street photography',
    'portrait photography',
    'landscape photography',
    'creative lighting',
    'aesthetic visual',
    'cinematic view',
    'artistic composition',
    
    // Seni & Ekspresi
    'artistic expression',
    'creative art',
    'painting',
    'sculpture art',
    'handmade craft',
    'artistic work',
    'creative hobby',
    'diy project',
    'calligraphy art',
    'watercolor art',
    
    // Inspirasi & Estetika
    'inspiring visuals',
    'aesthetic photography',
    'beautiful moments',
    'creative lifestyle',
    'art inspiration',
    'visual art',
    'colorful creativity',
    'modern aesthetics',
    'art gallery',
    'creative community'

];


let maulidStockItems = [];
let maulidStockIsLoading = false;
let maulidStockPage = 1;
let maulidStockAutoScrollInterval = null;
let maulidStockIsPaused = false;

// ============================================================
// LOAD MAULID STOCK
// ============================================================
async function loadMaulidStock() {
    if (maulidStockIsLoading) return;
    maulidStockIsLoading = true;
    
    const track = document.getElementById('maulidStockTrack');
    const refreshBtn = document.getElementById('maulidStockRefresh');
    if (!track) return;
    
    // Animasi refresh
    if (refreshBtn) {
        refreshBtn.classList.add('spinning');
    }
    
    track.innerHTML = `
        <div class="maulid-stock-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Memuat galeri kreatif...</span>
        </div>
    `;
    
    
    
    /*
    try {
        // Pilih query acak untuk Maulid
        const randomQuery = maulidStockQueries[Math.floor(Math.random() * maulidStockQueries.length)];
        
        // Fetch foto - ambil lebih banyak agar scroll panjang
        const photoUrl = `${PEXELS_BASE}/search?query=${encodeURIComponent(randomQuery)}&page=${maulidStockPage}&per_page=20`;
        const photoRes = await fetch(photoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!photoRes.ok) throw new Error(`HTTP ${photoRes.status}`);
        const photoData = await photoRes.json();
        
        // Fetch video
        const videoUrl = `${PEXELS_VIDEO_BASE}/search?query=${encodeURIComponent(randomQuery)}&page=${maulidStockPage}&per_page=10`;
        const videoRes = await fetch(videoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
        if (!videoRes.ok) throw new Error(`HTTP ${videoRes.status}`);
        const videoData = await videoRes.json();
        
        const photos = photoData.photos || [];
        const videos = videoData.videos || [];
        
        // Gabungkan foto dan video
        const photoItems = photos.map(p => ({ ...p, type: 'photo' }));
        const videoItems = videos.map(v => ({ ...v, type: 'video' }));
        
        // Gabung dan acak
        let combined = [...photoItems, ...videoItems];
        combined = shuffleArray(combined);
        
        // Ambil 20 item untuk slider agar scroll panjang
        maulidStockItems = combined.slice(0, 20);
        
        renderMaulidStock();
        startMaulidStockAutoScroll();
        
    } catch (err) {
        console.error('Gagal memuat Kreatif Stock:', err);
        track.innerHTML = `
            <div class="maulid-stock-empty">
                <i class="fas fa-exclamation-circle"></i>
                <span>Gagal memuat galeri, coba refresh</span>
            </div>
        `;
    }
    
    maulidStockIsLoading = false;
    */
try {
    // ============================================================
    // RETRY LOOP: Coba beberapa query sampai dapat ≥ 12 item valid
    // ============================================================
    let allItems = [];
    let attempts = 0;
    const maxAttempts = 3;
    const usedQueries = new Set();
    
    while (allItems.length < 12 && attempts < maxAttempts) {
        attempts++;
        
        // Pilih query acak yang belum dipakai
        let randomQuery;
        let queryAttempts = 0;
        do {
            const randomIndex = Math.floor(Math.random() * maulidStockQueries.length);
            randomQuery = maulidStockQueries[randomIndex];
            queryAttempts++;
        } while (usedQueries.has(randomQuery) && queryAttempts < 15);
        
        usedQueries.add(randomQuery);
        
        try {
            // Fetch foto
            const photoUrl = `${PEXELS_BASE}/search?query=${encodeURIComponent(randomQuery)}&page=1&per_page=15`;
            const photoRes = await fetch(photoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
            
            // Fetch video
            const videoUrl = `${PEXELS_VIDEO_BASE}/search?query=${encodeURIComponent(randomQuery)}&page=1&per_page=8`;
            const videoRes = await fetch(videoUrl, { headers: { 'Authorization': PEXELS_API_KEY } });
            
            // Proses foto
            if (photoRes.ok) {
                const photoData = await photoRes.json();
                const photos = photoData.photos || [];
                
                // Validasi: hanya foto yang punya src.medium
                const validPhotos = photos.filter(p => 
                    p && p.src && p.src.medium && p.src.medium.startsWith('http')
                );
                
                validPhotos.forEach(photo => {
                    const isDuplicate = allItems.some(item => 
                        item.id === photo.id && item.type === 'photo'
                    );
                    if (!isDuplicate) {
                        allItems.push({ ...photo, type: 'photo' });
                    }
                });
            }
            
            // Proses video
            if (videoRes.ok) {
                const videoData = await videoRes.json();
                const videos = videoData.videos || [];
                
                // Validasi: hanya video yang punya video_files valid
                const validVideos = videos.filter(v => {
                    if (!v || !v.video_files || !Array.isArray(v.video_files)) return false;
                    return v.video_files.some(f => f && f.link && f.link.startsWith('http'));
                });
                
                validVideos.forEach(video => {
                    const isDuplicate = allItems.some(item => 
                        item.id === video.id && item.type === 'video'
                    );
                    if (!isDuplicate) {
                        allItems.push({ ...video, type: 'video' });
                    }
                });
            }
            
        } catch (e) {
            console.warn(`Query "${randomQuery}" gagal:`, e.message);
            continue;
        }
    }
    
    // Kalau tidak ada item valid sama sekali
    if (allItems.length === 0) {
        track.innerHTML = `
            <div class="maulid-stock-empty">
                <i class="fas fa-image"></i>
                <span>Belum ada karya tersedia</span>
            </div>
        `;
        maulidStockIsLoading = false;
        if (refreshBtn) {
            setTimeout(() => refreshBtn.classList.remove('spinning'), 500);
        }
        return;
    }
    
    // Acak dan ambil 20 item
    allItems = shuffleArray(allItems);
    maulidStockItems = allItems.slice(0, 20);
    
    renderMaulidStock();
    startMaulidStockAutoScroll();
    
} catch (err) {
    console.error('Gagal memuat Karya Komunitas:', err);
    track.innerHTML = `
        <div class="maulid-stock-empty">
            <i class="fas fa-exclamation-circle"></i>
            <span>Gagal memuat galeri, coba refresh</span>
        </div>
    `;
}

maulidStockIsLoading = false;
    
    
    
    // Hapus animasi refresh
    if (refreshBtn) {
        setTimeout(() => {
            refreshBtn.classList.remove('spinning');
        }, 500);
    }
}

// ============================================================
// RENDER MAULID STOCK
// ============================================================
function renderMaulidStock() {
    const track = document.getElementById('maulidStockTrack');
    const dots = document.getElementById('maulidStockDots');
    
    if (!track) return;
    
    if (maulidStockItems.length === 0) {
        track.innerHTML = `
            <div class="maulid-stock-empty">
                <i class="fas fa-image"></i>
                <span>Tidak ada gambar tersedia</span>
            </div>
        `;
        if (dots) dots.innerHTML = '';
        return;
    }
    
    // Reset track
    track.innerHTML = '';
    
    // Render item
    maulidStockItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'maulid-stock-item';
        
        if (item.type === 'photo') {
            // Foto
            div.innerHTML = `
                <img src="${item.src.medium}" alt="Maulid Stock" loading="lazy" />
                <div class="maulid-stock-badge-media">
                    <i class="fas fa-camera"></i> Foto
                </div>
            `;
            div.addEventListener('click', () => showStockDetail(item));
        } else {
            // Video
            const videoFile = item.video_files?.find(f => f.quality === 'hd') || item.video_files?.[0];
            const thumb = item.image || item.video_pictures?.[0]?.picture || '';
            
            div.innerHTML = `
                <video src="${videoFile?.link || ''}" poster="${thumb}" muted loop playsinline loading="lazy"></video>
                <div class="maulid-stock-badge-media">
                    <i class="fas fa-video"></i> Video
                </div>
            `;
            
            const videoEl = div.querySelector('video');
            // Autoplay saat hover
            div.addEventListener('mouseenter', () => {
                if (videoEl) videoEl.play().catch(() => {});
            });
            div.addEventListener('mouseleave', () => {
                if (videoEl) { videoEl.pause(); videoEl.currentTime = 0; }
            });
            div.addEventListener('click', () => showVideoDetail(item));
        }
        
        track.appendChild(div);
    });
    
    // Update dots (untuk scroll indicator)
    if (dots) {
        const totalSlides = Math.max(1, maulidStockItems.length);
        dots.innerHTML = Array.from({ length: totalSlides }, (_, i) => `
            <span class="dot ${i === 0 ? 'active' : ''}" 
                  onclick="scrollToMaulidStockItem(${i})"></span>
        `).join('');
    }
}

// ============================================================
// AUTO SCROLL - SEPERTI TV (TAPI SCROLLABLE)
// ============================================================
function startMaulidStockAutoScroll() {
    if (maulidStockAutoScrollInterval) clearInterval(maulidStockAutoScrollInterval);
    
    const wrapper = document.getElementById('maulidStockWrapper');
    if (!wrapper) return;
    
    maulidStockAutoScrollInterval = setInterval(() => {
        if (maulidStockIsPaused) return;
        
        const itemWidth = wrapper.querySelector('.maulid-stock-item')?.offsetWidth || 180;
        const gap = 10;
        const totalWidth = itemWidth + gap;
        const visibleCount = Math.floor(wrapper.offsetWidth / totalWidth) || 2;
        const maxScroll = wrapper.scrollWidth - wrapper.offsetWidth;
        
        // Scroll ke kanan
        let newScroll = wrapper.scrollLeft + (totalWidth * visibleCount);
        
        // Jika sudah di ujung, kembali ke awal
        if (newScroll >= maxScroll - 10) {
            wrapper.scrollTo({ left: 0, behavior: 'smooth' });
            // Update dots
            updateMaulidStockDots(0);
        } else {
            wrapper.scrollTo({ left: newScroll, behavior: 'smooth' });
            // Update dots berdasarkan scroll posisi
            const currentIndex = Math.round(newScroll / (totalWidth * visibleCount));
            updateMaulidStockDots(currentIndex);
        }
    }, 4000); // Geser setiap 4 detik
}

// ============================================================
// UPDATE DOTS BERDASARKAN SCROLL POSISI
// ============================================================
function updateMaulidStockDots(index) {
    const dots = document.querySelectorAll('#maulidStockDots .dot');
    const totalDots = dots.length;
    if (totalDots === 0) return;
    
    // Hitung indeks dot yang aktif berdasarkan posisi scroll
    const wrapper = document.getElementById('maulidStockWrapper');
    if (!wrapper) return;
    
    const itemWidth = wrapper.querySelector('.maulid-stock-item')?.offsetWidth || 180;
    const gap = 10;
    const totalWidth = itemWidth + gap;
    const visibleCount = Math.floor(wrapper.offsetWidth / totalWidth) || 2;
    
    const scrollIndex = Math.round(wrapper.scrollLeft / (totalWidth * visibleCount));
    const dotIndex = Math.min(scrollIndex, totalDots - 1);
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === dotIndex);
    });
}

// ============================================================
// SCROLL KE ITEM TERTENTU
// ============================================================
function scrollToMaulidStockItem(index) {
    const wrapper = document.getElementById('maulidStockWrapper');
    if (!wrapper) return;
    
    const itemWidth = wrapper.querySelector('.maulid-stock-item')?.offsetWidth || 180;
    const gap = 10;
    const totalWidth = itemWidth + gap;
    const visibleCount = Math.floor(wrapper.offsetWidth / totalWidth) || 2;
    
    const scrollPosition = index * totalWidth * visibleCount;
    wrapper.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    updateMaulidStockDots(index);
}

// ============================================================
// REFRESH MAULID STOCK
// ============================================================
function refreshMaulidStock() {
    maulidStockPage = 1;
    if (maulidStockAutoScrollInterval) {
        clearInterval(maulidStockAutoScrollInterval);
        maulidStockAutoScrollInterval = null;
    }
    // Reset scroll ke awal
    const wrapper = document.getElementById('maulidStockWrapper');
    if (wrapper) {
        wrapper.scrollLeft = 0;
    }
    loadMaulidStock();
}

// ============================================================
// PAUSE/RESUME AUTO SCROLL SAAT HOVER
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.getElementById('maulidStockWrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', function() {
            maulidStockIsPaused = true;
        });
        
        wrapper.addEventListener('mouseleave', function() {
            maulidStockIsPaused = false;
        });
        
        // Update dots saat user scroll manual
        wrapper.addEventListener('scroll', function() {
            updateMaulidStockDots();
        });
    }
});

// ============================================================
// RESIZE HANDLER - UPDATE POSISI SAAT WINDOW RESIZE
// ============================================================
let maulidStockResizeTimeout = null;

function handleMaulidStockResize() {
    if (maulidStockResizeTimeout) clearTimeout(maulidStockResizeTimeout);
    maulidStockResizeTimeout = setTimeout(() => {
        updateMaulidStockDots();
    }, 300);
}

window.addEventListener('resize', handleMaulidStockResize);

// ============================================================
// INIT MAULID STOCK
// ============================================================
let maulidStockInitialized = false;

function initMaulidStock() {
    if (maulidStockInitialized) return;
    maulidStockInitialized = true;
    
    if (document.getElementById('maulidStockTrack')) {
        loadMaulidStock();
    }
}

// ============================================================
// OVERRIDE NAVIGATE UNTUK MAULID STOCK
// ============================================================
const originalNavMaulidStock = window.navigateTo;
window.navigateTo = function(page) {
    if (typeof originalNavMaulidStock === 'function') {
        originalNavMaulidStock(page);
    }
    
    if (page === 'stock') {
        setTimeout(() => {
            if (document.getElementById('maulidStockTrack') && !maulidStockInitialized) {
                initMaulidStock();
            }
        }, 500);
    }
};

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMaulidStock, 800);
});

// ============================================================
// TAMBAHKAN KE FUNGSI REFRESH STOCK
// ============================================================
// Override fungsi refresh stock agar juga refresh Maulid Stock
const originalLoadRandomStock = loadRandomStock;
loadRandomStock = function() {
    originalLoadRandomStock();
    // Refresh Maulid Stock juga
    setTimeout(refreshMaulidStock, 300);
};











// ============================================================
// BOOKS - OPEN LIBRARY
// ============================================================
function getRandomBookQuery() {
    const categories = ['fiction', 'science', 'history', 'technology', 'art', 'philosophy', 'psychology', 'business', 'health', 'travel', 'religion', 'poetry', 'biography'];
    return categories[Math.floor(Math.random() * categories.length)];
}

async function loadRandomBooks() {
    bookCurrentCategory = 'random';
    bookCurrentQuery = getRandomBookQuery();
    bookCurrentPage = 1;
    bookHasMore = true;
    books = [];
    
    document.querySelectorAll('.book-categories button').forEach(b => b.classList.remove('active'));
    document.querySelector('.book-categories button:first-child')?.classList.add('active');
    
    await fetchBooks();
}

async function filterBookCategory(category, btn) {
    bookCurrentCategory = category;
    bookCurrentPage = 1;
    bookHasMore = true;
    books = [];
    
    document.querySelectorAll('.book-categories button').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    if (category === 'random') {
        bookCurrentQuery = getRandomBookQuery();
    } else if (category === 'indonesia_history') {
        const randomIndex = Math.floor(Math.random() * indonesiaBookQueries.length);
        bookCurrentQuery = indonesiaBookQueries[randomIndex];
        console.log('🇮🇩 Mencari buku kemerdekaan:', bookCurrentQuery);
    } else {
        bookCurrentQuery = category;
    }
    
    await fetchBooks();
    trackActivity('book');
}

async function searchBooks() {
    const query = document.getElementById('bookSearchInput').value.trim();
    if (!query) { loadRandomBooks(); return; }
    bookCurrentQuery = query;
    bookCurrentCategory = 'search';
    bookCurrentPage = 1;
    bookHasMore = true;
    books = [];
    
    document.querySelectorAll('.book-categories button').forEach(b => b.classList.remove('active'));
    await fetchBooks();
}

async function fetchBooks() {
    if (bookIsLoading) return;
    bookIsLoading = true;
    
    const list = document.getElementById('bookList');
    list.innerHTML = '<div class="book-loading"><i class="fas fa-spinner fa-spin"></i> Memuat buku...</div>';
    document.getElementById('bookLoadMoreWrap').style.display = 'none';
    
    try {
        let queryToUse = bookCurrentQuery;
        
        if (bookCurrentCategory === 'indonesia_history') {
            const randomIndex = Math.floor(Math.random() * indonesiaBookQueries.length);
            queryToUse = indonesiaBookQueries[randomIndex];
            console.log('🇮🇩 Memuat buku kemerdekaan:', queryToUse);
        }
        
        const searchQuery = encodeURIComponent(queryToUse);
        const url = `${OPEN_LIBRARY_BASE}/search.json?q=${searchQuery}&page=${bookCurrentPage}&limit=20`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        let bookData = [];
        if (data.docs) {
            bookData = data.docs;
            bookHasMore = data.num_found > bookCurrentPage * 20;
        } else if (data.works) {
            bookData = data.works;
            bookHasMore = data.work_count > bookCurrentPage * 20;
        }
        
        books = bookData;
        renderBooks(books);
        
        if (books.length === 0) {
            list.innerHTML = '<div class="book-empty">Tidak ada buku ditemukan</div>';
        }
        
        if (bookHasMore && books.length > 0) {
            document.getElementById('bookLoadMoreWrap').style.display = 'block';
        } else {
            document.getElementById('bookLoadMoreWrap').style.display = 'none';
        }
        
    } catch (err) {
        console.error(err);
        list.innerHTML = `<div class="book-empty">Gagal memuat buku: ${err.message}</div>`;
    }
    
    bookIsLoading = false;
}

async function loadMoreBooks() {
    if (bookIsLoading || !bookHasMore) return;
    bookCurrentPage++;
    bookIsLoading = true;
    
    const btn = document.querySelector('#bookLoadMoreWrap .btn-load-more');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat...';
    
    try {
        let queryToUse = bookCurrentQuery;
        
        if (bookCurrentCategory === 'indonesia_history') {
            const randomIndex = Math.floor(Math.random() * indonesiaBookQueries.length);
            queryToUse = indonesiaBookQueries[randomIndex];
            console.log('🇮🇩 Load more buku kemerdekaan:', queryToUse);
        }
        
        const searchQuery = encodeURIComponent(queryToUse);
        const url = `${OPEN_LIBRARY_BASE}/search.json?q=${searchQuery}&page=${bookCurrentPage}&limit=20`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        let bookData = [];
        if (data.docs) {
            bookData = data.docs;
            bookHasMore = data.num_found > bookCurrentPage * 20;
        } else if (data.works) {
            bookData = data.works;
            bookHasMore = data.work_count > bookCurrentPage * 20;
        }
        
        books = [...books, ...bookData];
        renderBooks(books, true);
        
        if (!bookHasMore || bookData.length === 0) {
            document.getElementById('bookLoadMoreWrap').style.display = 'none';
        }
        
    } catch (err) {
        console.error(err);
        showNotification('Gagal memuat lebih banyak');
    }
    
    bookIsLoading = false;
    btn.innerHTML = '<i class="fas fa-chevron-down"></i> Muat Lebih Banyak';
}

function renderBooks(bookList, append = false) {
    const list = document.getElementById('bookList');
    if (!append) list.innerHTML = '';
    
    bookList.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book-item';
        
        const title = book.title || 'Judul tidak tersedia';
        const author = book.author_name ? book.author_name.join(', ') : (book.authors ? book.authors.map(a => a.name).join(', ') : 'Penulis tidak diketahui');
        const year = book.first_publish_year || book.publish_year?.[0] || '';
        const coverId = book.cover_i || book.cover_id || null;
        const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://via.placeholder.com/200x300/1a6b3c/fff?text=No+Cover';
        const key = book.key || book.works?.[0]?.key || '';
        
        div.innerHTML = `
            <img src="${coverUrl}" alt="${title}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x300/1a6b3c/fff?text=No+Cover'" />
            <div class="book-info">
                <div class="book-title">${title}</div>
                <div class="book-author">${author}</div>
                ${year ? `<div class="book-year">${year}</div>` : ''}
            </div>
        `;
        
        div.addEventListener('click', () => showBookDetail(book));
        list.appendChild(div);
    });
}

async function showBookDetail(book) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailBody');
    
    const title = book.title || 'Judul tidak tersedia';
    const author = book.author_name ? book.author_name.join(', ') : (book.authors ? book.authors.map(a => a.name).join(', ') : 'Penulis tidak diketahui');
    const year = book.first_publish_year || book.publish_year?.[0] || 'Tahun tidak diketahui';
    const coverId = book.cover_i || book.cover_id || null;
    const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : 'https://via.placeholder.com/300x450/1a6b3c/fff?text=No+Cover';
    const key = book.key || book.works?.[0]?.key || '';
    
    let description = 'Deskripsi tidak tersedia';
    let pages = '';
    let downloadUrl = '';
    let isDownloadable = false;
    
    if (key) {
        try {
            const detailRes = await fetch(`${OPEN_LIBRARY_BASE}${key}.json`);
            if (detailRes.ok) {
                const detailData = await detailRes.json();
                if (detailData.description) {
                    if (typeof detailData.description === 'string') {
                        description = detailData.description;
                    } else if (detailData.description.value) {
                        description = detailData.description.value;
                    }
                }
                if (detailData.number_of_pages) {
                    pages = `${detailData.number_of_pages} halaman`;
                }
                
                if (detailData.identifiers?.openlibrary) {
                    const olid = detailData.identifiers.openlibrary[0];
                    const iaRes = await fetch(`https://archive.org/metadata/${olid}`);
                    if (iaRes.ok) {
                        const iaData = await iaRes.json();
                        if (iaData.files && iaData.files.length > 0) {
                            const pdf = iaData.files.find(f => f.format === 'PDF' || f.name.endsWith('.pdf'));
                            if (pdf) {
                                downloadUrl = `https://archive.org/download/${olid}/${pdf.name}`;
                                isDownloadable = true;
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Gagal mengambil detail buku:', e);
        }
    }
    
    body.innerHTML = `
        <div class="detail-body">
            <img src="${coverUrl}" alt="${title}" class="book-cover-large" onerror="this.src='https://via.placeholder.com/300x450/1a6b3c/fff?text=No+Cover'" />
            <div class="book-title-large">${title}</div>
            <div class="book-author-large">${author}</div>
            <div class="book-meta">${year} ${pages ? '• ' + pages : ''}</div>
            <div class="book-description">${description}</div>
            <div class="detail-actions">
                ${isDownloadable ? `<button class="btn-download" onclick="downloadFile('${downloadUrl}', '${title}.pdf')"><i class="fas fa-download"></i> Unduh PDF</button>` : '<button class="btn-download" disabled><i class="fas fa-download"></i> Tidak tersedia</button>'}
                <button class="btn-view" onclick="window.open('${OPEN_LIBRARY_BASE}${key || ''}', '_blank')"><i class="fas fa-external-link-alt"></i> Lihat di Open Library</button>
                <button class="btn-close-detail" onclick="closeDetail()"><i class="fas fa-times"></i> Tutup</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackActivity('book');
}

// ============================================================
// POPUP UNDANGAN
// ============================================================
let currentTema = '';

function openPopup(tema) {
    currentTema = tema;
    document.getElementById('popupTema').textContent = tema;
    document.getElementById('popupOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    document.getElementById('popupOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function closePopupOutside(event) {
    if (event.target === document.getElementById('popupOverlay')) { closePopup(); }
}

function closeDetail() {
    const modal = document.getElementById('detailModal');
    const vid = modal.querySelector('video');
    if (vid) vid.pause();
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function closeDetailOutside(e) {
    if (e.target === document.getElementById('detailModal')) closeDetail();
}

// ============================================================
// PREMIUM MODAL
// ============================================================
/*
function openPremiumModal() {
    document.getElementById('premiumModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('premiumForm').reset();
    document.getElementById('premiumFormSection').style.display = 'block';
    document.getElementById('premiumSuccess').style.display = 'none';
    document.getElementById('fileUploadArea').classList.remove('has-file');
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('charCount').textContent = '0 / 1000';
    document.getElementById('charCount').className = 'char-count';
}

function closePremiumModal() {
    document.getElementById('premiumModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closePremiumOutside(event) {
    if (event.target === document.getElementById('premiumModal')) {
        closePremiumModal();
    }
}

function updateCharCount(el) {
    const count = el.value.length;
    const charCount = document.getElementById('charCount');
    charCount.textContent = count + ' / 1000';
    charCount.className = 'char-count';
    if (count > 800) charCount.classList.add('warning');
    if (count > 950) charCount.classList.add('danger');
}

function handleFileSelect(input) {
    const file = input.files[0];
    if (!file) return;
    
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
        showNotification('Ukuran file terlalu besar. Maksimal 20 MB.');
        input.value = '';
        return;
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
        showNotification('Format file tidak didukung. Gunakan JPG, PNG, atau MP4.');
        input.value = '';
        return;
    }
    
    const area = document.getElementById('fileUploadArea');
    area.classList.add('has-file');
    document.getElementById('filePreview').style.display = 'flex';
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
}

function removeFile() {
    const input = document.getElementById('premiumFile');
    input.value = '';
    document.getElementById('fileUploadArea').classList.remove('has-file');
    document.getElementById('filePreview').style.display = 'none';
}

async function submitPremium(event) {
    event.preventDefault();
    
    const email = document.getElementById('premiumEmail').value.trim();
    const username = document.getElementById('premiumUsername').value.trim();
    const description = document.getElementById('premiumDescription').value.trim();
    const file = document.getElementById('premiumFile').files[0];
    
    if (!email || !username || !file) {
        showNotification('Silakan isi semua data yang wajib diisi');
        return;
    }
    
    const btn = document.getElementById('premiumSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-small"></span> Mengirim...';
    
    try {
        const { data, error } = await supabaseClient
            .from("pesanan")
            .insert([{
                nama_user: username,
                kategori: "premium_creator",
                nama: email,
                promo: description,
                catatan: `File: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)\nTipe: ${file.type}`,
                created_at: new Date().toISOString()
            }]);
        
        if (error) {
            console.error('Supabase error:', error);
            throw new Error(error.message);
        }
        
        document.getElementById('premiumFormSection').style.display = 'none';
        document.getElementById('premiumSuccess').style.display = 'block';
        showNotification('Permohonan berhasil dikirim!');
        
        setTimeout(() => {
            closePremiumModal();
            navigateTo('profile');
        }, 3000);
        
    } catch (err) {
        console.error('Error submitting premium:', err);
        showNotification('Gagal mengirim: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Permohonan';
    }
}

// ============================================================
// DRAG AND DROP SUPPORT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const area = document.getElementById('fileUploadArea');
    if (area) {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const input = document.getElementById('premiumFile');
                input.files = files;
                handleFileSelect(input);
            }
        });
    }
});
*/
// ============================================================
// PROFIL FUNCTIONS
// ============================================================// ============================================================
// PROFIL FUNCTIONS - SEDERHANA (TANPA PREMIUM)
// ============================================================

/*
// Data profil default
let userProfile = {
    username: 'Pengunjung',
    email: '-',
    bio: 'Belum ada deskripsi',
    avatar: 'fas fa-user'
};

// Load profil dari localStorage
function loadUserProfile() {
    const saved = localStorage.getItem('alovera_profile');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            userProfile = { ...userProfile, ...data };
        } catch (e) {}
    }
    updateProfileUI();
}


// Update tampilan profil
function updateProfileUI() {
    const name = document.getElementById('profileName');
    const email = document.getElementById('profileEmail');
    const bio = document.getElementById('profileBio');
    const status = document.getElementById('profileStatus');
    const avatar = document.getElementById('profileAvatarIcon');
    
    if (name) name.textContent = userProfile.username || 'Pengunjung';
    if (email) email.textContent = userProfile.email || '-';
    if (bio) bio.textContent = userProfile.bio || 'Belum ada deskripsi';
    if (status) {
        status.textContent = 'Aktif';
        status.style.background = 'rgba(74,222,128,0.12)';
        status.style.color = '#4ade80';
    }
    if (avatar) {
        // Ganti ikon avatar jika ada
        if (userProfile.avatar && userProfile.avatar !== 'fas fa-user') {
            avatar.className = userProfile.avatar;
        } else {
            avatar.className = 'fas fa-user';
        }
    }
}


// ============================================================
// EDIT PROFIL - MODAL
// ============================================================
function openEditProfile() {
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;
    
    // Isi form dengan data yang ada
    document.getElementById('editProfileName').value = userProfile.username || '';
    document.getElementById('editProfileEmail').value = userProfile.email || '';
    document.getElementById('editProfileBio').value = userProfile.bio || '';
    document.getElementById('bioCharCount').textContent = (userProfile.bio || '').length;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEditProfile() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeEditProfileOutside(e) {
    if (e.target === document.getElementById('editProfileModal')) {
        closeEditProfile();
    }
}

// ============================================================
// SAVE PROFIL
// ============================================================
function saveProfile(e) {
    e.preventDefault();
    
    const username = document.getElementById('editProfileName').value.trim();
    const email = document.getElementById('editProfileEmail').value.trim();
    const bio = document.getElementById('editProfileBio').value.trim();
    
    if (!username) {
        showNotification('Nama pengguna wajib diisi');
        return;
    }
    
    if (!email) {
        showNotification('Email wajib diisi');
        return;
    }
    
    // Update data
    userProfile.username = username;
    userProfile.email = email;
    userProfile.bio = bio || 'Belum ada deskripsi';
    
    // Simpan ke localStorage
    localStorage.setItem('alovera_profile', JSON.stringify(userProfile));
    
    // Update UI
    updateProfileUI();
    
    // Tutup modal
    closeEditProfile();
    
    showNotification(' Profil berhasil diperbarui!');
}

// ============================================================
// COUNTER BIO
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const bioTextarea = document.getElementById('editProfileBio');
    const bioCount = document.getElementById('bioCharCount');
    
    if (bioTextarea && bioCount) {
        bioTextarea.addEventListener('input', function() {
            bioCount.textContent = this.value.length;
        });
    }
});

// Load profil saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
});
*/
// ============================================================
// GRAFIK RIWAYAT PENGGUNA - CHART.JS
// ============================================================

/*
let userActivity = {
    history: [],
    total: { news: 0, stock: 0, ai: 0, book: 0, shop: 0 }
};
let chartInstance = null;

function loadActivityData() {
    try {
        const saved = localStorage.getItem('alovera_activity');
        if (saved) {
            const parsed = JSON.parse(saved);
            userActivity = parsed;
            if (!userActivity.history) userActivity.history = [];
            if (!userActivity.total) userActivity.total = { news: 0, stock: 0, ai: 0, book: 0, shop: 0 };
        }
    } catch (e) {
        userActivity = { history: [], total: { news: 0, stock: 0, ai: 0, book: 0, shop: 0 } };
    }
}

function saveActivityData() {
    try {
        localStorage.setItem('alovera_activity', JSON.stringify(userActivity));
    } catch (e) {
        console.warn('Gagal menyimpan data aktivitas');
    }
}

function addActivity(type) {
    const today = new Date().toISOString().split('T')[0];
    let todayEntry = userActivity.history.find(h => h.date === today);
    
    if (todayEntry) {
        if (todayEntry[type] !== undefined) {
            todayEntry[type] += 1;
        }
    } else {
        todayEntry = { date: today, news: 0, stock: 0, ai: 0, book: 0, shop: 0 };
        todayEntry[type] = 1;
        userActivity.history.push(todayEntry);
    }
    
    if (userActivity.total[type] !== undefined) {
        userActivity.total[type] += 1;
    }
    
    userActivity.history.sort((a, b) => a.date.localeCompare(b.date));
    if (userActivity.history.length > 30) {
        userActivity.history = userActivity.history.slice(-30);
    }
    
    saveActivityData();
    renderChart();
}

function trackActivity(type) {
    const typeMap = {
        'news': 'news',
        'stock': 'stock',
        'ai': 'ai',
        'book': 'book',
        'shop': 'shop',
        'home': null,
        'profile': null,
        'cart': null
    };
    
    const mappedType = typeMap[type];
    if (mappedType) {
        addActivity(mappedType);
    }
}

function renderChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const wrapper = document.getElementById('chartWrapper');
    
    if (userActivity.history.length === 0) {
        if (wrapper) {
            wrapper.innerHTML = `
                <div class="chart-empty">
                    <i class="fas fa-chart-simple"></i>
                    <h4>Belum Ada Aktivitas</h4>
                    <p>Mulai jelajahi Alovera untuk melihat grafik aktivitas Anda</p>
                </div>
            `;
        }
        return;
    }
    
    if (wrapper) {
        wrapper.innerHTML = '<canvas id="activityChart"></canvas>';
    }
    
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
    
    const dates = userActivity.history.map(h => {
        const d = new Date(h.date + 'T00:00:00');
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    });
    
    const newsData = userActivity.history.map(h => h.news || 0);
    const stockData = userActivity.history.map(h => h.stock || 0);
    const aiData = userActivity.history.map(h => h.ai || 0);
    const bookData = userActivity.history.map(h => h.book || 0);
    const shopData = userActivity.history.map(h => h.shop || 0);
    
    const isDark = !document.documentElement.hasAttribute('data-theme');
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const isHutri = document.documentElement.getAttribute('data-theme') === 'hutri';
    
    const textColor = isDark ? '#c8d6e5' : (isLight ? '#0a1929' : '#1a0000');
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,0,0,0.06)');
    
    const newsColor = isHutri ? '#ff6b6b' : '#3b82f6';
    const stockColor = isHutri ? '#ff6b6b' : '#22c55e';
    const aiColor = isHutri ? '#ff6b6b' : '#a855f7';
    const bookColor = isHutri ? '#ff6b6b' : '#f59e0b';
    const shopColor = isHutri ? '#ff6b6b' : '#ef4444';
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                { label: 'Berita', data: newsData, borderColor: newsColor, backgroundColor: newsColor + '20', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: newsColor, borderWidth: 2 },
                { label: 'Gallery', data: stockData, borderColor: stockColor, backgroundColor: stockColor + '20', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: stockColor, borderWidth: 2 },
                { label: 'AI', data: aiData, borderColor: aiColor, backgroundColor: aiColor + '20', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: aiColor, borderWidth: 2 },
                { label: 'Buku', data: bookData, borderColor: bookColor, backgroundColor: bookColor + '20', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: bookColor, borderWidth: 2 },
                { label: 'Shop', data: shopData, borderColor: shopColor, backgroundColor: shopColor + '20', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: shopColor, borderWidth: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDark ? 'rgba(5,11,21,0.9)' : 'rgba(255,255,255,0.95)',
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: isDark ? 'rgba(74,222,128,0.1)' : 'rgba(0,102,204,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + (context.parsed.y || 0) + ' klik';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: gridColor, drawBorder: false },
                    ticks: { color: textColor, font: { size: 10 }, maxTicksLimit: 10 }
                },
                y: {
                    grid: { color: gridColor, drawBorder: false },
                    ticks: { color: textColor, font: { size: 10 }, beginAtZero: true, stepSize: 1 }
                }
            },
            elements: {
                line: { borderWidth: 2 },
                point: { radius: 3, hoverRadius: 5 }
            }
        }
    });
    
    updateChartLegend();
    updateChartTotal();
}

function updateChartLegend() {
    const legendContainer = document.getElementById('chartLegend');
    if (!legendContainer) return;
    
    const isHutri = document.documentElement.getAttribute('data-theme') === 'hutri';
    const items = [
        { key: 'news', label: 'Berita', color: isHutri ? '#ff6b6b' : '#3b82f6' },
        { key: 'stock', label: 'Gallery', color: isHutri ? '#ff6b6b' : '#22c55e' },
        { key: 'ai', label: 'AI', color: isHutri ? '#ff6b6b' : '#a855f7' },
        { key: 'book', label: 'Buku', color: isHutri ? '#ff6b6b' : '#f59e0b' },
        { key: 'shop', label: 'Shop', color: isHutri ? '#ff6b6b' : '#ef4444' }
    ];
    
    legendContainer.innerHTML = items.map(item => `
        <span class="legend-item">
            <span class="legend-dot ${item.key}" style="background:${item.color}"></span>
            ${item.label}
        </span>
    `).join('');
}

function updateChartTotal() {
    const totalContainer = document.getElementById('chartTotal');
    if (!totalContainer) return;
    
    const total = userActivity.total || { news: 0, stock: 0, ai: 0, book: 0, shop: 0 };
    const grandTotal = Object.values(total).reduce((a, b) => a + b, 0);
    
    totalContainer.innerHTML = `
        <div class="total-item"><div class="total-number">${total.news || 0}</div><div class="total-label">Berita</div></div>
        <div class="total-item"><div class="total-number">${total.stock || 0}</div><div class="total-label">Gallery</div></div>
        <div class="total-item"><div class="total-number">${total.ai || 0}</div><div class="total-label">AI</div></div>
        <div class="total-item"><div class="total-number">${total.book || 0}</div><div class="total-label">Buku</div></div>
        <div class="total-item"><div class="total-number">${total.shop || 0}</div><div class="total-label">Shop</div></div>
        <div class="total-item" style="background:var(--accent-color);color:var(--text-inverse);">
            <div class="total-number" style="color:inherit;">${grandTotal}</div>
            <div class="total-label" style="color:rgba(255,255,255,0.7);">Total</div>
        </div>
    `;
}

function resizeChart() {
    if (chartInstance) {
        chartInstance.resize();
    }
}

function initChart() {
    loadActivityData();
    const canvas = document.getElementById('activityChart');
    if (canvas) {
        renderChart();
    }
    window.addEventListener('resize', resizeChart);
}
*/
// ============================================================
// GRAFIK RIWAYAT PENGGUNA - CHART.JS
// ============================================================

// Inisialisasi data riwayat (PASTIKAN HANYA SATU DEKLARASI)
let userActivity = {
    history: [],
    total: { news: 0, stock: 0, ai: 0, book: 0, shop: 0 }
};

let chartInstance = null;

// Load data dari localStorage
function loadActivityData() {
    try {
        const saved = localStorage.getItem('alovera_activity');
        if (saved) {
            const parsed = JSON.parse(saved);
            userActivity = parsed;
            if (!userActivity.history) userActivity.history = [];
            if (!userActivity.total) userActivity.total = { news: 0, stock: 0, ai: 0, book: 0, shop: 0 };
        }
    } catch (e) {
        userActivity = { history: [], total: { news: 0, stock: 0, ai: 0, book: 0, shop: 0 } };
    }
}

// Simpan data ke localStorage
function saveActivityData() {
    try {
        localStorage.setItem('alovera_activity', JSON.stringify(userActivity));
    } catch (e) {
        console.warn('Gagal menyimpan data aktivitas');
    }
}

// Tambah aktivitas
function addActivity(type) {
    const today = new Date().toISOString().split('T')[0];
    let todayEntry = userActivity.history.find(h => h.date === today);
    
    if (todayEntry) {
        if (todayEntry[type] !== undefined) {
            todayEntry[type] += 1;
        }
    } else {
        todayEntry = { date: today, news: 0, stock: 0, ai: 0, book: 0, shop: 0 };
        todayEntry[type] = 1;
        userActivity.history.push(todayEntry);
    }
    
    if (userActivity.total[type] !== undefined) {
        userActivity.total[type] += 1;
    }
    
    userActivity.history.sort((a, b) => a.date.localeCompare(b.date));
    if (userActivity.history.length > 30) {
        userActivity.history = userActivity.history.slice(-30);
    }
    
    saveActivityData();
    renderChart();
}

// Fungsi untuk mencatat aktivitas
function trackActivity(type) {
    const typeMap = {
        'news': 'news',
        'stock': 'stock',
        'ai': 'ai',
        'book': 'book',
        'shop': 'shop',
        'home': null,
        'profile': null,
        'cart': null
    };
    
    const mappedType = typeMap[type];
    if (mappedType) {
        addActivity(mappedType);
    }
}

/*
// Render Chart - VERSI DIPERBAIKI
function renderChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) {
        console.warn('Canvas activityChart tidak ditemukan');
        return;
    }
    
    // Pastikan Chart.js tersedia
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js belum dimuat, coba lagi nanti');
        setTimeout(renderChart, 1000);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const wrapper = document.getElementById('chartWrapper');
    
    // Jika tidak ada data, tampilkan pesan
    if (!userActivity.history || userActivity.history.length === 0) {
        if (wrapper) {
            wrapper.innerHTML = `
                <div class="chart-empty">
                    <i class="fas fa-chart-simple"></i>
                    <h4>Belum Ada Aktivitas</h4>
                    <p>Mulai jelajahi Alovera untuk melihat grafik aktivitas Anda</p>
                </div>
            `;
        }
        return;
    }
    
    // Reset wrapper
    if (wrapper) {
        wrapper.innerHTML = '<canvas id="activityChart"></canvas>';
        // Ambil ulang canvas setelah reset
        const newCanvas = document.getElementById('activityChart');
        if (!newCanvas) return;
        const newCtx = newCanvas.getContext('2d');
        
        // Hapus chart instance lama
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
        
        // Siapkan data
        const dates = userActivity.history.map(h => {
            const d = new Date(h.date + 'T00:00:00');
            return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        });
        
        const newsData = userActivity.history.map(h => h.news || 0);
        const stockData = userActivity.history.map(h => h.stock || 0);
        const aiData = userActivity.history.map(h => h.ai || 0);
        const bookData = userActivity.history.map(h => h.book || 0);
        const shopData = userActivity.history.map(h => h.shop || 0);
        
        // Theme colors
        const isDark = !document.documentElement.hasAttribute('data-theme');
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const isHutri = document.documentElement.getAttribute('data-theme') === 'hutri';
        
        const textColor = isDark ? '#c8d6e5' : (isLight ? '#0a1929' : '#1a0000');
        const gridColor = isDark ? 'rgba(255,255,255,0.05)' : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,0,0,0.06)');
        
        const newsColor = isHutri ? '#ff6b6b' : '#3b82f6';
        const stockColor = isHutri ? '#ff6b6b' : '#22c55e';
        const aiColor = isHutri ? '#ff6b6b' : '#a855f7';
        const bookColor = isHutri ? '#ff6b6b' : '#f59e0b';
        const shopColor = isHutri ? '#ff6b6b' : '#ef4444';
        
        // Buat chart baru
        chartInstance = new Chart(newCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    { label: 'Berita', data: newsData, borderColor: newsColor, backgroundColor: newsColor + '20', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: newsColor, borderWidth: 2 },
                    { label: 'Gallery', data: stockData, borderColor: stockColor, backgroundColor: stockColor + '20', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: stockColor, borderWidth: 2 },
                    { label: 'AI', data: aiData, borderColor: aiColor, backgroundColor: aiColor + '20', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: aiColor, borderWidth: 2 },
                    { label: 'Buku', data: bookData, borderColor: bookColor, backgroundColor: bookColor + '20', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: bookColor, borderWidth: 2 },
                    { label: 'Shop', data: shopData, borderColor: shopColor, backgroundColor: shopColor + '20', fill: false, tension: 0.4, pointRadius: 3, pointBackgroundColor: shopColor, borderWidth: 2 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isDark ? 'rgba(5,11,21,0.9)' : 'rgba(255,255,255,0.95)',
                        titleColor: textColor,
                        bodyColor: textColor,
                        borderColor: isDark ? 'rgba(74,222,128,0.1)' : 'rgba(0,102,204,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + (context.parsed.y || 0) + ' klik';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor, drawBorder: false },
                        ticks: { color: textColor, font: { size: 10 }, maxTicksLimit: 10 }
                    },
                    y: {
                        grid: { color: gridColor, drawBorder: false },
                        ticks: { color: textColor, font: { size: 10 }, beginAtZero: true, stepSize: 1 }
                    }
                },
                elements: {
                    line: { borderWidth: 2 },
                    point: { radius: 3, hoverRadius: 5 }
                }
            }
        });
        
        // Update legend dan total
        updateChartLegend();
        updateChartTotal();
    }
}


*/





/*
// ============================================================
// RENDER CHART - DENGAN FILL AREA & ANIMASI
// ============================================================
function renderChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) {
        console.warn('Canvas activityChart tidak ditemukan');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js belum dimuat, coba lagi nanti');
        setTimeout(renderChart, 1000);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const wrapper = document.getElementById('chartWrapper');
    
    if (!userActivity.history || userActivity.history.length === 0) {
        if (wrapper) {
            wrapper.innerHTML = `
                <div class="chart-empty">
                    <i class="fas fa-chart-simple"></i>
                    <h4>Belum Ada Aktivitas</h4>
                    <p>Mulai jelajahi Alovera untuk melihat grafik aktivitas Anda</p>
                </div>
            `;
        }
        return;
    }
    
    if (wrapper) {
        wrapper.innerHTML = '<canvas id="activityChart"></canvas>';
        const newCanvas = document.getElementById('activityChart');
        if (!newCanvas) return;
        const newCtx = newCanvas.getContext('2d');
        
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
        
        const dates = userActivity.history.map(h => {
            const d = new Date(h.date + 'T00:00:00');
            return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        });
        
        const newsData = userActivity.history.map(h => h.news || 0);
        const stockData = userActivity.history.map(h => h.stock || 0);
        const aiData = userActivity.history.map(h => h.ai || 0);
        const bookData = userActivity.history.map(h => h.book || 0);
        const shopData = userActivity.history.map(h => h.shop || 0);
        
        // Theme colors
        const isDark = !document.documentElement.hasAttribute('data-theme');
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const isHutri = document.documentElement.getAttribute('data-theme') === 'hutri';
        
        const textColor = isDark ? '#c8d6e5' : (isLight ? '#0a1929' : '#1a0000');
        const gridColor = isDark ? 'rgba(255,255,255,0.06)' : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,0,0,0.06)');
        
        // Warna-warna yang berbeda untuk setiap line
        const colors = {
            news: { border: isHutri ? '#ff4757' : '#3b82f6', fill: isHutri ? 'rgba(255,71,87,0.15)' : 'rgba(59,130,246,0.15)', light: isHutri ? 'rgba(255,71,87,0.05)' : 'rgba(59,130,246,0.05)' },
            stock: { border: isHutri ? '#ff6b81' : '#22c55e', fill: isHutri ? 'rgba(255,107,129,0.15)' : 'rgba(34,197,94,0.15)', light: isHutri ? 'rgba(255,107,129,0.05)' : 'rgba(34,197,94,0.05)' },
            ai: { border: isHutri ? '#ff9ff3' : '#a855f7', fill: isHutri ? 'rgba(255,159,243,0.15)' : 'rgba(168,85,247,0.15)', light: isHutri ? 'rgba(255,159,243,0.05)' : 'rgba(168,85,247,0.05)' },
            book: { border: isHutri ? '#ffd93d' : '#f59e0b', fill: isHutri ? 'rgba(255,217,61,0.15)' : 'rgba(245,158,11,0.15)', light: isHutri ? 'rgba(255,217,61,0.05)' : 'rgba(245,158,11,0.05)' },
            shop: { border: isHutri ? '#ff6b6b' : '#ef4444', fill: isHutri ? 'rgba(255,107,107,0.15)' : 'rgba(239,68,68,0.15)', light: isHutri ? 'rgba(255,107,107,0.05)' : 'rgba(239,68,68,0.05)' }
        };
        
        // Buat chart baru dengan fill area yang memudar
        chartInstance = new Chart(newCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    { 
                        label: 'Berita', 
                        data: newsData, 
                        borderColor: colors.news.border, 
                        backgroundColor: colors.news.fill,
                        fill: true,
                        tension: 0.4, 
                        pointRadius: 3, 
                        pointBackgroundColor: colors.news.border,
                        pointBorderColor: colors.news.border,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2.5,
                        spanGaps: true,
                    },
                    { 
                        label: 'Gallery', 
                        data: stockData, 
                        borderColor: colors.stock.border, 
                        backgroundColor: colors.stock.fill,
                        fill: true,
                        tension: 0.4, 
                        pointRadius: 3, 
                        pointBackgroundColor: colors.stock.border,
                        pointBorderColor: colors.stock.border,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2.5,
                        spanGaps: true,
                    },
                    { 
                        label: 'AI', 
                        data: aiData, 
                        borderColor: colors.ai.border, 
                        backgroundColor: colors.ai.fill,
                        fill: true,
                        tension: 0.4, 
                        pointRadius: 3, 
                        pointBackgroundColor: colors.ai.border,
                        pointBorderColor: colors.ai.border,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2.5,
                        spanGaps: true,
                    },
                    { 
                        label: 'Buku', 
                        data: bookData, 
                        borderColor: colors.book.border, 
                        backgroundColor: colors.book.fill,
                        fill: true,
                        tension: 0.4, 
                        pointRadius: 3, 
                        pointBackgroundColor: colors.book.border,
                        pointBorderColor: colors.book.border,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2.5,
                        spanGaps: true,
                    },
                    { 
                        label: 'Shop', 
                        data: shopData, 
                        borderColor: colors.shop.border, 
                        backgroundColor: colors.shop.fill,
                        fill: true,
                        tension: 0.4, 
                        pointRadius: 3, 
                        pointBackgroundColor: colors.shop.border,
                        pointBorderColor: colors.shop.border,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2.5,
                        spanGaps: true,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                },
                interaction: { 
                    mode: 'index', 
                    intersect: false,
                    includeInvisible: true
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isDark ? 'rgba(5,11,21,0.92)' : 'rgba(255,255,255,0.95)',
                        titleColor: textColor,
                        bodyColor: textColor,
                        borderColor: isDark ? 'rgba(74,222,128,0.15)' : 'rgba(0,102,204,0.15)',
                        borderWidth: 1,
                        padding: 14,
                        cornerRadius: 12,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + (context.parsed.y || 0) + ' klik';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { 
                            color: gridColor, 
                            drawBorder: false,
                            drawTicks: false,
                        },
                        ticks: { 
                            color: textColor, 
                            font: { size: 10, weight: '500' },
                            maxTicksLimit: 10,
                            maxRotation: 45,
                            minRotation: 0,
                        }
                    },
                    y: {
                        grid: { 
                            color: gridColor, 
                            drawBorder: false,
                            drawTicks: false,
                        },
                        ticks: { 
                            color: textColor, 
                            font: { size: 10, weight: '500' },
                            beginAtZero: true, 
                            stepSize: 1,
                            precision: 0,
                        }
                    }
                },
                elements: {
                    line: { 
                        borderWidth: 2.5,
                        tension: 0.4,
                    },
                    point: { 
                        radius: 3, 
                        hoverRadius: 7,
                        hitRadius: 10,
                    }
                }
            }
        });
        
        // Update legend dan total
        updateChartLegend();
        updateChartTotal();
    }
}
*/

// ============================================================
// RENDER CHART - DENGAN GRADIEN MEMUDAR (SEPERTI SAHAM)
// ============================================================
function renderChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) {
        console.warn('Canvas activityChart tidak ditemukan');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js belum dimuat, coba lagi nanti');
        setTimeout(renderChart, 1000);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const wrapper = document.getElementById('chartWrapper');
    
    if (!userActivity.history || userActivity.history.length === 0) {
        if (wrapper) {
            wrapper.innerHTML = `
                <div class="chart-empty">
                    <i class="fas fa-chart-simple"></i>
                    <h4>Belum Ada Aktivitas</h4>
                    <p>Mulai jelajahi Alovera untuk melihat grafik aktivitas Anda</p>
                </div>
            `;
        }
        return;
    }
    
    if (wrapper) {
        wrapper.innerHTML = '<canvas id="activityChart"></canvas>';
        const newCanvas = document.getElementById('activityChart');
        if (!newCanvas) return;
        const newCtx = newCanvas.getContext('2d');
        
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
        
        const dates = userActivity.history.map(h => {
            const d = new Date(h.date + 'T00:00:00');
            return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        });
        
        const newsData = userActivity.history.map(h => h.news || 0);
        const stockData = userActivity.history.map(h => h.stock || 0);
        const aiData = userActivity.history.map(h => h.ai || 0);
        const bookData = userActivity.history.map(h => h.book || 0);
        const shopData = userActivity.history.map(h => h.shop || 0);
        
        // Theme colors
        const isDark = !document.documentElement.hasAttribute('data-theme');
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const isHutri = document.documentElement.getAttribute('data-theme') === 'hutri';
        
        const textColor = isDark ? '#c8d6e5' : (isLight ? '#0a1929' : '#1a0000');
        const gridColor = isDark ? 'rgba(255,255,255,0.06)' : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,0,0,0.06)');
        
        // Warna untuk setiap kategori
        const colorMap = {
            news: { 
                border: isHutri ? '#ff4757' : '#3b82f6',
                bg: isHutri ? 'rgba(255,71,87,0.2)' : 'rgba(59,130,246,0.2)',
                gradient: isHutri ? ['rgba(255,71,87,0.4)', 'rgba(255,71,87,0.02)'] : ['rgba(59,130,246,0.4)', 'rgba(59,130,246,0.02)']
            },
            stock: { 
                border: isHutri ? '#ff6b81' : '#22c55e',
                bg: isHutri ? 'rgba(255,107,129,0.2)' : 'rgba(34,197,94,0.2)',
                gradient: isHutri ? ['rgba(255,107,129,0.4)', 'rgba(255,107,129,0.02)'] : ['rgba(34,197,94,0.4)', 'rgba(34,197,94,0.02)']
            },
            ai: { 
                border: isHutri ? '#ff9ff3' : '#a855f7',
                bg: isHutri ? 'rgba(255,159,243,0.2)' : 'rgba(168,85,247,0.2)',
                gradient: isHutri ? ['rgba(255,159,243,0.4)', 'rgba(255,159,243,0.02)'] : ['rgba(168,85,247,0.4)', 'rgba(168,85,247,0.02)']
            },
            book: { 
                border: isHutri ? '#ffd93d' : '#f59e0b',
                bg: isHutri ? 'rgba(255,217,61,0.2)' : 'rgba(245,158,11,0.2)',
                gradient: isHutri ? ['rgba(255,217,61,0.4)', 'rgba(255,217,61,0.02)'] : ['rgba(245,158,11,0.4)', 'rgba(245,158,11,0.02)']
            },
            shop: { 
                border: isHutri ? '#ff6b6b' : '#ef4444',
                bg: isHutri ? 'rgba(255,107,107,0.2)' : 'rgba(239,68,68,0.2)',
                gradient: isHutri ? ['rgba(255,107,107,0.4)', 'rgba(255,107,107,0.02)'] : ['rgba(239,68,68,0.4)', 'rgba(239,68,68,0.02)']
            }
        };
        
        // Buat chart baru dengan gradien yang memudar
        chartInstance = new Chart(newCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    { 
                        label: 'Berita', 
                        data: newsData, 
                        borderColor: colorMap.news.border,
                        backgroundColor: function(context) {
                            const chart = context.chart;
                            const {ctx, chartArea} = chart;
                            if (!chartArea) return colorMap.news.gradient[1];
                            
                            // Buat gradien vertikal dari atas ke bawah
                            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                            gradient.addColorStop(0, colorMap.news.gradient[0]);
                            gradient.addColorStop(0.3, colorMap.news.gradient[0]);
                            gradient.addColorStop(0.7, colorMap.news.gradient[1]);
                            gradient.addColorStop(1, colorMap.news.gradient[1]);
                            return gradient;
                        },
                        fill: true,
                        tension: 0.4, 
                        pointRadius: 2, 
                        pointBackgroundColor: colorMap.news.border,
                        pointBorderColor: colorMap.news.border,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        spanGaps: true,
                    },
                    { 
                        label: 'Gallery', 
                        data: stockData, 
                        borderColor: colorMap.stock.border,
                        backgroundColor: function(context) {
                            const chart = context.chart;
                            const {ctx, chartArea} = chart;
                            if (!chartArea) return colorMap.stock.gradient[1];
                            
                            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                            gradient.addColorStop(0, colorMap.stock.gradient[0]);
                            gradient.addColorStop(0.3, colorMap.stock.gradient[0]);
                            gradient.addColorStop(0.7, colorMap.stock.gradient[1]);
                            gradient.addColorStop(1, colorMap.stock.gradient[1]);
                            return gradient;
                        },
                        fill: true,
                        tension: 0.4, 
                        pointRadius: 2, 
                        pointBackgroundColor: colorMap.stock.border,
                        pointBorderColor: colorMap.stock.border,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        spanGaps: true,
                    },
                    { 
                        label: 'AI', 
                        data: aiData, 
                        borderColor: colorMap.ai.border,
                        backgroundColor: function(context) {
                            const chart = context.chart;
                            const {ctx, chartArea} = chart;
                            if (!chartArea) return colorMap.ai.gradient[1];
                            
                            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                            gradient.addColorStop(0, colorMap.ai.gradient[0]);
                            gradient.addColorStop(0.3, colorMap.ai.gradient[0]);
                            gradient.addColorStop(0.7, colorMap.ai.gradient[1]);
                            gradient.addColorStop(1, colorMap.ai.gradient[1]);
                            return gradient;
                        },
                        fill: true,
                        tension: 0.4, 
                        pointRadius: 2, 
                        pointBackgroundColor: colorMap.ai.border,
                        pointBorderColor: colorMap.ai.border,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        spanGaps: true,
                    },
                    { 
                        label: 'Buku', 
                        data: bookData, 
                        borderColor: colorMap.book.border,
                        backgroundColor: function(context) {
                            const chart = context.chart;
                            const {ctx, chartArea} = chart;
                            if (!chartArea) return colorMap.book.gradient[1];
                            
                            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                            gradient.addColorStop(0, colorMap.book.gradient[0]);
                            gradient.addColorStop(0.3, colorMap.book.gradient[0]);
                            gradient.addColorStop(0.7, colorMap.book.gradient[1]);
                            gradient.addColorStop(1, colorMap.book.gradient[1]);
                            return gradient;
                        },
                        fill: true,
                        tension: 0.4, 
                        pointRadius: 2, 
                        pointBackgroundColor: colorMap.book.border,
                        pointBorderColor: colorMap.book.border,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        spanGaps: true,
                    },
                    { 
                        label: 'Shop', 
                        data: shopData, 
                        borderColor: colorMap.shop.border,
                        backgroundColor: function(context) {
                            const chart = context.chart;
                            const {ctx, chartArea} = chart;
                            if (!chartArea) return colorMap.shop.gradient[1];
                            
                            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                            gradient.addColorStop(0, colorMap.shop.gradient[0]);
                            gradient.addColorStop(0.3, colorMap.shop.gradient[0]);
                            gradient.addColorStop(0.7, colorMap.shop.gradient[1]);
                            gradient.addColorStop(1, colorMap.shop.gradient[1]);
                            return gradient;
                        },
                        fill: true,
                        tension: 0.4, 
                        pointRadius: 2, 
                        pointBackgroundColor: colorMap.shop.border,
                        pointBorderColor: colorMap.shop.border,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        spanGaps: true,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                },
                interaction: { 
                    mode: 'index', 
                    intersect: false,
                    includeInvisible: true
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isDark ? 'rgba(5,11,21,0.92)' : 'rgba(255,255,255,0.95)',
                        titleColor: textColor,
                        bodyColor: textColor,
                        borderColor: isDark ? 'rgba(74,222,128,0.15)' : 'rgba(0,102,204,0.15)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + (context.parsed.y || 0) + ' klik';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { 
                            color: gridColor, 
                            drawBorder: false,
                            drawTicks: false,
                        },
                        ticks: { 
                            color: textColor, 
                            font: { size: 10, weight: '500' },
                            maxTicksLimit: 10,
                            maxRotation: 45,
                            minRotation: 0,
                        }
                    },
                    y: {
                        grid: { 
                            color: gridColor, 
                            drawBorder: false,
                            drawTicks: false,
                        },
                        ticks: { 
                            color: textColor, 
                            font: { size: 10, weight: '500' },
                            beginAtZero: true, 
                            stepSize: 1,
                            precision: 0,
                        }
                    }
                },
                elements: {
                    line: { 
                        borderWidth: 2,
                        tension: 0.4,
                    },
                    point: { 
                        radius: 2, 
                        hoverRadius: 6,
                        hitRadius: 10,
                    }
                }
            }
        });
        
        // Update legend dan total
        updateChartLegend();
        updateChartTotal();
    }
}







/*
// Update Legend
function updateChartLegend() {
    const legendContainer = document.getElementById('chartLegend');
    if (!legendContainer) return;
    
    const isHutri = document.documentElement.getAttribute('data-theme') === 'hutri';
    const items = [
        { key: 'news', label: 'Berita', color: isHutri ? '#ff6b6b' : '#3b82f6' },
        { key: 'stock', label: 'Gallery', color: isHutri ? '#ff6b6b' : '#22c55e' },
        { key: 'ai', label: 'AI', color: isHutri ? '#ff6b6b' : '#a855f7' },
        { key: 'book', label: 'Buku', color: isHutri ? '#ff6b6b' : '#f59e0b' },
        { key: 'shop', label: 'Shop', color: isHutri ? '#ff6b6b' : '#ef4444' }
    ];
    
    legendContainer.innerHTML = items.map(item => `
        <span class="legend-item">
            <span class="legend-dot ${item.key}" style="background:${item.color}"></span>
            ${item.label}
        </span>
    `).join('');
}
*/
// Update Legend - Dengan warna yang berbeda
function updateChartLegend() {
    const legendContainer = document.getElementById('chartLegend');
    if (!legendContainer) return;
    
    const isHutri = document.documentElement.getAttribute('data-theme') === 'hutri';
    const items = [
        { key: 'news', label: 'Berita', color: isHutri ? '#ff4757' : '#3b82f6' },
        { key: 'stock', label: 'Gallery', color: isHutri ? '#ff6b81' : '#22c55e' },
        { key: 'ai', label: 'AI', color: isHutri ? '#ff9ff3' : '#a855f7' },
        { key: 'book', label: 'Buku', color: isHutri ? '#ffd93d' : '#f59e0b' },
        { key: 'shop', label: 'Shop', color: isHutri ? '#ff6b6b' : '#ef4444' }
    ];
    
    legendContainer.innerHTML = items.map(item => `
        <span class="legend-item" onclick="toggleChartDataset('${item.key}')">
            <span class="legend-dot ${item.key}" style="background:${item.color}"></span>
            ${item.label}
        </span>
    `).join('');
}

// Fungsi toggle dataset (opsional)
function toggleChartDataset(key) {
    if (!chartInstance) return;
    const datasetIndex = ['news', 'stock', 'ai', 'book', 'shop'].indexOf(key);
    if (datasetIndex === -1) return;
    
    const meta = chartInstance.getDatasetMeta(datasetIndex);
    meta.hidden = !meta.hidden;
    chartInstance.update();
    
    // Update style legend
    const legendItems = document.querySelectorAll('.chart-legend .legend-item');
    if (legendItems[datasetIndex]) {
        legendItems[datasetIndex].style.opacity = meta.hidden ? '0.3' : '1';
    }
}














// Update Total
function updateChartTotal() {
    const totalContainer = document.getElementById('chartTotal');
    if (!totalContainer) return;
    
    const total = userActivity.total || { news: 0, stock: 0, ai: 0, book: 0, shop: 0 };
    const grandTotal = Object.values(total).reduce((a, b) => a + b, 0);
    
    totalContainer.innerHTML = `
        <div class="total-item"><div class="total-number">${total.news || 0}</div><div class="total-label">Berita</div></div>
        <div class="total-item"><div class="total-number">${total.stock || 0}</div><div class="total-label">Gallery</div></div>
        <div class="total-item"><div class="total-number">${total.ai || 0}</div><div class="total-label">AI</div></div>
        <div class="total-item"><div class="total-number">${total.book || 0}</div><div class="total-label">Buku</div></div>
        <div class="total-item"><div class="total-number">${total.shop || 0}</div><div class="total-label">Shop</div></div>
        <div class="total-item" style="background:var(--accent-color);color:var(--text-inverse);">
            <div class="total-number" style="color:inherit;">${grandTotal}</div>
            <div class="total-label" style="color:rgba(255,255,255,0.7);">Total</div>
        </div>
    `;
}

// Resize Chart
function resizeChart() {
    if (chartInstance) {
        chartInstance.resize();
    }
}

// Init Chart
function initChart() {
    loadActivityData();
    setTimeout(renderChart, 200);
    window.addEventListener('resize', resizeChart);
}















// ============================================================
// THEME FUNCTIONS
// ============================================================
function setTheme(theme) {
    document.documentElement.removeAttribute('data-theme');
    if (theme !== 'dark') {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    localStorage.setItem('alovera_theme', theme);
    
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    const brand = document.querySelector('.brand-name');
    if (brand) {
        brand.textContent = theme === 'hutri' ? 'alovera' : 'alovera';
    }
    
    if (theme === 'hutri') {
        showNotification('Mode Spirit');
    } else if (theme === 'light') {
        showNotification('Mode Terang');
    } else {
        showNotification('Mode Gelap');
    }
    
    setTimeout(() => {
        if (document.getElementById('activityChart')) {
            renderChart();
        }
    }, 100);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('alovera_theme') || 'dark';
    setTheme(savedTheme);
}

// ============================================================
// HUT POPUP
// ============================================================

/*
function shouldShowHutPopup() {
    const lastShown = localStorage.getItem('hut_popup_shown');
    const today = new Date().toDateString();
    return !lastShown || lastShown !== today;
}

function openHutPopup() {
    const popup = document.getElementById('hutPopup');
    if (popup) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        localStorage.setItem('hut_popup_shown', new Date().toDateString());
        createConfettiEffect();
    }
}

function closeHutPopup() {
    const popup = document.getElementById('hutPopup');
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';
        const container = document.querySelector('.hut-confetti-container');
        if (container) container.remove();
    }
}

function createConfettiEffect() {
    const oldContainer = document.querySelector('.hut-confetti-container');
    if (oldContainer) oldContainer.remove();
    
    const container = document.createElement('div');
    container.className = 'hut-confetti-container';
    document.body.appendChild(container);
    
    const colors = ['#ff0000', '#ff6b6b', '#ffffff', '#ffd700', '#22c55e', '#4ade80'];
    
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'hut-confetti';
        const size = Math.random() * 8 + 4;
        const isCircle = Math.random() > 0.5;
        confetti.style.width = isCircle ? size + 'px' : size * 0.5 + 'px';
        confetti.style.height = isCircle ? size + 'px' : size * 1.5 + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = isCircle ? '50%' : '2px';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 2) + 's';
        confetti.style.opacity = Math.random() * 0.6 + 0.2;
        container.appendChild(confetti);
    }
    
    setTimeout(() => {
        if (container) container.remove();
    }, 6000);
}
*/
// ============================================================
// AI GENERATOR 
// ============================================================
const aiRandomPrompts = [
    'A futuristic city floating in the clouds at sunset, photorealistic, 8K',
    'A cozy cabin in a snowy forest with warm lights glowing from the windows, cinematic',
    'A majestic white tiger with icy blue eyes in a mystical forest, fantasy art',
    'An astronaut playing electric guitar on the moon with Earth in the background, digital art',
    'A steampunk airship sailing through golden clouds at dawn, highly detailed',
    'A beautiful mermaid sitting on a rock under the moonlight, oil painting style',
    'A cyberpunk street market in Tokyo at night with neon signs, rain, and reflections',
    'A giant ancient tree with a glowing door in its trunk, surrounded by fireflies',
    'A crystal castle on a floating island above a purple ocean, fantasy, magical atmosphere',
    'A samurai warrior standing in a field of cherry blossoms at sunrise, photorealistic',
    'A dragon made of galaxies and stars coiled around a planet, cosmic art',
    'A vintage coffee shop on a rainy Paris street, warm lighting, cinematic mood',
];

function getAiRandomPrompt() {
    const random = aiRandomPrompts[Math.floor(Math.random() * aiRandomPrompts.length)];
    const input = document.getElementById('promptInput');
    if (input) {
        input.value = random;
        input.focus();
    }
}

// AI Generate - override function dari file terpisah
const originalHandleGenerate = window.handleGenerate;

// ============================================================
// SKELETON RENDER
// ============================================================
function renderSkeleton() {
    const el = document.getElementById("productList");
    if (!el) return;
    let skeletonHTML = '';
    for (let i = 0; i < 4; i++) {
        skeletonHTML += `
            <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
                <div class="skeleton-line price"></div>
                <div class="skeleton-btn"></div>
            </div>
        `;
    }
    el.innerHTML = skeletonHTML;
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    loadUserProfile();
    loadActivityData();
    
    renderSkeleton();
    
    setTimeout(() => {
        renderProducts(products);
        renderShopProducts(products);
        loadNews('');
        loadRandomStock();
        loadRandomBooks();
        initChart();
        /*
        // HUT Popup
        if (shouldShowHutPopup()) {
            setTimeout(openHutPopup, 1500);
        }
        */
        // HUT Float Button
        const floatBtn = document.getElementById('hutFloatBtn');
        if (floatBtn) {
            floatBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1) rotate(-5deg)';
            });
            floatBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        }
    }, 800);
    
    // Tracking klik
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-cart')) trackActivity('shop');
        if (e.target.closest('.stock-item')) trackActivity('stock');
        if (e.target.closest('.book-item')) trackActivity('book');
        if (e.target.closest('.news-card')) trackActivity('news');
    });
    
    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
            closePopup();
            closeDetail();
            closePremiumModal();
            closeHutPopup();
        }
    });
    
    // Theme toggle buttons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Update shop button active
    updateShopButtonActive('home');
});


















// ============================================================
// MAULID BOOKS SLIDER - SPESIAL MAULID NABI
// ============================================================

// Query khusus buku Maulid/Islam untuk Open Library
/*
const maulidBooksQueries = [
    'sejarah nabi muhammad',
    'sirah nabawiyah',
    'maulid nabi',
    'kisah nabi muhammad',
    'rasulullah',
    'biografi nabi muhammad',
    'sirah rasulullah',
    'kehidupan nabi muhammad',
    'teladan nabi',
    'akhlak nabi',
    'perjuangan nabi muhammad',
    'hijrah nabi',
    'shalawat nabi',
    'maulid rasul',
    'nabi muhammad saw',
    'sejarah islam',
    'peradaban islam',
    'tokoh islam',
    'sahabat nabi',
    'khulafaur rasyidin'
];

// Query khusus Bisnis, Edukasi, Finansial & Ekonomi untuk Pexels
const maulidBooksQueries = [
    // Bisnis
    'business meeting',
    'business strategy',
    'business',
    'money',
    'economy',
    'business planning',
    'business presentation',
    'business team',
    'business discussion',
    'entrepreneur',
    'entrepreneurship',
    'small business',
    'business owner',
    'startup business',
    'startup team',
    'business growth',
    'business success',
    'business innovation',
    'business networking',
    'professional workplace',
    'office teamwork',

    // UMKM & Perdagangan
    'small business owner',
    'local business',
    'online business',
    'ecommerce business',
    'online shopping business',
    'business packaging',
    'product selling',
    'small business shop',
    'creative business',
    'digital business',

    // Edukasi
    'education',
    'online education',
    'online learning',
    'student studying',
    'students learning',
    'teacher teaching',
    'classroom education',
    'modern education',
    'digital education',
    'education technology',
    'e learning',
    'online course',
    'learning technology',
    'library education',
    'study workspace',

    // Finansial
    'personal finance',
    'financial planning',
    'financial management',
    'money management',
    'financial education',
    'financial technology',
    'fintech',
    'digital payment',
    'online banking',
    'mobile banking',
    'business finance',
    'financial growth',
    'saving money',
    'budget planning',
    'financial analysis',

    // Ekonomi & Investasi
    'economy',
    'economic growth',
    'global economy',
    'economic development',
    'investment',
    'investment planning',
    'stock market',
    'financial market',
    'economic analysis',
    'business economics'
];
*/
// Query buku untuk Pustaka Wawasan (Edukasi, Bisnis, Finansial, Mindset)
const maulidBooksQueries = [
    // Bisnis & Marketing
    'business strategy',
    'marketing',
    'entrepreneurship',
    'startup business',
    'business management',
    'digital marketing',
    'branding',
    'sales strategy',
    'business innovation',
    'leadership',
    
    // Keuangan & Investasi
    'personal finance',
    'investing',
    'financial freedom',
    'money management',
    'stock market',
    'wealth building',
    'financial literacy',
    'passive income',
    'investment guide',
    'budgeting',
    
    // Mindset & Pengembangan Diri
    'self improvement',
    'growth mindset',
    'personal development',
    'success habits',
    'productivity',
    'time management',
    'goal setting',
    'self discipline',
    'motivation',
    'positive thinking',
    
    // Ekonomi
    'economics',
    'economic growth',
    'microeconomics',
    'macroeconomics',
    'global economy',
    
    // Edukasi Umum
    'learning',
    'education',
    'critical thinking',
    'problem solving',
    'creativity',
    'communication skills'
];



let maulidBooksItems = [];
let maulidBooksIsLoading = false;
let maulidBooksAutoScrollInterval = null;
let maulidBooksIsPaused = false;

// ============================================================
// LOAD MAULID BOOKS
// ============================================================
async function loadMaulidBooks() {
    if (maulidBooksIsLoading) return;
    maulidBooksIsLoading = true;
    
    const track = document.getElementById('maulidBooksTrack');
    const refreshBtn = document.getElementById('maulidBooksRefresh');
    if (!track) return;
    
    // Animasi refresh
    if (refreshBtn) {
        refreshBtn.classList.add('spinning');
    }
    
    track.innerHTML = `
        <div class="maulid-books-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Memuat buku edukasi...</span>
        </div>
    `;
    
    /*
    try {
        // Pilih query acak untuk buku Maulid
        const randomQuery = maulidBooksQueries[Math.floor(Math.random() * maulidBooksQueries.length)];
        const searchQuery = encodeURIComponent(randomQuery);
        
        // Fetch buku dari Open Library
        const url = `${OPEN_LIBRARY_BASE}/search.json?q=${searchQuery}&limit=25`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        const bookData = data.docs || [];
        
        if (bookData.length === 0) {
            track.innerHTML = `
                <div class="maulid-books-empty">
                    <i class="fas fa-book-open"></i>
                    <span>Tidak ada buku ditemukan</span>
                </div>
            `;
            maulidBooksIsLoading = false;
            if (refreshBtn) {
                setTimeout(() => {
                    refreshBtn.classList.remove('spinning');
                }, 500);
            }
            return;
        }
        
        // Filter buku yang memiliki cover
        const booksWithCover = bookData.filter(b => b.cover_i || b.cover_id);
        
        // Ambil 20 buku
        const selectedBooks = booksWithCover.slice(0, 20);
        
        maulidBooksItems = selectedBooks.map(book => {
            const coverId = book.cover_i || book.cover_id || null;
            const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
            
            return {
                title: book.title || 'Judul tidak tersedia',
                coverUrl: coverUrl,
                key: book.key || null,
                author: book.author_name ? book.author_name[0] : 'Penulis tidak diketahui'
            };
        });
        
        renderMaulidBooks();
        startMaulidBooksAutoScroll();
        
    } catch (err) {
        console.error('Gagal memuat buku Edukasi:', err);
        track.innerHTML = `
            <div class="maulid-books-empty">
                <i class="fas fa-exclamation-circle"></i>
                <span>Gagal memuat buku, coba refresh</span>
            </div>
        `;
    }
    
    maulidBooksIsLoading = false;
  */
try {
    // ============================================================
    // RETRY LOOP: Coba beberapa query sampai dapat ≥ 8 buku valid
    // ============================================================
    let allBooks = [];
    let attempts = 0;
    const maxAttempts = 3;
    const usedQueries = new Set();
    
    while (allBooks.length < 8 && attempts < maxAttempts) {
        attempts++;
        
        // Pilih query acak yang belum dipakai
        let randomQuery;
        let queryAttempts = 0;
        do {
            const randomIndex = Math.floor(Math.random() * maulidBooksQueries.length);
            randomQuery = maulidBooksQueries[randomIndex];
            queryAttempts++;
        } while (usedQueries.has(randomQuery) && queryAttempts < 15);
        
        usedQueries.add(randomQuery);
        
        const searchQuery = encodeURIComponent(randomQuery);
        const url = `${OPEN_LIBRARY_BASE}/search.json?q=${searchQuery}&limit=30`;
        
        try {
            const res = await fetch(url);
            if (!res.ok) continue;
            
            const data = await res.json();
            const bookData = data.docs || [];
            
            // Filter buku yang:
            // 1. Punya cover (biar tampil bagus)
            // 2. Punya judul valid
            // 3. Punya penulis (opsional)
            const booksWithCover = bookData.filter(b => {
                const hasCover = b.cover_i || b.cover_id;
                const hasTitle = b.title && b.title.trim().length >= 3;
                return hasCover && hasTitle;
            });
            
            // Tambahkan ke allBooks, hindari duplikat
            booksWithCover.forEach(book => {
                const title = book.title?.trim();
                if (!title) return;
                
                const isDuplicate = allBooks.some(b => 
                    (b.title || '').toLowerCase() === title.toLowerCase()
                );
                
                if (!isDuplicate) {
                    allBooks.push(book);
                }
            });
            
        } catch (e) {
            console.warn(`Query "${randomQuery}" gagal:`, e.message);
            continue;
        }
    }
    
    // Kalau tidak ada buku valid sama sekali
    if (allBooks.length === 0) {
        track.innerHTML = `
            <div class="maulid-books-empty">
                <i class="fas fa-book-open"></i>
                <span>Belum ada buku tersedia</span>
            </div>
        `;
        maulidBooksIsLoading = false;
        if (refreshBtn) {
            setTimeout(() => refreshBtn.classList.remove('spinning'), 500);
        }
        return;
    }
    
    // Ambil 20 buku
    const selectedBooks = allBooks.slice(0, 20);
    
    // Format ke maulidBooksItems
    maulidBooksItems = selectedBooks.map(book => {
        const coverId = book.cover_i || book.cover_id || null;
        const coverUrl = coverId 
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` 
            : null;
        
        return {
            title: book.title || 'Judul tidak tersedia',
            coverUrl: coverUrl,
            key: book.key || null,
            author: book.author_name ? book.author_name[0] : 'Penulis tidak diketahui'
        };
    });
    
    renderMaulidBooks();
    startMaulidBooksAutoScroll();
    
} catch (err) {
    console.error('Gagal memuat buku:', err);
    track.innerHTML = `
        <div class="maulid-books-empty">
            <i class="fas fa-exclamation-circle"></i>
            <span>Gagal memuat buku, coba refresh</span>
        </div>
    `;
}

maulidBooksIsLoading = false;

  
  
  
    if (refreshBtn) {
        setTimeout(() => {
            refreshBtn.classList.remove('spinning');
        }, 500);
    }
}

// ============================================================
// RENDER MAULID BOOKS
// ============================================================
function renderMaulidBooks() {
    const track = document.getElementById('maulidBooksTrack');
    const dots = document.getElementById('maulidBooksDots');
    
    if (!track) return;
    
    if (maulidBooksItems.length === 0) {
        track.innerHTML = `
            <div class="maulid-books-empty">
                <i class="fas fa-book"></i>
                <span>Tidak ada buku tersedia</span>
            </div>
        `;
        if (dots) dots.innerHTML = '';
        return;
    }
    
    // Reset track
    track.innerHTML = '';
    
    // Render item buku
    maulidBooksItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'maulid-books-item';
        div.setAttribute('data-index', index);
        
        const coverImg = item.coverUrl || 'https://via.placeholder.com/200x300/1a6b3c/fff?text=No+Cover';
        
        div.innerHTML = `
            <img src="${coverImg}" alt="${item.title}" loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/200x300/1a6b3c/fff?text=No+Cover'">
            <div class="maulid-books-info">
                <div class="maulid-books-title-text">${item.title}</div>
            </div>
        `;
        
        // Klik untuk membuka detail buku
        div.addEventListener('click', () => {
            // Cari buku di list books
            const bookData = {
                title: item.title,
                author_name: [item.author],
                cover_i: item.coverUrl ? parseInt(item.coverUrl.split('/').pop().split('-')[0]) : null,
                key: item.key
            };
            showBookDetail(bookData);
        });
        
        track.appendChild(div);
    });
    
    // Update dots
    if (dots) {
        const totalSlides = Math.max(1, maulidBooksItems.length);
        dots.innerHTML = Array.from({ length: totalSlides }, (_, i) => `
            <span class="dot ${i === 0 ? 'active' : ''}" 
                  onclick="scrollToMaulidBooksItem(${i})"></span>
        `).join('');
    }
}

// ============================================================
// AUTO SCROLL - SEPERTI TV
// ============================================================
function startMaulidBooksAutoScroll() {
    if (maulidBooksAutoScrollInterval) clearInterval(maulidBooksAutoScrollInterval);
    
    const wrapper = document.getElementById('maulidBooksWrapper');
    if (!wrapper) return;
    
    maulidBooksAutoScrollInterval = setInterval(() => {
        if (maulidBooksIsPaused) return;
        
        const itemWidth = wrapper.querySelector('.maulid-books-item')?.offsetWidth || 150;
        const gap = 10;
        const totalWidth = itemWidth + gap;
        const visibleCount = Math.floor(wrapper.offsetWidth / totalWidth) || 2;
        const maxScroll = wrapper.scrollWidth - wrapper.offsetWidth;
        
        let newScroll = wrapper.scrollLeft + (totalWidth * visibleCount);
        
        if (newScroll >= maxScroll - 10) {
            wrapper.scrollTo({ left: 0, behavior: 'smooth' });
            updateMaulidBooksDots(0);
        } else {
            wrapper.scrollTo({ left: newScroll, behavior: 'smooth' });
            const currentIndex = Math.round(newScroll / (totalWidth * visibleCount));
            updateMaulidBooksDots(currentIndex);
        }
    }, 4500); // Geser setiap 4.5 detik
}

// ============================================================
// UPDATE DOTS
// ============================================================
function updateMaulidBooksDots(index) {
    const dots = document.querySelectorAll('#maulidBooksDots .dot');
    const totalDots = dots.length;
    if (totalDots === 0) return;
    
    const wrapper = document.getElementById('maulidBooksWrapper');
    if (!wrapper) return;
    
    const itemWidth = wrapper.querySelector('.maulid-books-item')?.offsetWidth || 150;
    const gap = 10;
    const totalWidth = itemWidth + gap;
    const visibleCount = Math.floor(wrapper.offsetWidth / totalWidth) || 2;
    
    const scrollIndex = Math.round(wrapper.scrollLeft / (totalWidth * visibleCount));
    const dotIndex = Math.min(scrollIndex, totalDots - 1);
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === dotIndex);
    });
}

// ============================================================
// SCROLL KE ITEM TERTENTU
// ============================================================
function scrollToMaulidBooksItem(index) {
    const wrapper = document.getElementById('maulidBooksWrapper');
    if (!wrapper) return;
    
    const itemWidth = wrapper.querySelector('.maulid-books-item')?.offsetWidth || 150;
    const gap = 10;
    const totalWidth = itemWidth + gap;
    const visibleCount = Math.floor(wrapper.offsetWidth / totalWidth) || 2;
    
    const scrollPosition = index * totalWidth * visibleCount;
    wrapper.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    updateMaulidBooksDots(index);
}

// ============================================================
// REFRESH MAULID BOOKS
// ============================================================
function refreshMaulidBooks() {
    if (maulidBooksAutoScrollInterval) {
        clearInterval(maulidBooksAutoScrollInterval);
        maulidBooksAutoScrollInterval = null;
    }
    const wrapper = document.getElementById('maulidBooksWrapper');
    if (wrapper) {
        wrapper.scrollLeft = 0;
    }
    loadMaulidBooks();
}

// ============================================================
// PAUSE/RESUME AUTO SCROLL SAAT HOVER
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.getElementById('maulidBooksWrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', function() {
            maulidBooksIsPaused = true;
        });
        
        wrapper.addEventListener('mouseleave', function() {
            maulidBooksIsPaused = false;
        });
        
        wrapper.addEventListener('scroll', function() {
            updateMaulidBooksDots();
        });
    }
});

// ============================================================
// RESIZE HANDLER
// ============================================================
let maulidBooksResizeTimeout = null;

function handleMaulidBooksResize() {
    if (maulidBooksResizeTimeout) clearTimeout(maulidBooksResizeTimeout);
    maulidBooksResizeTimeout = setTimeout(() => {
        updateMaulidBooksDots();
    }, 300);
}

window.addEventListener('resize', handleMaulidBooksResize);

// ============================================================
// INIT MAULID BOOKS
// ============================================================
let maulidBooksInitialized = false;

function initMaulidBooks() {
    if (maulidBooksInitialized) return;
    maulidBooksInitialized = true;
    
    if (document.getElementById('maulidBooksTrack')) {
        loadMaulidBooks();
    }
}

// ============================================================
// OVERRIDE NAVIGATE UNTUK MAULID BOOKS
// ============================================================
const originalNavMaulidBooks = window.navigateTo;
window.navigateTo = function(page) {
    if (typeof originalNavMaulidBooks === 'function') {
        originalNavMaulidBooks(page);
    }
    
    if (page === 'books') {
        setTimeout(() => {
            if (document.getElementById('maulidBooksTrack') && !maulidBooksInitialized) {
                initMaulidBooks();
            }
        }, 500);
    }
};

// ============================================================
// TAMBAHKAN KE FUNGSI REFRESH BOOKS
// ============================================================
const originalLoadRandomBooks = loadRandomBooks;
loadRandomBooks = function() {
    originalLoadRandomBooks();
    setTimeout(refreshMaulidBooks, 300);
};

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMaulidBooks, 1000);
});












// ============================================================
// KEYBOARD SHORTCUT - ESC UNTUK TUTUP POPUP
// ============================================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Tutup popup iklan
        const adPopup = document.getElementById('adPopup');
        if (adPopup && adPopup.classList.contains('active')) {
            closeAdPopup();
        }
    }
});











// ============================================================
// HALAMAN MAULID NEWS - DAFTAR BERITA SPESIAL MAULID
// ============================================================



// State untuk halaman Maulid
let maulidPageArticles = [];
let maulidPagePage = 1;
let maulidPageHasMore = true;
let maulidPageIsLoading = false;

/*
let maulidPageQueries = [
    'maulid nabi muhammad 1448',
    'peringatan maulid nabi',
    'rabiul awal 1448',
    'shalawat nabi',
    'kisah nabi muhammad',
    'teladan rasulullah',
    'hijrah nabi muhammad',
    'akhlak nabi muhammad',
    'sejarah nabi muhammad',
    'maulid rasulullah',
    'sirah nabawiyah',
    'keutamaan maulid nabi',
    'perayaan maulid nabi',
    'sunnah maulid nabi',
    'nabi',
    'muhammad saw',
    'maulid',
    'syukuran',
    'tahlil',
    'islam',
    'mui',
    'masjid',
    'pesantren',
    'santri',
    'doa maulid nabi'
];
*/
// Query khusus Bisnis, Ekonomi, Finansial & Edukasi untuk NewsData.io

/*
let maulidPageQueries = [
    'pertumbuhan ekonomi Indonesia',
    'ekonomi Indonesia',
    'ekonomi nasional',
    'ekonomi daerah',
    'ekonomi global',
    'kebijakan ekonomi Indonesia',
    'kebijakan fiskal',
    'kebijakan moneter',
    'stabilitas ekonomi',
    'prospek ekonomi Indonesia',

    'keuangan Indonesia',
    'sektor keuangan',
    'industri keuangan',
    'literasi keuangan',
    'inklusi keuangan',
    'perencanaan keuangan',
    'pengelolaan keuangan',
    'keuangan pribadi',
    'keuangan keluarga',
    'transformasi keuangan',

    'perbankan Indonesia',
    'bank digital',
    'digitalisasi perbankan',
    'suku bunga',
    'nilai tukar rupiah',
    'inflasi Indonesia',
    'harga kebutuhan pokok',
    'kebijakan perbankan',
    'pembayaran digital',
    'ekonomi digital',

    'investasi Indonesia',
    'pasar modal Indonesia',
    'saham Indonesia',
    'reksa dana',
    'obligasi Indonesia',
    'investasi digital',
    'investasi perusahaan',
    'pendanaan startup',
    'modal usaha',
    'pertumbuhan investasi',

    'bisnis Indonesia',
    'perkembangan bisnis',
    'strategi bisnis',
    'peluang bisnis',
    'pertumbuhan perusahaan',
    'perusahaan Indonesia',
    'industri Indonesia',
    'dunia usaha',
    'kewirausahaan',
    'usaha kecil menengah',

    'UMKM Indonesia',
    'perkembangan UMKM',
    'digitalisasi UMKM',
    'pemasaran digital',
    'strategi pemasaran',
    'tren pemasaran',
    'bisnis online',
    'perdagangan digital',
    'e-commerce Indonesia',
    'ekonomi kreatif',

    'pendidikan Indonesia',
    'edukasi keuangan',
    'pendidikan bisnis',
    'pendidikan ekonomi',
    'keterampilan kerja',
    'pengembangan sumber daya manusia',
    'peluang kerja',
    'lapangan kerja',
    'produktivitas tenaga kerja',
    'inovasi dan produktivitas'
];
*/

// Query untuk halaman Edukasi & Finansial (Grow Insight)
let maulidPageQueries = [
    // Keuangan & Investasi
    'tips keuangan',
    'literasi keuangan',
    'investasi saham',
    'reksadana',
    'cara menabung',
    'manajemen keuangan',
    'keuangan pribadi',
    'dana darurat',
    'perencanaan keuangan',
    'financial freedom',
    'passive income',
    'trading saham',
    'crypto indonesia',
    'emas investasi',
    'deposito',
    
    // Bisnis & Wirausaha
    'bisnis indonesia',
    'UMKM indonesia',
    'startup indonesia',
    'kewirausahaan',
    'entrepreneur indonesia',
    'bisnis online',
    'peluang usaha',
    'side hustle',
    'cara memulai bisnis',
    'franchise indonesia',
    
    // Ekonomi & Finansial
    'ekonomi indonesia',
    'finansial',
    'fintech indonesia',
    'bank indonesia',
    'pajak',
    'asuransi',
    'properti investasi',
    'kredit usaha',
    'smart money',
    
    // Umum
    'uang',
    'keuangan',
    'bisnis',
    'ekonomi',
    'cara kaya'
];

// ============================================================
// LOAD MAULID PAGE NEWS
// ============================================================

/*
async function loadMaulidPageNews(reset = true) {
    if (maulidPageIsLoading) return;
    maulidPageIsLoading = true;
    
    const grid = document.getElementById('maulidNewsGrid');
    const loadMoreBtn = document.querySelector('#maulidLoadMore .btn-load-more');
    
    if (!grid) return;
    
    if (reset) {
        maulidPageArticles = [];
        maulidPagePage = 1;
        maulidPageHasMore = true;
        grid.innerHTML = `
            <div class="maulid-page-loading" style="grid-column:1/-1;">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Memuat informasi finansial...</span>
            </div>
        `;
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat...';
    }
    
    try {
        // Pilih query acak dari daftar
        const randomIndex = Math.floor(Math.random() * maulidPageQueries.length);
        const query = maulidPageQueries[randomIndex];
        const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=id&language=id&q=${encodeURIComponent(query)}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        if (data.status === 'error' || !data.results || data.results.length === 0) {
            if (reset) {
                grid.innerHTML = `
                    <div class="maulid-page-empty" style="grid-column:1/-1;">
                        <i class="fas fa-newspaper"></i>
                        <h3>Tidak Ada Berita</h3>
                        <p>Belum ada berita Edukasi saat ini</p>
                    </div>
                `;
            }
            maulidPageHasMore = false;
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
            maulidPageIsLoading = false;
            return;
        }
        
        // Filter berita yang relevan
        const filtered = data.results.filter(a => {
            const title = (a.title || '').toLowerCase();
            const desc = (a.description || '').toLowerCase();
            return title.includes('nabi') || 
                   title.includes('maulid') || 
                   title.includes('rasul') ||
                   title.includes('islam') ||
                   title.includes('muslim') ||
                   title.includes('shalawat') ||
                   title.includes('hijrah') ||
                   desc.includes('nabi') ||
                   desc.includes('maulid') ||
                   desc.includes('rasul');
        });
        
        if (filtered.length === 0) {
            if (reset) {
                grid.innerHTML = `
                    <div class="maulid-page-empty" style="grid-column:1/-1;">
                        <i class="fas fa-newspaper"></i>
                        <h3>Tidak Ada Berita</h3>
                        <p>Belum ada berita finansial saat ini</p>
                    </div>
                `;
            }
            maulidPageHasMore = false;
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
            maulidPageIsLoading = false;
            return;
        }
        
        // Tambahkan ke daftar
        const newArticles = filtered.slice(0, 10);
        maulidPageArticles = reset ? newArticles : [...maulidPageArticles, ...newArticles];
        maulidPageHasMore = data.results.length > 10;
        
        // Render
        renderMaulidPageNews();
        
        // Update load more button
        if (loadMoreBtn) {
            if (maulidPageHasMore) {
                loadMoreBtn.style.display = 'inline-flex';
                loadMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Muat Lebih Banyak';
                loadMoreBtn.disabled = false;
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
        
    } catch (error) {
        console.error('Gagal memuat berita finansial:', error);
        if (reset) {
            grid.innerHTML = `
                <div class="maulid-page-empty" style="grid-column:1/-1;">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Gagal Memuat Berita</h3>
                    <p>${error.message || 'Coba refresh halaman'}</p>
                </div>
            `;
        }
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Muat Lebih Banyak';
            loadMoreBtn.disabled = false;
        }
    }
    
    maulidPageIsLoading = false;
}
*/
// ============================================================
// LOAD EDUKASI & FINANSIAL PAGE NEWS
// ============================================================
async function loadMaulidPageNews(reset = true) {
    if (maulidPageIsLoading) return;
    maulidPageIsLoading = true;
    
    const grid = document.getElementById('maulidNewsGrid');
    const loadMoreBtn = document.querySelector('#maulidLoadMore .btn-load-more');
    
    if (!grid) {
        maulidPageIsLoading = false;
        return;
    }
    
    if (reset) {
        maulidPageArticles = [];
        maulidPagePage = 1;
        maulidPageHasMore = true;
        grid.innerHTML = `
            <div class="maulid-page-loading" style="grid-column:1/-1;">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Memuat berita...</span>
            </div>
        `;
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat...';
    }
    
    try {
        // ============================================================
        // RETRY LOOP: Coba beberapa query sampai dapat ≥ 6 berita valid
        // ============================================================
        let validArticles = [];
        let attempts = 0;
        const maxAttempts = 4;
        const usedQueries = new Set();
        
        // Keyword untuk filter berita finansial/bisnis
        const finKeywords = [
            'bisnis', 'keuangan', 'investasi', 'saham', 'reksadana', 'finansial',
            'ekonomi', 'uang', 'tabungan', 'menabung', 'pajak', 'asuransi',
            'startup', 'umkm', 'usaha', 'wirausaha', 'entrepreneur', 'pengusaha',
            'properti', 'crypto', 'trading', 'emas', 'deposito', 'fintech',
            'bank', 'kredit', 'pinjaman', 'dana', 'anggaran', 'budget',
            'penghasilan', 'gaji', 'profit', 'laba', 'pasar', 'keuangan',
            'financial', 'money', 'income', 'wealth', 'kaya', 'mandiri'
        ];
        
        while (validArticles.length < 6 && attempts < maxAttempts) {
            attempts++;
            
            // Pilih query acak yang belum dipakai
            let query;
            let queryAttempts = 0;
            do {
                const randomIndex = Math.floor(Math.random() * maulidPageQueries.length);
                query = maulidPageQueries[randomIndex];
                queryAttempts++;
            } while (usedQueries.has(query) && queryAttempts < 15);
            
            usedQueries.add(query);
            
            const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=id&language=id&q=${encodeURIComponent(query)}`;
            
            try {
                const response = await fetch(url);
                if (!response.ok) continue;
                
                const data = await response.json();
                if (data.status === 'error' || !data.results || data.results.length === 0) {
                    continue;
                }
                
                // Filter berita yang relevan dengan finansial/bisnis
                const filtered = data.results.filter(a => {
                    const title = (a.title || '').toLowerCase();
                    const desc = (a.description || '').toLowerCase();
                    return finKeywords.some(k => title.includes(k) || desc.includes(k));
                });
                
                // Filter lagi: hanya yang valid (judul + deskripsi + link lengkap)
                const validOnes = filtered.filter(a => {
                    const title = (a.title || '').trim();
                    const desc = (a.description || '').trim();
                    const link = (a.link || '').trim();
                    return title.length >= 15 && desc.length >= 30 && link.startsWith('http');
                });
                
                // Gabungkan, hindari duplikat
                validOnes.forEach(article => {
                    const isDuplicate = validArticles.some(a => 
                        (a.title || '').toLowerCase() === (article.title || '').toLowerCase()
                    );
                    if (!isDuplicate) {
                        validArticles.push(article);
                    }
                });
                
            } catch (e) {
                console.warn(`Query "${query}" gagal:`, e.message);
                continue;
            }
        }
        
        if (validArticles.length === 0) {
            throw new Error('Tidak ada berita valid ditemukan');
        }
        
        // Ambil maksimal 10, dengan fallback gambar
        const newArticles = validArticles.slice(0, 10).map(article => {
            let img = article.image_url;
            if (!img || typeof img !== 'string' || !img.startsWith('http')) {
                img = `https://via.placeholder.com/400x200/f59e0b/ffffff?text=Grow+Insight`;
            }
            return { ...article, image_url: img };
        });
        
        maulidPageArticles = reset ? newArticles : [...maulidPageArticles, ...newArticles];
        maulidPageHasMore = true; // Selalu bisa load more
        
        renderMaulidPageNews();
        
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'inline-flex';
            loadMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Muat Lebih Banyak';
            loadMoreBtn.disabled = false;
        }
        
    } catch (error) {
        console.error('Gagal memuat berita Edukasi & Finansial:', error);
        if (reset) {
            grid.innerHTML = `
                <div class="maulid-page-empty" style="grid-column:1/-1;">
                    <i class="fas fa-newspaper"></i>
                    <h3>Gagal Memuat Berita</h3>
                    <p>${error.message || 'Coba refresh halaman'}</p>
                </div>
            `;
        }
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Muat Lebih Banyak';
            loadMoreBtn.disabled = false;
        }
    }
    
    maulidPageIsLoading = false;
}


// ============================================================
// RENDER MAULID PAGE NEWS
// ============================================================
/*
function renderMaulidPageNews() {
    const grid = document.getElementById('maulidNewsGrid');
    if (!grid) return;
    
    if (maulidPageArticles.length === 0) {
        grid.innerHTML = `
            <div class="maulid-page-empty" style="grid-column:1/-1;">
                <i class="fas fa-newspaper"></i>
                <h3>Tidak Ada Berita</h3>
                <p>Belum ada berita finansial saat ini</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = maulidPageArticles.map(a => `
        <div class="maulid-news-card" onclick="window.open('${a.link || '#'}', '_blank')">
            <img src="${a.image_url || 'https://via.placeholder.com/400x200/1a6b3c/fff?text=No+Image'}" 
                 alt="${a.title || 'Berita'}" 
                 class="maulid-news-thumb"
                 onerror="this.src='https://via.placeholder.com/400x200/1a6b3c/fff?text=No+Image'">
            <div class="maulid-news-body">
                <div class="maulid-news-title">${a.title || 'Judul tidak tersedia'}</div>
                <div class="maulid-news-meta">
                <!--
                    <span><i class="fas fa-user"></i> ${a.source_id || 'Sumber'}</span>
                    -->
                    <span><i class="far fa-clock"></i> ${a.pubDate ? new Date(a.pubDate).toLocaleString('id-ID') : ''}</span>
                </div>
                <div class="maulid-news-desc">${a.description || 'Klik untuk membaca selengkapnya...'}</div>
                <a href="${a.link || '#'}" target="_blank" class="maulid-news-read" onclick="event.stopPropagation();">
                    <i class="fas fa-book-open"></i> Baca Selengkapnya
                </a>
            </div>
        </div>
    `).join('');
}
*/
// ============================================================
// RENDER EDUKASI & FINANSIAL PAGE NEWS
// ============================================================
function renderMaulidPageNews() {
    const grid = document.getElementById('maulidNewsGrid');
    if (!grid) return;
    
    if (maulidPageArticles.length === 0) {
        grid.innerHTML = `
            <div class="maulid-page-empty" style="grid-column:1/-1;">
                <i class="fas fa-newspaper"></i>
                <h3>Belum Ada Berita</h3>
                <p>Coba refresh halaman untuk memuat berita terbaru</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = maulidPageArticles.map(a => `
        <div class="maulid-news-card fin-news-card" onclick="window.open('${a.link || '#'}', '_blank')">
            <img src="${a.image_url || 'https://via.placeholder.com/400x200/f59e0b/ffffff?text=Grow+Insight'}" 
                 alt="${a.title || 'Berita'}" 
                 class="maulid-news-thumb"
                 onerror="this.src='https://via.placeholder.com/400x200/f59e0b/ffffff?text=Grow+Insight'">
            <div class="maulid-news-body">
                <div class="maulid-news-title">${a.title || 'Judul tidak tersedia'}</div>
                <div class="maulid-news-meta">
                    <span><i class="far fa-clock"></i> ${a.pubDate ? new Date(a.pubDate).toLocaleString('id-ID', {day:'2-digit', month:'short', year:'numeric'}) : ''}</span>
                </div>
                <div class="maulid-news-desc">${a.description || 'Klik untuk membaca selengkapnya...'}</div>
                <a href="${a.link || '#'}" target="_blank" class="maulid-news-read fin-news-read" onclick="event.stopPropagation();">
                    <i class="fas fa-book-open"></i> Baca Selengkapnya
                </a>
            </div>
        </div>
    `).join('');
}


// ============================================================
// LOAD MORE MAULID NEWS
// ============================================================
async function loadMoreMaulidNews() {
    if (maulidPageIsLoading || !maulidPageHasMore) return;
    maulidPagePage++;
    await loadMaulidPageNews(false);
}

// ============================================================
// INIT MAULID PAGE
// ============================================================
function initMaulidPage() {
    loadMaulidPageNews(true);
}

// ============================================================
// OVERRIDE NAVIGATE UNTUK MAULID PAGE
// ============================================================
const originalNavMaulidPage = window.navigateTo;
window.navigateTo = function(page) {
    if (typeof originalNavMaulidPage === 'function') {
        originalNavMaulidPage(page);
    }
    
    if (page === 'maulid') {
        setTimeout(() => {
            const grid = document.getElementById('maulidNewsGrid');
            if (grid) {
                // Cek apakah sudah ada berita
                if (maulidPageArticles.length === 0) {
                    initMaulidPage();
                }
            }
        }, 300);
    }
};





// ============================================================
// BERITA SPESIAL MAULID NABI - NEWS PAGE (DENGAN NEWSAPI.IO)
// ============================================================

// Query untuk berita Maulid dan Keagamaan
/*
const maulidNewsQueries = [
    'maulid nabi muhammad 1448',
    'peringatan maulid nabi',
    'rabiul awal 1448',
    'shalawat nabi',
    'kisah nabi muhammad',
    'teladan rasulullah',
    'hijrah nabi muhammad',
    'akhlak nabi muhammad',
    'sejarah nabi muhammad',
    'maulid rasulullah',
    'sirah nabawiyah',
    'keutamaan maulid nabi',
    'perayaan maulid nabi',
    'sunnah maulid nabi',
    'doa maulid nabi',
    'islam indonesia',
    'masjid nabawi',
    'kisah islami',
    'motivasi islami',
    'dakwah islam',
    'ustadz ceramah',
    'kajian islam',
    'muslim indonesia',
    'ramadan islam',
    'quran hadits',
    'nabi muhammad saw',
    'sahabat nabi',
    'khulafaur rasyidin',
    'peradaban islam',
    'maulid',
    'islam',
    'ustadz',
    'masjid',
    'doa',
    'sholat',
    'dzalim',
    'menolong',
    'nabi',
    'tokoh muslim'
];
*/
// Query khusus Bisnis, Ekonomi, Finansial & Edukasi untuk NewsData.io
/*
const maulidNewsQueries = [
    'business',
    'business news',
    'global business',
    'international business',
    'business growth',
    'business strategy',
    'business development',
    'entrepreneurship',
    'entrepreneur',
    'startup',
    'startup funding',
    'startup ecosystem',
    'small business',
    'small business growth',
    'company news',
    'corporate news',
    'corporate strategy',
    'technology business',
    'digital business',
    'digital transformation',
    'ecommerce business',
    'online business',
    'business innovation',
    'business investment',
    'economic growth',
    'global economy',
    'world economy',
    'economic development',
    'economic outlook',
    'economic policy',
    'international economy',
    'global economic growth',
    'economic recovery',
    'inflation economy',
    'interest rates economy',
    'trade economy',
    'global trade',
    'international trade',
    'financial markets',
    'finance news',
    'global finance',
    'personal finance',
    'financial technology',
    'fintech',
    'banking',
    'digital banking',
    'investment',
    'stock market',
    'market trends',
    'financial markets news',
    'marketing',
    'digital marketing',
    'marketing strategy',
    'social media marketing',
    'advertising business',
    'brand strategy',
    'education',
    'education technology',
    'edtech',
    'business education'
];

// Query khusus Ekonomi, Finansial, Bisnis & Edukasi untuk
const maulidNewsQueries = [
    'pertumbuhan',
    'ekonomi',
    'Indonesia',
    'ekonomi Indonesia',
    'ekonomi',
    'nasional',
    'ekonomi daerah',
    'ekonomi',
    'global',
    'kebijakan ekonomi Indonesia',
    'kebijakan',
    'fiskal',
    'kebijakan',
    'moneter',
    'stabilitas ekonomi',
    'prospek ekonomi Indonesia',

    'keuangan',
    'Indonesia',
    'sektor keuangan',
    'industri',
    'keuangan',
    'literasi keuangan',
    'inklusi',
    'keuangan',
    'perencanaan keuangan',
    'pengelolaan keuangan',
    'keuangan pribadi',
    'keuangan keluarga',
    'transformasi',
    'keuangan',

    'perbankan',
    'Indonesia',
    'bank',
    'digital',
    'digitalisasi',
    'suku bunga',
    'nilai tukar',
    'rupiah',
    'inflasi',
    'Indonesia',
    'harga',
    'kebutuhan pokok',
    'kebijakan perbankan',
    'pembayaran digital',
    'ekonomi digital',

    'investasi',
    'pasar modal',
    'saham',
    'reksa dana',
    'obligasi',
    'investasi digital',
    'investasi perusahaan',
    'pendanaan',
    'startup',
    'modal usaha',
    'pertumbuhan',

    'bisnis Indonesia',
    'perkembangan bisnis',
    'strategi bisnis',
    'peluang bisnis',
    'pertumbuhan perusahaan',
    'perusahaan Indonesia',
    'industri Indonesia',
    'dunia usaha',
    'kewirausahaan',
    'usaha kecil menengah',

    'UMKM Indonesia',
    'UMKM',
    'digitalisasi UMKM',
    'pemasaran digital',
    'strategi pemasaran',
    'tren pemasaran',
    'bisnis online',
    'perdagangan',
    'e-commerce',
    'ekonomi kreatif',

    'pendidikan Indonesia',
    'edukasi',
    'pendidikan bisnis',
    'pendidikan ekonomi',
    'keterampilan kerja',
    'pengembangan sumber daya manusia',
    'peluang kerja',
    'lapangan kerja',
    'produktivitas tenaga kerja',
    'inovasi',
    'produktivitas'
];
*/
// Query untuk berita Cerdas Finansial (Bisnis, Keuangan, Investasi)
const maulidNewsQueries = [
    'tips keuangan',
    'literasi keuangan',
    'investasi',
    'reksadana',
    'saham indonesia',
    'cara menabung',
    'manajemen keuangan',
    'keuangan pribadi',
    'bisnis indonesia',
    'UMKM indonesia',
    'startup indonesia',
    'kewirausahaan',
    'entrepreneur indonesia',
    'ekonomi indonesia',
    'pajak',
    'asuransi',
    'dana darurat',
    'perencanaan keuangan',
    'crypto indonesia',
    'properti investasi',
    'bisnis online',
    'peluang usaha',
    'finansial',
    'fintech indonesia',
    'bank indonesia',
    'trading',
    'emas investasi',
    'deposito',
    'kredit usaha',
    'smart money',
    'financial freedom',
    'passive income',
    'side hustle',
    'uang',
    'keuangan',
    'bisnis',
    'ekonomi',
    'investasi saham',
    'tips menabung',
    'cara kaya'
];


let maulidNewsItems = [];
let maulidNewsCurrentIndex = 0;
let maulidNewsInterval = null;
let maulidNewsIsLoading = false;
let maulidNewsLastUpdate = null;
let maulidNewsAllArticles = [];
let maulidNewsPage = 1;
let maulidNewsHasMore = true;

// ============================================================
// LOAD BERITA MAULID DARI NEWSAPI
// ============================================================
async function loadMaulidNews(append = false) {
    if (maulidNewsIsLoading) return;
    maulidNewsIsLoading = true;
    
    const track = document.getElementById('maulidSliderTrack');
    const dots = document.getElementById('maulidDots');
    const timeLabel = document.getElementById('maulidUpdateTime');
    
    if (!track) return;



// ============================================================
// HELPER: Validasi artikel — pastikan tidak kosong
// ============================================================
function isValidArticle(article) {
    if (!article) return false;
    const title = (article.title || '').trim();
    const desc = (article.description || '').trim();
    const link = (article.link || '').trim();
    
    // Minimal 15 karakter judul, 30 karakter deskripsi, link valid
    return title.length >= 15 && 
           desc.length >= 30 && 
           link.startsWith('http');
}

// ============================================================
// HELPER: Ambil gambar — fallback ke placeholder kalau kosong
// ============================================================
function getArticleImage(article) {
    let img = article.image_url;
    
    // Kalau kosong atau bukan URL valid → pakai placeholder
    if (!img || typeof img !== 'string' || !img.startsWith('http')) {
        return `https://via.placeholder.com/400x300/f59e0b/ffffff?text=Cerdas+Finansial`;
    }
    
    // Beberapa URL newsdata.io kadang pakai placeholder buruk
    if (img.includes('via.placeholder') && img.includes('image')) {
        return `https://via.placeholder.com/400x300/f59e0b/ffffff?text=Cerdas+Finansial`;
    }
    
    return img;
}




    // Tampilkan loading jika pertama kali
    if (!append && maulidNewsItems.length === 0) {
        track.innerHTML = `
            <div class="maulid-slide" style="justify-content:center;min-height:200px;width:100%;">
                <div style="text-align:center;color:var(--text-muted);">
                    <i class="fas fa-spinner fa-spin" style="font-size:28px;display:block;margin-bottom:12px;"></i>
                    <span>Memuat berita Ekonomi dan Finansial...</span>
                </div>
            </div>
        `;
    }

/*
    try {
        // Pilih query acak
        const randomIndex = Math.floor(Math.random() * maulidNewsQueries.length);
        const query = maulidNewsQueries[randomIndex];
        const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=id&language=id&q=${encodeURIComponent(query)}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        if (data.status === 'error' || !data.results || data.results.length === 0) {
            // Jika tidak ada hasil, coba query lain
            const fallbackQuery = 'islam indonesia';
            const fallbackUrl = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=id&language=id&q=${encodeURIComponent(fallbackQuery)}`;
            const fallbackRes = await fetch(fallbackUrl);
            if (!fallbackRes.ok) throw new Error(`HTTP error! status: ${fallbackRes.status}`);
            const fallbackData = await fallbackRes.json();
            
            if (fallbackData.status === 'error' || !fallbackData.results) {
                throw new Error('Tidak ada berita');
            }
            
            const filtered = filterMaulidNews(fallbackData.results);
            if (filtered.length === 0) {
                throw new Error('Tidak ada berita relevan');
            }
            
            if (append) {
                maulidNewsAllArticles = [...maulidNewsAllArticles, ...filtered];
            } else {
                maulidNewsAllArticles = filtered;
            }
        } else {
            // Filter berita yang relevan
            const filtered = filterMaulidNews(data.results);
            
            if (filtered.length === 0) {
                throw new Error('Tidak ada berita relevan');
            }
            
            if (append) {
                maulidNewsAllArticles = [...maulidNewsAllArticles, ...filtered];
            } else {
                maulidNewsAllArticles = filtered;
            }
        }
        
        // Update waktu terakhir
        maulidNewsLastUpdate = new Date();
        if (timeLabel) {
            timeLabel.textContent = maulidNewsLastUpdate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        }
        
        // Update slider items (ambil 10 berita untuk slider, sisanya di grid)
        const sliderItems = maulidNewsAllArticles.slice(0, 10);
        maulidNewsItems = sliderItems;
        maulidNewsCurrentIndex = 0;
        
        renderMaulidSliderNews();
        startMaulidAutoSlideNews();
        
        // Jika ada berita lebih dari 10, tampilkan tombol load more
        const loadMoreWrap = document.getElementById('maulidLoadMoreWrap');
        if (loadMoreWrap) {
            if (maulidNewsAllArticles.length > 10) {
                loadMoreWrap.style.display = 'block';
            } else {
                loadMoreWrap.style.display = 'none';
            }
        }
        
    } 
    
    
    
    
    catch (error) {
        console.error('Gagal memuat berita Edukasi:', error);
        if (!append && maulidNewsItems.length === 0) {
            track.innerHTML = `
                <div class="maulid-slide" style="justify-content:center;min-height:200px;width:100%;">
                    <div style="text-align:center;color:var(--text-muted);">
                        <i class="fas fa-exclamation-circle" style="font-size:28px;display:block;margin-bottom:12px;"></i>
                        <span>Gagal memuat berita. Coba refresh.</span>
                    </div>
                </div>
            `;
        }
    }
    
    maulidNewsIsLoading = false;
}
*/
    try {
        // ============================================================
        // RETRY LOOP: Coba maksimal 3 query berbeda sampai dapat berita valid
        // ============================================================
        let validArticles = [];
        let attempts = 0;
        const maxAttempts = 3;
        const usedQueries = new Set();
        
        while (validArticles.length < 5 && attempts < maxAttempts) {
            attempts++;
            
            // Pilih query acak yang belum dipakai
            let query;
            let queryAttempts = 0;
            do {
                const randomIndex = Math.floor(Math.random() * maulidNewsQueries.length);
                query = maulidNewsQueries[randomIndex];
                queryAttempts++;
            } while (usedQueries.has(query) && queryAttempts < 10);
            
            usedQueries.add(query);
            
            const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=id&language=id&q=${encodeURIComponent(query)}`;
            
            try {
                const response = await fetch(url);
                if (!response.ok) continue; // Skip kalau HTTP error, coba query lain
                
                const data = await response.json();
                if (data.status === 'error' || !data.results || data.results.length === 0) {
                    continue; // Skip kalau tidak ada hasil
                }
                
                // Filter berita yang relevan
                const filtered = filterMaulidNews(data.results);
                
                // Filter lagi: hanya yang valid (judul + deskripsi + link lengkap)
                const validOnes = filtered.filter(isValidArticle);
                
                // Gabungkan ke validArticles (hindari duplikat by title)
                validOnes.forEach(article => {
                    const isDuplicate = validArticles.some(a => 
                        (a.title || '').toLowerCase() === (article.title || '').toLowerCase()
                    );
                    if (!isDuplicate) {
                        validArticles.push(article);
                    }
                });
                
            } catch (e) {
                console.warn(`Query "${query}" gagal:`, e.message);
                continue;
            }
        }
        
        // ============================================================
        // JIKA MASIH KOSONG → throw error
        // ============================================================
        if (validArticles.length === 0) {
            throw new Error('Tidak ada berita valid ditemukan');
        }
        
        // ============================================================
        // AMBIL GAMBAR DENGAN FALLBACK
        // ============================================================
        validArticles = validArticles.map(article => ({
            ...article,
            image_url: getArticleImage(article)
        }));
        
        // ============================================================
        // SIMPAN
        // ============================================================
        if (append) {
            maulidNewsAllArticles = [...maulidNewsAllArticles, ...validArticles];
        } else {
            maulidNewsAllArticles = validArticles;
        }
        
        // Update waktu terakhir
        maulidNewsLastUpdate = new Date();
        if (timeLabel) {
            timeLabel.textContent = maulidNewsLastUpdate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        }
        
        // ============================================================
        // SLIDER: HANYA ambil artikel yang PUNYA GAMBAR VALID
        // ============================================================
        const sliderItems = maulidNewsAllArticles
            .filter(a => a.image_url && a.image_url.startsWith('http'))
            .slice(0, 10);
        
        // Kalau tidak ada yang punya gambar (semua fallback), tetap pakai
        maulidNewsItems = sliderItems.length > 0 
            ? sliderItems 
            : maulidNewsAllArticles.slice(0, 10);
        
        maulidNewsCurrentIndex = 0;
        
        renderMaulidSliderNews();
        startMaulidAutoSlideNews();
        
        // Update load more
        const loadMoreWrap = document.getElementById('maulidLoadMoreWrap');
        if (loadMoreWrap) {
            loadMoreWrap.style.display = maulidNewsAllArticles.length > 10 ? 'block' : 'none';
        }
        
    } catch (error) {
        console.error('Gagal memuat berita Cerdas Finansial:', error);
        if (!append && maulidNewsItems.length === 0) {
            track.innerHTML = `
                <div class="maulid-slide" style="justify-content:center;min-height:200px;width:100%;">
                    <div style="text-align:center;color:var(--text-muted);">
                        <i class="fas fa-exclamation-circle" style="font-size:28px;display:block;margin-bottom:12px;"></i>
                        <span>Gagal memuat berita. Coba refresh.</span>
                    </div>
                </div>
            `;
        }
    }
    
    maulidNewsIsLoading = false;
}

// ============================================================
// FILTER BERITA MAULID
// ============================================================
function filterMaulidNews(articles) {
    
    /*
    const keywords = ['nabi', 'maulid', 'rasul', 'islam', 'muslim', 'shalawat', 'hijrah', 
                      'quran', 'hadits', 'sunnah', 'dakwah', 'masjid', 'ustadz', 'ceramah',
                      'kajian', 'ramadan', 'muhammad', 'sahabat', 'khulafaur', 'rasyidin',
                      'peradaban', 'tokoh', 'agama', 'spiritual', 'ibadah', 'doa'];
                      
// Query khusus Bisnis, Ekonomi, Finansial & Edukasi untuk NewsData.io
const keywords = [
    'pertumbuhan',
    'ekonomi',
    'Indonesia',
    'ekonomi Indonesia',
    'ekonomi nasional',
    'ekonomi daerah',
    'ekonomi',
    'global',
    'kebijakan',
    'ekonomi Indonesia',
    'kebijakan fiskal',
    'moneter',
    'stabilitas',
    'prospek ekonomi Indonesia',

    'keuangan',
    'sektor keuangan',
    'industri',
    'literasi',
    'inklusi',
    'perencanaan keuangan',
    'pengelolaan',
    'keuangan pribadi',
    'keuangan keluarga',
    'transformasi',

    'perbankan',
    'bank digital',
    'digitalisasi',
    'suku bunga',
    'nilai tukar rupiah',
    'inflasi Indonesia',
    'harga',
    'kebutuhan pokok',
    'kebijakan perbankan',
    'pembayaran',
    'digital',

    'investasi',
    'pasar modal',
    'saham',
    'reksa dana',
    'obligasi',
    'investasi digital',
    'perusahaan',
    'startup',
    'modal usaha',
    'pertumbuhan',

    'bisnis Indonesia',
    'perkembangan bisnis',
    'strategi bisnis',
    'peluang bisnis',
    'pertumbuhan perusahaan',
    'perusahaan Indonesia',
    'industri Indonesia',
    'dunia usaha',
    'kewirausahaan',
    'usaha kecil menengah',

    'UMKM Indonesia',
    'perkembangan UMKM',
    'UMKM',
    'pemasaran digital',
    'pemasaran',
    'tren',
    'bisnis online',
    'perdagangan digital',
    'e-commerce',
    'ekonomi kreatif',

    'pendidikan Indonesia',
    'edukasi keuangan',
    'pendidikan bisnis',
    'pendidikan ekonomi',
    'keterampilan kerja',
    'pengembangan sumber daya manusia',
    'peluang kerja',
    'lapangan kerja',
    'produktivitas tenaga kerja',
    'inovasi',
    'produktivitas'
];

                      
                      
    
    return articles.filter(a => {
        const title = (a.title || '').toLowerCase();
        const desc = (a.description || '').toLowerCase();
        return keywords.some(k => title.includes(k) || desc.includes(k));
    });
}
*/

// ============================================================
// FILTER BERITA CERDAS FINANSIAL
// ============================================================

    const keywords = [
        'bisnis', 'keuangan', 'investasi', 'saham', 'reksadana', 'finansial',
        'ekonomi', 'uang', 'tabungan', 'menabung', 'pajak', 'asuransi',
        'startup', 'umkm', 'usaha', 'wirausaha', 'entrepreneur', 'pengusaha',
        'properti', 'crypto', 'trading', 'emas', 'deposito', 'fintech',
        'bank', 'kredit', 'pinjaman', 'dana', 'anggaran', 'budget',
        'penghasilan', 'gaji', 'profit', 'laba', 'rugi', 'pasar',
        'financial', 'money', 'income', 'wealth', 'kaya', 'mandiri'
    ];
    
    return articles.filter(a => {
        const title = (a.title || '').toLowerCase();
        const desc = (a.description || '').toLowerCase();
        return keywords.some(k => title.includes(k) || desc.includes(k));
    });
}

// ============================================================
// RENDER MAULID SLIDER NEWS
// ============================================================
function renderMaulidSliderNews() {
    const track = document.getElementById('maulidSliderTrack');
    const dots = document.getElementById('maulidDots');
    
    if (!track) return;
    
    if (maulidNewsItems.length === 0) {
        track.innerHTML = `
            <div class="maulid-slide" style="justify-content:center;min-height:200px;width:100%;">
                <div style="text-align:center;color:var(--text-muted);">
                    <i class="fas fa-info-circle" style="font-size:28px;display:block;margin-bottom:12px;"></i>
                    <span>Belum ada berita Finansial saat ini</span>
                </div>
            </div>
        `;
        if (dots) dots.innerHTML = '';
        return;
    }
    
    /*
    // Render slides
    track.innerHTML = maulidNewsItems.map((item, index) => {
        const isCustom = index < 3 ? true : false;
        return `
            <div class="maulid-slide" data-index="${index}" style="transform: translateX(${index * 100}%); min-width:100%;">
                <img src="${item.image_url || 'https://via.placeholder.com/400x300/1a6b3c/fff?text=Maulid'}" 
                     alt="${item.title || 'Berita'}" 
                     class="maulid-thumb"
                     onerror="this.src='https://via.placeholder.com/400x300/1a6b3c/fff?text=Maulid'">
                <div class="maulid-content">
                    <span class="maulid-tag">
                        <i class="fas fa-new" style="font-size:9px;"></i> 
                        ${isCustom ? 'News' : 'Berita Terkini'}
                    </span>
                    <div class="maulid-slide-title">${item.title || 'Judul tidak tersedia'}</div>
                    <div class="maulid-slide-desc">${item.description || 'Klik baca selengkapnya...'}</div>
                    <div class="maulid-slide-meta">
                    
                    <!--
                        <span><i class="fas fa-user"></i> 
                        
                        ${item.source_id || 'Sumber'}
                        
                        
                        </span>
                        -->
                        
                        
                        <span><i class="far fa-clock"></i> ${item.pubDate ? new Date(item.pubDate).toLocaleDateString('id-ID') : ''}</span>
                    </div>
                    <a href="${item.link || '#'}" target="_blank" class="maulid-read-btn" onclick="event.stopPropagation();">
                        <i class="fas fa-book-open"></i> Baca Selengkapnya
                    </a>
                </div>
            </div>
        `;
    }).join('');
    */
    // Render slides
track.innerHTML = maulidNewsItems.map((item, index) => {
    const isCustom = index < 3 ? true : false;
    
    // Validasi tambahan: jangan render slide kalau tidak ada title
    if (!item.title || item.title.trim().length < 10) {
        return ''; // Skip slide ini
    }
    
    return `
        <div class="maulid-slide" data-index="${index}" style="transform: translateX(${index * 100}%); min-width:100%;">
            <img src="${item.image_url || 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Cerdas+Finansial'}" 
                 alt="${item.title}" 
                 class="maulid-thumb"
                 onerror="this.src='https://via.placeholder.com/400x300/f59e0b/ffffff?text=Cerdas+Finansial'">
            <div class="maulid-content">
                <span class="maulid-tag">
                    <i class="fas fa-coins" style="font-size:9px;"></i> 
                    ${isCustom ? 'Tips' : 'Keuangan'}
                </span>
                <div class="maulid-slide-title">${item.title}</div>
                <div class="maulid-slide-desc">${item.description || 'Klik baca selengkapnya...'}</div>
                <div class="maulid-slide-meta">
                    <span><i class="far fa-clock"></i> ${item.pubDate ? new Date(item.pubDate).toLocaleDateString('id-ID') : ''}</span>
                </div>
                <a href="${item.link || '#'}" target="_blank" class="maulid-read-btn" onclick="event.stopPropagation();">
                    <i class="fas fa-book-open"></i> Baca Selengkapnya
                </a>
            </div>
        </div>
    `;
}).filter(html => html !== '').join('');  // ← Filter slide yang kosong
// Update jumlah slide yang valid
const validSlideCount = track.querySelectorAll('.maulid-slide').length;
maulidNewsItems = maulidNewsItems.slice(0, validSlideCount);

// Kalau semua slide kosong, tampilkan pesan
if (validSlideCount === 0) {
    track.innerHTML = `
        <div class="maulid-slide" style="justify-content:center;min-height:200px;width:100%;">
            <div style="text-align:center;color:var(--text-muted);">
                <i class="fas fa-newspaper" style="font-size:28px;display:block;margin-bottom:12px;"></i>
                <span>Belum ada berita tersedia</span>
            </div>
        </div>
    `;
    if (dots) dots.innerHTML = '';
    return;
}


    
    
    // Reset ke slide pertama
    maulidNewsCurrentIndex = 0;
    updateMaulidTrackNews();
    
    // Render dots
    if (dots) {
        dots.innerHTML = maulidNewsItems.map((_, index) => `
            <span class="dot ${index === maulidNewsCurrentIndex ? 'active' : ''}" 
                  onclick="goToMaulidSlideNews(${index})"></span>
        `).join('');
    }
}

// ============================================================
// UPDATE MAULID TRACK NEWS
// ============================================================
function updateMaulidTrackNews() {
    const track = document.getElementById('maulidSliderTrack');
    if (!track) return;
    
    const slides = track.querySelectorAll('.maulid-slide');
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    if (maulidNewsCurrentIndex >= totalSlides) {
        maulidNewsCurrentIndex = 0;
    }
    
    slides.forEach((slide, index) => {
        const offset = index - maulidNewsCurrentIndex;
        slide.style.transform = `translateX(${offset * 100}%)`;
        slide.style.display = 'flex';
    });
    
    // Update dots
    const dots = document.querySelectorAll('#maulidDots .dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === maulidNewsCurrentIndex);
    });
}

// ============================================================
// GO TO SLIDE NEWS
// ============================================================
function goToMaulidSlideNews(index) {
    const totalSlides = maulidNewsItems.length;
    if (index < 0 || index >= totalSlides || index === maulidNewsCurrentIndex) return;
    
    maulidNewsCurrentIndex = index;
    updateMaulidTrackNews();
    resetMaulidAutoSlideNews();
}

function nextMaulidSlideNews() {
    const totalSlides = maulidNewsItems.length;
    if (maulidNewsCurrentIndex >= totalSlides - 1) {
        goToMaulidSlideNews(0);
        return;
    }
    goToMaulidSlideNews(maulidNewsCurrentIndex + 1);
}

function prevMaulidSlideNews() {
    if (maulidNewsCurrentIndex <= 0) {
        goToMaulidSlideNews(maulidNewsItems.length - 1);
        return;
    }
    goToMaulidSlideNews(maulidNewsCurrentIndex - 1);
}

// ============================================================
// AUTO SLIDE NEWS
// ============================================================
function startMaulidAutoSlideNews() {
    if (maulidNewsInterval) clearInterval(maulidNewsInterval);
    
    const totalSlides = maulidNewsItems.length;
    if (totalSlides <= 1) return;
    
    maulidNewsInterval = setInterval(() => {
        if (maulidNewsCurrentIndex >= totalSlides - 1) {
            goToMaulidSlideNews(0);
        } else {
            goToMaulidSlideNews(maulidNewsCurrentIndex + 1);
        }
    }, 6000);
}

function resetMaulidAutoSlideNews() {
    if (maulidNewsInterval) {
        clearInterval(maulidNewsInterval);
        startMaulidAutoSlideNews();
    }
}

// ============================================================
// PAUSE SLIDE SAAT HOVER
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.maulid-slider-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', function() {
            if (maulidNewsInterval) {
                clearInterval(maulidNewsInterval);
                maulidNewsInterval = null;
            }
        });
        wrapper.addEventListener('mouseleave', function() {
            if (!maulidNewsInterval && maulidNewsItems.length > 0) {
                startMaulidAutoSlideNews();
            }
        });
    }
});

// ============================================================
// LOAD MORE MAULID NEWS (untuk halaman News)
// ============================================================
async function loadMoreMaulidSliderNews() {
    if (maulidNewsIsLoading) return;
    await loadMaulidNews(true);
}

// ============================================================
// UPDATE BERITA MAULID SETIAP 6 JAM
// ============================================================
function scheduleMaulidNewsUpdate() {
    // Update setiap 6 jam (21600000 ms)
    setInterval(() => {
        console.log('🔄 Update berita Maulid otomatis...');
        loadMaulidNews(false);
    }, 21600000); // 6 jam
}

// ============================================================
// INIT MAULID NEWS
// ============================================================
let maulidNewsInitialized = false;

function initMaulidNews() {
    if (maulidNewsInitialized) return;
    maulidNewsInitialized = true;
    
    loadMaulidNews(false);
    scheduleMaulidNewsUpdate();
}

// ============================================================
// NAVIGATE OVERRIDE UNTUK MAULID NEWS
// ============================================================
const originalNavMaulidNews = window.navigateTo;
window.navigateTo = function(page) {
    if (typeof originalNavMaulidNews === 'function') {
        originalNavMaulidNews(page);
    }
    
    if (page === 'news') {
        setTimeout(() => {
            if (document.getElementById('maulidSliderTrack')) {
                // Jika sudah ada berita dan sudah lebih dari 6 jam, refresh
                if (maulidNewsLastUpdate) {
                    const now = new Date();
                    const diff = now - maulidNewsLastUpdate;
                    if (diff > 21600000) { // 6 jam
                        loadMaulidNews(false);
                    }
                }
                // Update waktu
                const timeLabel = document.getElementById('maulidUpdateTime');
                if (timeLabel && maulidNewsLastUpdate) {
                    timeLabel.textContent = maulidNewsLastUpdate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                }
            }
        }, 300);
    }
};

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMaulidNews, 800);
});

// ============================================================
// TOMBOL PREV/NEXT - HUBUNGKAN DENGAN FUNGSI BARU
// ============================================================
// Update tombol navigasi di HTML (jika ada)
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.getElementById('maulidPrevBtn');
    const nextBtn = document.getElementById('maulidNextBtn');
    
    if (prevBtn) {
        prevBtn.onclick = prevMaulidSlideNews;
    }
    if (nextBtn) {
        nextBtn.onclick = nextMaulidSlideNews;
    }
});



// ============================================================
// HELPER: Handle video error di stock
// ============================================================
function handleStockVideoError(videoEl) {
    console.warn('⚠️ Video gagal load:', videoEl.src);
    
    // Sembunyikan video
    videoEl.style.display = 'none';
    
    const wrapper = videoEl.parentElement;
    if (wrapper && !wrapper.querySelector('.stock-video-error-fallback')) {
        const fallback = document.createElement('div');
        fallback.className = 'stock-video-error-fallback';
        fallback.innerHTML = `
            <i class="fas fa-video-slash"></i>
            <span>Video tidak dapat dimuat</span>
        `;
        wrapper.appendChild(fallback);
    }
}



















// ============================================================
// SERVICE WORKER
// ============================================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => console.log('Service Worker terdaftar:', registration))
        .catch(error => console.log('Pendaftaran Service Worker gagal:', error));
}




// ============================================================
// FIX NAVIGASI KE HALAMAN MAULID (EDUKASI FINANSIAL)
// ============================================================
// Karena window.navigateTo di-override berkali-kali,
// kita pastikan navigasi ke 'maulid' tetap berfungsi.
(function() {
    const _navHandlers = [];
    
    // Simpan handler yang sudah ada
    const existingNav = window.navigateTo;
    
    // Bungkus navigateTo dengan wrapper yang handle 'maulid'
    window.navigateTo = function(page) {
        // Panggil handler lama
        if (typeof existingNav === 'function') {
            existingNav(page);
        }
        
        // Handle 'maulid' secara eksplisit
        if (page === 'maulid') {
            // Pastikan halaman aktif
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const maulidPage = document.getElementById('maulidPage');
            if (maulidPage) maulidPage.classList.add('active');
            
            // Update bottom nav
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            
            // Update menu item
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            
            // Scroll ke atas
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Tutup side menu
            if (typeof closeMenu === 'function') closeMenu();
            
            // Load berita
            setTimeout(() => {
                if (typeof initMaulidPage === 'function') {
                    initMaulidPage();
                } else if (typeof loadMaulidPageNews === 'function') {
                    loadMaulidPageNews(true);
                }
            }, 200);
        }
    };
    
    console.log('✅ Navigasi ke halaman Edukasi Finansial siap');
})();