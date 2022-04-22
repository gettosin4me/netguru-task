const chai = require('chai');
const {expect, should} = chai;
// const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
// const rewire = require('rewire');
const supertest = require('supertest');
// const config = require('../../config');
// const {DB} = require('../../database/DB');

const server = supertest.agent("http://localhost:3000/");
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('Movies Endpoints', function() {
    this.timeout(15000);

    it('It should failed to create movie by basic user', (done) => {
        server
            .post(`movies`)
            .send({
                'title': "Venom"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${basicserAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
                res.body.should.contain.keys('error');
                done();
            });
    });

    it('It should create a movie by premium user', (done) => {
        server
            .post(`movies`)
            .send({
                'title': "IP Man 4"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${premiumUserAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                res.body.data.should.contain.keys('Title', 'Released', 'Genre', 'Director');
                done();
            });
    });

    it('It should list all movies', (done) => {
        server
            .get(`movies`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${basicserAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                res.body.data[0].should.contain.keys('title', 'released', 'genre', 'director');
                done();
            });
    });
});
