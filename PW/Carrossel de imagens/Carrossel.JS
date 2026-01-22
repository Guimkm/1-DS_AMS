// Dados das imagens do carrossel
const carouselImages = [
    {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        title: "Montanhas e Lago",
        description: "Paisagem serena de montanhas refletidas em um lago calmo durante o pôr do sol."
    },
    {
        url: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
        title: "Aurora Boreal",
        description: "Esplêndida exibição de luzes da aurora boreal em um céu noturno estrelado."
    },
    {
        url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
        title: "Praia Tropical",
        description: "Águas cristalinas e areia branca em uma praia tropical paradisíaca."
    },
    {
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        title: "Floresta Verdejante",
        description: "Caminho misterioso através de uma densa floresta cheia de vida e vegetação."
    },
    {
        url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
        title: "Campo de Flores",
        description: "Vasto campo colorido com flores silvestres sob um céu azul com nuvens."
    },
    {
        url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1",
        title: "Oceano e Falésias",
        description: "Poderosas ondas do oceano batendo contra falésias rochosas."
    }
];

// Elementos DOM
const carousel = document.querySelector('.carousel');
const indicatorsContainer = document.querySelector('.carousel-indicators');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const toggleAutoBtn = document.getElementById('toggleAuto');
const speedControl = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const prevCarouselBtn = document.querySelector('.carousel-btn.prev');
const nextCarouselBtn = document.querySelector('.carousel-btn.next');

// Variáveis de estado
let currentIndex = 0;
let autoPlayInterval;
let autoPlaySpeed = 5000; // 5 segundos
let isAutoPlay = true;

// Inicializar o carrossel
function initCarousel() {
    // Limpar conteúdo existente
    carousel.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    // Adicionar imagens ao carrossel
    carouselImages.forEach((image, index) => {
        // Criar item do carrossel
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        if (index === 0) carouselItem.classList.add('active');
        
        carouselItem.innerHTML = `
            <img src="${image.url}" alt="${image.title}" loading="lazy">
            <div class="image-info">
                <h3>${image.title}</h3>
                <p>${image.description}</p>
            </div>
        `;
        
        carousel.appendChild(carouselItem);
        
        // Criar indicador
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.dataset.index = index;
        
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
        
        indicatorsContainer.appendChild(indicator);
    });
    
    // Atualizar exibição
    updateCarousel();
    
    // Iniciar autoplay
    startAutoPlay();
    
    // Atualizar valor da velocidade
    updateSpeedValue();
}

// Atualizar a posição do carrossel
function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Atualizar indicadores ativos
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        if (index === currentIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Ir para um slide específico
function goToSlide(index) {
    currentIndex = index;
    if (currentIndex < 0) currentIndex = carouselImages.length - 1;
    if (currentIndex >= carouselImages.length) currentIndex = 0;
    
    updateCarousel();
    resetAutoPlay();
}

// Slide anterior
function prevSlide() {
    goToSlide(currentIndex - 1);
}

// Próximo slide
function nextSlide() {
    goToSlide(currentIndex + 1);
}

// Iniciar reprodução automática
function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    
    autoPlayInterval = setInterval(() => {
        if (isAutoPlay) {
            nextSlide();
        }
    }, autoPlaySpeed);
}

// Reiniciar autoplay (após interação manual)
function resetAutoPlay() {
    if (isAutoPlay) {
        startAutoPlay();
    }
}

// Alternar autoplay
function toggleAutoPlay() {
    isAutoPlay = !isAutoPlay;
    
    if (isAutoPlay) {
        toggleAutoBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar Auto';
        startAutoPlay();
    } else {
        toggleAutoBtn.innerHTML = '<i class="fas fa-play"></i> Iniciar Auto';
        clearInterval(autoPlayInterval);
    }
}

// Atualizar velocidade do autoplay
function updateSpeed() {
    // Converter valor de 1-10 para 8.000-2.000ms
    autoPlaySpeed = 10000 - (speedControl.value * 800);
    updateSpeedValue();
    
    if (isAutoPlay) {
        startAutoPlay();
    }
}

// Atualizar exibição do valor de velocidade
function updateSpeedValue() {
    const seconds = autoPlaySpeed / 1000;
    speedValue.textContent = `${seconds.toFixed(1)}s`;
}

// Configurar event listeners
function setupEventListeners() {
    // Botões de navegação
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    prevCarouselBtn.addEventListener('click', prevSlide);
    nextCarouselBtn.addEventListener('click', nextSlide);
    
    // Botão de autoplay
    toggleAutoBtn.addEventListener('click', toggleAutoPlay);
    
    // Controle de velocidade
    speedControl.addEventListener('input', updateSpeed);
    
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === ' ') {
            e.preventDefault();
            toggleAutoPlay();
        }
    });
    
    // Pausar autoplay ao passar o mouse sobre o carrossel
    carousel.addEventListener('mouseenter', () => {
        if (isAutoPlay) {
            clearInterval(autoPlayInterval);
        }
    });
    
    // Retomar autoplay ao remover o mouse do carrossel
    carousel.addEventListener('mouseleave', () => {
        if (isAutoPlay) {
            startAutoPlay();
        }
    });
    
    // Suporte a toque em dispositivos móveis
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const threshold = 50; // Sensibilidade do swipe
        
        if (startX - endX > threshold) {
            // Swipe para a esquerda = próxima imagem
            nextSlide();
        } else if (endX - startX > threshold) {
            // Swipe para a direita = imagem anterior
            prevSlide();
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    setupEventListeners();
});