// Image Modal - Lightbox / Pop-up
let imageModal = null;
let currentZoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

function initImageModal() {
    // Créer le modal HTML
    imageModal = document.createElement('div');
    imageModal.id = 'imageModal';
    imageModal.className = 'image-modal';
    imageModal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <img id="modalImage" draggable="false" src="" alt="">
            <div class="modal-zoom-controls">
                <button id="resetZoom" class="zoom-btn">Reset</button>
            </div>
        </div>
    `;
    document.body.appendChild(imageModal);

    // Variables pour le zoom
    const minZoom = 1;
    const maxZoom = 5;
    const zoomStep = 0.2;

    // Fonction pour ouvrir le modal
    window.openImageZoom = function(src, alt) {
        const modalImg = document.getElementById('modalImage');
        modalImg.src = src;
        modalImg.alt = alt || '';
        imageModal.classList.add('active');
        currentZoom = 1;
        offsetX = 0;
        offsetY = 0;
        modalImg.style.transform = 'scale(1) translate(0, 0)';
        document.body.style.overflow = 'hidden';
    };

    // Fonction pour fermer le modal
    function closeImageModal() {
        imageModal.classList.remove('active');
        currentZoom = 1;
        offsetX = 0;
        offsetY = 0;
        document.body.style.overflow = 'auto';
    }

    // Fonction pour mettre à jour la transformation
    function updateImageTransform() {
        const modalImg = document.getElementById('modalImage');
        modalImg.style.transform = `scale(${currentZoom}) translate(${offsetX}px, ${offsetY}px)`;
    }

    // Fonction pour zoomer
    function zoomImage(direction) {
        if (direction === 'in') {
            currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
        } else if (direction === 'out') {
            currentZoom = Math.max(currentZoom - zoomStep, minZoom);
        }
        updateImageTransform();
    }

    // Événements des boutons
    document.getElementById('resetZoom').addEventListener('click', () => {
        currentZoom = 1;
        offsetX = 0;
        offsetY = 0;
        updateImageTransform();
    });

    // Fermer en cliquant sur la croix
    document.querySelector('.modal-close').addEventListener('click', closeImageModal);

    // Fermer en cliquant en dehors de l'image
    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            closeImageModal();
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            closeImageModal();
        }
    });

    // Support du zoom à la molette
    imageModal.addEventListener('wheel', function(e) {
        if (imageModal.classList.contains('active')) {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomImage('in');
            } else {
                zoomImage('out');
            }
        }
    }, { passive: false });

    // Support du déplacement de l'image avec la souris
    const modalImg = document.getElementById('modalImage');

    modalImg.addEventListener('mousedown', function(e) {
        if (imageModal.classList.contains('active') && currentZoom > 1) {
            isDragging = true;
            dragStartX = e.clientX - offsetX;
            dragStartY = e.clientY - offsetY;
            modalImg.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            offsetX = e.clientX - dragStartX;
            offsetY = e.clientY - dragStartY;
            updateImageTransform();
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        modalImg.style.cursor = 'grab';
    });

    // Support du déplacement tactile (touch)
    let touchStartX = 0;
    let touchStartY = 0;

    modalImg.addEventListener('touchstart', function(e) {
        if (imageModal.classList.contains('active') && currentZoom > 1) {
            isDragging = true;
            touchStartX = e.touches[0].clientX - offsetX;
            touchStartY = e.touches[0].clientY - offsetY;
        }
    });

    document.addEventListener('touchmove', function(e) {
        if (isDragging && currentZoom > 1) {
            offsetX = e.touches[0].clientX - touchStartX;
            offsetY = e.touches[0].clientY - touchStartY;
            updateImageTransform();
        }
    }, { passive: false });

    document.addEventListener('touchend', function() {
        isDragging = false;
    });
}

// Initialiser le modal au chargement du DOM
document.addEventListener('DOMContentLoaded', initImageModal);
