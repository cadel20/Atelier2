// ===== MISE À JOUR DES MÉTRIQUES EN TEMPS RÉEL CI/CD =====

class CI_CDMetricsUpdater {
    constructor() {
        this.metrics = {
            avgExecutionTime: '2m 34s',
            successRate: '98.7%',
            latency: '142ms',
            throughput: '12/min',
            buildTime: '1m 25s',
            testCoverage: '94.2%',
            deploymentFrequency: '3.2/jour',
            leadTime: '45min'
        };
        
        this.deployments = [];
        this.services = [
            { id: 'github', name: 'GitHub Actions', status: 'up', description: 'CI/CD Workflows' },
            { id: 'docker', name: 'Docker Registry', status: 'up', description: 'Container Registry' },
            { id: 'node', name: 'Node.js API', status: 'up', description: 'Application Backend' },
            { id: 'nginx', name: 'Nginx Proxy', status: 'up', description: 'Reverse Proxy & Load Balancer' },
            { id: 'postgres', name: 'PostgreSQL', status: 'up', description: 'Database Server' },
            { id: 'monitoring', name: 'Grafana', status: 'up', description: 'Monitoring Dashboard' }
        ];
        
        this.init();
    }
    
    async init() {
        console.log('📊 Initialisation du système de métriques CI/CD...');
        await this.loadRealTimeMetrics();
        this.renderMetrics();
        this.renderDeployments();
        this.renderServices();
        
        // Mettre à jour périodiquement
        setInterval(() => this.updateMetrics(), 10000); // Toutes les 10 secondes
        
        // Mettre à jour les services toutes les 15 secondes
        setInterval(() => this.updateServicesStatus(), 15000);
        
        // Simuler un pipeline réussi toutes les 2 minutes
        setInterval(() => this.simulateSuccessfulPipeline(), 120000);
    }
    
    async loadRealTimeMetrics() {
        try {
            // Dans un environnement réel, on appellerait des APIs DevOps
            // - GitHub Actions API pour les statistiques de build
            // - Docker Hub API pour les pulls
            // - Prometheus/Grafana pour les métriques système
            // - Base de données pour l'historique
            
            this.simulateRealisticMetrics();
            
        } catch (error) {
            console.error('Erreur de chargement des métriques CI/CD:', error);
            this.useFallbackMetrics();
        }
    }
    
    simulateRealisticMetrics() {
        // Simuler des métriques DevOps réalistes
        const now = new Date();
        const hour = now.getHours();
        
        // Augmenter le trafic pendant les heures de bureau
        const trafficMultiplier = hour >= 9 && hour <= 17 ? 1.5 : 0.8;
        
        this.metrics = {
            avgExecutionTime: `${Math.floor(Math.random() * 2) + 1}m ${Math.floor(Math.random() * 60)}s`,
            successRate: `${(96.5 + Math.random() * 3).toFixed(1)}%`,
            latency: `${Math.floor(Math.random() * 80) + 80}ms`,
            throughput: `${Math.floor(Math.random() * 8 * trafficMultiplier) + 6}/min`,
            buildTime: `${Math.floor(Math.random() * 120) + 45}s`,
            testCoverage: `${(92 + Math.random() * 6).toFixed(1)}%`,
            deploymentFrequency: `${(2.5 + Math.random() * 2).toFixed(1)}/jour`,
            leadTime: `${Math.floor(Math.random() * 30) + 30}min`
        };
        
        // Simuler des événements de déploiement
        if (Math.random() > 0.7) { // 30% de chance d'avoir un déploiement
            this.addRealisticDeployment();
        }
        
        // Simuler des changements de statut de service
        this.simulateServiceChanges();
    }
    
