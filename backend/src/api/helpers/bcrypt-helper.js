const bcrypt = require("bcrypt");

const bcryptCompareAsync = (password, hash) => {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, hash, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

module.exports = { bcryptCompareAsync };
