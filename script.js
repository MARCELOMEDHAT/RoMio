// Tab Switching
window.openTab = function (evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active-tab");
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active-tab");
    evt.currentTarget.className += " active";
}

// Hacker Text Effect (Premium Edition)
class HackerText {
    constructor(el) {
        this.el = el;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        this.originalText = el.innerText;
        this.update = this.update.bind(this);
    }

    setText(newText) {
        this.originalText = newText; // update target
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 20); // Faster
            const end = start + Math.floor(Math.random() * 20);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud" style="color: var(--primary-color)">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Reveal Animations & Text Scramble
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Trigger Text Scramble for Titles
            if (entry.target.classList.contains('section-title') || entry.target.tagName === 'H3') {
                if (!entry.target.dataset.scrambled) {
                    const fx = new HackerText(entry.target);
                    fx.setText(entry.target.innerText);
                    entry.target.dataset.scrambled = "true";
                }
            }
        }
    });
}, observerOptions);

document.querySelectorAll('section, .about-card, .project-card, .section-title').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Scroll Progress Bar
window.onscroll = function () {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progress-bar").style.width = scrolled + "%";
};

// Typing Effect
const typedTextSpan = document.querySelector(".typed-text");
const textArray = ["AI Engineer", "Data Scientist", "Python Developer", "Problem Solver"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!typedTextSpan.classList.contains("typing")) typedTextSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        typedTextSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if (!typedTextSpan.classList.contains("typing")) typedTextSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        typedTextSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function () { // On DOM Load initiate the effect
    if (textArray.length) setTimeout(type, newTextDelay + 250);
});


// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('loaded');
    }, 1500); // Wait for animation
});

// 3D Tilt Effect & Spotlight
const tiltElements = document.querySelectorAll('.bento-item, .project-card, .dock-glass');

tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spotlight variables
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);

        // Tilt Logic (re-calc for center)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Reduce tilt effect slightly for smoother feel
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        // Apply transform only if it's not the dock (keep dock flat but spotlighted)
        if (!el.classList.contains('dock-glass')) {
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        }
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        el.style.transform = '';
    });
});

// Time Widget (Jordan Time)
function updateTime() {
    const timeDisplay = document.getElementById('current-time');
    if (timeDisplay) {
        const now = new Date();
        const options = { timeZone: 'Asia/Amman', hour: '2-digit', minute: '2-digit', hour12: true };
        timeDisplay.textContent = now.toLocaleTimeString('en-US', options);
    }
}
setInterval(updateTime, 1000);
updateTime();

// Neural Network Animation
const heroCanvas = document.getElementById('neuralCanvas');
if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 60; // Number of nodes
    const connectionDistance = 120; // Max distance to connect
    const mouseDistance = 150; // Interaction radius

    // Resize
    function resize() {
        width = heroCanvas.width = heroCanvas.parentElement.offsetWidth;
        height = heroCanvas.height = heroCanvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction
            const dx = this.x - cursorDot.offsetLeft; // Approximate mouse pos from cursor element logic if useful, otherwise separate tracker
            // Better to use the CSS variable trackers we added earlier or a global mouse var
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary-color').trim();
            ctx.fill();
        }
    }

    // Initialize
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    // Mouse Tracking for Canvas
    let mouse = { x: null, y: null };
    document.addEventListener('mousemove', (e) => {
        const rect = heroCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update & Draw Particles
        particles.forEach(p => {
            p.update();
            p.draw();

            // Connections
            particles.forEach(q => {
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(10, 132, 255, ${1 - dist / connectionDistance})`; // Fade out
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            });

            // Mouse Connections
            if (mouse.x != null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(175, 82, 222, ${1 - dist / mouseDistance})`; // Purple interaction
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
// Note: icon is inside the button now
const icon = themeToggle ? themeToggle.querySelector('i') : null;

// Check Local Storage
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        } else {
            localStorage.setItem('theme', 'dark');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    });
}

// Magnetic Effect for Dock Items & Buttons
const dockItems = document.querySelectorAll('.dock-item, .btn-ios, .social-icon');

dockItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Strength of attraction
        const strength = 15; // Slightly gentler for smaller buttons
        const xMove = (x / rect.width) * strength;
        const yMove = (y / rect.height) * strength;

        item.style.transform = `translate(${xMove}px, ${yMove}px) scale(1.1)`; // Magnetic + Scale
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = ''; // Reset
    });
});

// Scroll Spy (Active Dock Icon)
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.dock-item');

const observerSpy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            let id = entry.target.getAttribute('id');
            // Remove active from all
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.5 }); // 50% section visible

sections.forEach(section => observerSpy.observe(section));
