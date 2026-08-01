/**
 * UNIVERSO ROMÁNTICO INTERACTIVO
 * HTML5 Canvas, Parallax, Partículas y Revelado de Texto
 */

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------
    // 1. LOADER Y REPRODUCTOR DE MÚSICA
    // ------------------------------------------------------------------
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 1000);
    }, 1500);

    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '🎵';
        } else {
            bgMusic.play();
            musicBtn.innerHTML = '⏸️';
        }
        isPlaying = !isPlaying;
    });

    // ------------------------------------------------------------------
    // 2. CURSOR PERSONALIZADO Y EFECTO DE PARTÍCULAS DEL MOUSE
    // ------------------------------------------------------------------
    const cursor = document.getElementById('custom-cursor');
    let mouse = { x: -100, y: -100 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        cursor.style.left = `${mouse.x}px`;
        cursor.style.top = `${mouse.y}px`;

        if (Math.random() < 0.3) {
            createMouseParticle(mouse.x, mouse.y);
        }
    });

    // ------------------------------------------------------------------
    // 3. CANVAS UNIVERSO (ESTRELLAS, NEBULOSAS, COMETAS Y CORAZONES)
    // ------------------------------------------------------------------
    const canvas = document.getElementById('space-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Objetos del Espacio
    const stars = Array.from({ length: 400 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 2 + 0.5,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005
    }));

    const floatingHearts = Array.from({ length: 25 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight + window.innerHeight,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: Math.sin(Math.random() * Math.PI) * 0.5,
        opacity: Math.random() * 0.7 + 0.3
    }));

    let comets = [];
    function spawnComet() {
        if (Math.random() < 0.015) {
            comets.push({
                x: Math.random() * width,
                y: 0,
                length: Math.random() * 80 + 40,
                speed: Math.random() * 10 + 6,
                angle: Math.PI / 4,
                alpha: 1
            });
        }
    }

    let mouseParticles = [];
    function createMouseParticle(x, y) {
        mouseParticles.push({
            x, y,
            size: Math.random() * 4 + 1,
            alpha: 1,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            color: Math.random() > 0.5 ? '#ffb6c1' : '#ffffff'
        });
    }

    // Loop Principal de Animación
    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; });

    function renderSpace() {
        ctx.fillStyle = '#030308';
        ctx.fillRect(0, 0, width, height);

        // Nebulosa de Fondo (Gradiente Radiante)
        let gradient = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, width*0.8);
        gradient.addColorStop(0, 'rgba(25, 10, 45, 0.4)');
        gradient.addColorStop(0.5, 'rgba(10, 5, 25, 0.2)');
        gradient.addColorStop(1, 'rgba(3, 3, 8, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Dibujar Estrellas con Parallax por Scroll
        stars.forEach(star => {
            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;

            let renderY = (star.y - scrollY * star.z * 0.2) % height;
            if (renderY < 0) renderY += height;

            ctx.beginPath();
            ctx.arc(star.x, renderY, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
            ctx.fill();
        });

        // Dibujar y Actualizar Cometas
        spawnComet();
        comets.forEach((c, index) => {
            c.x += Math.cos(c.angle) * c.speed;
            c.y += Math.sin(c.angle) * c.speed;
            c.alpha -= 0.01;

            ctx.beginPath();
            ctx.moveTo(c.x, c.y);
            ctx.lineTo(c.x - Math.cos(c.angle) * c.length, c.y - Math.sin(c.angle) * c.length);
            ctx.strokeStyle = `rgba(255, 182, 193, ${c.alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            if (c.alpha <= 0) comets.splice(index, 1);
        });

        // Corazones Flotantes
        floatingHearts.forEach(h => {
            h.y -= h.speedY;
            h.x += Math.sin(h.y * 0.01) * h.speedX;

            if (h.y < -20) {
                h.y = height + 20;
                h.x = Math.random() * width;
            }

            ctx.font = `${h.size}px serif`;
            ctx.fillStyle = `rgba(255, 105, 180, ${h.opacity})`;
            ctx.fillText('❤️', h.x, h.y);
        });

        // Partículas del Mouse
        mouseParticles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fill();
            ctx.globalAlpha = 1;

            if (p.alpha <= 0) mouseParticles.splice(index, 1);
        });

        requestAnimationFrame(renderSpace);
    }
    renderSpace();

    // ------------------------------------------------------------------
    // 4. GALERÍA DINÁMICA DE FOTOS EN LA CARPETA img/
    // ------------------------------------------------------------------
    const galleryContainer = document.getElementById('floating-gallery');
    const totalPhotos = 6; // foto1.jpg hasta foto6.jpg

    for (let i = 1; i <= totalPhotos; i++) {
        const img = document.createElement('img');
        img.src = `img/foto${i}.jpg`;
        img.classList.add('floating-photo');
        
        // Posicionamiento aleatorio en pantalla
        img.style.top = `${Math.random() * 70 + 10}%`;
        img.style.left = `${Math.random() * 70 + 10}%`;
        img.style.animationDelay = `${i * 1.5}s`;

        // Mostrar u ocultar gradualmente según el scroll
        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            if (scrollPercent > 0.1 && scrollPercent < 0.85) {
                img.style.opacity = '0.7';
            } else {
                img.style.opacity = '0';
            }
        });

        galleryContainer.appendChild(img);
    }

    // ------------------------------------------------------------------
    // 5. EFECTO MAQUINA DE ESCRIBIR & BARRA DE PROGRESO
    // ------------------------------------------------------------------
    const paragraphs = document.querySelectorAll('.tw-paragraph');
    const progressBar = document.getElementById('progress-bar');

    window.addEventListener('scroll', () => {
        // Actualizar barra de progreso
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = `${progress}%`;

        // Revelar párrafos
        paragraphs.forEach(p => {
            const rect = p.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85 && !p.classList.contains('typing-done')) {
                typeEffect(p);
            }
        });

        // Detección Final de Página
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            triggerFinalSequence();
        }
    });

    function typeEffect(element) {
        element.classList.add('visible', 'typing-done');
        const text = element.getAttribute('data-text');
        element.textContent = '';
        let i = 0;

        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 30);
    }

    // ------------------------------------------------------------------
    // 6. SECUENCIA FINAL: EXPLOSIÓN, CORAZÓN DE PARTÍCULAS Y REINICIO
    // ------------------------------------------------------------------
    const finalOverlay = document.getElementById('final-overlay');
    const heartCanvas = document.getElementById('heart-canvas');
    const hCtx = heartCanvas.getContext('2d');
    const finalMessage = document.getElementById('final-message');
    const restartBtn = document.getElementById('restart-btn');
    let heartParticles = [];
    let isFinalTriggered = false;

    function triggerFinalSequence() {
        if (isFinalTriggered) return;
        isFinalTriggered = true;

        finalOverlay.classList.remove('hidden');
        finalOverlay.style.opacity = '1';
        heartCanvas.width = window.innerWidth;
        heartCanvas.height = window.innerHeight;

        createHeartShape();
        animateHeartParticles();

        setTimeout(() => {
            finalMessage.classList.remove('hidden');
            finalMessage.style.opacity = '1';
        }, 2000);

        setTimeout(() => {
            restartBtn.classList.remove('hidden');
            restartBtn.style.opacity = '1';
        }, 3500);
    }

    function createHeartShape() {
        heartParticles = [];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2 - 50;
        const count = window.innerWidth < 768 ? 600 : 1200;

        for (let i = 0; i < count; i++) {
            const step = (i / count) * Math.PI * 2;
            // Ecuación paramétrica de un corazón
            const scale = window.innerWidth < 768 ? 10 : 15;
            const x = 16 * Math.pow(Math.sin(step), 3);
            const y = -(13 * Math.cos(step) - 5 * Math.cos(2 * step) - 2 * Math.cos(3 * step) - Math.cos(4 * step));

            heartParticles.push({
                targetX: centerX + x * scale,
                targetY: centerY + y * scale,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 2 + 1,
                color: `hsl(${Math.random() * 30 + 340}, 100%, 65%)`,
                speed: Math.random() * 0.05 + 0.02
            });
        }
    }

    function animateHeartParticles() {
        hCtx.fillStyle = 'rgba(3, 3, 8, 0.2)';
        hCtx.fillRect(0, 0, heartCanvas.width, heartCanvas.height);

        heartParticles.forEach(p => {
            p.x += (p.targetX - p.x) * p.speed;
            p.y += (p.targetY - p.y) * p.speed;

            hCtx.beginPath();
            hCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            hCtx.fillStyle = p.color;
            hCtx.fill();
        });

        if (isFinalTriggered) {
            requestAnimationFrame(animateHeartParticles);
        }
    }

    restartBtn.addEventListener('click', () => {
        isFinalTriggered = false;
        finalOverlay.classList.add('hidden');
        finalMessage.classList.add('hidden');
        restartBtn.classList.add('hidden');
        
        paragraphs.forEach(p => {
            p.classList.remove('visible', 'typing-done');
            p.textContent = '';
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
// ------------------------------------------------------------------
    // 4. GALERÍA DINÁMICA DE FOTOS EN LA CARPETA img/ (VISIBILIDAD MEJORADA)
    // ------------------------------------------------------------------
    const galleryContainer = document.getElementById('floating-gallery');
    const totalPhotos = 6; // foto1.jpg hasta foto6.jpg

    // Posiciones estratégicas a los lados (izquierda / derecha) para no obstruir el texto central
    const positions = [
        { top: '10%', left: '5%' },   // Foto 1 - Izquierda arriba
        { top: '15%', right: '5%' },  // Foto 2 - Derecha arriba
        { top: '42%', left: '3%' },   // Foto 3 - Izquierda centro
        { top: '48%', right: '3%' },  // Foto 4 - Derecha centro
        { top: '75%', left: '6%' },   // Foto 5 - Izquierda abajo
        { top: '72%', right: '6%' }   // Foto 6 - Derecha abajo
    ];

    for (let i = 1; i <= totalPhotos; i++) {
        const img = document.createElement('img');
        img.src = `img/foto${i}.jpg`;
        img.classList.add('floating-photo');
        
        // Asignar posición
        const pos = positions[(i - 1) % positions.length];
        if (pos.left) img.style.left = pos.left;
        if (pos.right) img.style.right = pos.right;
        img.style.top = pos.top;

        // Desfase de animación suave para cada foto
        img.style.animationDelay = `${(i - 1) * 1.5}s`;

        galleryContainer.appendChild(img);
    }