const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        res.status(400);
        throw new Error("Token is not valid");
      }
      req.user=decoded.user
    });
    next()
    if(!token){
       res.status(401);
       throw new Error('User is not authorized or token is not present')
    }
  }
  
};

module.exports = validateToken;
