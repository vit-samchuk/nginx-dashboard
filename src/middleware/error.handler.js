module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const response = {
    message: err.message || 'Internal Server Error',
  };
  if (err.data) response.data = err.data;
  res.status(status).json(response);
};
