// ========================================
// YOUR COSMIC SHELF - INTERACTIONS FILE
// Handles: Navigation, News, Books, Contact, Planet Info
// ========================================

// --- PLANET INFORMATION DATABASE ---
// This data is shown when users click on planets
const planetDatabase = {
    sun: {
        name: "🌞 THE SUN",
        desc: "The star at the center of our solar system. It contains 99.8% of all mass in the solar system!",
        fact: "1.3 million Earths could fit inside the Sun. Its surface temperature is 5,500°C!"
    },
    mercury: {
        name: "🪨 MERCURY",
        desc: "The smallest and fastest planet. It orbits the Sun every 88 Earth days.",
        fact: "Despite being closest to the Sun, Mercury has ice in permanently shadowed craters!"
    },
    venus: {
        name: "🟡 VENUS",
        desc: "The hottest planet with a toxic atmosphere of carbon dioxide and sulfuric acid clouds.",
        fact: "A day on Venus (243 Earth days) is longer than its year (225 Earth days)!"
    },
    earth: {
        name: "🌍 EARTH",
        desc: "Our home! The only planet known to support life, with liquid water covering 71% of its surface.",
        fact: "Earth is the only planet not named after a Roman or Greek god!"
    },
    mars: {
        name: "🔴 MARS",
        desc: "The Red Planet, named for its iron-rich soil that appears rusty red.",
        fact: "Home to Olympus Mons, the largest volcano in the solar system (3x taller than Everest)!"
    },
    jupiter: {
        name: "🟤 JUPITER",
        desc: "The largest planet in our solar system. It's 2.5 times more massive than all other planets combined!",
        fact: "Jupiter has 95 known moons and its Great Red Spot is a storm that has raged for centuries!"
    },
    saturn: {
        name: "🪐 SATURN",
        desc: "Famous for its beautiful ring system made of ice and rock particles.",
        fact: "Saturn is so light it would float in water! Its rings are only 30 feet thick!"
    },
    uranus: {
        name: "💚 URANUS",
        desc: "An ice giant that rotates on its side with a unique axial tilt of 98 degrees.",
        fact: "First planet discovered with a telescope (by William Herschel in 1781)!"
    },
    neptune: {
        name: "💙 NEPTUNE",
        desc: "The windiest planet in the solar system with winds reaching 1,200 miles per hour.",
        fact: "Neptune takes 165 Earth years to complete just one orbit around the Sun!"
    }
};

// --- UPDATE INFO PANEL (called when planet is clicked) ---
function updateInfoPanel(planetId) {
    const planet = planetDatabase[planetId];
    if (planet) {
        document.getElementById('planet-name').textContent = planet.name;
        document.getElementById('planet-desc').textContent = planet.desc;
        document.getElementById('planet-fact').innerHTML = "✨ " + planet.fact;
        
        // Add a subtle animation to the info panel
        const panel = document.getElementById('info-panel');
        panel.style.transform = 'scale(1.02)';
        setTimeout(() => {
            panel.style.transform = 'scale(1)';
        }, 200);
    }
}

// --- NAVIGATION BETWEEN SECTIONS ---
function showSection(sectionName) {
    // Get all sections
    const homeSection = document.getElementById('home-section');
    const newsSection = document.getElementById('news-section');
    const booksSection = document.getElementById('books-section');
    const contactSection = document.getElementById('contact-section');
    
    // Hide all sections
    homeSection.classList.remove('active');
    newsSection.classList.remove('active');
    booksSection.classList.remove('active');
    contactSection.classList.remove('active');
    
    // Show selected section
    if (sectionName === 'home') {
        homeSection.classList.add('active');
    } else if (sectionName === 'news') {
        newsSection.classList.add('active');
        fetchNASANews();
    } else if (sectionName === 'books') {
        booksSection.classList.add('active');
        displayBooks();
    } else if (sectionName === 'contact') {
        contactSection.classList.add('active');
    }
    
    // Update active button styling
    const buttons = document.querySelectorAll('.nav-buttons button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes('Solar System') && sectionName === 'home') {
            btn.classList.add('active');
        } else if (btn.textContent.includes('NASA News') && sectionName === 'news') {
            btn.classList.add('active');
        } else if (btn.textContent.includes('Books') && sectionName === 'books') {
            btn.classList.add('active');
        } else if (btn.textContent.includes('Contact') && sectionName === 'contact') {
            btn.classList.add('active');
        }
    });
}

