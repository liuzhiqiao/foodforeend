require('dotenv').load();
const http = require('http');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { PORT } = require('./utilities/const');

const index = require('./routes/index');
const search = require('./routes/search');
const detail = require('./routes/detail');
const login = require('./routes/login');
const logout = require('./routes/logout');
const register = require('./routes/register');
const user = require('./routes/user');
const password = require('./routes/password');
// const category = require('./routes/category');
const menu = require('./routes/menu');
// const article = require('./routes/article');
const about = require('./routes/about');
const contactus = require('./routes/contactus');



let app = express();
let server = http.createServer(app);
server.listen(PORT);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', true);    // 设置反向代理

app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: 'a5717a649d346ed0c51be68888c130cd',
	resave: true,
	saveUninitialized: true,
	// cookie: {
	// 	maxAge: 1000 * 60 * 60 * 24 * 14	// 14 天
	// }
}));
app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// setUpPassport();

/**
 * 存储 req.session 为 res.locals
 */
app.use(function(req, res, next) {
	res.locals.menuHistory = req.session.menuHistory ? req.session.menuHistory: [];
	res.locals.recommandWords = [];
	res.locals.currentUser = req.session.user;
	res.locals.navAvatar = req.session.user ? req.session.user.avatar: false;
	res.locals.navUsername = req.session.user ? req.session.user.username: false;
	res.locals.errors = req.flash('error');
	res.locals.infos = req.flash('info');
	next();
});

app.use('/', index);
app.use('/search', search);
app.use('/detail', detail);
app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);
app.use('/user', user);
app.use('/password', password);
// app.use('/category', category);
app.use('/menu', menu);
// app.use('/article', article);
app.use('/about', about)
app.use('/contactus', contactus);


// catch 404
app.use(function(req, res) {
	var err = new Error('Not Found');
	err.status = 404;

	res.locals.message = err.message;
	res.locals.error = err;

	res.status(err.status || 500);
	res.render('error');
});

module.exports = server;
