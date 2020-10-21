//rutas relacionadas con el login
const express = require('express')
const router = express.Router();
const passport = require('passport');
const{isLoggedIn} =require('../lib/auth')
const {isNotLoggedIn}=require('../lib/auth')


router.get('/signup', isNotLoggedIn,(req, res)=>{
    res.render('auth/signup')
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    //redireccionamiento cuando va todo bien,
    successRedirect: '/profile',
    //redireccionamiento cuando falle.
    failureRedirect: '/signup',
    //permite recibir a passport mensajes flash, los cuales creamos antes
    failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    //rederizamos la ruta signin
   res.render('auth/signin');
});
router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        //redireccionamiento cuando va todo bien,
       successRedirect: '/profile',
       //redireccionamiento cuando falle.
       failureRedirect: '/signin',
       //permite recibir a passport mensajes flash, los cuales creamos antes
       failureFlash: true
            
      
    })(req, res, next);   
    

});
  
  
router.get('/profile',isLoggedIn, (req, res)=>{
    res.render('profile')
});

router.get('/logout',isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/');
  });

module.exports = router;