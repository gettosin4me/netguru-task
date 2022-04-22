const chai = require('chai');
const {expect, should} = chai;
// const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
// const rewire = require('rewire');
const supertest = require('supertest');
// const config = require('../../config');
// const {DB} = require('../../database/DB');

const server = supertest.agent("http://localhost:6800/");
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('Movies Endpoints', function() {
    this.timeout(15000);

    // it('It should create a movie.', (done) => {
    //     server
    //         .post(`/movies`)
    //             .send({
    //             'title': "Wonder Woman"
    //         })
    //         .set('Content-Type', 'application/json')
    //         .set('Authorization', `Bearer ${userAccessToken}`)
    //         .expect('Content-Type', /json/)
    //         .expect(200)
    //         .end((err, res) => {
    //             res.body.data[0].should.contain.keys('image_url', 'page_name', 'custom_link');
    //             currentPage = res.body.data[0].uuid;
    //             done();
    //         });
    // });
});
