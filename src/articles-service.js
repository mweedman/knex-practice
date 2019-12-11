const ArticlesService = {
  getAllArticles(db){
    return db('blogful_articles')
      .select('*');
  },
  insertArticle(db, newArticle){
    return db('blogful_articles')
      .insert(newArticle)
      .returning('*')
      .then(rows => rows[0]);
  },
  getById(db, id){

  },
  deleteArticle(){

  }
};

module.exports = ArticlesService;