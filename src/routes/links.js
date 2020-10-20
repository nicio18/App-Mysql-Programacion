//Rutas encargadas de eliminar actualizar o crear un enlace

const express = require('express')
const router = express.Router();

const pool = require('../database');

const {isLoggedIn} =require('../lib/auth')

router.get("/add", (req, res)=>{    
    res.render("links/add");
 });

//Encargado de recibir los datos del formulario 
router.post("/add",isLoggedIn,  async(req, res)=>{
    const {title, url, description} =req.body;
    const newLink = {
       title,
       url,
       description,
       user_id: req.user.id
    };
    //pool es nuestra conexion
    
       await pool.query("INSERT INTO links set ? ",[newLink]);
       // flash recibe dos parametros 1, el nombre como se guarda el mensaje, y el valor de el mensaje
        req.flash('success', 'Link guardado correctamente');
        //redireccionamos a la ruta 
        res.redirect('/links');
 })


 //listar tareas mediante el metodo get.
router.get('/', isLoggedIn,  async (req, res)=>{
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id])
    //renderizamos las listas mediante...    
    res.render('links/list', {links})
 })
router.get('/table', isLoggedIn, async(req, res)=>{
   const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id])
   res.render('links/table', {links})


}) 

 

 router.get('/delete/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);   
    req.flash('success', 'Link eliminado correctamente'); 
    //redireccionamos a la ruta 
    res.redirect('/links');
 });

 //ingresamos los datos editados mediante el metodo post

 router.get('/edit/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    
    res.render('links/edit',isLoggedIn, {link:links[0]})
 })
 router.post('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    //almacenamos en la base de datos los datos actualizados.
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);

    req.flash('success', 'Link actualizado correctamente'); 
    //redireccionamos 
    res.redirect('/links');
 });

module.exports = router