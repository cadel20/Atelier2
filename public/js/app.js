// ===== GESTION GÉNÉRALE DE L'APPLICATION =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation
    initApp();
    
    // Configuration des écouteurs d'événements
    setupEventListeners();
    
    // Initialiser les composants
    initComponents();
});

function initApp() {
    // Ajuster le padding pour la navbar fixe
    document.body.style.paddingTop = '40px';
    
    // Initialiser l'horloge
    updateClock();
    setInterval(updateClock, 1000);
    
    // Initialiser l'observation des sections
    initSectionObserver();
    
    // Charger les métriques initiales
    loadInitialMetrics();
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR');
    const dateString = now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Mettre à jour l'horloge
    const timerElement = document.getElementById('live-timer');
    if (timerElement) {
        timerElement.textContent = timeString;
    }
    
    // Mettre à jour la dernière mise à jour
    const lastUpdateElement = document.getElementById('footer-last-update');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = dateString + ' ' + timeString;
    }
}

function initSectionObserver() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

function setupEventListeners() {
    // Gestion de la navbar au scroll
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
    
    // Gestion du menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }
    
    // Formulaires
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Mettre à jour la navigation active
    updateActiveNavLink();
}

function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const btn = document.querySelector('.mobile-menu-btn i');
    navMenu.classList.toggle('active');
    btn.classList.toggle('fa-bars');
    btn.classList.toggle('fa-times');
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
        });
        
        // Fermer le menu mobile si ouvert
        const navMenu = document.getElementById('navMenu');
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;
    
    // Simulation d'envoi
    console.log(`Message de ${name} (${email}): ${message}`);
    
    // Animation de chargement
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
    
    // Simuler un appel API
    setTimeout(() => {
        alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
        this.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Journaliser l'événement
        if (window.pipelineLogger) {
            window.pipelineLogger.log(`[CONTACT] Message envoyé par ${name}`, 'success');
        }
    }, 1500);
}

function loadInitialMetrics() {
    // Charger les métriques depuis l'API
    fetch('/api/metrics')
        .then(response => response.json())
        .then(data => {
            updateMetricsUI(data);
        })
        .catch(error => {
            console.error('Erreur de chargement des métriques:', error);
            // Utiliser des valeurs par défaut
            updateMetricsUI({
                commits: 47,
                builds: 12,
                deployments: 8,
                uptime: '99.8%',
                lastDeploy: new Date().toISOString()
            });
        });
}

function updateMetricsUI(data) {
    // Mettre à jour les éléments UI avec les données
    const elements = {
        'commits-count': data.commits,
        'builds-count': data.builds,
        'docker-pulls': data.deployments * 10,
        'uptime-percent': data.uptime,
        'last-deploy': new Date(data.lastDeploy).toLocaleTimeString('fr-FR')
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });
}

function initComponents() {
    // Initialiser les composants dynamiques
    initDynamicMetrics();
    
    // Démarrer les mises à jour périodiques
    setInterval(initDynamicMetrics, 30000); // Toutes les 30 secondes
    
    // Initialiser des événements aléatoires
    initRandomEvents();
}

function initDynamicMetrics() {
    // Mettre à jour les métriques dynamiques
    const services = ['GitHub Actions', 'Docker Registry', 'Production Server', 'Database', 'Monitoring'];
    const servicesStatus = document.getElementById('services-status');
    
    if (servicesStatus) {
        servicesStatus.innerHTML = '';
        services.forEach(service => {
            const isUp = Math.random() > 0.1;
            const statusDiv = document.createElement('div');
            statusDiv.className = 'service-status-item';
            statusDiv.innerHTML = `
                <div class="status-indicator ${isUp ? 'up' : 'down'}"></div>
                <div class="service-info">
                    <div class="service-name">${service}</div>
                    <div class="service-status">${isUp ? 'Opérationnel' : 'En maintenance'}</div>
                </div>
            `;
            servicesStatus.appendChild(statusDiv);
        });
    }
}

function initRandomEvents() {
    // Simuler des événements aléatoires
    setInterval(() => {
        if (Math.random() > 0.95) {
            const status = document.getElementById('system-status');
            if (status) {
                const oldStatus = status.textContent;
                status.textContent = 'MAINTENANCE';
                status.style.color = 'var(--warning)';
                
                setTimeout(() => {
                    status.textContent = oldStatus;
                    status.style.color = '';
                }, 5000);
            }
        }
    }, 30000);
}

// Exposer des fonctions globales si nécessaire
window.App = {
    init: initApp,
    updateMetrics: loadInitialMetrics,
    toggleMenu: toggleMenu
};