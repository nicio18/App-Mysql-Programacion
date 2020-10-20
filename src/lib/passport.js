const passport = require('passport');

// permite configurar el metodo de autenticacion, en este caso seria local.
const LocalStrategy = require('passport-local').Strategy;
//importamos la conexion.
const pool = require('../database');
const helpers = require('../lib/helpers')

//ruta signin // login
passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido ' + user.username));
    } else {
      done(null, false, req.flash('message', 'Contraseña incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'Usuario inexistente'));
  }

  

}));

//ruta Signup
passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  //configuracion para recibir otros datos, recibimos el objeto req.
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { fullname } = req.body;
  const newUser = {
    fullname,
    username,
    password
  };
  
  newUser.password = await helpers.encryptPassword(password);
  // Guardando en la base de datos.
  const result = await pool.query('INSERT INTO users SET ? ', [newUser]);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

// configuracion de passport, toma el usuario y guarda en una session 
passport.serializeUser((user, done ) => {
  done(null, user.id);
});

//
passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  //ponemos indice 0 porque devuelve un objeto y usamos el primero.
  done(null, rows[0]);
});

