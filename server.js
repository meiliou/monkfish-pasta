const path = require('path');
const express = require('express');
const session = require('express-session');
const helpers = require('./utils/helpers');
const exphbs = require('express-handlebars');
//const hbs = exphbs.create({});
const app = express();
const hbs = exphbs.create({ helpers });
const PORT = process.env.PORT || 3001;

const signupRoutes = require('./controllers/api/signup-routes');
const loginRoutes = require('./controllers/api/login-routes');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// create session
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// set up handlebars.js engine with custom helpers
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// serve up static assets (useful for front-end and JS files)
app.use(express.static(path.join(__dirname, 'public')));
// session middleware
app.use(session(sess));

// turn on routes
app.use(signupRoutes);
app.use(loginRoutes);
app.use(routes); //same as app.use(require('./controllers'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});


// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});