    addRealisticDeployment() {
        const now = new Date();
        const environments = ['Production', 'Staging', 'Development'];
        const teamMembers = ['Thaumy', 'cadel', 'stelphin', 'DevOpsBot'];
        
        const deployment = {
            id: `deploy-${now.getTime().toString(36)}`,
            timestamp: now,
            time: now.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            }),
            date: now.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit' 
            }),
            environment: environments[Math.floor(Math.random() * environments.length)],
            version: `v1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 20)}`,
            commit: `#${Math.random().toString(36).substring(2, 8)}`,
            success: Math.random() > 0.2, // 80% de réussite
            duration: Math.floor(Math.random() * 240) + 30, // 30s - 4.5min
            triggeredBy: teamMembers[Math.floor(Math.random() * teamMembers.length)],
            changes: Math.floor(Math.random() * 15) + 1
        };
        
        deployment.branch = deployment.environment === 'Production' ? 'main' : 
                          deployment.environment === 'Staging' ? 'staging' : 'dev';
        
        this.deployments.unshift(deployment);
        
        // Garder seulement les 6 derniers déploiements
        if (this.deployments.length > 6) {
            this.deployments = this.deployments.slice(0, 6);
        }
        
        // Journaliser l'événement
        this.logDeploymentEvent(deployment);
    }
    
    logDeploymentEvent(deployment) {
        const eventType = deployment.success ? 'DÉPLOIEMENT' : 'ÉCHEC';
        const emoji = deployment.success ? '🚀' : '❌';
        const logMessage = `${emoji} [${eventType}] ${deployment.environment} - ${deployment.version} par ${deployment.triggeredBy}`;
        
        console.log(logMessage);
        
        // Émettre un événement personnalisé pour les logs du pipeline
        const event = new CustomEvent('deploymentEvent', { 
            detail: { 
                deployment,
                message: logMessage,
                type: deployment.success ? 'success' : 'error'
            }
        });
        document.dispatchEvent(event);
    }
    
    simulateServiceChanges() {
        // Simuler des changements de statut occasionnels
        this.services.forEach(service => {
            // Plus de chance de problèmes pour certains services
            const failureProbability = service.id === 'node' ? 0.05 : 
                                     service.id === 'postgres' ? 0.03 : 0.02;
            
            if (Math.random() < failureProbability) {
                service.status = 'degraded';
                service.lastChange = new Date();
                
                // Simuler une récupération après 30-90 secondes
                setTimeout(() => {
                    service.status = 'up';
                    this.renderServices();
                    console.log(`✅ Service ${service.name} rétabli`);
                }, 30000 + Math.random() * 60000);
            }
        });
    }
    
    updateServicesStatus() {
        // Simuler des variations de latence/performance
        this.services.forEach(service => {
            if (service.status === 'up') {
                // Simuler des variations de performance
                service.performance = (80 + Math.random() * 20).toFixed(0) + '%';
            }
        });
        
        this.renderServices();
    }
    
    useFallbackMetrics() {
        this.metrics = {
            avgExecutionTime: '3m 10s',
            successRate: '95.5%',
            latency: '200ms',
            throughput: '8/min',
            buildTime: '2m 00s',
            testCoverage: '88.0%',
            deploymentFrequency: '1.5/jour',
            leadTime: '60min'
        };
    }
    
    renderMetrics() {
        const metricElements = {
            'avg-execution-time': this.metrics.avgExecutionTime,
            'success-rate': this.metrics.successRate,
            'latency': this.metrics.latency,
            'throughput': this.metrics.throughput,
            'build-time': this.metrics.buildTime,
            'test-coverage': this.metrics.testCoverage,
            'deployment-frequency': this.metrics.deploymentFrequency,
            'lead-time': this.metrics.leadTime
        };
        
        Object.entries(metricElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                const oldValue = element.dataset.lastValue || '';
                element.textContent = value;
                element.dataset.lastValue = value;
                
                // Animation de mise à jour si la valeur a changé
                if (oldValue !== value) {
                    element.classList.add('metric-update');
                    setTimeout(() => {
                        element.classList.remove('metric-update');
                    }, 1000);
                }
            }
        });
        
        // Mettre à jour les graphiques miniatures (simulés)
        this.updateMiniCharts();
    }
    
    updateMiniCharts() {
        // Simuler des mises à jour de graphiques
        const chartElements = document.querySelectorAll('.metric-chart');
        chartElements.forEach(chart => {
            const newHeight = 40 + Math.random() * 40;
            chart.style.height = `${newHeight}%`;
            chart.dataset.value = newHeight.toFixed(0);
        });
    }
    
    renderDeployments() {
        const container = document.getElementById('deployments-list');
        if (!container) return;
        
        // Créer le HTML des déploiements
        const deploymentsHTML = this.deployments.map(deployment => `
            <div class="deployment-item ${deployment.success ? 'success' : 'failed'}" 
                 data-id="${deployment.id}">
                <div class="deployment-header">
                    <div class="deployment-meta">
                        <span class="deployment-time">${deployment.time}</span>
                        <span class="deployment-environment ${deployment.environment.toLowerCase()}">
                            ${deployment.environment}
                        </span>
                    </div>
                    <div class="deployment-status ${deployment.success ? 'success' : 'failed'}">
                        ${deployment.success ? '✓ Réussi' : '✗ Échec'}
                    </div>
                </div>
                <div class="deployment-details">
                    <div class="deployment-version">
                        <i class="fas fa-tag"></i> ${deployment.version}
                    </div>
                    <div class="deployment-commit">
                        <i class="fas fa-code-branch"></i> ${deployment.commit} (${deployment.branch})
                    </div>
                    <div class="deployment-info">
                        <span class="deployment-duration">
                            <i class="fas fa-clock"></i> ${Math.floor(deployment.duration / 60)}m ${deployment.duration % 60}s
                        </span>
                        <span class="deployment-triggered">
                            <i class="fas fa-user"></i> ${deployment.triggeredBy}
                        </span>
                        <span class="deployment-changes">
                            <i class="fas fa-file-code"></i> ${deployment.changes} changements
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = deploymentsHTML || '<div class="no-deployments">Aucun déploiement récent</div>';
        
        // Ajouter des événements aux éléments
        this.addDeploymentEventListeners();
    }
    
    addDeploymentEventListeners() {
        document.querySelectorAll('.deployment-item').forEach(item => {
            item.addEventListener('click', () => {
                const deploymentId = item.dataset.id;
                const deployment = this.deployments.find(d => d.id === deploymentId);
                if (deployment) {
                    this.showDeploymentDetails(deployment);
                }
            });
        });
    }
    
    showDeploymentDetails(deployment) {
        const modalHTML = `
            <div class="deployment-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Détails du déploiement</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="deployment-summary ${deployment.success ? 'success' : 'failed'}">
                            <div class="summary-header">
                                <h4>${deployment.environment} - ${deployment.version}</h4>
                                <span class="status-badge ${deployment.success ? 'success' : 'failed'}">
                                    ${deployment.success ? 'RÉUSSI' : 'ÉCHEC'}
                                </span>
                            </div>
                            <div class="summary-grid">
                                <div class="summary-item">
                                    <label><i class="fas fa-calendar"></i> Date</label>
                                    <span>${deployment.date} ${deployment.time}</span>
                                </div>
                                <div class="summary-item">
                                    <label><i class="fas fa-user"></i> Déclenché par</label>
                                    <span>${deployment.triggeredBy}</span>
                                </div>
                                <div class="summary-item">
                                    <label><i class="fas fa-code-branch"></i> Branche</label>
                                    <span>${deployment.branch}</span>
                                </div>
                                <div class="summary-item">
                                    <label><i class="fas fa-hashtag"></i> Commit</label>
                                    <span class="commit-hash">${deployment.commit}</span>
                                </div>
                                <div class="summary-item">
                                    <label><i class="fas fa-clock"></i> Durée</label>
                                    <span>${Math.floor(deployment.duration / 60)}m ${deployment.duration % 60}s</span>
                                </div>
                                <div class="summary-item">
                                    <label><i class="fas fa-file-code"></i> Changements</label>
                                    <span>${deployment.changes} fichiers modifiés</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="deployment-logs">
                            <h4><i class="fas fa-terminal"></i> Logs d'exécution</h4>
                            <div class="logs-content">
                                ${this.generateDeploymentLogs(deployment)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal.firstElementChild);
        
        // Gérer la fermeture
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        // Fermer en cliquant à l'extérieur
        modal.querySelector('.deployment-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('deployment-modal')) {
                modal.remove();
            }
        });
    }
    
    generateDeploymentLogs(deployment) {
        const steps = [
            { action: 'Clonage du dépôt', duration: 3, success: true },
            { action: 'Installation des dépendances', duration: 15, success: true },
            { action: 'Exécution des tests', duration: 25, success: deployment.success || Math.random() > 0.3 },
            { action: 'Build de l\'image Docker', duration: 45, success: true },
            { action: 'Push vers le registry', duration: 12, success: true },
            { action: 'Déploiement sur le cluster', duration: 30, success: deployment.success }
        ];
        
        return steps.map(step => `
            <div class="log-entry ${step.success ? 'success' : 'error'}">
                <span class="log-time">[${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}]</span>
                <span class="log-action">${step.action}</span>
                <span class="log-duration">(${step.duration}s)</span>
                <span class="log-status">${step.success ? '✓' : '✗'}</span>
            </div>
        `).join('');
    }
    
    renderServices() {
        const container = document.getElementById('services-status-list');
        if (!container) return;
        
        const servicesHTML = this.services.map(service => {
            let statusIcon, statusClass, statusText;
            
            switch(service.status) {
                case 'up':
                    statusIcon = 'fa-check-circle';
                    statusClass = 'up';
                    statusText = 'Opérationnel';
                    break;
                case 'degraded':
                    statusIcon = 'fa-exclamation-triangle';
                    statusClass = 'degraded';
                    statusText = 'Dégradé';
                    break;
                case 'down':
                    statusIcon = 'fa-times-circle';
                    statusClass = 'down';
                    statusText = 'Hors service';
                    break;
            }
            
            return `
                <div class="service-status-item ${statusClass}">
                    <div class="service-icon">
                        <i class="fas ${statusIcon}"></i>
                    </div>
                    <div class="service-info">
                        <div class="service-name">${service.name}</div>
                        <div class="service-desc">${service.description}</div>
                    </div>
                    <div class="service-status">
                        <span class="status-text">${statusText}</span>
                        ${service.performance ? `<span class="performance">${service.performance}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = servicesHTML;
    }
    
    async updateMetrics() {
        await this.loadRealTimeMetrics();
        this.renderMetrics();
        this.renderDeployments();
        
        // Mettre à jour les statistiques globales
        this.updateGlobalStats();
        
        // Émettre un événement de mise à jour
        document.dispatchEvent(new CustomEvent('metricsUpdated', { 
            detail: { timestamp: new Date(), metrics: this.metrics }
        }));
    }
    
    updateGlobalStats() {
        // Calculer des statistiques DevOps
        const successfulDeployments = this.deployments.filter(d => d.success).length;
        const totalDeployments = this.deployments.length;
        const successRate = totalDeployments > 0 ? 
            (successfulDeployments / totalDeployments * 100).toFixed(1) : '100.0';
        
        const avgDeploymentTime = this.deployments.length > 0 ?
            this.deployments.reduce((sum, d) => sum + d.duration, 0) / this.deployments.length : 0;
        
        // Mettre à jour l'interface
        this.updateMetricElement('build-success-rate', `${successRate}%`, successRate);
        this.updateMetricElement('avg-deploy-time', `${Math.floor(avgDeploymentTime / 60)}m ${Math.floor(avgDeploymentTime % 60)}s`);
        
        // Mettre à jour le statut global du système
        this.updateSystemHealthStatus();
    }
    
    updateMetricElement(id, value, numericValue = null) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            
            if (numericValue !== null) {
                // Colorer en fonction de la valeur
                if (numericValue >= 95) {
                    element.style.color = 'var(--success)';
                } else if (numericValue >= 80) {
                    element.style.color = 'var(--warning)';
                } else {
                    element.style.color = 'var(--error)';
                }
            }
            
            element.classList.add('metric-update');
            setTimeout(() => element.classList.remove('metric-update'), 1000);
        }
    }
    
    updateSystemHealthStatus() {
        const healthyServices = this.services.filter(s => s.status === 'up').length;
        const totalServices = this.services.length;
        const healthPercentage = (healthyServices / totalServices * 100).toFixed(0);
        
        const healthElement = document.getElementById('system-health');
        if (healthElement) {
            healthElement.textContent = `${healthPercentage}%`;
            healthElement.style.color = healthPercentage >= 90 ? 'var(--success)' :
                                       healthPercentage >= 70 ? 'var(--warning)' : 'var(--error)';
        }
    }
    
    simulateSuccessfulPipeline() {
        // Simuler un pipeline réussi pour garder les métriques fraîches
        console.log('🔄 Simulation d\'un pipeline CI/CD réussi');
        
        const mockDeployment = {
            id: `sim-${Date.now()}`,
            timestamp: new Date(),
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            environment: 'Production',
            version: `v1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
            success: true,
            triggeredBy: 'DevOpsBot'
        };
        
        this.deployments.unshift(mockDeployment);
        if (this.deployments.length > 6) {
            this.deployments = this.deployments.slice(0, 6);
        }
        
        this.renderDeployments();
        this.updateGlobalStats();
    }
    
    // API publique
    forceUpdate() {
        this.updateMetrics();
        console.log('📈 Métriques CI/CD mises à jour manuellement');
    }
    
    getCurrentMetrics() {
        return { ...this.metrics, deployments: [...this.deployments] };
    }
    
    triggerManualDeployment(environment = 'Staging') {
        const manualDeployment = {
            id: `manual-${Date.now()}`,
            timestamp: new Date(),
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            environment: environment,
            version: `v1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 20)}`,
            success: Math.random() > 0.1, // 90% de réussite
            duration: Math.floor(Math.random() * 180) + 60,
            triggeredBy: 'Utilisateur',
            changes: Math.floor(Math.random() * 10) + 1
        };
        
        this.deployments.unshift(manualDeployment);
        if (this.deployments.length > 6) {
            this.deployments = this.deployments.slice(0, 6);
        }
        
        this.renderDeployments();
        this.updateGlobalStats();
        
        return manualDeployment;
    }
}

// CSS additionnel pour les métriques DevOps
const devOpsMetricsStyles = `
    /* Styles pour les métriques */
    .metric-update {
        animation: metricPulse 0.5s ease;
    }
    
    @keyframes metricPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    /* Styles pour les déploiements */
    .deployment-item {
        background: var(--card-bg);
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        border-left: 4px solid var(--primary);
        border: 1px solid var(--border-color);
    }
    
    .deployment-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        border-left-color: var(--accent);
    }
    
    .deployment-item.success {
        border-left-color: var(--success);
    }
    
    .deployment-item.failed {
        border-left-color: var(--error);
    }
    
    .deployment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .deployment-meta {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .deployment-time {
        font-weight: 600;
        color: var(--dark);
        font-size: 0.95rem;
    }
    
    .deployment-environment {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .deployment-environment.production {
        background: rgba(239, 68, 68, 0.1);
        color: var(--error);
    }
    
    .deployment-environment.staging {
        background: rgba(245, 158, 11, 0.1);
        color: var(--warning);
    }
    
    .deployment-environment.development {
        background: rgba(16, 185, 129, 0.1);
        color: var(--success);
    }
    
    .deployment-status {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
    }
    
    .deployment-status.success {
        background: rgba(16, 185, 129, 0.1);
        color: var(--success);
    }
    
    .deployment-status.failed {
        background: rgba(239, 68, 68, 0.1);
        color: var(--error);
    }
    
    .deployment-details {
        font-size: 0.85rem;
        color: var(--gray);
    }
    
    .deployment-version, .deployment-commit {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 5px;
    }
    
    .deployment-info {
        display: flex;
        gap: 15px;
        margin-top: 10px;
        font-size: 0.8rem;
    }
    
    .deployment-duration,
    .deployment-triggered,
    .deployment-changes {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .no-deployments {
        text-align: center;
        padding: 30px;
        color: var(--gray);
        font-style: italic;
    }
    
    /* Styles pour les services */
    .service-status-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px;
        background: var(--card-bg);
        border-radius: 8px;
        margin-bottom: 8px;
        border: 1px solid var(--border-color);
        transition: all 0.3s;
    }
    
    .service-status-item:hover {
        transform: translateX(5px);
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }
    
    .service-status-item.up {
        border-left: 4px solid var(--success);
    }
    
    .service-status-item.degraded {
        border-left: 4px solid var(--warning);
    }
    
    .service-status-item.down {
        border-left: 4px solid var(--error);
    }
    
    .service-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }
    
    .service-status-item.up .service-icon {
        background: rgba(16, 185, 129, 0.1);
        color: var(--success);
    }
    
    .service-status-item.degraded .service-icon {
        background: rgba(245, 158, 11, 0.1);
        color: var(--warning);
    }
    
    .service-status-item.down .service-icon {
        background: rgba(239, 68, 68, 0.1);
        color: var(--error);
    }
    
    .service-info {
        flex: 1;
    }
    
    .service-name {
        font-weight: 600;
        color: var(--dark);
        font-size: 0.95rem;
    }
    
    .service-desc {
        font-size: 0.8rem;
        color: var(--gray);
        margin-top: 2px;
    }
    
    .service-status {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
    }
    
    .status-text {
        font-size: 0.85rem;
        font-weight: 600;
    }
    
    .service-status-item.up .status-text {
        color: var(--success);
    }
    
    .service-status-item.degraded .status-text {
        color: var(--warning);
    }
    
    .service-status-item.down .status-text {
        color: var(--error);
    }
    
    .performance {
        font-size: 0.75rem;
        padding: 2px 8px;
        background: var(--section-bg);
        border-radius: 10px;
        color: var(--gray);
    }
    
    /* Modal des détails de déploiement */
    .deployment-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        background: white;
        border-radius: 15px;
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .modal-header h3 {
        margin: 0;
        color: var(--dark);
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--gray);
        cursor: pointer;
        padding: 5px;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .deployment-summary {
        background: var(--section-bg);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
    }
    
    .summary-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .status-badge {
        padding: 6px 15px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
    }
    
    .status-badge.success {
        background: rgba(16, 185, 129, 0.1);
        color: var(--success);
    }
    
    .status-badge.failed {
        background: rgba(239, 68, 68, 0.1);
        color: var(--error);
    }
    
    .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }
    
    .summary-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .summary-item label {
        font-size: 0.85rem;
        color: var(--gray);
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .summary-item span {
        font-weight: 600;
        color: var(--dark);
    }
    
    .commit-hash {
        font-family: 'Courier New', monospace;
        background: var(--dark);
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.85rem;
    }
    
    .deployment-logs h4 {
        margin-bottom: 15px;
        color: var(--dark);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .logs-content {
        background: var(--dark);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .log-entry {
        padding: 5px 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .log-entry:last-child {
        border-bottom: none;
    }
    
    .log-entry.success {
        color: var(--success);
    }
    
    .log-entry.error {
        color: var(--error);
    }
    
    .log-time {
        color: var(--gray-light);
        min-width: 70px;
    }
    
    .log-action {
        flex: 1;
    }
    
    .log-duration {
        color: var(--gray-light);
    }
    
    .log-status {
        font-weight: bold;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { 
            opacity: 0;
            transform: translateY(50px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Mini graphiques pour les métriques */
    .metric-chart {
        width: 100%;
        height: 40%;
        background: var(--primary);
        border-radius: 4px;
        transition: height 0.5s ease;
        position: relative;
    }
    
    .metric-chart::after {
        content: attr(data-value) '%';
        position: absolute;
        bottom: -20px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 0.75rem;
        color: var(--gray);
    }
`;

// Ajouter les styles DevOps
const devOpsStyleSheet = document.createElement('style');
devOpsStyleSheet.textContent = devOpsMetricsStyles;
document.head.appendChild(devOpsStyleSheet);

// Initialiser le système de métriques CI/CD
document.addEventListener('DOMContentLoaded', () => {
    window.ciCdMetrics = new CI_CDMetricsUpdater();
    
    // Écouter les événements de pipeline
    document.addEventListener('deploymentEvent', (event) => {
        const { deployment, message, type } = event.detail;
        console.log(`📦 ${message}`);
        
        // Afficher une notification pour les déploiements importants
        if (deployment.environment === 'Production') {
            const notification = document.createElement('div');
            notification.className = `deploy-notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'rocket' : 'exclamation-triangle'}"></i>
                <div>
                    <strong>Déploiement ${type === 'success' ? 'réussi' : 'échoué'} en Production</strong>
                    <p>${deployment.version} - ${deployment.time}</p>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 10);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }
    });
    
    console.log('✅ Système de métriques CI/CD initialisé avec succès!');
});

// Styles pour les notifications de déploiement
const deployNotificationStyles = `
    .deploy-notification {
        position: fixed;
        top: 80px;
        right: 20px;
        background: white;
        border-radius: 10px;
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        border-left: 4px solid var(--info);
        max-width: 350px;
    }
    
    .deploy-notification.show {
        transform: translateX(0);
    }
    
    .deploy-notification.success {
        border-left-color: var(--success);
    }
    
    .deploy-notification.error {
        border-left-color: var(--error);
    }
    
    .deploy-notification i {
        font-size: 1.5rem;
    }
    
    .deploy-notification.success i {
        color: var(--success);
    }
    
    .deploy-notification.error i {
        color: var(--error);
    }
    
    .deploy-notification strong {
        display: block;
        color: var(--dark);
        margin-bottom: 5px;
    }
    
    .deploy-notification p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--gray);
    }
`;

const deployNotificationSheet = document.createElement('style');
deployNotificationSheet.textContent = deployNotificationStyles;
document.head.appendChild(deployNotificationSheet);