document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const addUrlButton = document.getElementById('addUrlButton');
    const urlList = document.getElementById('urlList');

    addUrlButton.addEventListener('click', addUrl);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addUrl();
    });

    async function addUrl() {
        const url = urlInput.value.trim();
        if (url) {
            const metadata = await fetchMetadata(url);
            addUrlToList(url, metadata.title, metadata.image);
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
                image: data.image || 'https://via.placeholder.com/100'
            };
        } catch (error) {
            console.error('Error fetching metadata:', error);
            return { title: 'No Title', image: 'https://via.placeholder.com/100' };
        }
    }

    function addUrlToList(url, title, thumbnailUrl) {
        const listItem = document.createElement('li');
        listItem.className = 'thumbnail-item';
        listItem.innerHTML = `
            <img src="${thumbnailUrl}" alt="Thumbnail" class="thumbnail">
            <div class="thumbnail-content">
                <div class="thumbnail-title">${title}</div>
                <div class="thumbnail-url">${url}</div>
            </div>
            <button class="more-btn"><i class="fas fa-ellipsis-v"></i></button>
            <div class="dropdown">
                <button class="favorite-btn"><i class="fas fa-star"></i> Favorite</button>
                <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;

        const moreBtn = listItem.querySelector('.more-btn');
        const dropdown = listItem.querySelector('.dropdown');
        const favoriteBtn = listItem.querySelector('.favorite-btn');
        const editBtn = listItem.querySelector('.edit-btn');
        const deleteBtn = listItem.querySelector('.delete-btn');

        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        favoriteBtn.addEventListener('click', () => {
            listItem.classList.toggle('favorite');
            dropdown.classList.remove('show');
        });

        editBtn.addEventListener('click', () => {
            const newUrl = prompt('Enter new URL:', url);
            if (newUrl && newUrl !== url) {
                fetchMetadata(newUrl).then(metadata => {
                    listItem.querySelector('.thumbnail').src = metadata.image;
                    listItem.querySelector('.thumbnail-title').textContent = metadata.title;
                    listItem.querySelector('.thumbnail-url').textContent = newUrl;
                });
            }
            dropdown.classList.remove('show');
        });

        deleteBtn.addEventListener('click', () => {
            listItem.remove();
        });

        urlList.appendChild(listItem);
    }

    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown.show').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    });
});