import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, "somesupersecretsecret");
    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }

    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
  } catch (err) {
    req.isAuth = false;
    next();
  }
};
