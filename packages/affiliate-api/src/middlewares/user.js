import jwt from "jsonwebtoken";

export const user = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) res.status(401).send('Unauthorized: Missing Headers');
  const jwtToken = authHeader.replace('Bearer ', '');
  try {
    const { sub } = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.userId = sub;
  } catch (e) {
    res.status(401).send('Unauthorized: JWT malformed');
  }
  next();
  
}