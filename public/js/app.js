// ===== PIPELINE CI/CD SIMULATION =====

// Variables globales pour la simulation
let pipelineInterval;
let currentPipelineStep = 0;
let isPipelineRunning = false;
let pipelineSteps = ['commit', 'test', 'build', 'deploy'];
let servicesStatus = {
    'github': true,
    'docker': true,
    'node': true,
    'nginx': true,
    'database': true
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du Dashboard CI/CD DevOps...');
    
    // Initialisation
    initDevOpsDashboard();
    
    // Configuration des écouteurs d'événements
    setupPipelineEventListeners();
    
    // Initialiser les composants DevOps
    initDevOpsComponents();
    
    // Démarrer la simulation en temps réel
    startRealTimeSimulation();
});

function initDevOpsDashboard() {
    console.log('🔧 Configuration du dashboard DevOps...');
    
    // Initialiser l'horloge en temps réel
    updateClock();
    setInterval(updateClock, 1000);
    
    // Initialiser l'observation des sections
    initSectionObserver();
    
    // Initialiser les métriques DevOps
    loadDevOpsMetrics();
    
    // Initialiser le simulateur de pipeline
    initPipelineSimulator();
    
    // Initialiser le statut des services
    updateServicesStatus();
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
    
    // Mettre à jour l'horloge DevOps
    const timerElement = document.getElementById('live-timer');
    if (timerElement) {
        timerElement.textContent = timeString;
    }
    
    // Mettre à jour la dernière exécution du pipeline
    const lastRunElement = document.getElementById('pipeline-last-run');
    if (lastRunElement && !isPipelineRunning) {
        const options = { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        };
        lastRunElement.textContent = `Aujourd'hui, ${now.toLocaleTimeString('fr-FR', options)}`;
    }
}

function initSectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                
                // Animation supplémentaire pour les cartes d'équipe
                if (entry.target.classList.contains('team-card')) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

function setupPipelineEventListeners() {
    console.log('🔗 Configuration des événements du pipeline...');
    
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
    
    // Boutons du simulateur de pipeline
    const triggerBtn = document.getElementById('trigger-pipeline');
    if (triggerBtn) {
        triggerBtn.addEventListener('click', () => triggerPipeline());
    }
    
    const simulateErrorBtn = document.getElementById('simulate-error');
    if (simulateErrorBtn) {
        simulateErrorBtn.addEventListener('click', simulatePipelineError);
    }
    
    const simulateCommitBtn = document.getElementById('simulate-commit');
    if (simulateCommitBtn) {
        simulateCommitBtn.addEventListener('click', simulateGitCommit);
    }
    
    // Boutons étape par étape
    document.getElementById('step-test')?.addEventListener('click', () => runPipelineStep('test'));
    document.getElementById('step-build')?.addEventListener('click', () => runPipelineStep('build'));
    document.getElementById('step-deploy')?.addEventListener('click', () => runPipelineStep('deploy'));
    document.getElementById('reset-pipeline')?.addEventListener('click', resetPipeline);
    
    // Boutons de copie de commandes
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const command = this.parentElement.querySelector('.command').textContent;
            copyToClipboard(command, this);
        });
    });
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
    navMenu.classList.toggle('show');
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
            top: targetElement.offsetTop - 120,
            behavior: 'smooth'
        });
        
        // Fermer le menu mobile si ouvert
        const navMenu = document.getElementById('navMenu');
        if (navMenu.classList.contains('show')) {
            toggleMenu();
        }
        
        // Mettre à jour la navigation active
        updateActiveNavLink();
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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
    
    // Animation de chargement
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
    
    // Simuler un appel API CI/CD
    setTimeout(() => {
        // Simuler un log de pipeline
        logToPipeline(`[CONTACT_FORM] Nouveau message de ${name}`, 'info');
        
        // Afficher la notification
        showNotification('Message envoyé avec succès! Notre équipe DevOps vous répondra bientôt.', 'success');
        
        // Réinitialiser le formulaire
        this.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

function loadDevOpsMetrics() {
    console.log('📊 Chargement des métriques DevOps...');
    
    // Simuler le chargement des métriques depuis GitHub/Docker
    const devopsMetrics = {
        commits: Math.floor(Math.random() * 20) + 40,
        builds: Math.floor(Math.random() * 5) + 10,
        deployments: Math.floor(Math.random() * 3) + 5,
        uptime: (98 + Math.random() * 2).toFixed(1) + '%',
        dockerPulls: Math.floor(Math.random() * 50) + 150,
        testCoverage: (85 + Math.random() * 15).toFixed(1) + '%',
        buildTime: (45 + Math.random() * 30).toFixed(0) + 's'
    };
    
    // Mettre à jour l'interface
    updateMetricsUI(devopsMetrics);
    
    // Simuler des mises à jour périodiques
    setInterval(() => {
        devopsMetrics.commits += Math.floor(Math.random() * 3);
        devopsMetrics.dockerPulls += Math.floor(Math.random() * 10);
        updateMetricsUI(devopsMetrics);
    }, 30000);
}

function updateMetricsUI(metrics) {
    const metricElements = {
        'commits-count': metrics.commits,
        'builds-count': metrics.builds,
        'docker-pulls': metrics.dockerPulls,
        'uptime-percent': metrics.uptime,
        'footer-commits': metrics.commits,
        'footer-downloads': metrics.dockerPulls,
        'footer-contributors': 3
    };
    
    Object.keys(metricElements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = metricElements[id];
            
            // Animation
            element.classList.add('pulse');
            setTimeout(() => element.classList.remove('pulse'), 300);
        }
    });
    
    // Mettre à jour les métriques de performance
    document.getElementById('avg-execution-time')?.textContent = metrics.buildTime;
    document.getElementById('success-rate')?.textContent = metrics.uptime;
    document.getElementById('latency')?.textContent = (Math.random() * 50 + 100).toFixed(0) + 'ms';
    document.getElementById('throughput')?.textContent = (Math.random() * 5 + 10).toFixed(0) + '/min';
}

