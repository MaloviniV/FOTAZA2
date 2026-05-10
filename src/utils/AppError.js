/**
  *Clase para el manejo de errores
  *@param {string} message - Descripcion del error
  *@param {int} statusCode - Codigo de estado del error
*/

class AppError extends Error{ 
  constructor(message, statusCode){
    super(message);
    this.statusCode = parseInt(statusCode, 10) || 500;
    this.status = (this.statusCode>=400 && this.statusCode<500)? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);    //ignora la ruta de la Clase AppError en el stackTrace.
  }
}

export default AppError