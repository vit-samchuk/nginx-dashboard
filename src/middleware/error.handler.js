module.exports = (err, req, res, next) => {
  if (typeof err === 'object') {
    console.dir(err, { depth: null });
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