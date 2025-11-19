// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.bento-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
});

// Shape-Shifting Puzzle Animation
const canvasContainer = document.querySelector('.hero-visual-container');
const cards = Array.from(document.querySelectorAll('.canvas-card'));

if (canvasContainer && cards.length > 0) {

    const UNIT = 100;
    const GAP = 10;

    function getPos(uX, uY) {
        const pxX = uX * (UNIT + GAP);
        const pxY = uY * (UNIT + GAP);
        return {
            left: `calc(50% + ${pxX}px)`,
            top: `calc(50% + ${pxY}px)`
        };
    }

    // Define "Inventory Configs"
    const inventories = [
        {
            name: "Standard Mix",
            shapes: ['shape-tall', 'shape-wide', 'shape-wide', 'shape-square', 'shape-square'],
            layout: [
                { x: -2, y: -1, shape: 'shape-tall' },
                { x: -1, y: -1, shape: 'shape-square' },
                { x: -1, y: 0, shape: 'shape-square' },
                { x: 0, y: -1, shape: 'shape-wide' },
                { x: 0, y: 0, shape: 'shape-wide' }
            ]
        },
        {
            name: "Tall Towers",
            shapes: ['shape-tall', 'shape-tall', 'shape-tall', 'shape-square', 'shape-square'],
            layout: [
                { x: -1.5, y: -1, shape: 'shape-tall' },
                { x: -0.5, y: -1, shape: 'shape-tall' },
                { x: 0.5, y: -1, shape: 'shape-tall' },
                { x: 1.5, y: -1, shape: 'shape-square' },
                { x: 1.5, y: 0, shape: 'shape-square' }
            ]
        },
        {
            name: "Wide Stack",
            shapes: ['shape-wide', 'shape-wide', 'shape-wide', 'shape-square', 'shape-square'],
            layout: [
                { x: -1, y: -1.5, shape: 'shape-wide' },
                { x: -1, y: -0.5, shape: 'shape-wide' },
                { x: -1, y: 0.5, shape: 'shape-wide' },
                { x: 1, y: -0.5, shape: 'shape-square' },
                { x: 1, y: 0.5, shape: 'shape-square' }
            ]
        },
        {
            name: "The Big One",
            shapes: ['shape-big', 'shape-square', 'shape-square', 'shape-square', 'shape-square'],
            layout: [
                { x: -1, y: -1, shape: 'shape-big' },
                { x: -2, y: -1, shape: 'shape-square' },
                { x: -2, y: 0, shape: 'shape-square' },
                { x: 1, y: -1, shape: 'shape-square' },
                { x: 1, y: 0, shape: 'shape-square' }
            ]
        }
    ];

    let currentInventory = inventories[0];

    function setCardShapes(inventory) {
        const shuffledShapes = [...inventory.shapes].sort(() => Math.random() - 0.5);

        cards.forEach((card, i) => {
            card.classList.remove('shape-square', 'shape-wide', 'shape-tall', 'shape-big');
            card.classList.add(shuffledShapes[i]);
            card.dataset.shape = shuffledShapes[i];
        });
    }

    function randomizePositions() {
        currentInventory = inventories[Math.floor(Math.random() * inventories.length)];
        setCardShapes(currentInventory);

        cards.forEach((card) => {
            const randomTop = Math.random() * 60 + 10;
            const randomLeft = Math.random() * 60 + 10;
            const randomRotate = Math.random() * 40 - 20;

            card.style.top = `${randomTop}%`;
            card.style.left = `${randomLeft}%`;
            card.style.transform = `translate(-50%, -50%) rotate(${randomRotate}deg)`;
            card.style.zIndex = Math.floor(Math.random() * 10);
        });

        console.log(`Scattered with: ${currentInventory.name}`);
    }

    function organizePositions() {
        const cardsByShape = {
            'shape-square': [],
            'shape-wide': [],
            'shape-tall': [],
            'shape-big': []
        };

        cards.forEach(card => {
            cardsByShape[card.dataset.shape].push(card);
        });

        for (let key in cardsByShape) {
            cardsByShape[key].sort(() => Math.random() - 0.5);
        }

        currentInventory.layout.forEach(slot => {
            const card = cardsByShape[slot.shape].pop();
            if (card) {
                const pos = getPos(slot.x, slot.y);
                card.style.left = pos.left;
                card.style.top = pos.top;
                card.style.transform = `translate(0, 0) rotate(0deg)`;
                card.style.zIndex = 20;
            }
        });

        console.log(`Organized: ${currentInventory.name}`);
    }

    // Initial Setup
    randomizePositions();

    // Event Listeners
    canvasContainer.addEventListener('mouseenter', () => {
        organizePositions();
    });

    canvasContainer.addEventListener('mouseleave', () => {
        randomizePositions();
    });
}
