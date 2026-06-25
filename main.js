// ==========================================
// 🛠️ 0️⃣ إعداد وتهيئة Firebase Firestore (قاعدة البيانات)
// ==========================================
// ⚠️ ضع هنا بيانات مشروعك الحقيقية من Firebase Console عشان السلة تسمع في الداش بورد
  const firebaseConfig = {
    apiKey: "AIzaSyBI53K1OEyBAkGkf4Q1-M1Uwet5JYKkGRg",
    authDomain: "adham-f9501.firebaseapp.com",
    projectId: "adham-f9501",
    storageBucket: "adham-f9501.firebasestorage.app",
    messagingSenderId: "146782842546",
    appId: "1:146782842546:web:aa66d8409061bcfaad23ab",
    measurementId: "G-QBWWZ33614"
  };
// تأكد من كتابة الكود كاملاً بهذا الشكل:
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

let cart = []; 
let favoriteDresses = JSON.parse(localStorage.getItem('favoriteDresses')) || [];
// ==========================================
// 1️⃣ لوجيك سلايدر الفساتين الأساسي (Dress Slider)
// ==========================================
const slider = document.querySelector('.dress-slider');
const cards = document.querySelectorAll('.dress-slider .dress-card');
const nextBtn = document.querySelector('.next-arrow');
const prevBtn = document.querySelector('.prev-arrow');

let counter = 0;

function moveSlider() {
    if (!cards.length || !slider) return;
    const cardWidth = cards[0].getBoundingClientRect().width + 30; 
    slider.style.transform = `translateX(${-counter * cardWidth}px)`;
}

function getMaxScroll() {
    const cardsToShow = window.innerWidth <= 900 ? 1 : 3;
    return cards.length - cardsToShow;
}

function nextSlide() {
    if (counter >= getMaxScroll()) {
        counter = 0; 
    } else {
        counter++;
    }
    moveSlider();
}

function prevSlide() {
    if (counter <= 0) {
        counter = getMaxScroll(); 
    } else {
        counter--;
    }
    moveSlider();
}

let autoPlayInterval = setInterval(nextSlide, 3500);

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        stopAutoPlay(); 
        nextSlide();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        stopAutoPlay(); 
        prevSlide();
    });
}

window.addEventListener('resize', moveSlider);


// ==========================================
// 2️⃣ لوجيك سلايدر آراء الزباين التلقائي
// ==========================================
const reviewsSlider = document.querySelector('.reviews-slider');
const reviewCards = document.querySelectorAll('.review-card');
let reviewCounter = 0;

function moveReviews() {
    if (!reviewCards.length || !reviewsSlider) return;
    const showCards = window.innerWidth <= 768 ? 1 : 3;
    const maxScroll = reviewCards.length - showCards;

    if (reviewCounter > maxScroll) {
        reviewCounter = 0; 
    } else if (reviewCounter < 0) {
        reviewCounter = maxScroll;
    }

    const cardSize = reviewCards[0].clientWidth + 25; 
    reviewsSlider.style.transform = `translateX(${-reviewCounter * cardSize}px)`;
}

setInterval(() => {
    reviewCounter++;
    moveReviews();
}, 3000);

window.addEventListener('resize', moveReviews);


// ==========================================
// 3️⃣ 📊 لوجيك العداد الرقمي الذكي
// ==========================================
const counters = document.querySelectorAll('.counter');

function startCounting(counterElement) {
    const target = +counterElement.getAttribute('data-target'); 
    const count = +counterElement.innerText; 
    const speed = target / 50; 

    if (count < target) {
        counterElement.innerText = Math.ceil(count + speed);
        setTimeout(() => startCounting(counterElement), 20);
    } else {
        counterElement.innerText = target === 500 ? '+' + target : target;
    }
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounting(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => observer.observe(counter));


// ==========================================
// 4️⃣ 🖱️ لوجيك الماوس السحري المخصص
// ==========================================
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

if (cursorDot && cursorOutline) {
    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    });

    const hoverTargets = document.querySelectorAll("a, button, .dress-card, .stat-card, .review-card");
    hoverTargets.forEach(target => {
        target.addEventListener("mouseover", () => {
            cursorOutline.classList.add("cursor-grow");
            cursorDot.style.width = "4px"; 
            cursorDot.style.height = "4px";
        });
        
        target.addEventListener("mouseleave", () => {
            cursorOutline.classList.remove("cursor-grow");
            cursorDot.style.width = "8px";
            cursorDot.style.height = "8px";
        });
    });
}


// ==========================================
// 5️⃣ 💕 لوجيك توليد القلوب الطائرة تلقائياً
// ==========================================
const heartsContainer = document.getElementById('hearts-container');

