const NotFound = (req, res, next) => {
  const error = new Error(`Requested ${req.originalUrl} is not found `);
  res.status(404);
  next(error);
};

export default NotFound;
