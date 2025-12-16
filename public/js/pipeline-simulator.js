// ===== SIMULATEUR DE PIPELINE CI/CD =====

class PipelineSimulator {
    constructor() {
        this.currentStep = 1;
        this.steps = ['step1', 'step2', 'step3', 'step4'];
        this.isRunning = false;
        this.hasError = false;
        this.stepNames = ['Commit', 'Tests automatisés', 'Build Docker', 'Déploiement'];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.resetPipeline();
    }
    
    setupEventListeners() {
        // Bouton de déclenchement
        const triggerBtn = document.getElementById('trigger-pipeline');
        if (triggerBtn) {
            triggerBtn.addEventListener('click', () => this.runPipeline());
        }
        
        // Boutons d'étapes individuelles
        const stepBtns = ['step-test', 'step-build', 'step-deploy'];
        stepBtns.forEach((btnId, index) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => this.runStep(index + 1));
            }
        });
        
        // Réinitialisation
        const resetBtn = document.getElementById('reset-pipeline');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetPipeline());
        }
        
        // Simulation d'erreur
        const errorBtn = document.getElementById('simulate-error');
        if (errorBtn) {
            errorBtn.addEventListener('click', () => this.simulateError());
        }
        
        // Simulation de commit
        const commitBtn = document.getElementById('simulate-commit');
        if (commitBtn) {
            commitBtn.addEventListener('click', () => this.simulateCommit());
        }
    }
    
    resetPipeline() {
        this.steps.forEach(step => {
            const element = document.getElementById(step);
            if (element) {
                element.classList.remove('active', 'shaking');
                const status = element.querySelector('span:last-child');
                if (status) {
                    status.innerHTML = '<i class="fas fa-clock"></i> En attente';
                    status.style.color = 'var(--gray)';
                }
            }
        });
        
        // Réactiver la première étape
        const firstStep = document.getElementById('step1');
        if (firstStep) {
            firstStep.classList.add('active');
            const status = firstStep.querySelector('span:last-child');
            if (status) {
                status.innerHTML = '<i class="fas fa-check-circle"></i> Actif';
                status.style.color = 'var(--secondary)';
            }
        }
        
        // Réinitialiser la progression
        const progressBar = document.getElementById('demo-progress');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        
        // Réinitialiser les variables
        this.currentStep = 1;
        this.hasError = false;
        this.isRunning = false;
        
        // Vider les logs
        const output = document.getElementById('pipeline-output');
        if (output) {
            output.innerHTML = '';
        }
        
        // Réactiver les boutons
        this.toggleButtons(true);
        
        this.log('[INFO] Pipeline réinitialisé', 'info');
    }
    
    async runPipeline() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.resetPipeline();
        this.log('[INFO] Démarrage du pipeline CI/CD...', 'info');
        
        try {
            for (let i = 0; i < this.steps.length; i++) {
                await this.simulateStep(i, this.stepNames[i]);
                if (this.hasError) break;
            }
            
            if (!this.hasError) {
                this.log('[SUCCÈS] Pipeline CI/CD terminé avec succès!', 'success');
                
                // Mettre à jour la progression finale
                const progressBar = document.getElementById('demo-progress');
                if (progressBar) {
                    progressBar.style.width = '100%';
                }
                
                // Mettre à jour le dernier run
                const lastRun = document.getElementById('pipeline-last-run');
                if (lastRun) {
                    const now = new Date();
                    lastRun.textContent = `Aujourd'hui, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                }
            }
        } catch (error) {
            this.log(`[ERREUR] ${error.message}`, 'error');
        } finally {
            this.isRunning = false;
        }
    }
    
    async simulateStep(stepIndex, stepName) {
        return new Promise((resolve, reject) => {
            const step = this.steps[stepIndex];
            const element = document.getElementById(step);
            
            if (!element) {
                reject(new Error(`Élément ${step} non trouvé`));
                return;
            }
            
            // Démarrage de l'étape
            element.classList.add('active');
            const status = element.querySelector('span:last-child');
            if (status) {
                status.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> En cours';
                status.style.color = 'var(--primary)';
            }
            
            this.log(`[INFO] Démarrage de l'étape: ${stepName}...`, 'info');
            
            // Simulation avec délai réaliste
            const delay = 1500 + Math.random() * 1000;
            
            setTimeout(() => {
                // Simulation d'erreur aléatoire (10% de chance)
                if (!this.hasError && Math.random() < 0.1) {
                    this.hasError = true;
                    element.classList.add('shaking');
                    
                    if (status) {
                        status.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erreur';
                        status.style.color = 'var(--error)';
                    }
                    
                    this.log(`[ERREUR] Échec de l'étape ${stepName}`, 'error');
                    this.log(`[DÉTAIL] Test unitaire échoué: test_api_connection()`, 'error');
                    
                    // Mettre à jour le statut système
                    const systemStatus = document.getElementById('system-status');
                    if (systemStatus) {
                        systemStatus.textContent = 'ERREUR';
                        systemStatus.style.color = 'var(--error)';
                    }
                    
                    // Désactiver les boutons
                    this.toggleButtons(false);
                    
                    reject(new Error(`Échec de ${stepName}`));
                } else {
                    // Succès
                    if (status) {
                        status.innerHTML = '<i class="fas fa-check-circle"></i> Terminé';
                        status.style.color = 'var(--secondary)';
                    }
                    
                    this.log(`[SUCCÈS] Étape ${stepName} terminée`, 'success');
                    
                    // Mise à jour de la progression
                    const progressBar = document.getElementById('demo-progress');
                    if (progressBar) {
                        const progress = ((stepIndex + 1) / this.steps.length) * 100;
                        progressBar.style.width = `${progress}%`;
                    }
                    
                    resolve();
                }
            }, delay);
        });
    }
    
    async runStep(stepNumber) {
        if (stepNumber === this.currentStep) {
            await this.simulateStep(stepNumber - 1, this.stepNames[stepNumber - 1]);
            this.currentStep++;
        }
    }
    
    simulateError() {
        this.hasError = true;
        this.log('[SIMULATION] Erreur forcée déclenchée', 'warning');
    }
    
    simulateCommit() {
        const countdown = document.getElementById('countdown');
        if (!countdown) return;
        
        let count = 3;
        
        countdown.textContent = count;
        countdown.style.color = 'var(--primary)';
        
        this.log('[INFO] Simulation de commit GitHub...', 'info');
        
        const interval = setInterval(() => {
            count--;
            countdown.textContent = count;
            
            if (count === 0) {
                clearInterval(interval);
                countdown.textContent = 'Déclenchement...';
                countdown.style.color = 'var(--secondary)';
                
                setTimeout(() => {
                    this.runPipeline();
                    countdown.textContent = 'En cours...';
                }, 500);
            }
        }, 1000);
    }
    
    log(message, type = 'info') {
        const output = document.getElementById('pipeline-output');
        if (!output) return;
        
        const line = document.createElement('div');
        line.className = `terminal-line terminal-${type}`;
        line.textContent = message;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
        
        // Également log dans la console
        console.log(`[Pipeline] ${message}`);
    }
    
    toggleButtons(enabled) {
        const buttonIds = ['step-test', 'step-build', 'step-deploy', 'trigger-pipeline'];
        buttonIds.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.disabled = !enabled;
            }
        });
    }
}

// Initialiser le simulateur quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    window.pipelineSimulator = new PipelineSimulator();
});