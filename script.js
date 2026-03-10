/* ─────────────────────────────────────────────────────────────────────────────
   IMPERIVM EVENTOS — Main Script
   Features: Navbar scroll, hamburger menu, scroll reveal, counter animation,
             gallery lightbox, gallery filter, venue tabs
───────────────────────────────────────────────────────────────────────────── */

(function () {
    'use strict';

    /* ── Navbar scroll effect ─────────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const onScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ── Hamburger / Mobile Menu ──────────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });
    }

    window.closeMobile = function () {
        if (hamburger) hamburger.classList.remove('open');
        if (mobileMenu) mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    };

    /* ── Scroll Reveal (Intersection Observer) ───────────────────────────── */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
        );
        revealElements.forEach((el) => observer.observe(el));
    }

    /* ── Animated Number Counter ─────────────────────────────────────────── */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseInt(el.dataset.count, 10);
                        const suffix = el.dataset.suffix || '';
                        const duration = 2000;
                        const step = Math.ceil(target / (duration / 16));
                        let current = 0;
                        const timer = setInterval(() => {
                            current = Math.min(current + step, target);
                            el.textContent = current.toLocaleString('es') + suffix;
                            if (current >= target) clearInterval(timer);
                        }, 16);
                        counterObserver.unobserve(el);
                    }
                });
            },
            { threshold: 0.5 }
        );
        counters.forEach((c) => counterObserver.observe(c));
    }

    /* ── Gallery Lightbox ─────────────────────────────────────────────────── */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightbox && lightboxImg) {
        // Attach to all gallery items
        document.querySelectorAll('.gallery-item img, .gallery-item').forEach((el) => {
            const container = el.closest('.gallery-item') || el;
            container.style.cursor = 'pointer';
            container.addEventListener('click', () => {
                const img = container.querySelector('img') || el;
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
            setTimeout(() => { lightboxImg.src = ''; }, 300);
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
        });
    }

    /* ── Gallery Filter ───────────────────────────────────────────────────── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item');

    if (filterBtns.length && galleryItems.length) {
        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                filterBtns.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                galleryItems.forEach((item) => {
                    const cat = item.dataset.cat || '';
                    const show = filter === 'all' || cat === filter;
                    item.style.transition = 'opacity 0.4s, transform 0.4s';
                    if (show) {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                        item.style.display = '';
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            if (btn.dataset.filter !== 'all' && item.dataset.cat !== btn.dataset.filter) {
                                item.style.display = 'none';
                            }
                        }, 400);
                    }
                });
            });
        });
    }

    /* ── Venue Tabs ───────────────────────────────────────────────────────── */
    window.openTab = function (event, tabId) {
        document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        const panel = document.getElementById(tabId);
        if (panel) panel.classList.add('active');
        event.currentTarget.classList.add('active');
    };

    /* ── Smooth scroll for anchor links ──────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ── Parallax on page-header ──────────────────────────────────────────── */
    const pageHeaderBgImg = document.querySelector('.page-header-bg img');
    if (pageHeaderBgImg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            pageHeaderBgImg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }, { passive: true });
    }

    /* ── Set minimum date on reservation form ────────────────────────────── */
    const dateInput = document.getElementById('res-fecha');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    /* ── Gold cursor trail (desktop only) ──────────────────────────────────── */
    if (window.matchMedia('(pointer: fine)').matches) {
        const trail = document.createElement('div');
        trail.style.cssText = `
      position:fixed; width:6px; height:6px; border-radius:50%;
      background:var(--gold); pointer-events:none; z-index:99999;
      opacity:0; transform:translate(-50%,-50%);
      transition: opacity 0.3s, transform 0.15s;
    `;
        document.body.appendChild(trail);

        document.addEventListener('mousemove', (e) => {
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.opacity = '0.6';
        });
        document.addEventListener('mouseleave', () => { trail.style.opacity = '0'; });
    }

    /* ── Reservation Form Handler ─────────────────────────────────────────── */
    window.handleSubmit = function (e) {
        if (e) e.preventDefault();
        const form = document.getElementById('reservationForm');
        const success = document.getElementById('successMsg');
        if (form && success) {
            form.style.display = 'none';
            success.style.display = 'block';
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

})();
