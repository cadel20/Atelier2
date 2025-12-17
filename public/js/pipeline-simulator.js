// ===== SIMULATEUR AVANCÉ DE PIPELINE CI/CD =====

class CICDPipelineSimulator {
    constructor() {
        this.steps = [
            { id: 'step1', name: 'Commit GitHub', icon: 'fa-code', duration: 1000 },
            { id: 'step2', name: 'Tests Automatisés', icon: 'fa-vial', duration: 3000 },
            { id: 'step3', name: 'Build Docker', icon: 'fa-docker', duration: 4000 },
            { id: 'step4', name: 'Déploiement', icon: 'fa-cloud-upload-alt', duration: 2000 }
        ];
        
        this.currentStep = 0;
        this.isRunning = false;
        this.hasError = false;
        this.pipelineHistory = [];
        this.successRate = 0.92; // 92% de succès
        
        // Cache pour les éléments DOM fréquemment utilisés
        this.domElements = {};
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initialisation du simulateur de pipeline CI/CD avancé');
        this.cacheDOMElements();
        this.setupEventListeners();
        this.loadPipelineHistory();
        this.updateSuccessRate();
        this.setupAutoCommitSimulation();
    }
    
    cacheDOMElements() {
        // Éléments fréquemment utilisés
        const elements = {
            'pipeline-output': 'pipeline-output',
            'demo-progress': 'demo-progress',
            'pipeline-progress': 'pipeline-progress',
            'system-status': 'system-status',
            'pipeline-last-run': 'pipeline-last-run',
            'pipeline-next-run': 'pipeline-next-run',
            'countdown': 'countdown',
            'trigger-pipeline': 'trigger-pipeline',
            'simulate-error': 'simulate-error',
            'simulate-commit': 'simulate-commit',
            'step-test': 'step-test',
            'step-build': 'step-build',
            'step-deploy': 'step-deploy',
            'reset-pipeline': 'reset-pipeline'
        };
        
        Object.entries(elements).forEach(([key, id]) => {
            this.domElements[key] = document.getElementById(id);
        });
    }
    
    setupEventListeners() {
        // Gestion des boutons de contrôle
        this.addButtonListeners();
        
        // Gestion des étapes individuelles
        this.addStepButtonsListeners();
        
        // Gestion des raccourcis clavier
        this.setupKeyboardShortcuts();
    }
    
    addButtonListeners() {
        const buttons = {
            'trigger-pipeline': () => this.runPipeline(),
            'simulate-error': () => this.forcePipelineError(),
            'simulate-commit': () => this.simulateRealisticCommit(),
            'reset-pipeline': () => this.resetPipelineWithAnimation()
        };
        
        Object.entries(buttons).forEach(([id, handler]) => {
            if (this.domElements[id]) {
                this.domElements[id].addEventListener('click', handler);
            }
        });
    }
    