// --- FETCH REAL NASA NEWS ---
async function fetchNASANews() {
    const container = document.getElementById('news-container');
    container.innerHTML = '<div class="loading">🌠 Fetching latest space news from NASA...</div>';
    
    try {
        // Using RSS2JSON API to convert NASA's RSS feed to JSON
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.nasa.gov/rss/dyn/breaking_news.rss');
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const newsHTML = data.items.slice(0, 4).map(item => {
                // Clean up description (remove HTML tags)
                let description = item.description || '';
                description = description.replace(/<[^>]*>/g, '');
                description = description.substring(0, 150);
                
                return `
                    <div class="news-card">
                        <h3>${item.title.substring(0, 80)}${item.title.length > 80 ? '...' : ''}</h3>
                        <small>📅 ${new Date(item.pubDate).toLocaleDateString()}</small>
                        <p>${description}...</p>
                        <a href="${item.link}" target="_blank" rel="noopener">🔭 Read more →</a>
                    </div>
                `;
            }).join('');
            container.innerHTML = newsHTML;
        } else {
            throw new Error('No news items found');
        }
    } catch (error) {
        console.error('News fetch error:', error);
        // Fallback news in case API fails
        container.innerHTML = `
            <div class="news-card">
                <h3>🚀 Artemis II Mission Progress</h3>
                <small>📅 December 2024</small>
                <p>NASA continues preparations for the first crewed Artemis mission around the Moon...</p>
                <a href="https://www.nasa.gov/artemis" target="_blank">🔭 Read more →</a>
            </div>
            <div class="news-card">
                <h3>🔭 James Webb Space Telescope Discoveries</h3>
                <small>📅 December 2024</small>
                <p>JWST captures stunning new images of distant galaxies and exoplanet atmospheres...</p>
                <a href="https://webb.nasa.gov" target="_blank">🔭 Read more →</a>
            </div>
            <div class="news-card">
                <h3>🌊 Europa Clipper Mission</h3>
                <small>📅 October 2024</small>
                <p>NASA's mission to Jupiter's icy moon launches to search for signs of life...</p>
                <a href="https://europa.nasa.gov" target="_blank">🔭 Read more →</a>
            </div>
            <div class="news-card">
                <h3>🌌 Hubble Space Telescope Anniversary</h3>
                <small>📅 April 2024</small>
                <p>Celebrating decades of groundbreaking discoveries from low Earth orbit...</p>
                <a href="https://hubble.nasa.gov" target="_blank">🔭 Read more →</a>
            </div>
        `;
    }
}

// --- DISPLAY BOOKS AND ARTICLES ---
function displayBooks() {
    const books = [
        { 
            title: "Cosmos", 
            author: "Carl Sagan", 
            desc: "A classic journey through space and time that inspired generations."
        },
        { 
            title: "A Brief History of Time", 
            author: "Stephen Hawking", 
            desc: "Exploring the universe from the big bang to black holes."
        },
        { 
            title: "Astrophysics for People in a Hurry", 
            author: "Neil deGrasse Tyson", 
            desc: "The universe explained in digestible, entertaining chapters."
        },
        { 
            title: "The Universe in a Nutshell", 
            author: "Stephen Hawking", 
            desc: "Beautifully illustrated guide to modern physics and cosmology."
        },
        { 
            title: "Pale Blue Dot", 
            author: "Carl Sagan", 
            desc: "A vision of the human future in space and our place in the cosmos."
        },
        { 
            title: "The Elegant Universe", 
            author: "Brian Greene", 
            desc: "Exploring string theory and the fabric of reality."
        }
    ];
    
    const container = document.getElementById('books-container');
    container.innerHTML = books.map(book => `
        <div class="book-card">
            <h3>📖 ${book.title}</h3>
            <p style="opacity: 0.7; margin: 8px 0;">by ${book.author}</p>
            <p style="font-size: 0.85rem; line-height: 1.4;">${book.desc}</p>
        </div>
    `).join('');
}

// --- COPY EMAIL FUNCTION ---
function copyEmail() {
    const email = 'lilithseclipse999@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        // Show success feedback
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(() => {
        alert('📧 Email: ' + email);
    });
}

// --- CLOSE SECTIONS (if you add a close button) ---
function closeSection() {
    showSection('home');
}

// --- INITIALIZE EVERYTHING ON PAGE LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Your Cosmic Shelf - Realistic Solar System Loaded! ✨');
    console.log('🌍 Created by Bouchra Bdb');
    console.log('🪐 Click on any planet to learn about it!');
    
    // Display books (for when books section is opened)
    displayBooks();
    
    // Add floating animation to info panel
    const panel = document.getElementById('info-panel');
    if (panel) {
        gsap.to(panel, {
            y: 10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }
});

// --- MAKE FUNCTIONS GLOBALLY ACCESSIBLE ---
window.updateInfoPanel = updateInfoPanel;
window.showSection = showSection;
window.copyEmail = copyEmail;
window.closeSection = closeSection;
window.fetchNASANews = fetchNASANews;
window.displayBooks = displayBooks;