const jwt = require("jsonwebtoken");
const jwtConfig = require("../configs/jwtConfig");

exports.sign = function(data, expiresIn) {
  try {
    return jwt.sign(data, jwtConfig.jwtKey, { expiresIn: expiresIn });
  } catch (err) {}
  return "";
};

exports.verify = function(token) {
  try {
    return jwt.verify(token, jwtConfig.jwtKey);
  } catch (err) {}
  return {};
};
