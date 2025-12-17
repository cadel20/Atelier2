// ===== MISE À JOUR DES MÉTRIQUES EN TEMPS RÉEL =====

class MetricsUpdater {
    constructor() {
        this.metrics = {
            avgExecutionTime: '2m 34s',
            successRate: '98.7%',
            latency: '142ms',
            throughput: '12/min'
        };
        
        this.deployments = [];
        this.init();
    }
    
    async init() {
        await this.loadMetrics();
        this.renderMetrics();
        this.renderDeployments();
        
        // Mettre à jour périodiquement
        setInterval(() => this.updateMetrics(), 15000);
    }
    
    async loadMetrics() {
        try {
            // En production, on appellerait une API réelle
            // const response = await fetch('/api/real-metrics');
            // this.metrics = await response.json();
            
            // Pour la démo, on simule des métriques
            this.simulateMetrics();
        } catch (error) {
            console.error('Erreur de chargement des métriques:', error);
        }
    }
    
    simulateMetrics() {
        // Simuler des variations réalistes
        this.metrics = {
            avgExecutionTime: `${Math.floor(Math.random() * 3) + 2}m ${Math.floor(Math.random() * 60)}s`,
            successRate: `${(95 + Math.random() * 4).toFixed(1)}%`,
            latency: `${Math.floor(Math.random() * 100) + 100}ms`,
            throughput: `${Math.floor(Math.random() * 10) + 8}/min`
        };
        
        // Ajouter un déploiement simulé
        this.addSimulatedDeployment();
    }
    
    addSimulatedDeployment() {
        const now = new Date();
        const deployment = {
            id: Date.now(),
            time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            version: `v1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
            success: Math.random() > 0.15,
            duration: Math.floor(Math.random() * 300) + 60 // 1-5 minutes
        };
        
        this.deployments.unshift(deployment);
        
        // Garder seulement les 5 derniers déploiements
        if (this.deployments.length > 5) {
            this.deployments = this.deployments.slice(0, 5);
        }
    }
    
    renderMetrics() {
        // Mettre à jour les métriques numériques
        const metricElements = {
            'avg-execution-time': this.metrics.avgExecutionTime,
            'success-rate': this.metrics.successRate,
            'latency': this.metrics.latency,
            'throughput': this.metrics.throughput
        };
        
        Object.entries(metricElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                
                // Animation de mise à jour
                element.classList.add('updating');
                setTimeout(() => {
                    element.classList.remove('updating');
                }, 500);
            }
        });
    }
    
    renderDeployments() {
        const container = document.getElementById('deployments-history');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.deployments.forEach(deployment => {
            const deploymentElement = document.createElement('div');
            deploymentElement.className = 'deployment-item';
            deploymentElement.innerHTML = `
                <div class="deployment-info">
                    <div class="deployment-time">${deployment.time}</div>
                    <div class="deployment-version">Version: ${deployment.version}</div>
                    <div class="deployment-duration">Durée: ${Math.floor(deployment.duration / 60)}m ${deployment.duration % 60}s</div>
                </div>
                <div class="deployment-status ${deployment.success ? 'success' : 'failed'}">
                    ${deployment.success ? '✓ Réussi' : '✗ Échoué'}
                </div>
            `;
            
            container.appendChild(deploymentElement);
        });
    }
    
    async updateMetrics() {
        await this.loadMetrics();
        this.renderMetrics();
        this.renderDeployments();
        
        // Mettre à jour les statistiques globales
        this.updateGlobalStats();
    }
    
    updateGlobalStats() {
        // Calculer des statistiques globales
        const successfulDeployments = this.deployments.filter(d => d.success).length;
        const totalDeployments = this.deployments.length;
        const successRate = totalDeployments > 0 ? (successfulDeployments / totalDeployments * 100).toFixed(1) : '100';
        
        // Mettre à jour l'interface
        const successRateElement = document.getElementById('build-success-rate');
        if (successRateElement) {
            successRateElement.textContent = `${successRate}%`;
            successRateElement.style.color = successRate >= 95 ? 'var(--success)' : 
                                           successRate >= 80 ? 'var(--warning)' : 'var(--error)';
        }
    }
    
    // Méthode pour forcer une mise à jour depuis la console
    forceUpdate() {
        this.updateMetrics();
        console.log('Métriques forcément mises à jour');
    }
}

// CSS additionnel pour les métriques
const metricsStyles = `
    .deployment-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        margin-bottom: 8px;
        background: #f8fafc;
        border-radius: 8px;
        border-left: 4px solid var(--primary);
        transition: transform 0.3s;
    }
    
    .deployment-item:hover {
        transform: translateX(5px);
        background: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .deployment-info {
        flex: 1;
    }
    
    .deployment-time {
        font-weight: 600;
        color: var(--dark);
    }
    
    .deployment-version {
        font-size: 0.9rem;
        color: var(--gray);
        margin-top: 2px;
    }
    
    .deployment-duration {
        font-size: 0.8rem;
        color: var(--gray);
        margin-top: 2px;
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
    
    .service-status-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        background: #f8fafc;
        border-radius: 8px;
        margin-bottom: 8px;
    }
    
    .status-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }
    
    .status-indicator.up {
        background: var(--success);
        animation: pulse 2s infinite;
    }
    
    .status-indicator.down {
        background: var(--error);
    }
    
    .service-info {
        flex: 1;
    }
    
    .service-name {
        font-weight: 600;
        color: var(--dark);
    }
    
    .service-status {
        font-size: 0.85rem;
        color: var(--gray);
    }
    
    .updating {
        animation: highlight 0.5s;
    }
    
    @keyframes highlight {
        0% { background-color: transparent; }
        50% { background-color: rgba(37, 99, 235, 0.1); }
        100% { background-color: transparent; }
    }
`;

// Ajouter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = metricsStyles;
document.head.appendChild(styleSheet);

// Initialiser le mise à jour des métriques
document.addEventListener('DOMContentLoaded', () => {
    window.metricsUpdater = new MetricsUpdater();
});