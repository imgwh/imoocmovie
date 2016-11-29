var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var session = require('express-session')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(session)
var _ = require('underscore')
var morgan = require('morgan')
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/imooc'

mongoose.connect(dbUrl)

app.set('views', 'app/views/pages')
app.set('view engine', 'jade')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(require('connect-multiparty')())
app.use(session({
	secret: 'imooc',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: true
}))

if('development' === app.get('env')) {
	app.set('showStackError', true)
	app.use(morgan(':method :url :status'))
	app.locals.pretty = true
	mongoose.set('debug', true)
}

require('./config/routes')(app)

app.locals.moment = require("moment")
app.listen(port)

console.log('immoc started on port ' + port)
