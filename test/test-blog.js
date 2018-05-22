const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');


const expect = chai.expect;


chai.use(chaiHttp);


describe('Blog Posts', function() {

  
  before(function() {
    return runServer();
  });

  
  after(function() {
    return closeServer();
  });

  it('should list Blog posts on GET', function(){
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res){ 
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);
        const expectedKeys= ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(blogpost){
          expect(blogpost).to.be.a('object');
          expect(blogpost).to.include.keys(expectedKeys);
          expect(blogpost.id).to.not.equal(null || undefined);
          expect(blogpost.title).to.be.a('string');
          expect(blogpost.content).to.be.a('string');
          expect(blogpost.author).to.be.a('string');
          expect(blogpost.publishDate).to.be.a('number');
        });
      });
    });
      
    
    //create a blog post to POST and send

    it('should create a new blog post on POST', function(){
      const newPost = {title: 'newTestPost', content: 'testing', author: 'Kenny'}
      return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res){
        expect(res).to.have.status(201);
        expect(res).to.be.a.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
        expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
        });
      });

      //perform a GET request
      //grab ID
      //another chai.request
      //then using the id of the function edit
      //write test criteria
      it('should update a blog post on PUT', function *(){
        const updatedPost = {
                              title: 'TestPost', 
                              content: 'testingupdate', 
                              author: 'Kenny'
                            }
        return chai.request(app)
          .get('/blog-posts')
          .then(function(res){
           updatedPost.id = res.body[0].id;
           return chai.request(app)
            .put(`/blog-posts/${updatedPost.id}`)
            .send(updatedPost)
          })
            .then(function(res){
              expect(res).to.have.status(204);
              expect(res).to.be.a.json;
              expect(res.body).to.deep.equal(Object.assign(updatedPost, {publishDate: res.body[0].publishDate}));
            });
        });
      






    });

    



