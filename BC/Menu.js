const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');
const searchInput = document.querySelector('.placeholder_text');

let products = [];
let selectedCategory = 'all';

function normalize(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function getProductForCard(card) {
    const title = normalize(card.querySelector('h2')?.textContent ?? '');
    const image = card.querySelector('img')?.getAttribute('src')?.split('/').pop().toLowerCase();

    return products.find(product => normalize(product.item_name) === title)
        ?? products.find(product => product.image?.split('/').pop().toLowerCase() === image);
}

function filterCards() {
    const searchTerm = normalize(searchInput.value);

    cards.forEach(card => {
        const categories = (card.getAttribute('data-category') ?? '').split(',').map(normalize);
        const categoryMatches = selectedCategory === 'all'
            || categories.includes(normalize(selectedCategory));
        const product = getProductForCard(card);
        const tags = (product?.tags ?? [])
            .flatMap(tag => String(tag).split(','))
            .map(normalize);
        const tagMatches = !searchTerm || tags.some(tag => tag.includes(searchTerm));

        card.style.display = categoryMatches && tagMatches ? '' : 'none';
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedCategory = button.getAttribute('data-category') ?? 'all';
        filterButtons.forEach(filterButton => filterButton.classList.remove('active'));
        button.classList.add('active');
        filterCards();
    });
});

searchInput.addEventListener('input', filterCards);

fetch('./menus.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Could not load menus.json: ${response.status}`);
        }
        return response.json();
    })
    .then(menuProducts => {
        products = menuProducts;
        filterCards();
    })
    .catch(error => console.error('Unable to load menu search data.', error));