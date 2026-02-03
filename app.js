document.addEventListener('DOMContentLoaded', () => {
    const sliders = ['.projects-top', '.projects-bottom'];
    
    sliders.forEach(selector => {
        const container = document.querySelector(selector);
        if (container) {
            // Calculate the center position
            const scrollCenter = (container.scrollWidth - container.clientWidth) / 2;
            // Scroll to the center
            container.scrollLeft = scrollCenter;
        }
    });

    // FAQ Accordion
    const faqContainers = document.querySelectorAll('.open-faq, .closed-faq');
    
    faqContainers.forEach(container => {
        container.addEventListener('click', () => {
            const isOpen = container.classList.contains('open-faq');
            
            // Close all items
            faqContainers.forEach(item => {
                item.classList.remove('open-faq');
                item.classList.add('closed-faq');
            });
            
            // If the clicked item was closed, open it
            if (!isOpen) {
                container.classList.remove('closed-faq');
                container.classList.add('open-faq');
            }
        });
    });

    // Mobile Menu Toggle with Screen Size Check
    const burgerInput = document.getElementById('burger');
    const navLinks = document.querySelector('.nav-links');
    // Specifically target the primary button inside the header
    const headerBtn = document.querySelector('header .Primary-btn');

    if (burgerInput) {
        const toggleMenu = () => {
            // Only hide the button if screen width is 425px or less
            const isMobile = window.innerWidth <= 425;
            
            if (burgerInput.checked) {
                if (navLinks) navLinks.classList.add('active');
                // Only hide header button on mobile screens
                if (headerBtn && isMobile) {
                    headerBtn.style.setProperty('display', 'none', 'important');
                }
                document.body.style.overflow = 'hidden';
            } else {
                if (navLinks) navLinks.classList.remove('active');
                // Restore header button visibility on mobile screens by removing inline 'display' so CSS controls it
                if (headerBtn && isMobile) {
                    headerBtn.style.removeProperty('display');
                }
                document.body.style.overflow = '';
            }
        };

        burgerInput.addEventListener('change', toggleMenu);

        // Close menu when clicking a link
        if (navLinks) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    burgerInput.checked = false;
                    toggleMenu();
                });
            });
        }
    }

    // Simple reveal animations: add base class and observe sections
    const revealSelectors = [
        // hero intentionally excluded per user request
        '.projects-preview',
        '.testimonials',
        '.Capabilities',
        '.portfolio',
        '.digital-products',
        '.how-we-work',
        '.our-founder',
        '.faq-section',
        '.final-cta',
        '.footer'
    ];

    revealSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            // add namespaced animation marker only; avoid touching UI styles
            el.classList.add('tz-animate');
            // default fade-in for sections (hero/header/rotated cards excluded elsewhere)
            el.classList.add('tz-anim-fade-up');
        });
    });

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('tz-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.tz-animate').forEach(el => revealObserver.observe(el));

    // Ensure header and rotated cards are never treated as animated targets
    // (remove any tz-related classes and unobserve if present)
    try {
        document.querySelectorAll('header, .rotated-card-left, .rotated-card-right').forEach(el => {
            el.classList.remove('tz-animate','tz-visible','tz-anim-fade-up','tz-anim-hero-zoom','tz-anim-slide-down','tz-anim-scale','tz-delay-0','tz-delay-1','tz-delay-2','tz-delay-3');
            try { revealObserver.unobserve(el); } catch(e) { /* ignore */ }
        });
    } catch (e) { /* noop */ }

    // hero is excluded from animations per user request

    // Also reveal any tz-animate children already in view (use computed animation-delay)
    document.querySelectorAll('.tz-animate').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const cs = window.getComputedStyle(el);
            let delay = 0;
            try {
                const d = cs.animationDelay || cs.getPropertyValue('animation-delay');
                if (d && d.indexOf('ms') > -1) delay = parseFloat(d);
                else if (d && d.indexOf('s') > -1) delay = parseFloat(d) * 1000;
            } catch (e) { delay = 0; }
            setTimeout(() => el.classList.add('tz-visible'), Math.max(0, delay));
        }
    });

    // Non-invasive per-element reveals inside sections with small staggers
    const revealChildrenMap = [
        { parent: '.Hero-Section', children: ['.expertise', '.head-para', '.hero-btn', '.hero-cards', '.video-area'], anim: 'tz-anim-hero-zoom' },
        { parent: '.projects-preview', children: ['.project-preview', '.logos img'], anim: 'tz-anim-fade-up' },
        { parent: '.testimonials', children: ['.content-top', '.bottom-testimonials', '.testimonials-reviews .testimonial-1'], anim: 'tz-anim-fade-up' },
        { parent: '.Capabilities', children: ['.our-capabilities-heading', '.all-services > div'], anim: 'tz-anim-fade-up' },
        { parent: '.portfolio', children: ['.our-portfolio-heading', '.projects-top .project-1', '.projects-bottom .project-1'], anim: 'tz-anim-fade-up' },
        { parent: '.digital-products', children: ['.header-digital', '.products-logos > div'], anim: 'tz-anim-fade-up' },
        { parent: '.how-we-work', children: ['.how-we-work-heading', '.all-steps .step-1'], anim: 'tz-anim-fade-up' },
        { parent: '.our-founder', children: ['.header-founder', '.name-info-founders > div'], anim: 'tz-anim-fade-up' },
        { parent: '.faq-section', children: ['.header-faq', '.faq-left > div', '.faq-right'], anim: 'tz-anim-fade-up' },
        { parent: '.final-cta', children: ['.header-cta'], anim: 'tz-anim-fade-up' },
        { parent: '.footer', children: ['.left-right-side-footer', '.footer-bottom-side'], anim: 'tz-anim-fade-up' }
    ];

    revealChildrenMap.forEach(entry => {
        const parentEls = document.querySelectorAll(entry.parent);
        parentEls.forEach(parent => {
            entry.children.forEach((sel, idx) => {
                try {
                    parent.querySelectorAll(sel).forEach(child => {
                        child.classList.add('tz-animate');
                        if (entry.anim) child.classList.add(entry.anim);
                        // apply stagger using delay classes where available
                        const delayClass = ['tz-delay-0','tz-delay-1','tz-delay-2','tz-delay-3'][Math.min(idx,3)];
                        if (delayClass) child.classList.add(delayClass);
                        // ensure observer watches newly added tz-animate children
                        revealObserver.observe(child);
                    });
                } catch (e) {
                    // silently ignore selector errors
                }
            });
        });
    });

    // Fallback: if nothing revealed shortly after load, stage a gentle reveal
    setTimeout(() => {
        const animated = Array.from(document.querySelectorAll('.tz-animate'));
        const anyVisible = animated.some(el => el.classList.contains('tz-visible'));
        if (!anyVisible && animated.length) {
            animated.forEach((el, idx) => {
                // never touch header (defensive)
                if (el.closest('header')) return;
                setTimeout(() => el.classList.add('tz-visible'), Math.min(600, idx * 120));
            });
        }
    }, 320);

    // Immediate staged reveal: force-add tz-visible to tz-animate elements on load
    // Skip if user prefers reduced motion
    try {
        const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduced) {
            const animatedNow = Array.from(document.querySelectorAll('.tz-animate'))
                .filter(el => !el.classList.contains('tz-visible') && !el.closest('header'));
            animatedNow.forEach((el, idx) => {
                setTimeout(() => el.classList.add('tz-visible'), 80 + idx * 100);
            });
        }
    } catch (e) {
        // noop
    }

    // Counting animation for rotated cards (animates h3 numbers)
    const countEls = document.querySelectorAll('.rotated-card-left h3, .rotated-card-right h3');
    if (countEls.length) {
        const countObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const raw = el.textContent.trim();
                    const suffix = /\+$/.test(raw) ? '+' : '';
                    const end = parseInt(raw.replace(/\D/g, ''), 10) || 0;
                    el.textContent = '0' + suffix;
                    animateCount(el, end, 1200, suffix);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        countEls.forEach(el => countObserver.observe(el));
    }

    

    function animateCount(el, endValue, duration = 1000, suffix = '') {
        const start = 0;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(progress * (endValue - start) + start);
            el.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = endValue + suffix;
                // small scale pop - use namespaced tz utility
                el.classList.add('tz-anim-scale');
                setTimeout(() => el.classList.remove('tz-anim-scale'), 600);
            }
        }

        requestAnimationFrame(tick);
    }
});

