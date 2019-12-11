require('dotenv').config();
const knex = require('knex');
const ArticlesService = require('../src/articles-service');


describe('ArticlesService', () => {
  let db;

  before('setup database', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before('clear db', () => db('blogful_articles').truncate());

  after('let go of db connection', () => {
    return db.destroy();
  });

  afterEach('clear db', ()=> db('blogful_articles').truncate());
  
  describe('getAllArticles', () => {
    it('returns empty array if no data', () => {
      return ArticlesService.getAllArticles(db)
        .then( res => {
          expect(res).to.be.an('array');
          expect(res).to.have.lengthOf(0);
        });
    });

    it('should return 3 articles when 3 articles present in db', () => {
      const testArticles = [
        {title: 'blog 1', content: 'some content'},
        {title: 'blog 2', content: 'some content'},
        {title: 'blog 3', content: 'some content'},
      ];
      return db('blogful_articles')
        .insert(testArticles)
        .then( () => {
          return ArticlesService.getAllArticles(db)
            .then(res => {
              expect(res).to.be.an('array');
              expect(res).to.have.lengthOf(3);
              expect(res[0]).to.be.an('object');
              expect(res[0]).to.include.all.keys('title', 'content', 'id');
            });
        });
    });
  });

  describe('insertArticle()', () => {
    it('should add new article to db when data is valid', () => {
      const testArticle = {
        title: 'test article',
        content: 'some test content'
      };

      return ArticlesService.insertArticle(db, testArticle)
        .then(res => {
          expect(res).to.be.an('object');
          expect(res).to.include.all.keys('title', 'content', 'id', 'date_published');
        });
    });
  });
  describe('deleteArticle', () => {

  });
})
;