    addStepButtonsListeners() {
        const stepButtons = {
            'step-test': () => this.runSpecificStep(1),
            'step-build': () => this.runSpecificStep(2),
            'step-deploy': () => this.runSpecificStep(3)
        };
        
        Object.entries(stepButtons).forEach(([id, handler]) => {
            if (this.domElements[id]) {
                this.domElements[id].addEventListener('click', handler);
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignorer si on est dans un input
            if (e.target.matches('input, textarea, select')) return;
            
            // Ctrl + P pour démarrer le pipeline
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                this.runPipeline();
            }
            
            // Ctrl + R pour réinitialiser
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.resetPipelineWithAnimation();
            }
            
            // Ctrl + E pour simuler une erreur
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.forcePipelineError();
            }
        });
    }
    
    setupAutoCommitSimulation() {
        // Simuler des commits automatiques toutes les 2-5 minutes
        const randomInterval = () => Math.floor(Math.random() * 180000) + 120000;
        
        const scheduleNextCommit = () => {
            setTimeout(() => {
                if (Math.random() > 0.3 && !this.isRunning) { // 70% de chance
                    this.simulateRealisticCommit();
                }
                scheduleNextCommit();
            }, randomInterval());
        };
        
        scheduleNextCommit();
    }
    
    resetPipelineWithAnimation() {
        this.showLoadingAnimation('Réinitialisation du pipeline...');
        
        // Animation de réinitialisation étape par étape
        this.steps.forEach((step, index) => {
            setTimeout(() => {
                this.resetStep(step.id);
                
                if (index === this.steps.length - 1) {
                    this.resetPipeline();
                    this.hideLoadingAnimation();
                    this.log('[INFO] Pipeline complètement réinitialisé', 'info');
                    this.showNotification('Pipeline réinitialisé', 'info');
                }
            }, index * 200);
        });
    }
    
    resetStep(stepId) {
        const element = document.getElementById(stepId);
        if (!element) return;
        
        element.classList.remove('active', 'error', 'success', 'shaking');
        const status = element.querySelector('.step-status');
        if (status) {
            status.className = 'step-status pending';
            status.innerHTML = '<i class="fas fa-clock"></i> En attente';
        }
        
        // Animation de sortie
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = '';
        }, 200);
    }
    
    resetPipeline() {
        this.currentStep = 0;
        this.isRunning = false;
        this.hasError = false;
        
        // Réinitialiser les barres de progression
        this.updateProgress(0);
        
        // Vider les logs
        if (this.domElements['pipeline-output']) {
            this.domElements['pipeline-output'].innerHTML = '';
        }
        
        // Réinitialiser le statut système
        if (this.domElements['system-status']) {
            this.domElements['system-status'].textContent = 'ACTIF';
            this.domElements['system-status'].style.color = '';
        }
        
        // Réactiver la première étape
        const firstStep = document.getElementById('step1');
        if (firstStep) {
            firstStep.classList.add('active');
            const status = firstStep.querySelector('.step-status');
            if (status) {
                status.className = 'step-status active';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Actif';
            }
        }
        
        // Réactiver les boutons
        this.enableControls(true);
    }
    
    async runPipeline() {
        if (this.isRunning) {
            this.showNotification('Le pipeline est déjà en cours d\'exécution', 'warning');
            return;
        }
        
        console.log('🔨 Démarrage du pipeline CI/CD...');
        this.isRunning = true;
        this.hasError = false;
        
        // Initialisation
        this.resetPipeline();
        this.enableControls(false);
        
        // Mise à jour du statut
        if (this.domElements['system-status']) {
            this.domElements['system-status'].textContent = 'EXÉCUTION';
            this.domElements['system-status'].style.color = 'var(--warning)';
        }
        
        this.log('[🚀] Démarrage du workflow CI/CD...', 'info');
        this.log('[📦] Récupération du code source depuis GitHub...', 'info');
        
        try {
            for (let i = 0; i < this.steps.length; i++) {
                await this.executeStep(i);
                if (this.hasError) break;
                
                // Mettre à jour la progression
                this.updateProgress((i + 1) * 25);
            }
            
            if (!this.hasError) {
                await this.completePipeline();
            }
            
        } catch (error) {
            this.log(`[💥] ERREUR CRITIQUE: ${error.message}`, 'error');
            this.handlePipelineFailure(error);
        } finally {
            this.isRunning = false;
            this.enableControls(true);
            this.recordPipelineRun();
        }
    }
    
    async executeStep(stepIndex) {
        const step = this.steps[stepIndex];
        this.currentStep = stepIndex;
        
        // Animation de démarrage
        const stepElement = document.getElementById(step.id);
        if (stepElement) {
            stepElement.classList.add('active');
            stepElement.classList.remove('error', 'success');
            
            const status = stepElement.querySelector('.step-status');
            if (status) {
                status.className = 'step-status running';
                status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> En cours';
            }
            
            // Animation d'entrée
            stepElement.style.transform = 'scale(1.05)';
            setTimeout(() => {
                stepElement.style.transform = '';
            }, 300);
        }
        
        // Log de début
        this.log(`[⚙️] Démarrage: ${step.name}`, 'info');
        
        // Simuler l'exécution avec un délai réaliste
        const stepDuration = step.duration + Math.random() * 1000;
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simuler une chance d'échec (basée sur le taux de succès)
                const shouldFail = Math.random() > this.successRate;
                
                if (shouldFail && !this.hasError) {
                    this.hasError = true;
                    this.handleStepFailure(stepIndex, step);
                    reject(new Error(`Échec de l'étape: ${step.name}`));
                } else {
                    this.handleStepSuccess(stepIndex, step);
                    resolve();
                }
            }, stepDuration);
        });
    }
    
    handleStepSuccess(stepIndex, step) {
        const stepElement = document.getElementById(step.id);
        if (stepElement) {
            stepElement.classList.add('success');
            stepElement.classList.remove('error', 'shaking');
            
            const status = stepElement.querySelector('.step-status');
            if (status) {
                status.className = 'step-status completed';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Terminé';
            }
            
            // Animation de succès
            this.playSuccessAnimation(stepElement);
        }
        
        // Log de succès
        this.log(`[✅] ${step.name}: Succès`, 'success');
        
        // Messages spécifiques selon l'étape
        const stepMessages = {
            0: '[📝] Commit validé: 3 fichiers modifiés, tests unitaires OK',
            1: '[🧪] 42 tests passés, couverture de code: 94%',
            2: '[🐳] Image Docker construite: taille 245MB, étiquetage v1.2.3',
            3: '[🚀] Déploiement réussi sur production, vérification santé...'
        };
        
        if (stepMessages[stepIndex]) {
            this.log(stepMessages[stepIndex], 'success');
        }
    }
    
    handleStepFailure(stepIndex, step) {
        const stepElement = document.getElementById(step.id);
        if (stepElement) {
            stepElement.classList.add('error', 'shaking');
            stepElement.classList.remove('success');
            
            const status = stepElement.querySelector('.step-status');
            if (status) {
                status.className = 'step-status error';
                status.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erreur';
            }
        }
        
        // Messages d'erreur spécifiques
        const errorMessages = [
            '[❌] Échec du commit: Conflit de fusion détecté',
            '[❌] Échec des tests: 3 tests unitaires échoués',
            '[❌] Échec du build: Image Docker trop volumineuse (>500MB)',
            '[❌] Échec du déploiement: Serveur de production non disponible'
        ];
        
        this.log(errorMessages[stepIndex], 'error');
        this.log('[🔧] Lancement de la procédure de récupération...', 'warning');
        
        // Mettre à jour le statut système
        if (this.domElements['system-status']) {
            this.domElements['system-status'].textContent = 'ERREUR';
            this.domElements['system-status'].style.color = 'var(--error)';
        }
        
        // Désactiver les boutons
        this.enableControls(false);
        
        // Simuler une tentative de récupération
        setTimeout(() => {
            this.attemptRecovery(stepIndex);
        }, 2000);
    }
    
    async completePipeline() {
        this.log('[🎉] PIPELINE CI/CD TERMINÉ AVEC SUCCÈS!', 'success');
        this.log('[📊] Toutes les vérifications passées, déploiement validé', 'success');
        
        // Mettre à jour la barre de progression
        this.updateProgress(100);
        
        // Animation de célébration
        this.playCelebrationAnimation();
        
        // Mettre à jour les métriques
        if (window.ciCdMetrics) {
            window.ciCdMetrics.triggerManualDeployment('Production');
        }
        
        // Mettre à jour le timestamp
        if (this.domElements['pipeline-last-run']) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            this.domElements['pipeline-last-run'].textContent = `Aujourd'hui, ${timeString}`;
        }
        
        // Notification de succès
        this.showNotification('Pipeline CI/CD terminé avec succès! Déploiement réussi en production.', 'success');
        
        // Augmenter légèrement le taux de succès
        this.successRate = Math.min(this.successRate + 0.01, 0.99);
        this.updateSuccessRate();
    }
    
    handlePipelineFailure(error) {
        this.log('[💀] PIPELINE CI/CD EN ÉCHEC', 'error');
        this.log(`[📋] Cause: ${error.message}`, 'error');
        this.log('[🔔] Notification envoyée à l\'équipe DevOps', 'warning');
        
        // Diminuer légèrement le taux de succès
        this.successRate = Math.max(this.successRate - 0.05, 0.5);
        this.updateSuccessRate();
        
        // Notification d'échec
        this.showNotification('Pipeline CI/CD en échec. L\'équipe DevOps a été notifiée.', 'error');
    }
    
    attemptRecovery(stepIndex) {
        this.log('[🔄] Tentative de récupération automatique...', 'warning');
        
        // Simuler une récupération
        setTimeout(() => {
            if (Math.random() > 0.3) { // 70% de chance de récupération
                this.log('[✅] Récupération réussie! Reprise du pipeline...', 'success');
                this.hasError = false;
                this.executeStep(stepIndex).then(() => {
                    // Continuer avec les étapes suivantes
                    this.resumePipelineFromStep(stepIndex + 1);
                });
            } else {
                this.log('[❌] Échec de la récupération. Pipeline bloqué.', 'error');
                this.showNotification('Récupération automatique échouée. Intervention manuelle requise.', 'error');
            }
        }, 2000);
    }
    
    async resumePipelineFromStep(stepIndex) {
        for (let i = stepIndex; i < this.steps.length; i++) {
            if (this.hasError) break;
            await this.executeStep(i);
            this.updateProgress((i + 1) * 25);
        }
        
        if (!this.hasError) {
            await this.completePipeline();
        }
    }
    
    async runSpecificStep(stepNumber) {
        if (this.isRunning) {
            this.showNotification('Veuillez terminer le pipeline en cours', 'warning');
            return;
        }
        
        const stepIndex = stepNumber - 1;
        if (stepIndex < 0 || stepIndex >= this.steps.length) return;
        
        this.isRunning = true;
        this.enableControls(false);
        
        try {
            await this.executeStep(stepIndex);
        } catch (error) {
            this.log(`[❌] Échec de l'exécution manuelle: ${error.message}`, 'error');
        } finally {
            this.isRunning = false;
            this.enableControls(true);
        }
    }
    
    forcePipelineError() {
        if (this.isRunning && !this.hasError) {
            this.hasError = true;
            const currentStep = this.steps[this.currentStep];
            this.handleStepFailure(this.currentStep, currentStep);
            this.log('[⚠️] Erreur forcée par l\'utilisateur', 'warning');
            this.showNotification('Erreur forcée dans le pipeline', 'warning');
        }
    }
    
    simulateRealisticCommit() {
        if (this.isRunning) return;
        
        const commitMessages = [
            'feat: ajout de l\'endpoint API /metrics',
            'fix: correction du bug de déploiement sur Kubernetes',
            'docs: mise à jour du README avec les commandes Docker',
            'test: ajout des tests d\'intégration pour le module auth',
            'refactor: optimisation du Dockerfile multi-stage',
            'style: amélioration du responsive du dashboard',
            'chore: mise à jour des dépendances de sécurité',
            'ci: ajout du cache npm dans GitHub Actions',
            'perf: optimisation des requêtes de base de données',
            'build: configuration des variables d\'environnement'
        ];
        
        const commitTypes = ['feature', 'bugfix', 'hotfix', 'release'];
        const branches = ['main', 'develop', 'feature/auth', 'release/v1.3'];
        
        const randomCommit = commitMessages[Math.floor(Math.random() * commitMessages.length)];
        const randomType = commitTypes[Math.floor(Math.random() * commitTypes.length)];
        const randomBranch = branches[Math.floor(Math.random() * branches.length)];
        const commitHash = Math.random().toString(36).substring(2, 10);
        
        // Animation du compte à rebours
        if (this.domElements['countdown']) {
            this.domElements['countdown'].style.color = 'var(--primary)';
            this.domElements['countdown'].textContent = '3';
            
            let count = 3;
            const interval = setInterval(() => {
                count--;
                if (count > 0) {
                    this.domElements['countdown'].textContent = count.toString();
                } else if (count === 0) {
                    this.domElements['countdown'].textContent = 'Commit!';
                    clearInterval(interval);
                    
                    setTimeout(() => {
                        this.domElements['countdown'].textContent = '--';
                        this.processCommit(commitHash, randomCommit, randomType, randomBranch);
                    }, 500);
                }
            }, 1000);
        }
    }
    
    processCommit(hash, message, type, branch) {
        this.log(`[📝] Commit détecté: ${hash.substring(0, 8)}`, 'info');
        this.log(`[🌿] Branche: ${branch}`, 'info');
        this.log(`[📋] Message: ${message}`, 'info');
        this.log(`[🏷️] Type: ${type}`, 'info');
        
        // Mettre à jour le compteur de commits
        this.incrementCommitCounter();
        
        // Déclencher automatiquement le pipeline pour les branches principales
        if (branch === 'main' || branch === 'develop') {
            setTimeout(() => {
                this.log(`[🚀] Déclenchement automatique du pipeline pour ${branch}`, 'info');
                this.runPipeline();
            }, 1000);
        } else {
            this.log(`[⏸️] Pipeline en attente pour merge request sur ${branch}`, 'info');
            this.showNotification(`Commit détecté sur ${branch}. Pipeline en attente de validation.`, 'info');
        }
    }
    
    incrementCommitCounter() {
        const counter = document.getElementById('commits-count');
        if (counter) {
            const current = parseInt(counter.textContent) || 0;
            counter.textContent = current + 1;
            
            // Animation
            counter.classList.add('pulse');
            setTimeout(() => counter.classList.remove('pulse'), 300);
        }
    }
    
    updateProgress(percentage) {
        const progressBars = ['demo-progress', 'pipeline-progress'];
        
        progressBars.forEach(id => {
            if (this.domElements[id]) {
                this.domElements[id].style.width = `${percentage}%`;
                
                // Animation fluide
                this.domElements[id].style.transition = 'width 0.5s ease';
            }
        });
    }
    
    updateSuccessRate() {
        const successElement = document.getElementById('build-success-rate');
        if (successElement) {
            successElement.textContent = `${(this.successRate * 100).toFixed(1)}%`;
            
            // Colorer selon le taux
            if (this.successRate >= 0.95) {
                successElement.style.color = 'var(--success)';
            } else if (this.successRate >= 0.85) {
                successElement.style.color = 'var(--warning)';
            } else {
                successElement.style.color = 'var(--error)';
            }
        }
    }
    
    enableControls(enabled) {
        const controlIds = [
            'trigger-pipeline', 'simulate-error', 'simulate-commit',
            'step-test', 'step-build', 'step-deploy', 'reset-pipeline'
        ];
        
        controlIds.forEach(id => {
            if (this.domElements[id]) {
                this.domElements[id].disabled = !enabled;
                this.domElements[id].style.opacity = enabled ? '1' : '0.6';
            }
        });
    }
    
    log(message, type = 'info') {
        if (!this.domElements['pipeline-output']) return;
        
        const line = document.createElement('div');
        line.className = `terminal-line terminal-${type}`;
        
        const timestamp = new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        line.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
        
        this.domElements['pipeline-output'].appendChild(line);
        
        // Scroll automatique
        this.domElements['pipeline-output'].scrollTop = this.domElements['pipeline-output'].scrollHeight;
        
        // Log dans la console
        console.log(`[CICD] ${message}`);
    }
    
    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`[Notification ${type}]: ${message}`);
        }
    }
    
    showLoadingAnimation(message) {
        // Créer l'overlay de chargement
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <i class="fas fa-spinner fa-spin"></i>
                <div class="loading-text">${message}</div>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);
        
        // Stocker la référence pour la retirer plus tard
        this.loadingOverlay = loadingOverlay;
    }
    
    hideLoadingAnimation() {
        if (this.loadingOverlay) {
            this.loadingOverlay.remove();
            this.loadingOverlay = null;
        }
    }
    
    playSuccessAnimation(element) {
        if (!element) return;
        
        // Animation de particules
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'success-particle';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.setProperty('--angle', `${(i * 45)}deg`);
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }
    
    playCelebrationAnimation() {
        // Confettis
        const colors = ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }
    }
    
    recordPipelineRun() {
        const run = {
            timestamp: new Date(),
            steps: this.steps.length,
            success: !this.hasError,
            duration: this.getEstimatedDuration(),
            errorStep: this.hasError ? this.currentStep : null
        };
        
        this.pipelineHistory.unshift(run);
        
        // Garder seulement les 20 derniers runs
        if (this.pipelineHistory.length > 20) {
            this.pipelineHistory = this.pipelineHistory.slice(0, 20);
        }
        
        // Sauvegarder dans localStorage pour persistance
        this.saveHistory();
    }
    
    getEstimatedDuration() {
        let duration = 0;
        for (let i = 0; i <= this.currentStep; i++) {
            duration += this.steps[i].duration;
        }
        return duration;
    }
    
    loadPipelineHistory() {
        try {
            const saved = localStorage.getItem('cicdPipelineHistory');
            if (saved) {
                this.pipelineHistory = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Impossible de charger l\'historique du pipeline:', e);
        }
    }
    
    saveHistory() {
        try {
            localStorage.setItem('cicdPipelineHistory', JSON.stringify(this.pipelineHistory));
        } catch (e) {
            console.warn('Impossible de sauvegarder l\'historique du pipeline:', e);
        }
    }
    
    getHistoryStats() {
        const totalRuns = this.pipelineHistory.length;
        const successfulRuns = this.pipelineHistory.filter(r => r.success).length;
        const avgDuration = totalRuns > 0 
            ? this.pipelineHistory.reduce((sum, r) => sum + r.duration, 0) / totalRuns 
            : 0;
        
        return {
            totalRuns,
            successRate: totalRuns > 0 ? (successfulRuns / totalRuns * 100).toFixed(1) : '0.0',
            avgDuration: `${Math.floor(avgDuration / 1000)}s`
        };
    }
}

