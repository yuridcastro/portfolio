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
    const posterButtons = document.querySelectorAll('.poster-button');

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        modalImage.src = '';
        modalImage.alt = '';
    }

    posterButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!modal || !modalImage) return;
            const src = button.dataset.poster;
            const img = button.querySelector('img');
            modalImage.src = src || '';
            modalImage.alt = img ? img.alt : 'Pôster';
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    if (modal) {
        modal.addEventListener('click', (event) => {
            const target = event.target;
            if (target && target.dataset && target.dataset.close) {
                closeModal();
            }
        });
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
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});
