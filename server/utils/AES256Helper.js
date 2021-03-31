const Crypto = require("crypto");
const AES256Config = require("../configs/AES256Config");

exports.AES256Encrypt = function(str) {
  let cipher = Crypto.createCipheriv(
    "aes-256-cbc",
    AES256Config.key,
    AES256Config.iv
  );
  let cipherChunks = [];
  cipher.setAutoPadding(true);
  cipherChunks.push(cipher.update(str, "utf8", "base64"));
  cipherChunks.push(cipher.final("base64"));
  return cipherChunks.join("");
};

exports.AES256Decrypt = function(str) {
  let cipher = Crypto.createDecipheriv(
    "aes-256-cbc",
    AES256Config.key,
    AES256Config.iv
  );
  let cipherChunks = [];
  cipher.setAutoPadding(true);
  cipherChunks.push(cipher.update(str, "base64", "utf8"));
  cipherChunks.push(cipher.final("utf8"));
  return cipherChunks.join("");
};
