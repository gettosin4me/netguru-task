const chai = require('chai');
const {expect, should} = chai;
// const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
// const rewire = require('rewire');
const supertest = require('supertest');
// const config = require('../../config');
// const {DB} = require('../../database/DB');

global.basicserAccessToken = null;
global.premiumUserAccessToken = null;
const server = supertest.agent("http://localhost:3000/");
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('Movies Endpoints', function() {
    this.timeout(15000);

    it('It should login a basic user.', done => {
        server
            .post('auth')
            .send({
                username: 'basic-thomas',
                password: 'sR-_pcoow-27-6PAwCD8'
            })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                res.body.should.contain.keys('token');
                res.body.token.should.not.be.null;
                basicserAccessToken = res.body.token;
                done();
            });
    });

    it('It should login a premium user.', done => {
        server
            .post('auth')
            .send({
                username: 'premium-jim',
                password: 'GBLtTyq3E_UNjFnpo9m6'
            })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                res.body.should.contain.keys('token');
                res.body.token.should.not.be.null;
                premiumUserAccessToken = res.body.token;
                done();
            });
    });
});
