const app = require('./app');
const {mockup} = require('./libs/mockup');
(async () => {
  const keys = ['Category', 'Product'];
  await mockup(keys);
  app.listen(3000, () => {
    console.log('App is running on http://localhost:3000');
  });
})();
