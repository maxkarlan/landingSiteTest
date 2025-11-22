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

    // Dynamic Unit Size
    function getUnitSize() {
        return window.innerWidth < 768 ? 60 : 100;
    }

    const GAP = 10;

    function getPos(uX, uY) {
        const UNIT = getUnitSize();
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
        const UNIT = getUnitSize();

        cards.forEach((card, i) => {
            card.classList.remove('shape-square', 'shape-wide', 'shape-tall', 'shape-big');
            card.classList.add(shuffledShapes[i]);
            card.dataset.shape = shuffledShapes[i];

            // Explicitly set size based on current UNIT
            let w, h;
            switch (shuffledShapes[i]) {
                case 'shape-square': w = UNIT; h = UNIT; break;
                case 'shape-wide': w = UNIT * 2 + GAP; h = UNIT; break;
                case 'shape-tall': w = UNIT; h = UNIT * 2 + GAP; break;
                case 'shape-big': w = UNIT * 2 + GAP; h = UNIT * 2 + GAP; break;
            }
            card.style.width = `${w}px`;
            card.style.height = `${h}px`;
        });
    }

    let isOrganized = false;
    let autoCycleInterval;

    function randomizePositions() {
        isOrganized = false;
        currentInventory = inventories[Math.floor(Math.random() * inventories.length)];
        setCardShapes(currentInventory);

        // Define 5 zones to ensure distribution (Top-Left, Top-Right, Bottom-Left, Bottom-Right, Center)
        // Using percentages. Safe buffer is roughly 20% from edges.
        const zones = [
            { x: 25, y: 25 }, // TL
            { x: 75, y: 25 }, // TR
            { x: 25, y: 75 }, // BL
            { x: 75, y: 75 }, // BR
            { x: 50, y: 50 }  // Center
        ];

        // Shuffle zones
        const shuffledZones = zones.sort(() => Math.random() - 0.5);

        cards.forEach((card, i) => {
            // Assign card to a zone
            const zone = shuffledZones[i % shuffledZones.length];

            // Add random jitter (+/- 10%)
            const jitterX = (Math.random() * 20) - 10;
            const jitterY = (Math.random() * 20) - 10;

            const finalX = zone.x + jitterX;
            const finalY = zone.y + jitterY;

            const randomRotate = Math.random() * 40 - 20;

            card.style.top = `${finalY}%`;
            card.style.left = `${finalX}%`;
            card.style.transform = `translate(-50%, -50%) rotate(${randomRotate}deg)`;
            card.style.zIndex = Math.floor(Math.random() * 10);
        });

        console.log(`Scattered with: ${currentInventory.name}`);
    }

    function organizePositions() {
        isOrganized = true;
        const UNIT = getUnitSize();

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

        // Shape dimensions for bounding box calculation
        const shapeDims = {
            'shape-square': { w: UNIT, h: UNIT },
            'shape-wide': { w: UNIT * 2 + GAP, h: UNIT },
            'shape-tall': { w: UNIT, h: UNIT * 2 + GAP },
            'shape-big': { w: UNIT * 2 + GAP, h: UNIT * 2 + GAP }
        };

        // Calculate visual bounding box of the layout (using Top-Left coordinates)
        let minLeft = Infinity, maxRight = -Infinity, minTop = Infinity, maxBottom = -Infinity;

        currentInventory.layout.forEach(slot => {
            const dims = shapeDims[slot.shape];
            // Coordinates are Top-Left based in the original system
            const left = slot.x * (UNIT + GAP);
            const top = slot.y * (UNIT + GAP);
            const right = left + dims.w;
            const bottom = top + dims.h;

            if (left < minLeft) minLeft = left;
            if (right > maxRight) maxRight = right;
            if (top < minTop) minTop = top;
            if (bottom > maxBottom) maxBottom = bottom;
        });

        // Calculate the center of the bounding box
        const visualCenterX = (minLeft + maxRight) / 2;
        const visualCenterY = (minTop + maxBottom) / 2;

        currentInventory.layout.forEach(slot => {
            const card = cardsByShape[slot.shape].pop();
            if (card) {
                // Calculate position relative to center
                // We want the card's Top-Left to be shifted so that the BoundingBox Center aligns with (0,0)
                const targetX = (slot.x * (UNIT + GAP)) - visualCenterX;
                const targetY = (slot.y * (UNIT + GAP)) - visualCenterY;

                card.style.left = `calc(50% + ${targetX}px)`;
                card.style.top = `calc(50% + ${targetY}px)`;
                // Revert to translate(0,0) to match Top-Left anchoring
                card.style.transform = `translate(0, 0) rotate(0deg)`;
                card.style.zIndex = 20;
            }
        });

        console.log(`Organized: ${currentInventory.name}`);
    }

    function toggleState() {
        if (isOrganized) {
            randomizePositions();
        } else {
            organizePositions();
        }
    }

    function startAutoCycle() {
        stopAutoCycle(); // Clear existing to be safe
        autoCycleInterval = setInterval(() => {
            toggleState();
        }, 4000);
    }

    function stopAutoCycle() {
        if (autoCycleInterval) {
            clearInterval(autoCycleInterval);
            autoCycleInterval = null;
        }
    }

    // Initial Setup
    randomizePositions();
    startAutoCycle();

    // Re-calculate on resize (only if width changes to avoid mobile scroll trigger)
    let lastWidth = window.innerWidth;
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth !== lastWidth) {
                lastWidth = window.innerWidth;
                randomizePositions();
            }
        }, 300);
    });

    // Event Listeners
    canvasContainer.addEventListener('mouseenter', () => {
        stopAutoCycle();
        organizePositions();
    });

    canvasContainer.addEventListener('mouseleave', () => {
        randomizePositions();
        startAutoCycle();
    });

    // Tap/Click to toggle (Mobile & Desktop)
    canvasContainer.addEventListener('click', () => {
        stopAutoCycle();
        toggleState();
        // Restart cycle after interaction to keep it alive if they stop interacting
        startAutoCycle();
    });
}

// Waitlist Form Handling
const waitlistForm = document.getElementById('waitlist-form');
const waitlistSuccess = document.getElementById('waitlist-success');

if (waitlistForm && waitlistSuccess) {
    waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = waitlistForm.querySelector('input[type="email"]');
        const submitBtn = waitlistForm.querySelector('button[type="submit"]');
        const email = emailInput.value;

        // Disable button while submitting
        submitBtn.disabled = true;
        submitBtn.textContent = 'Joining...';

        // TODO: Replace this URL with your deployed Google Apps Script Web App URL
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtYCpHEWn4C1YKZM0FrJh558tl9lb6nOHP72ror1sGk6-X6rKRju4WySdoMEXwNp6Jtw/exec';

        if (SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
            console.warn('Google Script URL not set. Please deploy the script and update the URL in main.js');
            // Simulate success for demo purposes if URL isn't set yet
            setTimeout(() => {
                document.getElementById('waitlist-initial').style.display = 'none';
                waitlistSuccess.style.display = 'block';
            }, 1000);
            return;
        }

        // Send data to Google Sheets
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'cors', // Changed to 'cors' since the server sends Access-Control-Allow-Origin: *
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}&source=sienna_landing`
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.result === 'success') {
                    document.getElementById('waitlist-initial').style.display = 'none';
                    waitlistSuccess.style.display = 'block';
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            })
            .catch(error => {
                console.error('Error!', error.message);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Try Again';
                alert('Something went wrong. Please try again.');
            });
    });
}
