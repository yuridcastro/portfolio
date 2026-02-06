document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isExpanded));
            mainNav.classList.toggle('active');
        });
    }

    const modal = document.getElementById('posterModal');
    const modalImage = document.getElementById('posterModalImage');
    const modalCounter = document.getElementById('posterModalCounter');
    const posterButtons = Array.from(document.querySelectorAll('.poster-button'));
    const prevButton = document.querySelector('.poster-modal-prev');
    const nextButton = document.querySelector('.poster-modal-next');
    
    let currentPosterIndex = 0;

    function updateModalImage(index) {
        if (!posterButtons[index]) return;
        
        const button = posterButtons[index];
        const src = button.dataset.poster;
        const img = button.querySelector('img');
        
        modalImage.src = src || '';
        modalImage.alt = img ? img.alt : 'Pôster';
        currentPosterIndex = index;
        
        // Update counter
        if (modalCounter) {
            modalCounter.textContent = `${index + 1} / ${posterButtons.length}`;
        }
    }

    function showPrevPoster() {
        const newIndex = currentPosterIndex > 0 
            ? currentPosterIndex - 1 
            : posterButtons.length - 1;
        updateModalImage(newIndex);
    }

    function showNextPoster() {
        const newIndex = currentPosterIndex < posterButtons.length - 1 
            ? currentPosterIndex + 1 
            : 0;
        updateModalImage(newIndex);
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        modalImage.src = '';
        modalImage.alt = '';
    }

    posterButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (!modal || !modalImage) return;
            updateModalImage(index);
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    if (prevButton) {
        prevButton.addEventListener('click', showPrevPoster);
    }

    if (nextButton) {
        nextButton.addEventListener('click', showNextPoster);
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            const target = event.target;
            if (target && target.dataset && target.dataset.close) {
                closeModal();
            }
        });
    }

    // === Posters Carousel with Scroll Lock ===
    const postersSection = document.querySelector('.posters-section');
    const carousel = document.getElementById('postersCarousel');
    const track = document.getElementById('postersTrack');
    const counterCurrent = document.getElementById('counterCurrent');
    const counterTotal = document.getElementById('counterTotal');
    const progressBar = document.getElementById('progressBar');
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');
    
    if (carousel && track && postersSection) {
        const totalItems = track.children.length;
        const GAP = 24;
        
        if (counterTotal) {
            counterTotal.textContent = String(totalItems).padStart(2, '0');
        }
        
        function getItemsPerPage() {
            const width = window.innerWidth;
            if (width <= 500) return 1;
            if (width <= 800) return 2;
            if (width <= 1100) return 3;
            return 4;
        }
        
        function getTotalPages() {
            return Math.ceil(totalItems / getItemsPerPage());
        }
        
        function updateCarouselByProgress(progress) {
            const itemsPerPage = getItemsPerPage();
            const totalPages = getTotalPages();
            const carouselWidth = carousel.offsetWidth;
            const cardWidth = (carouselWidth - (GAP * (itemsPerPage - 1))) / itemsPerPage;
            const totalTrackWidth = (cardWidth + GAP) * totalItems - GAP;
            const maxOffset = totalTrackWidth - carouselWidth;
            
            // Calculate offset based on progress (0 to 1)
            const offset = Math.max(0, Math.min(maxOffset, progress * maxOffset));
            track.style.transform = `translateX(-${offset}px)`;
            
            // Calculate current page for counter
            const currentPage = Math.min(Math.floor(progress * totalPages), totalPages - 1);
            const firstVisibleItem = (currentPage * itemsPerPage) + 1;
            
            if (counterCurrent) {
                counterCurrent.textContent = String(Math.min(firstVisibleItem, totalItems)).padStart(2, '0');
            }
            
            if (progressBar) {
                progressBar.style.width = `${Math.min(progress * 100, 100)}%`;
            }
            
            // Update button states
            if (carouselPrev) {
                carouselPrev.style.opacity = progress <= 0.01 ? '0.3' : '1';
                carouselPrev.style.pointerEvents = progress <= 0.01 ? 'none' : 'auto';
            }
            if (carouselNext) {
                carouselNext.style.opacity = progress >= 0.99 ? '0.3' : '1';
                carouselNext.style.pointerEvents = progress >= 0.99 ? 'none' : 'auto';
            }
        }
        
        // Scroll-based carousel control
        function handleScroll() {
            const rect = postersSection.getBoundingClientRect();
            const sectionHeight = postersSection.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // Calculate the scroll range for the section
            const scrollStart = rect.top + window.scrollY;
            const scrollRange = sectionHeight - viewportHeight;
            
            // Calculate progress (0 to 1) through the section
            const scrolled = window.scrollY - scrollStart;
            const progress = Math.max(0, Math.min(1, scrolled / scrollRange));
            
            updateCarouselByProgress(progress);
        }
        
        // Button controls for manual navigation
        function navigateByButton(direction) {
            const totalPages = getTotalPages();
            const rect = postersSection.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionHeight = postersSection.offsetHeight;
            const viewportHeight = window.innerHeight;
            const scrollRange = sectionHeight - viewportHeight;
            
            // Calculate current progress
            const currentScroll = window.scrollY - sectionTop;
            const currentProgress = Math.max(0, Math.min(1, currentScroll / scrollRange));
            const currentPage = Math.round(currentProgress * (totalPages - 1));
            
            // Calculate new page
            const newPage = direction === 'next' 
                ? Math.min(currentPage + 1, totalPages - 1)
                : Math.max(currentPage - 1, 0);
            
            // Calculate new scroll position
            const newProgress = newPage / (totalPages - 1);
            const newScrollY = sectionTop + (newProgress * scrollRange);
            
            window.scrollTo({
                top: newScrollY,
                behavior: 'smooth'
            });
        }
        
        if (carouselPrev) {
            carouselPrev.addEventListener('click', () => navigateByButton('prev'));
        }
        if (carouselNext) {
            carouselNext.addEventListener('click', () => navigateByButton('next'));
        }
        
        // Listen to scroll
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        
        // Initial update
        handleScroll();
    }
    
    const scrollGalleries = Array.from(document.querySelectorAll('[data-scroll-gallery]')).map(gallery => {
        return {
            gallery,
            track: gallery.querySelector('[data-scroll-track]'),
            frame: gallery.querySelector('.scroll-frame'),
            currentX: 0,
            targetX: 0
        };
    });

    function updateScrollTargets() {
        scrollGalleries.forEach(item => {
            const { gallery, track, frame } = item;
            if (!track || !frame) return;

            const rect = gallery.getBoundingClientRect();
            const galleryTop = rect.top + window.scrollY;
            const galleryHeight = gallery.offsetHeight;
            const start = galleryTop;
            const end = galleryTop + galleryHeight - window.innerHeight;
            const maxShift = Math.max(0, track.scrollWidth - frame.clientWidth);

            if (end <= start || maxShift === 0) {
                item.targetX = 0;
                return;
            }

            const progress = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
            item.targetX = -progress * maxShift;
        });
    }

    function animateScrollGalleries() {
        scrollGalleries.forEach(item => {
            if (!item.track) return;
            item.currentX += (item.targetX - item.currentX) * 0.08;
            item.track.style.transform = `translateX(${item.currentX}px)`;
        });
        window.requestAnimationFrame(animateScrollGalleries);
    }

    if (scrollGalleries.length > 0) {
        const onScroll = () => {
            updateScrollTargets();
        };
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onScroll);
        updateScrollTargets();
        window.requestAnimationFrame(animateScrollGalleries);
    }


    document.addEventListener('keydown', (event) => {
        if (!modal || !modal.classList.contains('open')) return;
        
        switch (event.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                showPrevPoster();
                break;
            case 'ArrowRight':
                showNextPoster();
                break;
        }
    });
});
