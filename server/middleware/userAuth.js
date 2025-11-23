console.log("🟥 MIDDLEWARE LOADED");

import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized. Login Again",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("its play perfect");
    
    // console.log("JWT SECRET = ", process.env.JWT_SECRET);

    // ⭐ Correct way
    req.userId = decoded.id;
    // console.log("Req userId ");
    next();
  } catch (error) {
    console.log("🛑 ERROR IN MIDDLEWARE:", "middleware");
    return res.json({ success: false, message: "middleware catch Bug" });
  }
};

export default userAuth;
