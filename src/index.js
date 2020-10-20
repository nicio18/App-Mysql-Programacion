const express = require('express');

const morgan = require('morgan')

const exphbs = require('express-handlebars');

const path =require('path')

const flash = require('connect-flash')

const session = require('express-session')

const MySqlStore = require('express-mysql-session')

const {database } = require('./keys');

const passport = require('passport')


//initialitations

const app = express();
require('./lib/passport');

//settings

app.set('port', process.env.PORT || 4000);

//__dirname, devuelve la direccion del archivo que se esta ejecutando.


app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main', 
    //metodo join sirve para  unir directorios
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'), 
    //extname configura la extension de los archivos handlerbar   
    extname: '.hbs',
    helpers: require('./lib/handlebars')
    
}));

app.set('view engine', '.hbs')

//Middlewares: son funciones que se ejecutan cada vez que un cliente envia una peticion al servidor.
app.use(session({
    secret: 'PracticaProgramacion',
    resave: false,
    saveUninitialized: false,
    store: new MySqlStore(database)
}))
app.use(flash());
app.use (morgan('dev'));
//app.use(express.urlencoded({extended: false})) ----> sirve para poder aceptar los datos de los usuarios
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//global variables-- variables que toda mi aplicacion necesite

app.use((req, res, next)=>{

    app.locals.success = req.flash('success')
    app.locals.message = req.flash('message')

    //de esta forma la variable user puede ser accedida de cualquier vista
    app.locals.user =req.user
   

    //next , toma la informacion del usuario lo que el servidor quiere responder y continua con la aplicacion
    next();
})

//Routes

app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));



//Public

app.use(express.static(path.join(__dirname, 'public')))

//Starting the server

app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'))
    
})