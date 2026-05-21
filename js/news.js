const newsList = document.getElementById('newsList');
const newsDisplay = document.getElementById('newsDisplay');
const loadMoreBtn = document.getElementById('loadMore');

let allNews = []; 
let currentPage = 1;
const newsPerPage = 4; 

async function fetchNews(page = 1) {
    try {
        const response = await fetch(`https://archi-pizza.onrender.com/news`);
        
        if (!response.ok) {
            throw new Error('Помилка при отриманні новин');
        }

        const data = await response.json();

        const totalCount = response.headers.get('X-Total-Count');

        allNews = [...allNews, ...data];

        renderNews(data, page > 1);

        if (loadMoreBtn) {
            if (allNews.length >= totalCount || data.length < newsPerPage) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        }

    } catch (error) {
        console.error("Не вдалося завантажити новини:", error);
        if (newsList) newsList.innerHTML = '<p style="color: white; padding: 20px;">Не вдалося завантажити стрічку новин.</p>';
    }
}

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

        let newsId = card.dataset.id; 
        
        let newsData = allNews.find(n => n.id == newsId);

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
        currentPage++;
        fetchNews(currentPage);
    });
}

fetchNews(currentPage);