function initDevOpsComponents() {
    console.log('⚙️ Initialisation des composants DevOps...');
    
    // Initialiser le statut des environnements
    initEnvironments();
    
    // Initialiser l'historique des déploiements
    initDeploymentHistory();
    
    // Initialiser le compteur
    initCountdownTimer();
    
    // Démarrer les mises à jour en temps réel
    setInterval(updateRealTimeData, 10000);
}

function initPipelineSimulator() {
    console.log('🔄 Initialisation du simulateur de pipeline...');
    
    // Initialiser les étapes du pipeline
    pipelineSteps.forEach((step, index) => {
        const stepElement = document.getElementById(`step${index + 1}`);
        if (stepElement) {
            stepElement.dataset.step = step;
        }
    });
}

function triggerPipeline() {
    if (isPipelineRunning) {
        showNotification('Le pipeline est déjà en cours d\'exécution.', 'warning');
        return;
    }
    
    console.log('🚀 Démarrage du pipeline CI/CD...');
    showNotification('Pipeline CI/CD démarré!', 'info');
    
    isPipelineRunning = true;
    currentPipelineStep = 0;
    
    // Mettre à jour l'interface
    document.getElementById('system-status').textContent = 'EXÉCUTION';
    document.getElementById('system-status').style.color = 'var(--warning)';
    
    // Démarrer la simulation
    runPipeline();
}

function runPipeline() {
    if (currentPipelineStep >= pipelineSteps.length) {
        completePipeline();
        return;
    }
    
    const step = pipelineSteps[currentPipelineStep];
    console.log(`🔨 Étape ${currentPipelineStep + 1}: ${step}`);
    
    // Mettre à jour l'interface
    updatePipelineStepUI(currentPipelineStep, 'running');
    
    // Simuler l'exécution de l'étape
    const stepDuration = [1000, 2000, 1500, 2500][currentPipelineStep]; // Durées différentes par étape
    
    setTimeout(() => {
        // 90% de chance de succès
        const success = Math.random() > 0.1;
        
        if (success) {
            updatePipelineStepUI(currentPipelineStep, 'success');
            logToPipeline(`✅ Étape "${step}" terminée avec succès`, 'success');
            
            currentPipelineStep++;
            setTimeout(() => runPipeline(), 500); // Délai entre les étapes
        } else {
            updatePipelineStepUI(currentPipelineStep, 'error');
            logToPipeline(`❌ Échec de l'étape "${step}"`, 'error');
            showNotification(`Échec à l'étape ${step}!`, 'error');
            pausePipeline();
        }
        
        // Mettre à jour la barre de progression
        updatePipelineProgress();
        
    }, stepDuration);
}

