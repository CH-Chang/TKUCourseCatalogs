const JWTHelper = require("../utils/JWTHelper");

module.exports = (req, res, next) => {
  if (!req.signedCookies.token) return res.json({ res: -1, msg: "未登入" });

  try {
    let decryptedToken = JWTHelper.verify(req.signedCookies.token);
    if (decryptedToken) {
      req.headers.decryptedToken = decryptedToken;
      next();
    }
  } catch (err) {
    return res.json({
      res: -1,
      msg: "授權失敗，請重新登入"
    });
  }
};
