const mysql=require("mysql");
//modulo para aceptar promises, ya que la estructura pool no lo soporta
const {promisify}=require("util");
// const {database}, se pone asi para traer solo la parte de un objeto, en este caso solo la propiedad database
const {database} =require("./keys");



const pool = mysql.createPool(database);
pool.getConnection ((err, connection)=>{
    if (err){
        //LA CONEXION FUE PERDIDA//
        if (err.code === "PROTOCOL_CONNECTION_LOST"){
            console.error("DATABASE CONNECTION WAS CLOSED");
        }
        //
        if (err.code === "ER_CON_COUNT_ERROR"){
            console.error("DATABASE HAS TO MANY CONNECTIONS");
        }
        //CONEXION RECHADAZA//
        if (err.code === "ECONNREFUSED"){
            console.error("DATABASE CONNECTION WAS REFUSED");
        }

    }
    if (connection) connection.release();
    console.error("BD is connected");
    return;
      
});
pool.query=promisify(pool.query);
module.exports= pool;
