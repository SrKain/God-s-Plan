// Configuration
const NOTION_TOKEN = 'ntn_v799322124936RT7TDOlQWnRmhMKWb2BOdU1AAu5Fbr7BT';
const NOTION_DATABASE_ID = '2181dc6ee08180d0a2d8ca2fc4a8dd61';

// Global variables
let allCards = [];
let displayedCards = 0;
const CARDS_PER_PAGE = 5;
let totalValue = 0;

// DOM Elements
const cardsContainer = document.getElementById('cardsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const totalAmount = document.getElementById('totalAmount');
const backgroundOverlay = document.getElementById('backgroundOverlay');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupTouchEffect();
});

// Initialize the application
async function initializeApp() {
    try {
        await fetchNotionData();
        displayCards();
        updateTotalValue();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Erro ao carregar dados. Verifique a configuração da API do Notion.');
    }
}

// Fetch data from Notion API via Flask proxy
async function fetchNotionData() {
    try {
        const response = await fetch('/api/notion/database');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
            allCards = result.data;
        } else {
            throw new Error(result.message || 'Failed to fetch data');
        }

    } catch (error) {
        console.error('Error fetching Notion data:', error);
        throw error;
    }
}

// Helper function to extract property values from Notion API response
function getPropertyValue(property) {
    if (!property) return '';
    
    switch (property.type) {
        case 'title':
            return property.title.map(t => t.plain_text).join('');
        case 'rich_text':
            return property.rich_text.map(t => t.plain_text).join('');
        case 'date':
            return property.date ? property.date.start : '';
        case 'number':
            return property.number || 0;
        case 'select':
            return property.select ? property.select.name : '';
        case 'multi_select':
            return property.multi_select.map(s => s.name).join(', ');
        default:
            return '';
    }
}

// Display cards on the page
function displayCards() {
    loadingIndicator.style.display = 'none';
    
    const cardsToShow = allCards.slice(displayedCards, displayedCards + CARDS_PER_PAGE);
    
    cardsToShow.forEach(card => {
        const cardElement = createCardElement(card);
        cardsContainer.appendChild(cardElement);
    });
    
    displayedCards += cardsToShow.length;
    
    // Show/hide load more button
    if (displayedCards < allCards.length) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// Create a card element
function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'product-card';
    cardDiv.innerHTML = `
        <div class="card-header">
            <div class="creator-name">${card.creator}</div>
            <div class="card-value">R$ ${formatCurrency(card.value)}</div>
        </div>
        <div class="card-description">${card.description}</div>
        <div class="card-footer">
            <div class="card-date">${formatDate(card.date)}</div>
            <a href="${card.notionUrl}" target="_blank" class="view-app-btn">Veja no App</a>
        </div>
    `;
    return cardDiv;
}

// Format currency value
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Update total value display
function updateTotalValue() {
    totalValue = allCards.reduce((sum, card) => sum + card.value, 0);
    totalAmount.textContent = `R$ ${formatCurrency(totalValue)}`;
}

// Load more cards
loadMoreBtn.addEventListener('click', function() {
    displayCards();
});

// Show error message
function showError(message) {
    loadingIndicator.innerHTML = `
        <div style="color: #ff6b6b; text-align: center;">
            <p>${message}</p>
        </div>
    `;
}

// Setup touch effect for background
function setupTouchEffect() {
    let isTouch = false;
    
    // Mouse events
    document.addEventListener('mousemove', handlePointerMove);
    
    // Touch events
    document.addEventListener('touchstart', function(e) {
        isTouch = true;
        handlePointerMove(e.touches[0]);
    });
    
    document.addEventListener('touchmove', function(e) {
        if (isTouch) {
            e.preventDefault();
            handlePointerMove(e.touches[0]);
        }
    });
    
    document.addEventListener('touchend', function() {
        isTouch = false;
        resetBackgroundEffect();
    });
    
    // Mouse leave event
    document.addEventListener('mouseleave', resetBackgroundEffect);
}

// Handle pointer movement for background effect
function handlePointerMove(pointer) {
    const x = pointer.clientX;
    const y = pointer.clientY;
    
    const xPercent = (x / window.innerWidth) * 100;
    const yPercent = (y / window.innerHeight) * 100;
    
    backgroundOverlay.style.background = `radial-gradient(circle 200px at ${xPercent}% ${yPercent}%, transparent 0%, rgba(0, 0, 0, 0.7) 100%)`;
}

// Reset background effect
function resetBackgroundEffect() {
    backgroundOverlay.style.background = 'radial-gradient(circle 150px at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.8) 100%)';
}

// Function to update Notion configuration (to be called when user provides database ID)
function updateNotionConfig(databaseId) {
    NOTION_DATABASE_ID = databaseId;
    // Reset the app
    allCards = [];
    displayedCards = 0;
    cardsContainer.innerHTML = '<div class="loading" id="loadingIndicator"><div class="loading-spinner"></div><p>Carregando...</p></div>';
    loadMoreBtn.style.display = 'none';
    
    // Reinitialize
    initializeApp();
}

// Export function for external use
window.updateNotionConfig = updateNotionConfig;

