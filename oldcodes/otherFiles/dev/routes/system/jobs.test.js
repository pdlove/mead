const assert = require('assert');
const request = require('supertest');
const app = require('../../../app');

describe('Jobs Route', () => {
    it('should return a list of jobs', (done) => {
        request(app)
            .get('/api/jobs')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('should create a new job', (done) => {
        request(app)
            .post('/api/jobs')
            .send({ title: 'New Job', description: 'Job description' })
            .expect('Content-Type', /json/)
            .expect(201, done);
    });
});