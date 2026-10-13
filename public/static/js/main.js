/**
 * THE HOUSE OF WEAR - Main JavaScript
 * BCA Semester 6 Project - Premium Luxury E-Commerce
 */

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.luxury-navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            navbar.style.padding = '15px 0';
        }
    });

    // ============================================
    // FLASH MESSAGES AUTO DISMISS
    // ============================================
    const flashMessages = document.querySelectorAll('.flash-messages .alert');

    flashMessages.forEach(function (alert) {
        setTimeout(function () {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // ============================================
    // PRODUCT IMAGE ZOOM
    // ============================================
    const mainProductImage = document.getElementById('mainProductImage');

    if (mainProductImage) {
        mainProductImage.addEventListener('mousemove', function (e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = (e.clientX - left) / width * 100;
            const y = (e.clientY - top) / height * 100;

            this.style.transformOrigin = `${x}% ${y}%`;
            this.style.transform = 'scale(1.5)';
        });

        mainProductImage.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    }

    // ============================================
    // QUANTITY INPUT VALIDATION
    // ============================================
    const quantityInputs = document.querySelectorAll('.quantity-input');

    quantityInputs.forEach(function (input) {
        input.addEventListener('change', function () {
            const min = parseInt(this.min) || 1;
            const max = parseInt(this.max) || 99;
            let value = parseInt(this.value) || min;

            if (value < min) value = min;
            if (value > max) value = max;

            this.value = value;
        });
    });

    // ============================================
    // ADD TO CART ANIMATION
    // ============================================
    const addToCartForms = document.querySelectorAll('form[action*="add-to-cart"]');

    addToCartForms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            const button = this.querySelector('button[type="submit"]');
            if (button && !button.disabled) {
                button.innerHTML = '<i class="bi bi-check"></i>';
                button.classList.add('added');

                setTimeout(function () {
                    button.innerHTML = '<i class="bi bi-bag-plus"></i>';
                    button.classList.remove('added');
                }, 1500);
            }
        });
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // SEARCH MODAL FOCUS
    // ============================================
    const searchModal = document.getElementById('searchModal');

    if (searchModal) {
        searchModal.addEventListener('shown.bs.modal', function () {
            const searchInput = this.querySelector('input[name="q"]');
            if (searchInput) {
                searchInput.focus();
            }
        });
    }

    // ============================================
    // PRODUCT CARD HOVER EFFECT
    // ============================================
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function () {
            this.style.zIndex = '1';
        });
    });

    // ============================================
    // FORM VALIDATION
    // ============================================
    const forms = document.querySelectorAll('form');

    forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(function (field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    });

    // ============================================
    // PASSWORD TOGGLE
    // ============================================
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    togglePasswordButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const input = this.closest('.input-group').querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    });

    // ============================================
    // NEWSLETTER FORM
    // ============================================
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            if (email) {
                alert('Thank you for subscribing! You will receive our latest updates.');
                this.reset();
            }
        });
    }

    // ============================================
    // LAZY LOADING IMAGES
    // ============================================
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(function (img) {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // ANIMATION ON SCROLL
    // ============================================
    const animateElements = document.querySelectorAll('.product-card, .feature-card, .category-card');

    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        animateElements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            animationObserver.observe(el);
        });
    }

    // ============================================
    // INITIALIZE TOOLTIPS
    // ============================================
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // ============================================
    // QUICK VIEW LOGIC
    // ============================================
    const quickViewButtons = document.querySelectorAll('.quick-view-btn, .icon-btn[title="View Details"]');
    const qvModalElement = document.getElementById('quickViewModal');
    let qvModal = null;
    
    if (qvModalElement) {
        qvModal = new bootstrap.Modal(qvModalElement);
        
        const qvImageTrack = document.getElementById('qv-image-track');
        const qvName = document.getElementById('qv-name');
        const qvBrand = document.getElementById('qv-brand');
        const qvCurrentPrice = document.getElementById('qv-current-price');
        const qvOriginalPrice = document.getElementById('qv-original-price');
        const qvDescription = document.getElementById('qv-description');
        const qvForm = document.getElementById('qv-add-to-cart-form');
        const qvSubmitBtn = document.getElementById('qv-submit-btn');
        const qvDetailLink = document.getElementById('qv-detail-link');
        const qvPrevBtn = document.getElementById('qv-prev');
        const qvNextBtn = document.getElementById('qv-next');
        const qvSliderNav = document.querySelector('.qv-slider-nav');
        const qvDotsContainer = document.getElementById('qv-dots');

        let currentProductImages = [];
        let currentImageIndex = 0;

        function updateSliderImage() {
            if (currentProductImages.length > 0) {
                const offset = currentImageIndex * 100;
                qvImageTrack.style.transform = `translateX(-${offset}%)`;
                
                // Update dots
                const dots = qvDotsContainer.querySelectorAll('.qv-dot');
                dots.forEach((dot, idx) => {
                    if (idx === currentImageIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }

        qvPrevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentProductImages.length <= 1) return;
            currentImageIndex = (currentImageIndex - 1 + currentProductImages.length) % currentProductImages.length;
            updateSliderImage();
        });

        qvNextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentProductImages.length <= 1) return;
            currentImageIndex = (currentImageIndex + 1) % currentProductImages.length;
            updateSliderImage();
        });

        quickViewButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                const productId = this.dataset.productId;
                
                if (productId) {
                    e.preventDefault();
                    
                    // Reset content
                    qvName.innerText = 'Loading...';
                    qvBrand.innerText = '';
                    qvDescription.innerText = '';
                    qvImageTrack.innerHTML = '';
                    qvImageTrack.style.transform = 'translateX(0)';
                    qvDotsContainer.innerHTML = '';
                    qvCurrentPrice.innerText = '';
                    qvOriginalPrice.innerText = '';
                    qvSliderNav.style.display = 'none';
                    
                    fetch(`/api/product/${productId}`)
                        .then(response => response.json())
                        .then(data => {
                            qvName.innerText = data.name;
                            qvBrand.innerText = data.brand;
                            qvDescription.textContent = data.description.length > 120 ? data.description.substring(0, 120) + '...' : data.description;
                            
                            currentProductImages = data.images || [data.image_url];
                            currentImageIndex = 0;
                            
                            // Build the track and dots
                            currentProductImages.forEach((imgUrl, idx) => {
                                // Slide
                                const slide = document.createElement('div');
                                slide.className = 'qv-slide';
                                slide.innerHTML = `<img src="${imgUrl}" alt="${data.name}">`;
                                qvImageTrack.appendChild(slide);

                                // Dot
                                if (currentProductImages.length > 1) {
                                    const dot = document.createElement('button');
                                    dot.className = `qv-dot ${idx === 0 ? 'active' : ''}`;
                                    dot.addEventListener('click', () => {
                                        currentImageIndex = idx;
                                        updateSliderImage();
                                    });
                                    qvDotsContainer.appendChild(dot);
                                }
                            });

                            if (currentProductImages.length > 1) {
                                qvSliderNav.style.display = 'flex';
                                qvDotsContainer.style.display = 'flex';
                            } else {
                                qvSliderNav.style.display = 'none';
                                qvDotsContainer.style.display = 'none';
                            }
                            
                            qvCurrentPrice.innerText = `₹${Math.round(data.discount_price || data.price)}`;
                            if (data.discount_price) {
                                qvOriginalPrice.innerText = `₹${Math.round(data.price)}`;
                                qvOriginalPrice.style.display = 'inline';
                            } else {
                                qvOriginalPrice.style.display = 'none';
                            }
                            
                            qvForm.action = data.add_to_cart_url;
                            qvDetailLink.href = data.product_url;
                            
                            // Dynamic Sizing Logic for Quick View
                            const qvSizeOptions = document.getElementById('qv-size-options');
                            if (qvSizeOptions) {
                                qvSizeOptions.innerHTML = '';
                                const catName = (data.category_name || '').toLowerCase();
                                let sizes = [];
                                let defaultSize = '';

                                if (catName.includes('shoe') || catName.includes('footwear') || catName.includes('sneaker') || catName.includes('sandal')) {
                                    sizes = ['7', '8', '9', '10', '11'];
                                    defaultSize = '9';
                                } else {
                                    sizes = ['S', 'M', 'L', 'XL', 'XXL'];
                                    defaultSize = 'M';
                                }

                                sizes.forEach(size => {
                                    const id = `qv-size-${size.toLowerCase().replace(/\s+/g, '-')}`;
                                    const checked = size === defaultSize ? 'checked' : '';
                                    
                                    qvSizeOptions.innerHTML += `
                                        <input type="radio" class="btn-check" name="size" id="${id}" value="${size}" ${checked}>
                                        <label class="btn btn-outline-dark size-btn" for="${id}">${size}</label>
                                    `;
                                });
                            }
                            
                            if (!data.is_in_stock) {
                                qvSubmitBtn.disabled = true;
                                qvSubmitBtn.innerText = 'Out of Stock';
                            } else {
                                qvSubmitBtn.disabled = false;
                                qvSubmitBtn.innerHTML = '<i class="bi bi-bag-plus me-2"></i> Add to Cart';
                            }
                            
                            qvModal.show();
                        })
                        .catch(err => {
                            console.error('Error fetching product details:', err);
                        });
                }
            });
        });
    }

    console.log('THE HOUSE OF WEAR - JavaScript loaded successfully');
});
