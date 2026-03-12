/**
 * SENIA Landing Page - Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================================================
       1. ANTIGRAVITY PARTICLE CANVAS EFFECT
       ========================================================================= */
    const canvas = document.getElementById('cursor-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    let nodes = [];
    
    // Mouse tracking
    const mouse = {
        x: undefined,
        y: undefined,
        radius: 150
    };

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    // Initialize
    window.addEventListener('resize', resize);
    resize();
    
    // Update mouse position
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
        
        // Add trail particles
        for (let i = 0; i < 2; i++) {
            particles.push(new TrailParticle(mouse.x, mouse.y));
        }
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // Trail Particle Class
    class TrailParticle {
        constructor(x, y) {
            this.x = x + (Math.random() - 0.5) * 20;
            this.y = y + (Math.random() - 0.5) * 20;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 1;
            this.speedY = (Math.random() - 0.5) * 1;
            this.life = 1; // Opacity
            this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254,' : 'rgba(79, 172, 254,';
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= 0.02; // Fade out speed
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color} ${this.life})`;
            ctx.fill();
        }
    }

    // Floating Node Class (Background tech particles)
    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.baseAlpha = Math.random() * 0.3 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x > width || this.x < 0) this.speedX *= -1;
            if (this.y > height || this.y < 0) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(148, 163, 184, ${this.baseAlpha})`;
            ctx.fill();
        }
    }

    // Init Nodes
    function initNodes() {
        nodes = [];
        let numNodes = (width * height) / 15000; // Density
        for (let i = 0; i < numNodes; i++) {
            nodes.push(new Node());
        }
    }
    initNodes();

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw background nodes
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].update();
            nodes[i].draw();
            
            // Connect nodes to mouse
            if (mouse.x != undefined) {
                let dx = mouse.x - nodes[i].x;
                let dy = mouse.y - nodes[i].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    ctx.beginPath();
                    // Line opacity based on distance
                    let opacity = 1 - (distance / mouse.radius);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }

        // Update and draw trail particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Remove dead particles
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }

        requestAnimationFrame(animate);
    }
    animate();


    /* =========================================================================
       2. SCROLL ANIMATIONS (Intersection Observer)
       ========================================================================= */
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* =========================================================================
       3. NAVBAR SCROLL EFFECT
       ========================================================================= */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* Mobile Menu Toggle */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if(navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(5, 8, 20, 0.95)';
                navLinks.style.backdropFilter = 'blur(10px)';
                navLinks.style.padding = '20px';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            }
        });
    }

    /* =========================================================================
       4. DYNAMIC NUMBER COUNTERS
       ========================================================================= */
    const counterElements = document.querySelectorAll('.number');
    
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counterElements.forEach(el => countObserver.observe(el));

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Ease out quad
            const easeOutProgress = progress * (2 - progress);
            
            obj.innerHTML = Math.floor(easeOutProgress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end; // Ensure exact final value
            }
        };
        window.requestAnimationFrame(step);
    }

    /* =========================================================================
       5. FORM SUBMISSION WEBHOOK (MÉTODO FETCH SILENCIOSO NO-CORS)
       ========================================================================= */
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitamos que el navegador recargue o siga el link
            
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Enviando...';
            submitBtn.disabled = true;
            
            // Formatear datos nativamente como URL Encoded para saltar CORS preflight del navegador
            const urlEncodedData = new URLSearchParams();
            urlEncodedData.append('nombre', document.getElementById('nombre').value);
            urlEncodedData.append('correo', document.getElementById('correo').value);
            urlEncodedData.append('whatsapp', document.getElementById('whatsapp').value);
            
            try {
                // Enviar usando fetch opaco al entorno de PRODUCCIÓN de n8n
                fetch('https://nd-n8n.gtxuy4.easypanel.host/webhook/senia-lead', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: urlEncodedData
                }).then(() => {
                    // Si la promesa se resuelve (aunque sea opaca), mostramos éxito localmente
                    formMessage.classList.add('visible');
                    contactForm.reset();
                    
                    setTimeout(() => {
                        formMessage.classList.remove('visible');
                    }, 8000);
                    
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }).catch(error => {
                    console.error('Fetch error:', error);
                    alert('Error en red intentando enviar datos. Revisa tu conexión.');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
            } catch (err) {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
