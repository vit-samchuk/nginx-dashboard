module.exports = (err, req, res, next) => {
  const debug = false;
  if (debug) {
    if (typeof err === 'object') {
      const props = new Set();
      
      let current = err;
      while (current) {
        Object.getOwnPropertyNames(current).forEach(p => props.add(p));
        current = Object.getPrototypeOf(current);
      }
      
      props.forEach(key => {
        console.log(`${key}:`, err[key]);
      });
      
    } else {
      console.warn(err)
    }
  }
  
  
  
  const response = {
    status: err.status || 500,
    message: err.status >= 500 ?
      'Internal Server Error' : err.message || 'Something went wrong',
  };
  
  if (err.name === 'SqliteError') {
    console.log(err.toString())
    console.log(err.toLocaleString())
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      response.status = 409;
      response.message = `Conflict! ${err.message}`;
    }
  }
  
  
  if (response.status >= 500) console.error(`[${new Date().toLocaleString()}]`, err.stack || err);
  
  if (response.status < 500 && err.data) {
    response.data = err.data;
  }
  
  res.status(response.status).json(response);
};