function createHeart() {
    if (!heartsContainer) return;
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    
    const shapes = ['❤️', '✨', '💕', '🌸'];
    heart.innerText = shapes[Math.floor(Math.random() * shapes.length)];
    
    heart.style.left = Math.random() * 100 + 'vw';
    
    const size = Math.random() * 14 + 10;
    heart.style.fontSize = size + 'px';
    
    const duration = Math.random() * 4 + 5;
    heart.style.animationDuration = duration + 's';
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

setInterval(createHeart, 500);


// ==========================================
// 6️⃣ سيستم الفساتين المفضلة (Favorite List System)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const favMenuBtn = document.getElementById('fav-menu-btn');
    const favDropdown = document.getElementById('fav-dropdown');
    const favCountSpan = document.getElementById('fav-count');
    const favItemsList = document.getElementById('fav-items-list');
    const heartButtons = document.querySelectorAll('.heart-btn');

    updateFavoritesUI();

    if (favMenuBtn && favDropdown) {
        favMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            favDropdown.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            favDropdown.classList.remove('active');
        });
        favDropdown.addEventListener('click', (e) => e.stopPropagation());
    }

    heartButtons.forEach(btn => {
        const card = btn.closest('.dress-card');
        if (!card) return;
        const dressId = card.getAttribute('data-id');
        const dressTitle = card.querySelector('.dress-title').innerText;

        if (favoriteDresses.some(item => item.id === dressId)) {
            btn.innerText = '❤️';
            btn.classList.add('liked');
        }

        btn.addEventListener('click', () => {
            btn.classList.toggle('liked');
            
            if (btn.classList.contains('liked')) {
                btn.innerText = '❤️';
                favoriteDresses.push({ id: dressId, title: dressTitle });
            } else {
                btn.innerText = '🤍';
                favoriteDresses = favoriteDresses.filter(item => item.id !== dressId);
            }

            localStorage.setItem('favorites', JSON.stringify(favoriteDresses));
            updateFavoritesUI();
        });
    });

    function updateFavoritesUI() {
        if (favCountSpan) favCountSpan.innerText = favoriteDresses.length;
        if (!favItemsList) return;
        
        favItemsList.innerHTML = '';
        
        if (favoriteDresses.length === 0) {
            favItemsList.innerHTML = '<li>المفضلة فارغة 🥺</li>';
            return;
        }

        favoriteDresses.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>👗 ${item.title}</span>
                <button class="remove-fav-btn" onclick="removeFavoriteFromMenu('${item.id}')">❌</button>
            `;
            favItemsList.appendChild(li);
        });
    }

    window.removeFavoriteFromMenu = function(id) {
        favoriteDresses = favoriteDresses.filter(item => item.id !== id);
        localStorage.setItem('favorites', JSON.stringify(favoriteDresses));
        
        const card = document.querySelector(`.dress-card[data-id="${id}"]`);
        if(card) {
            const btn = card.querySelector('.heart-btn');
            if (btn) {
                btn.classList.remove('liked');
                btn.innerText = '🤍';
            }
        }
        
        updateFavoritesUI();
    };
});


// ==========================================
// 7️⃣ 📊 سيستم السلة المطور والمربوط بالداش بورد (Firebase Dashboard)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const floatingCartBtn = document.getElementById('floating-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const floatingCartCount = document.getElementById('floating-cart-count');
    const checkoutBtn = document.getElementById('checkout-btn') || document.getElementById('checkoutBtn');

    // اختبار لقط زرار الشراء في الكونسول
    if (checkoutBtn) {
        console.log("✅ تم العثور على زرار إتمام الشراء (Checkout) بنجاح!");
    } else {
        console.error("❌ تحذير السلة: مش قادر ألاقي زرار إتمام الشراء. راجع id='checkout-btn'");
    }

    if (floatingCartBtn && cartSidebar) {
        floatingCartBtn.addEventListener('click', () => cartSidebar.classList.add('open'));
    }
    if (closeCartBtn && cartSidebar) {
        closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));
    }

    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.dress-card');
            if (!card) return;
            const id = card.getAttribute('data-id');
            const title = card.querySelector('.dress-title') ? card.querySelector('.dress-title').innerText : card.getAttribute('data-title') || 'فستان';
            const price = +card.getAttribute('data-price') || 0;

            const exists = cart.find(item => item.id === id);
            if (exists) {
                alert('هذا الفستان مضاف بالفعل في السلة الخاص بك! 🥰');
                return;
            }

            cart.push({ id, title, price });
            updateCartUI();
            if (cartSidebar) cartSidebar.classList.add('open'); 
        });
    });

    function updateCartUI() {
        if (floatingCartCount) floatingCartCount.innerText = cart.length;
        if (!cartItemsList) return;
        
        cartItemsList.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li style="justify-content: center;">السلة فارغة 🛒</li>';
            if (cartTotalPrice) cartTotalPrice.innerText = '0 EGP';
            return;
        }

        cart.forEach(item => {
            total += item.price;
            const li = document.createElement('li');
            li.innerHTML = `
                <span>👗 ${item.title}</span>
                <span>${item.price.toLocaleString()} EGP <button style="background:none; border:none; color:red; cursor:pointer; margin-left:10px;" onclick="removeFromCart('${item.id}')">❌</button></span>
            `;
            cartItemsList.appendChild(li);
        });

        if (cartTotalPrice) cartTotalPrice.innerText = `${total.toLocaleString()} EGP`;
    }

    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    };

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            const nameInput = document.getElementById('client-name');
            const phoneInput = document.getElementById('client-phone');
            
            const name = nameInput ? nameInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';

            if (cart.length === 0) {
                alert('برجاء إضافة فساتين للسلة أولاً! 👗');
                return;
            }
            if (name === '' || phone === '') {
                alert('برجاء ملء بيانات الاسم ورقم الهاتف لإتمام الشراء! ✍️');
                return;
            }

            let total = 0;
            const itemsForFirebase = cart.map((item) => {
                total += item.price;
                return { id: item.id, title: item.title, price: item.price };
            });

            try {
                await db.collection("orders").add({
                    clientName: name,
                    clientPhone: phone,
                    items: itemsForFirebase,
                    totalPrice: total,
                    status: "جديد 🆕", 
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                cart = [];
                if (nameInput) nameInput.value = '';
                if (phoneInput) phoneInput.value = '';
                updateCartUI();
                if (cartSidebar) cartSidebar.classList.remove('open');
                
                alert("تم تسجيل طلب الشراء بنجاح في الداش بورد! 🛍️💖");

            } catch (error) {
                console.error("خطأ في السلة:", error);
                alert("حدث خطأ أثناء الاتصال بالسيستم 🥺");
            }
        });
    }
});


// ==========================================
// 8️⃣ تفاعلات الصفحات وفورم الحجز المربوطة بالواتساب (WhatsApp Setup)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // 📷 مودال الصور
    const modal = document.getElementById("image-modal");
    const fullImg = document.getElementById("full-image");
    const closeBtn = document.querySelector(".close-modal");
    const dressImages = document.querySelectorAll(".img-container img, .dress-card img, .slider-wrapper img");

    dressImages.forEach(img => {
        img.style.cursor = "pointer"; 
        img.addEventListener("click", function(e) {
            if (!modal || !fullImg) return;
            e.stopPropagation(); 
            modal.style.display = "block";
            fullImg.src = this.src;
        });
    });

    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (modal && e.target === modal) {
            modal.style.display = "none";
        }
    });

    // 🔝 Back To Top
    const topBtn = document.getElementById("backToTop");
    if (topBtn) {
        function checkScroll() {
            if (window.scrollY > 300) {
                topBtn.classList.add("show");
            } else {
                topBtn.classList.remove("show");
            }
        }
        window.addEventListener("scroll", checkScroll);
        checkScroll();

        topBtn.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 📅 💬 فورم حجز الموعد المطور والذكي المربوط بـ شات الواتساب مباشرة
    const bookingForm = document.getElementById("appointment-form") || 
                        document.getElementById("booking-form") || 
                        document.getElementById("appointmentForm");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function(e) {
            e.preventDefault(); 

            const nameInput = document.getElementById("bride-name") || document.querySelector("[name='bride-name']");
            const phoneInput = document.getElementById("bride-phone") || document.querySelector("[name='bride-phone']");
            const dateInput = document.getElementById("booking-date") || document.querySelector("[name='booking-date']");
            const timeSelect = document.getElementById("booking-time") || document.querySelector("[name='booking-time']");

            const name = nameInput ? nameInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const date = dateInput ? dateInput.value : 'غير محدد';
            const timeText = (timeSelect && timeSelect.selectedIndex !== -1) ? timeSelect.options[timeSelect.selectedIndex].text : 'غير محدد';

            if (name === '' || phone === '') {
                alert('برجاء كتابة الاسم ورقم الهاتف لإرسال الحجز! ✍️');
                return;
            }

            const atelierWhatsAppNumber = "201007100185"; // ⚠️ حط رقمك الحقيقي هنا

            const whatsappMessage = 
                `✨ *طلب حجز موعد بروفة جديد* ✨\n\n` +
                `👤 *اسم العروسة:* ${name}\n` +
                `📱 *رقم التواصل:* ${phone}\n` +
                `📅 *تاريخ البروفة:* ${date}\n` +
                `⏰ *التوقيت المفضل:* ${timeText}\n\n` +
                `💖 *أتيليه ديما وجوجو - Nasr City* 💖`;

            const encodedText = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${atelierWhatsAppNumber}?text=${encodedText}`;

            window.open(whatsappUrl, "_blank");
            bookingForm.reset();
        });
    }

    // 📧 Formspree
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (submitBtn) {
                submitBtn.innerText = "جاري الإرسال... ⏳";
                submitBtn.disabled = true;
                submitBtn.style.opacity = "0.6";
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch("https://formspree.io/f/meewvadn", {
                    method: "POST",
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    alert("تم إرسال رسالتك بنجاح! 🎉");
                    contactForm.reset();
                } else {
                    alert("عذراً، حدثت مشكلة أثناء الإرسال. حاول مرة أخرى.");
                }
            } catch (error) {
                alert("خطأ في الاتصال بالشبكة. تأكد من إنترنت جهازك.");
            } finally {
                if (submitBtn) {
                    submitBtn.innerText = "إرسال الرسالة 🚀";
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                }
            }
        });
    }
});


