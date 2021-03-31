const crypto = require("crypto");

exports.SHA256Hash = function(str) {
  let sha256 = crypto.createHash("sha256");
  return sha256.update(str).digest("base64");
};
