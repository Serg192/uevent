const crypto = require("crypto");

const algorithm = "aes256";

function encrypt(text) {
  const cipher = crypto.createCipher(algorithm, process.env.CRYPTO_KEY);
  return cipher.update(text, "utf8", "hex") + cipher.final("hex");
}

function decrypt(text) {
  const decipher = crypto.createDecipher(algorithm, process.env.CRYPTO_KEY);
  return decipher.update(text, "hex", "utf8") + decipher.final("utf8");
}

module.exports = { encrypt, decrypt };
