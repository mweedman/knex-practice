require('dotenv').config();
const knex = require('knex');
const ShoppingListService = require('../src/shopping-list-service');


describe('ShoppingListService', () => {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'First test item!',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      price: '12.00',
      category: 'Main'
    },
    {
      id: 2,
      name: 'Second test item!',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      price: '21.00',
      category: 'Snack'
    },
    {
      id: 3,
      name: 'Third test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '3.00',
      category: 'Lunch'
    },
    {
      id: 4,
      name: 'Third test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '0.99',
      category: 'Breakfast'
    },
  ];



  before('setup database', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before('clear db', () => db('shopping_list').truncate());

  after('let go of db connection', () => {
    return db.destroy();
  });

  afterEach('clear db', ()=> db('shopping_list').truncate());
  
  describe('getAllItems', () => {
    it('returns empty array if no data', () => {
      return ShoppingListService.getAllItems(db)
        .then( res => {
          expect(res).to.be.an('array');
          expect(res).to.have.lengthOf(0);
        });
    });

    it('should return 3 items when 3 items present in db', () => {
      return db('shopping_list')
        .insert(testItems)
        .then( () => {
          return ShoppingListService.getAllItems(db)
            .then(res => {
              expect(res).to.be.an('array');
              expect(res).to.have.lengthOf(4);
              expect(res[0]).to.be.an('object');
              expect(res[0]).to.include.all.keys('id', 'name', 'price', 'date_added', 'checked', 'category');
            });
        });
    });
  });

  describe('insertItem()', () => {
    it('should add new item to db when data is valid', () => {
      const newItem = {
        id: 23,
        name: 'Biscuits n Gravy',
        price: 6.99,
        date_added: new Date('2029-01-22T16:28:32.615Z'),
        checked: false,
        category: 'Main'
      };

      return ShoppingListService.insertItem(db, newItem)
        .then(res => {
          expect(res).to.be.an('object');
          expect(res).to.include.all.keys('id', 'name', 'price', 'date_added', 'checked', 'category');
        });
    });
  });
})
;