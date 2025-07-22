module.exports = (err, req, res, next) => {
 console.log(typeof err)
 console.log(err)
 console.log({
   status: err.status,
   code: err.code,
   path: err.path,
   message: err.message
 })
  
  const status = err.status || 500;

  if (status >= 500) {
    console.error(err.stack || err);
  }

  const response = {
    status,
    message:
      status >= 500
        ? 'Internal Server Error'
        : err.message || 'Something went wrong',
  };

  if (status < 500 && err.data) {
    response.data = err.data;
  }

  res.status(status).json(response);
};