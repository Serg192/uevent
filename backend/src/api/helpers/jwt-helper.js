const jwt = require("jsonwebtoken");
const logger = require("../../config/logger");

const jwtVerifyAsync = (token, secret) => {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = { jwtVerifyAsync };
