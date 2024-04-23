const HttpStatus = require("http-status-codes").StatusCodes;
const jwt = require("jsonwebtoken");

function jwtAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(HttpStatus.UNAUTHORIZED);

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(HttpStatus.FORBIDDEN);
    req.userId = user.userId;
    next();
  });
}

module.exports = { jwtAuth };
