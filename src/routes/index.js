//Almacenamos todas las rutas principales de mi aplicacion.

const express = require('express');
const {isNotLoggedIn}=require('../lib/auth')

//Router() --- es un metodo

const router = express.Router();

router.get('/',isNotLoggedIn, (req, res)=>{
    res.render('index');
})



module.exports= router;