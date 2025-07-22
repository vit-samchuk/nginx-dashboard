module.exports = (err, req, res, next) => {
  if (typeof err === 'object') {
    Object.getOwnPropertyNames(err).forEach(key => {
      console.log(`${key}:`, err[key]);
    });
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
  
  
  
  let status = err.status || 500;
  
  if (status >= 500) {
    console.error(err.stack || err);
  }
  
  let response = {
    status,
    message: status >= 500 ?
      'Internal Server Error' : err.message || 'Something went wrong',
  };
  
  
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    status = 409;
    response.status = status;
    response.message = 'Conflict. Already exists!';
  }
  
  
  if (status < 500 && err.data) {
    response.data = err.data;
  }
  
  res.status(status).json(response);
};