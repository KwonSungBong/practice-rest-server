import express from 'express'
import path from  'path'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import routes from './routes/index'
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(function(req, res, next){
  const accessToken = req.headers['access-token']
  req.accessToken = accessToken
  /*
   // url 권한검사 확인
   */
  next()
})

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Expose-Headers', 'access-token')
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,access-token')
  if (req.method == 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
});

/*app.get('/!*', function(req, res, next){
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next();
});*/

app.use('/', routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

module.exports = app