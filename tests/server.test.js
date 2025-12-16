const request = require('supertest');
const app = require('../server.js');

describe('API Endpoints', () => {
    test('GET / should return 200', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
    
    test('GET /api/metrics should return JSON', async () => {
        const response = await request(app).get('/api/metrics');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('commits');
        expect(response.body).toHaveProperty('builds');
    });
    
    test('GET /health should return healthy status', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('healthy');
    });
});