// ==========================================
// 🛡️ 9️⃣ سيستم الـ Preloader
// ==========================================
const hidePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
        
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 600);
    }
};

window.addEventListener('load', hidePreloader);
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(hidePreloader, 2500);
});

// ==========================================
// 🚀 فانكشن الشراء المباشرة (الضربة القاضية)
// ==========================================
window.submitOrderToFirebase = async function() {
    console.log("✅ تم الضغط على زرار الشراء بنجاح!");
    
    // سحب بيانات العميل
    const nameInput = document.getElementById('client-name');
    const phoneInput = document.getElementById('client-phone');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';

    // التأكد من إن السلة مش فاضية وإن البيانات مكتوبة
    if (typeof cart === 'undefined' || cart.length === 0) {
        alert('برجاء إضافة فساتين للسلة أولاً! 👗');
        return;
    }
    if (name === '' || phone === '') {
        alert('برجاء ملء بيانات الاسم ورقم الهاتف لإتمام الشراء! ✍️');
        return;
    }

    // تجميع السعر الإجمالي وتجهيز الأوردر
    let total = 0;
    const itemsForFirebase = cart.map((item) => {
        total += item.price;
        return { id: item.id, title: item.title, price: item.price };
    });

    try {
        // رسالة تنبيه إن الكود بدأ يبعت للفايربيز
        alert("⏳ جاري إرسال الطلب للسيستم، ثواني..."); 

        await db.collection("orders").add({
            clientName: name,
            clientPhone: phone,
            items: itemsForFirebase,
            totalPrice: total,
            status: "جديد 🆕", 
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // تفريغ السلة بعد نجاح الشراء
        cart = [];
        if (nameInput) nameInput.value = '';
        if (phoneInput) phoneInput.value = '';
        
        // تحديث شكل السلة وقفلها
        if (typeof updateCartUI === 'function') updateCartUI();
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) cartSidebar.classList.remove('open');
        
        alert("✅ تم تسجيل طلب الشراء بنجاح في السيستم سيتم التواصل معك في اقرب🛍️💖");

    } catch (error) {
        console.error("❌ خطأ في السلة:", error);
        alert("حدث خطأ أثناء الاتصال بالسيستم 🥺");
    }
};

//local storage //

let bride = document.getElementById('bride-name')

if(localStorage.length > 0 ){
    bride.value = localStorage.getItem('bride')
}

bride.onkeyup = function(){
    localStorage.setItem('bride', bride.value)
}



let bridenum = document.getElementById('bride-phone')

if(localStorage.length > 0){
    bridenum.value = localStorage.getItem('num')
}

bridenum.onkeyup = function(){
localStorage.setItem('num', bridenum.value)
} 


let date = document.getElementById('booking-date')

if(localStorage.length > 0 ){
    date.value = localStorage.getItem('date')
}

date.onchange = function(){
    localStorage.setItem('date',date.value
    )
}

let time = document.getElementById('booking-time')

if(localStorage.length > 0 ){
    time.value = localStorage.getItem('time')
}

time.onchange = function(){
    localStorage.setItem('time',time.value )
}



let name = document.getElementById('client-name')

if(localStorage.length > 0){
    name.value = localStorage.getItem('name')
}

name.onkeyup = function(){
    localStorage.setItem('name',name.value)
}


let num = document.getElementById('client-phone')

if(localStorage.length > 0){
    num.value = localStorage.getItem('num')
}

num.onkeyup = function(){
    localStorage.setItem('num',num.value)
}



let bt = document.getElementById('backToTop')

window.onscroll = function(){
    if(scrollY >= 400){
        bt.style.display = ('block')
    }
    else{
        bt.style.display = ('none')
    }
}

bt.onclick = function(){
  scroll({
    left:0,
    top:0,
    behavior:"smooth"
  })
}

