module.exports = function() {

  process.env.NODE_ENV = 'test';

  var assert = require('assert');
  var chai = require('chai');
  var expect = chai.expect;
  var should = chai.should();
  var chaiHttp = require('chai-http');
  var mongoose = require('mongoose');
  var server = require('../app');
  var Gear = mongoose.model('Gear');

  chai.use(chaiHttp);

  describe('Gear', function() {

    Gear.collection.drop();

    beforeEach(function(done){
      var newGear = new Gear({
        _id: '57c75e85004598ce935dd48c',
        name: 'Sleeping Bag',
        category: 'Sleep System',
        manufacturer: 'Test Manufacturer',
        price: 299,
        owner: 'Test Owner'
      });
      newGear.save(function(err) {
        done();
      });
    });
    afterEach(function(done){
      Gear.collection.drop();
      done();
    });

    it('should list ALL gear on /gear GET', function(done) {
      chai.request(server)
      .get('/gear')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        done();
      });
    });

    it('should list a SINGLE gear item on /gear/<item> GET', function(done) {
      chai.request(server)
        .get('/gear/57c75e85004598ce935dd48c')
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          done();
      });
    });

    it('should add a SINGLE gear item on /gear POST', function(done) {
      chai.request(server)
        .post('/gear')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1N2NjOTQ0OWVkODhmYmU0YzY1MTdkNjMiLCJ1c2VybmFtZSI6ImFkbWluMiIsImV4cCI6MTQ3ODk4MTMxNywiaWF0IjoxNDczNzkzNzE3fQ.zy4n0W4d2isiQLkad5I97ea9McspwHEVQQPmWr6H3pM')
        .send({'name': 'test product', 'manufacturer':'test man'})
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('manufacturer');
          res.body.should.have.property('_id');
          res.body.name.should.equal('test product');
          res.body.manufacturer.should.equal('test man');
          done();
        });
      });

    // it('should update a SINGLE gear item on /gear/<item> PUT', function(done) {
    //   expect(true).to.equal(false);
    //   done();
    // });

    it('should delete a SINGLE gear item on /gear/<item>/delete DELETE', function(done) {
      chai.request(server)
        .delete('/gear/57c75e85004598ce935dd48c/delete')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1N2NjOTQ0OWVkODhmYmU0YzY1MTdkNjMiLCJ1c2VybmFtZSI6ImFkbWluMiIsImV4cCI6MTQ3ODk4MTMxNywiaWF0IjoxNDczNzkzNzE3fQ.zy4n0W4d2isiQLkad5I97ea9McspwHEVQQPmWr6H3pM')
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });
}
