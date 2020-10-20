//Configuramos timeago

//Asi funciona handlerbar, por ejemplo si queremos procesar una funcion dentro de handlerbar, se realiza a traves de helpers

//creamos un objeto que se pueden utilizar descde las visas
const {format} = require("timeago.js")

const helpers = {}

//se recive el timestamp y se le da formato para ser entendible
 helpers.timeago = (timestamp)=>{
    return format(timestamp)
 }    
module.exports = helpers;