// Initialiser le simulateur
document.addEventListener('DOMContentLoaded', () => {
    window.cicdPipeline = new CICDPipelineSimulator();
    
    // Exposer des méthodes globales
    window.runPipeline = () => window.cicdPipeline.runPipeline();
    window.resetPipeline = () => window.cicdPipeline.resetPipelineWithAnimation();
    
    console.log('✅ Simulateur de pipeline CI/CD prêt!');
    console.log('📝 Commandes disponibles:');
    console.log('   - runPipeline() : Démarrer le pipeline');
    console.log('   - resetPipeline() : Réinitialiser le pipeline');
    console.log('   - window.cicdPipeline : Accès complet au simulateur');
});

// Styles additionnels pour les animations
const pipelineStyles = `
    /* Animations pour le pipeline */
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .pulse {
        animation: pulse 0.3s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .shaking {
        animation: shake 0.5s ease;
    }
    
    /* Particules de succès */
    .success-particle {
        position: fixed;
        width: 6px;
        height: 6px;
        background: var(--success);
        border-radius: 50%;
        z-index: 1000;
        pointer-events: none;
        animation: particleExplode 1s ease-out forwards;
    }
    
    @keyframes particleExplode {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: 
                translate(
                    calc(cos(var(--angle)) * 50px),
                    calc(sin(var(--angle)) * 50px)
                ) 
                scale(0);
            opacity: 0;
        }
    }
    
    /* Confettis */
    .confetti {
        position: fixed;
        width: 10px;
        height: 20px;
        opacity: 0.8;
        z-index: 999;
        pointer-events: none;
        animation: confettiFall 3s ease-in forwards;
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    /* Overlay de chargement */
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    }
    
    .loading-content {
        text-align: center;
        padding: 30px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        border: 1px solid var(--border-color);
    }
    
    .loading-content i {
        font-size: 2rem;
        color: var(--primary);
        margin-bottom: 15px;
    }
    
    .loading-text {
        color: var(--dark);
        font-weight: 500;
    }
    
    /* Améliorations des logs */
    .terminal-line {
        padding: 8px 12px;
        border-bottom: 1px solid rgba(0,0,0,0.05);
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .terminal-line:last-child {
        border-bottom: none;
    }
    
    .terminal-line.info {
        color: var(--info);
        background: rgba(59, 130, 246, 0.05);
    }
    
    .terminal-line.success {
        color: var(--success);
        background: rgba(16, 185, 129, 0.05);
    }
    
    .terminal-line.error {
        color: var(--error);
        background: rgba(239, 68, 68, 0.05);
    }
    
    .terminal-line.warning {
        color: var(--warning);
        background: rgba(245, 158, 11, 0.05);
    }
    
    .timestamp {
        color: var(--gray);
        margin-right: 10px;
        font-size: 0.85rem;
    }
    
    /* État des étapes */
    .step-status {
        transition: all 0.3s ease;
    }
    
    .step-status.running {
        color: var(--primary);
    }
    
    .step-status.completed {
        color: var(--success);
    }
    
    .step-status.error {
        color: var(--error);
    }
    
    .step-status.pending {
        color: var(--gray);
    }
    
    /* Améliorations des barres de progression */
    .pipeline-progress-bar {
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        background: linear-gradient(90deg, 
            var(--primary) 0%, 
            var(--accent) 50%, 
            var(--secondary) 100%);
        background-size: 200% 100%;
        animation: progressShimmer 2s infinite linear;
    }
    
    @keyframes progressShimmer {
        0% { background-position: 200% 0; }
        100% { background-position: 0 0; }
    }
    
    /* États des étapes */
    .pipeline-step {
        transition: all 0.3s ease;
    }
    
    .pipeline-step.active {
        box-shadow: 0 5px 20px rgba(37, 99, 235, 0.1);
        transform: translateX(5px);
    }
    
    .pipeline-step.success {
        border-left-color: var(--success);
        background: rgba(16, 185, 129, 0.05);
    }
    
    .pipeline-step.error {
        border-left-color: var(--error);
        background: rgba(239, 68, 68, 0.05);
    }
`;

// Ajouter les styles
const pipelineStyleSheet = document.createElement('style');
pipelineStyleSheet.textContent = pipelineStyles;
document.head.appendChild(pipelineStyleSheet);