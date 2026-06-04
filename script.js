const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const graphCanvas = document.querySelector("[data-graph-canvas]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (header && navToggle) {
    navToggle.addEventListener("click", () => {
        const isOpen = header.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            header.classList.remove("nav-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

if (graphCanvas && !reducedMotion.matches) {
    const context = graphCanvas.getContext("2d");
    const nodes = [];
    const nodeCount = 22;
    let animationFrame;
    let width = 0;
    let height = 0;

    const createNodes = () => {
        nodes.length = 0;

        for (let index = 0; index < nodeCount; index += 1) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.18,
                vy: (Math.random() - 0.5) * 0.18,
                radius: 2 + Math.random() * 2.3
            });
        }
    };

    const resizeCanvas = () => {
        const rect = graphCanvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;

        width = rect.width;
        height = rect.height;
        graphCanvas.width = Math.max(1, Math.floor(width * ratio));
        graphCanvas.height = Math.max(1, Math.floor(height * ratio));
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        createNodes();
    };

    const draw = () => {
        context.clearRect(0, 0, width, height);

        nodes.forEach((node, index) => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > width) {
                node.vx *= -1;
            }

            if (node.y < 0 || node.y > height) {
                node.vy *= -1;
            }

            for (let targetIndex = index + 1; targetIndex < nodes.length; targetIndex += 1) {
                const target = nodes[targetIndex];
                const dx = node.x - target.x;
                const dy = node.y - target.y;
                const distance = Math.hypot(dx, dy);

                if (distance < 145) {
                    context.beginPath();
                    context.moveTo(node.x, node.y);
                    context.lineTo(target.x, target.y);
                    context.strokeStyle = `rgba(38, 70, 83, ${0.16 * (1 - distance / 145)})`;
                    context.lineWidth = 1;
                    context.stroke();
                }
            }
        });

        nodes.forEach((node, index) => {
            context.beginPath();
            context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            context.fillStyle = index % 7 === 0 ? "rgba(182, 122, 45, 0.72)" : "rgba(38, 70, 83, 0.74)";
            context.fill();
        });

        animationFrame = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();
    window.addEventListener("resize", resizeCanvas);

    reducedMotion.addEventListener("change", (event) => {
        if (event.matches && animationFrame) {
            window.cancelAnimationFrame(animationFrame);
        }
    });
}
