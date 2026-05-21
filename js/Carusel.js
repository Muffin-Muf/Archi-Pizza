// Порожній масив, який заповниться після запиту до json-server
let banersInfo = [];

const container = document.getElementById('carouselContainer'); 
const dotsContainer = document.getElementById('carouselDots');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
let currentIndex = 0;
let slideInterval; 

async function fetchBanners() {
    try {
        const response = await fetch('http://localhost:3000/banners');
        
        if (!response.ok) {
            throw new Error('Помилка завантаження даних');
        }
        
        banersInfo = await response.json();
        initCarousel();
    } catch (error) {
        console.error("Не вдалося завантажити банери:", error);
        container.innerHTML = '<p style="color: white; padding: 20px;">Не вдалося завантажити акції. Спробуйте пізніше.</p>';
    }
}

function initCarousel() {
    if (banersInfo.length === 0) return;

    for (let i = 0; i < banersInfo.length; i++) {
        let info = banersInfo[i];

        let slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        slide.style.backgroundImage = "linear-gradient(to bottom right, rgba(29, 45, 80, 0.75), rgba(21, 20, 31, 0.85)), url('" + info.image + "')";

        slide.innerHTML = '<div class="slide-content">' +
            '<h2>' + info.title + '</h2>' +
            '<p>' + info.description + ' </p>' +
            '<button class="promo-btn">' + info.buttonText + '</button>' +
            '</div>';
        container.appendChild(slide);
        
        let dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');

        dot.onclick = function() {
            goToSlide(i);
            resetTimer();
        };

        dotsContainer.appendChild(dot);
    }
    
    startTimer();
}

function updateCarousel() {
    if (banersInfo.length === 0) return; 

    let movePercentage = currentIndex * 100;
    container.style.transform = 'translateX(-' + movePercentage + '%)';

    let allDots = document.querySelectorAll('.dot');
    allDots.forEach(function(dot, index) {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

nextBtn.onclick = function() {
    if (banersInfo.length === 0) return;
    currentIndex++;
    if (currentIndex >= banersInfo.length) {
        currentIndex = 0;
    }
    updateCarousel();
    resetTimer(); 
};

prevBtn.onclick = function() {
    if (banersInfo.length === 0) return;
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = banersInfo.length - 1;
    }
    updateCarousel();
    resetTimer(); 
};

function startTimer() {
    if (banersInfo.length === 0) return;
    slideInterval = setInterval(function() {
        currentIndex++;
        if (currentIndex >= banersInfo.length) {
            currentIndex = 0;
        }
        updateCarousel();
    }, 10000);
}

function resetTimer() {
    clearInterval(slideInterval);
    startTimer(); 
}

fetchBanners();