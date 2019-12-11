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
      checked: false,
      category: 'Main'
    },
    {
      id: 2,
      name: 'Second test item!',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      price: '21.00',
      checked: false,
      category: 'Snack'
    },
    {
      id: 3,
      name: 'Third test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '3.00',
      checked: false,
      category: 'Lunch'
    },
    {
      id: 4,
      name: 'Third test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '0.99',
      checked: false,
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

    it('should return 4 items when 4 items present in db', () => {
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

  describe('getById()', () => {
    it('should find the item with a given id of 2 and return that item from the test array', () => {
      return ShoppingListService.getAllItems(db)
        .insert(testItems)
        .then(() => {
          const findId = 2;
          const foundItem = testItems[findId - 1];
          return ShoppingListService.getById(db, findId)
            .then(res => 
              expect(res).to.eql({
                id: findId,
                name: foundItem.name,
                price: foundItem.price,
                date_added: foundItem.date_added,
                checked: foundItem.checked,
                category: foundItem.category
              })
            );
        });
    });
  });

  describe('deleteItem()', () => {
    it('should remove the item of the given id from the list', () => {
      return ShoppingListService.getAllItems(db)
        .insert(testItems)
        .then(() => {
          const givenId = 4;
          return ShoppingListService.deleteItem(db, givenId)
            .then(() => ShoppingListService.getAllItems(db))
            .then(items => {
              const expected = testItems
                .filter(item => item.id !== givenId);
              expect(items).to.eql(expected);
            });
        });
    });
  });

  describe('updateItem()', () => {
    it('should replace an item from the shopping_list with new given data', () => {
      return ShoppingListService.getAllItems(db)
        .insert(testItems)
        .then(() => {
          const updateId = 4;
          const replacement = {
            id: updateId,
            name: 'ReplacementData',
            date_added: new Date(),
            price: '1000.99',
            checked: false,
            category: 'Main'
          };
          return ShoppingListService.updateItem(db, updateId, replacement)
            .then(() => ShoppingListService.getById(db, updateId))
            .then(item => {
              expect(item).to.eql(replacement);
            });
        });
    });
  });
  
})
;