function runPipelineStep(step) {
    if (isPipelineRunning) {
        showNotification('Veuillez terminer ou réinitialiser le pipeline actuel.', 'warning');
        return;
    }
    
    const stepIndex = pipelineSteps.indexOf(step);
    if (stepIndex === -1) return;
    
    console.log(`▶️ Exécution manuelle: ${step}`);
    
    // Mettre à jour l'interface
    updatePipelineStepUI(stepIndex, 'running');
    
    const stepDuration = [1000, 2000, 1500, 2500][stepIndex];
    
    setTimeout(() => {
        const success = Math.random() > 0.15; // 85% de chance de succès
        updatePipelineStepUI(stepIndex, success ? 'success' : 'error');
        
        if (success) {
            logToPipeline(`✅ Étape "${step}" exécutée avec succès`, 'success');
        } else {
            logToPipeline(`❌ Échec de l'exécution de "${step}"`, 'error');
            showNotification(`Erreur lors de l'exécution de ${step}`, 'error');
        }
    }, stepDuration);
}

function simulatePipelineError() {
    console.log('🐛 Simulation d\'une erreur de pipeline...');
    
    // Choisir une étape aléatoire pour l'erreur
    const errorStep = Math.floor(Math.random() * pipelineSteps.length);
    updatePipelineStepUI(errorStep, 'error');
    
    // Mettre à jour le statut système
    document.getElementById('system-status').textContent = 'ERREUR';
    document.getElementById('system-status').style.color = 'var(--error)';
    
    // Journaliser l'erreur
    logToPipeline(`🚨 ERREUR CRITIQUE détectée à l'étape ${pipelineSteps[errorStep]}`, 'error');
    
    // Afficher l'alerte
    showNotification('Erreur de pipeline simulée! Vérifiez les logs.', 'error');
    
    // Simuler la récupération après 5 secondes
    setTimeout(() => {
        document.getElementById('system-status').textContent = 'ACTIF';
        document.getElementById('system-status').style.color = '';
        updatePipelineStepUI(errorStep, 'pending');
        showNotification('Pipeline restauré avec succès.', 'success');
    }, 5000);
}

function simulateGitCommit() {
    console.log('💾 Simulation d\'un commit Git...');
    
    const commitMessages = [
        'feat: ajout de nouvelles fonctionnalités API',
        'fix: correction du bug de déploiement',
        'docs: mise à jour de la documentation',
        'test: ajout de tests unitaires',
        'refactor: optimisation du code Dockerfile',
        'style: amélioration du formatage CSS',
        'chore: mise à jour des dépendances'
    ];
    
    const randomMessage = commitMessages[Math.floor(Math.random() * commitMessages.length)];
    const commitHash = Math.random().toString(36).substring(2, 10);
    
    logToPipeline(`📝 Commit [${commitHash}]: ${randomMessage}`, 'info');
    showNotification(`Commit simulé: ${randomMessage.substring(0, 30)}...`, 'info');
    
    // Mettre à jour les métriques
    const commitsElement = document.getElementById('commits-count');
    if (commitsElement) {
        const currentCommits = parseInt(commitsElement.textContent) || 0;
        commitsElement.textContent = currentCommits + 1;
        commitsElement.classList.add('pulse');
        setTimeout(() => commitsElement.classList.remove('pulse'), 300);
    }
}

function updatePipelineStepUI(stepIndex, status) {
    const stepElement = document.getElementById(`step${stepIndex + 1}`);
    if (!stepElement) return;
    
    const statusElement = stepElement.querySelector('.step-status');
    if (!statusElement) return;
    
    // Réinitialiser les classes
    stepElement.classList.remove('active', 'error', 'success');
    statusElement.className = 'step-status';
    
    switch (status) {
        case 'running':
            stepElement.classList.add('active');
            statusElement.classList.add('active');
            statusElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> En cours';
            break;
        case 'success':
            stepElement.classList.add('success');
            statusElement.classList.add('completed');
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Terminé';
            break;
        case 'error':
            stepElement.classList.add('error');
            statusElement.classList.add('error');
            statusElement.innerHTML = '<i class="fas fa-times-circle"></i> Erreur';
            break;
        case 'pending':
            statusElement.classList.add('pending');
            statusElement.innerHTML = '<i class="fas fa-clock"></i> En attente';
            break;
    }
}

