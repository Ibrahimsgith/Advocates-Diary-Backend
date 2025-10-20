import jwt from 'jsonwebtoken';

export const maybeAuth = (req, _res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const token = header.split(' ')[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (_) {
      // ignore bad token in dev mode
    }
  }
  next();
};