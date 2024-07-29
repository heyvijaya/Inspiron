document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const addUrlButton = document.getElementById('addUrlButton');
    const urlGrid = document.getElementById('urlGrid');

    addUrlButton.addEventListener('click', addUrl);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addUrl();
    });

    async function addUrl() {
        const url = urlInput.value.trim();
        if (url) {
            const metadata = await fetchMetadata(url);
            addUrlToGrid(url, metadata.title, metadata.image);
            urlInput.value = '';
        }
    }

    async function fetchMetadata(url) {
        const apiKey = 'd9ec9092ef3d90f0018c3a75a01ff4ed'; // Replace with your actual API key
        const apiUrl = `https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(url)}`;
        
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            return {
                title: data.title || 'No Title',
                image: data.image || 'https://via.placeholder.com/150'
            };
        } catch (error) {
            console.error('Error fetching metadata:', error);
            return { title: 'No Title', image: 'https://via.placeholder.com/150' };
        }
    }

    function addUrlToGrid(url, title, thumbnailUrl) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${thumbnailUrl}" alt="Thumbnail">
            <div class="card-content">
                <div class="card-title">${title}</div>
                <div class="card-url">${url} <i class="fas fa-copy" onclick="copyToClipboard('${url}')"></i></div>
            </div>
            <button class="more-btn"><i class="fas fa-ellipsis-v"></i></button>
            <div class="dropdown">
                <button class="favorite-btn"><i class="fas fa-star"></i> Favorite</button>
                <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;

        const moreBtn = card.querySelector('.more-btn');
        const dropdown = card.querySelector('.dropdown');
        const favoriteBtn = card.querySelector('.favorite-btn');
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');

        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        favoriteBtn.addEventListener('click', () => {
            card.classList.toggle('favorite');
            dropdown.classList.remove('show');
        });

        editBtn.addEventListener('click', () => {
            const newUrl = prompt('Enter new URL:', url);
            if (newUrl && newUrl !== url) {
                fetchMetadata(newUrl).then(metadata => {
                    card.querySelector('img').src = metadata.image;
                    card.querySelector('.card-title').textContent = metadata.title;
                    card.querySelector('.card-url').innerHTML = `${newUrl} <i class="fas fa-copy" onclick="copyToClipboard('${newUrl}')"></i>`;
                });
            }
            dropdown.classList.remove('show');
        });

        deleteBtn.addEventListener('click', () => {
            card.remove();
        });

        urlGrid.appendChild(card);
    }

    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown.show').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    });
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('URL copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}