function updatePipelineProgress() {
    const progress = document.getElementById('pipeline-progress');
    const demoProgress = document.getElementById('demo-progress');
    
    const progressValue = ((currentPipelineStep) / pipelineSteps.length) * 100;
    
    if (progress) {
        progress.style.width = `${progressValue}%`;
    }
    
    if (demoProgress) {
        demoProgress.style.width = `${progressValue}%`;
    }
}

function completePipeline() {
    console.log('🎉 Pipeline terminé avec succès!');
    
    isPipelineRunning = false;
    
    // Mettre à jour le statut
    document.getElementById('system-status').textContent = 'ACTIF';
    document.getElementById('system-status').style.color = '';
    
    // Mettre à jour la dernière exécution
    const now = new Date();
    const lastRunElement = document.getElementById('pipeline-last-run');
    if (lastRunElement) {
        lastRunElement.textContent = `Aujourd'hui, ${now.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    }
    
    // Incrémenter les métriques
    const buildsElement = document.getElementById('builds-count');
    if (buildsElement) {
        const currentBuilds = parseInt(buildsElement.textContent) || 0;
        buildsElement.textContent = currentBuilds + 1;
    }
    
    // Afficher la notification
    showNotification('Pipeline CI/CD terminé avec succès! Déploiement réussi.', 'success');
    
    // Journaliser la réussite
    logToPipeline('🚀 PIPELINE COMPLÉTÉ - Déploiement réussi en production', 'success');
}

function resetPipeline() {
    console.log('🔄 Réinitialisation du pipeline...');
    
    isPipelineRunning = false;
    currentPipelineStep = 0;
    
    // Réinitialiser toutes les étapes
    pipelineSteps.forEach((_, index) => {
        updatePipelineStepUI(index, 'pending');
    });
    
    // Réinitialiser la barre de progression
    updatePipelineProgress();
    
    // Réinitialiser les logs
    const pipelineOutput = document.getElementById('pipeline-output');
    if (pipelineOutput) {
        pipelineOutput.innerHTML = '';
    }
    
    showNotification('Pipeline réinitialisé.', 'info');
}

function pausePipeline() {
    isPipelineRunning = false;
    showNotification('Pipeline en pause - Erreur détectée', 'warning');
}

function initEnvironments() {
    console.log('🌍 Initialisation des environnements...');
    
    const environments = [
        { name: 'Développement', version: 'v1.2.3-dev', status: 'active', color: 'var(--success)' },
        { name: 'Staging', version: 'v1.2.2', status: 'stable', color: 'var(--info)' },
        { name: 'Production', version: 'v1.2.1', status: 'live', color: 'var(--accent)' }
    ];
    
    // Simuler des mises à jour périodiques
    setInterval(() => {
        // Mettre à jour les versions aléatoirement
        environments.forEach(env => {
            if (Math.random() > 0.7) { // 30% de chance de mise à jour
                const parts = env.version.substring(1).split('.');
                parts[2] = parseInt(parts[2]) + 1;
                env.version = `v${parts.join('.')}`;
                
                logToPipeline(`🔄 Mise à jour de ${env.name} vers ${env.version}`, 'info');
            }
        });
    }, 30000);
}

function initDeploymentHistory() {
    const deploymentsList = document.getElementById('deployments-list');
    if (!deploymentsList) return;
    
    const deployments = [
        { id: 'a1b2c3d4', env: 'Production', status: 'success', time: 'Il y a 2 heures', user: 'Thaumy' },
        { id: 'e5f6g7h8', env: 'Staging', status: 'success', time: 'Il y a 4 heures', user: 'cadel' },
        { id: 'i9j0k1l2', env: 'Production', status: 'success', time: 'Il y a 8 heures', user: 'Thaumy' },
        { id: 'm3n4o5p6', env: 'Développement', status: 'failed', time: 'Il y a 12 heures', user: 'stelphin' },
        { id: 'q7r8s9t0', env: 'Staging', status: 'success', time: 'Il y a 1 jour', user: 'cadel' }
    ];
    
    deploymentsList.innerHTML = '';
    deployments.forEach(deploy => {
        const div = document.createElement('div');
        div.className = 'deployment-item';
        div.innerHTML = `
            <div>
                <div class="deployment-id">${deploy.id.substring(0, 8)}</div>
                <div class="deployment-env">${deploy.env} • ${deploy.user}</div>
            </div>
            <div class="deployment-status ${deploy.status}">
                ${deploy.status === 'success' ? '✓ Réussi' : '✗ Échec'}
            </div>
            <div class="deployment-time">${deploy.time}</div>
        `;
        deploymentsList.appendChild(div);
    });
}

function initCountdownTimer() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    let countdown = 60; // 60 secondes
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            countdown = 60;
            countdownElement.textContent = countdown;
            
            // Simuler un événement aléatoire
            if (Math.random() > 0.7) {
                simulateRandomEvent();
            }
        }
    }, 1000);
}

function simulateRandomEvent() {
    const events = [
        { type: 'build', message: 'Build automatique déclenché', icon: '🏗️' },
        { type: 'test', message: 'Exécution des tests planifiés', icon: '🧪' },
        { type: 'deploy', message: 'Déploiement automatique en cours', icon: '🚀' },
        { type: 'alert', message: 'Alerte de performance détectée', icon: '⚠️' }
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    logToPipeline(`${randomEvent.icon} ${randomEvent.message}`, 'info');
    
    // Mettre à jour le statut du système si alerte
    if (randomEvent.type === 'alert') {
        document.getElementById('system-status').textContent = 'ALERTE';
        document.getElementById('system-status').style.color = 'var(--warning)';
        
        setTimeout(() => {
            document.getElementById('system-status').textContent = 'ACTIF';
            document.getElementById('system-status').style.color = '';
        }, 3000);
    }
}

function updateServicesStatus() {
    const servicesContainer = document.getElementById('services-status-list');
    if (!servicesContainer) return;
    
    const services = [
        { name: 'GitHub Actions', type: 'github', description: 'CI/CD Workflows' },
        { name: 'Docker Hub', type: 'docker', description: 'Container Registry' },
        { name: 'Node.js API', type: 'node', description: 'Backend Service' },
        { name: 'Nginx Proxy', type: 'nginx', description: 'Reverse Proxy' },
        { name: 'PostgreSQL', type: 'database', description: 'Database' }
    ];
    
    servicesContainer.innerHTML = '';
    services.forEach(service => {
        const isHealthy = servicesStatus[service.type];
        const div = document.createElement('div');
        div.className = 'service-status-item';
        div.innerHTML = `
            <div class="status-indicator ${isHealthy ? 'active' : 'warning'}"></div>
            <div class="service-info">
                <div class="service-name">${service.name}</div>
                <div class="service-desc">${service.description}</div>
            </div>
            <div class="service-status">
                ${isHealthy ? '✅ Actif' : '⚠️ Dégradé'}
            </div>
        `;
        servicesContainer.appendChild(div);
    });
    
    // Simuler des changements de statut
    setTimeout(() => {
        const randomService = Object.keys(servicesStatus)[Math.floor(Math.random() * Object.keys(servicesStatus).length)];
        servicesStatus[randomService] = !servicesStatus[randomService];
        updateServicesStatus();
        
        if (!servicesStatus[randomService]) {
            logToPipeline(`⚠️ Service ${randomService} dégradé`, 'warning');
            showNotification(`Service ${randomService} en dégradation`, 'warning');
        }
    }, 15000 + Math.random() * 30000);
}

function updateRealTimeData() {
    // Mettre à jour les métriques en temps réel
    const latencyElement = document.getElementById('latency');
    if (latencyElement) {
        const newLatency = Math.floor(Math.random() * 50 + 100);
        latencyElement.textContent = `${newLatency}ms`;
        
        // Animation si changement significatif
        const currentLatency = parseInt(latencyElement.dataset.current || newLatency);
        if (Math.abs(newLatency - currentLatency) > 20) {
            latencyElement.classList.add('shaking');
            setTimeout(() => latencyElement.classList.remove('shaking'), 500);
        }
        latencyElement.dataset.current = newLatency;
    }
    
    // Mettre à jour le débit
    const throughputElement = document.getElementById('throughput');
    if (throughputElement) {
        const newThroughput = Math.floor(Math.random() * 5 + 10);
        throughputElement.textContent = `${newThroughput}/min`;
    }
}

function startRealTimeSimulation() {
    console.log('⏱️ Démarrage de la simulation en temps réel...');
    
    // Simulation du pipeline automatique
    setInterval(() => {
        if (!isPipelineRunning && Math.random() > 0.95) { // 5% de chance de se déclencher
            triggerPipeline();
        }
    }, 30000);
    
    // Mettre à jour l'état des services
    setInterval(updateServicesStatus, 20000);
    
    // Mettre à jour l'historique des déploiements
    setInterval(() => {
        const deploymentsList = document.getElementById('deployments-list');
        if (deploymentsList && Math.random() > 0.8) { // 20% de chance
            const newDeploy = {
                id: Math.random().toString(36).substring(2, 10),
                env: ['Production', 'Staging', 'Développement'][Math.floor(Math.random() * 3)],
                status: Math.random() > 0.1 ? 'success' : 'failed',
                time: 'À l\'instant',
                user: ['Thaumy', 'cadel', 'stelphin'][Math.floor(Math.random() * 3)]
            };
            
            const div = document.createElement('div');
            div.className = 'deployment-item';
            div.innerHTML = `
                <div>
                    <div class="deployment-id">${newDeploy.id}</div>
                    <div class="deployment-env">${newDeploy.env} • ${newDeploy.user}</div>
                </div>
                <div class="deployment-status ${newDeploy.status}">
                    ${newDeploy.status === 'success' ? '✓ Réussi' : '✗ Échec'}
                </div>
                <div class="deployment-time">${newDeploy.time}</div>
            `;
            
            deploymentsList.insertBefore(div, deploymentsList.firstChild);
            
            // Limiter à 5 éléments
            if (deploymentsList.children.length > 5) {
                deploymentsList.removeChild(deploymentsList.lastChild);
            }
        }
    }, 45000);
}

function logToPipeline(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    const logElement = document.getElementById('pipeline-output');
    if (!logElement) return;
    
    const logLine = document.createElement('div');
    logLine.className = `terminal-line ${type}`;
    logLine.textContent = `[${new Date().toLocaleTimeString('fr-FR', { hour12: false })}] ${message}`;
    
    logElement.appendChild(logLine);
    
    // Limiter à 20 lignes
    if (logElement.children.length > 20) {
        logElement.removeChild(logElement.firstChild);
    }
    
    // Scroll automatique
    logElement.scrollTop = logElement.scrollHeight;
}

function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Ajouter au body
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Fermer la notification
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-fermer après 5 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        // Afficher le feedback
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copié!';
        button.style.background = 'var(--success)';
        
        showNotification('Commande copiée dans le presse-papier!', 'success');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Erreur lors de la copie:', err);
        showNotification('Erreur lors de la copie', 'error');
    });
}

// Exposer les fonctions globales
window.DevOpsDashboard = {
    triggerPipeline: triggerPipeline,
    resetPipeline: resetPipeline,
    simulateCommit: simulateGitCommit,
    simulateError: simulatePipelineError,
    toggleMenu: toggleMenu,
    copyCommand: copyToClipboard
};

// Ajouter des styles pour les notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        border-left: 4px solid var(--info);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left-color: var(--success);
    }
    
    .notification.error {
        border-left-color: var(--error);
    }
    
    .notification.warning {
        border-left-color: var(--warning);
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification.success i {
        color: var(--success);
    }
    
    .notification.error i {
        color: var(--error);
    }
    
    .notification.warning i {
        color: var(--warning);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--gray);
        cursor: pointer;
        margin-left: auto;
        padding: 5px;
    }
    
    .pulse {
        animation: pulse 0.3s ease;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .shaking {
        animation: shake 0.5s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

console.log('✅ Dashboard DevOps initialisé avec succès!');