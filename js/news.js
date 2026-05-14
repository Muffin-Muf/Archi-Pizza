
let newsList = document.getElementById('newsList');
let newsDisplay = document.getElementById('newsDisplay');
let loadMoreBtn = document.getElementById('loadMore');

let mockNews = [
    { id: 1, title: "🔥 Гранд-відкриття Archi-Pizza!", time: "18:00", date: "30.04", important: true, text: "Ми офіційно відчинилися! Завітайте на безкоштовну дегустацію нашої фірмової піци на дровах." },
    { id: 2, title: "🍕 Акція 1+1 до кінця тижня", time: "14:20", date: "30.04", important: true, text: "Замовляйте будь-яку велику піцу та отримуйте другу у подарунок! Акція діє до 4 травня." },
    { id: 3, title: "🧀 Нова піца 'Архітектор'", time: "12:05", date: "30.04", important: false, text: "Поєднання 5 видів сиру та секретного соусу. Вже доступна для замовлення." },
    { id: 4, title: "⚡ Швидка доставка за 30 хвилин", time: "10:40", date: "30.04", important: false, text: "Наші кур'єри вже на дорогах. Якщо не встигнемо за 30 хв — піца за наш рахунок!" }
];

let olderNews = [
    { id: 5, title: "🌾 Секрети нашого тіста", time: "17:30", date: "29.04", important: false, text: "Ми використовуємо італійське борошно сорту 00. Тісто ферментується 48 годин." },
    { id: 6, title: "📸 Конкурс в Instagram", time: "09:15", date: "28.04", important: false, text: "Переможці вже отримали свої сертифікати. Шукайте себе на фото!" }
];

let freshNewsData = null;


function renderNews(newsArray, append = false) {
    if (!newsList) return;
    let html = newsArray.map(item => `
        <article class="news-item ${item.important ? 'important' : ''}" data-id="${item.id}">
            <div class="meta">${item.time}, ${item.date}</div>
            <div class="title">${item.title}</div>
            <div class="news-content-mobile">${item.text}</div>
        </article>
    `).join('');

    if (append) newsList.insertAdjacentHTML('beforeend', html);
    else newsList.innerHTML = html;
}

if (newsList) {
    newsList.addEventListener('click', (e) => {
        let card = e.target.closest('.news-item');
        if (!card) return;

        let newsId = parseInt(card.dataset.id);
        
        let allPossibleNews = [...mockNews, ...olderNews];
        if (freshNewsData) allPossibleNews.push(freshNewsData); 

        let newsData = allPossibleNews.find(n => n.id === newsId);

        if (newsData && newsDisplay) {
            newsDisplay.innerHTML = `
                <h2 style="color: #e63946;">${newsData.title}</h2>
                <p><small>${newsData.date} о ${newsData.time}</small></p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 1.1rem; line-height: 1.6;">${newsData.text}</p>
            `;
            
            if (window.innerWidth <= 768) {
                card.scrollIntoView({ behavior: 'smooth' });
            }
        }

        document.querySelectorAll('.news-item').forEach(el => el.classList.remove('active'));
        card.classList.add('active');
    });
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        renderNews(olderNews, true);
        loadMoreBtn.style.display = 'none';
    });
}

renderNews(mockNews);




let pizzaData = {
    labels: ['Маргарита', 'Папероні', '4 Сири', 'Архітектор', 'Веганська'],
    orders: [150, 220, 180, 95, 60]
};

let myPizzaChart = null;

function showChart(type) {
    let ctx = document.getElementById('pizzaChart').getContext('2d');
    
    document.querySelectorAll('.btn-chart').forEach(btn => {
        btn.classList.remove('active');
        if(btn.dataset.type === type) btn.classList.add('active');
    });

    if (myPizzaChart) {
        myPizzaChart.destroy();
    }

    let archiPalette = [
        '#e63946', // Червоний
        '#ffb100', // Жовтий
        '#1d1d1d', // Темний
        '#f1faee', // Світлий (для фону)
        '#457b9d'  // Синій акцент
    ];

    myPizzaChart = new Chart(ctx, {
        type: type,
        data: {
            labels: pizzaData.labels,
            datasets: [{
                label: 'Замовлень',
                data: pizzaData.orders,
                backgroundColor: type === 'pie' ? archiPalette : '#ffb100',
                borderColor: '#1d1d1d',
                borderWidth: type === 'line' ? 3 : 1,
                tension: 0.4, 
                fill: type === 'line' ? 'origin' : false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: { size: 14, weight: '600', family: 'sans-serif' },
                        color: '#1a1a1a'
                    }
                }
            },
            scales: type !== 'pie' ? {
                y: {
                    beginAtZero: true, 
                    grid: { color: '#f0f0f0' }
                },
                x: {
                    grid: { display: false }
                }
            } : {}
        }
    });
}

document.addEventListener('DOMContentLoaded', () => showChart('pie'));