const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques (votre HTML)
app.use(express.static('public'));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API pour les métriques (simulées)
app.get('/api/metrics', (req, res) => {
    res.json({
        commits: Math.floor(Math.random() * 100),
        builds: Math.floor(Math.random() * 50),
        deployments: Math.floor(Math.random() * 30),
        uptime: '99.8%',
        lastDeploy: new Date().toISOString()
    });
});

// API de santé
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});