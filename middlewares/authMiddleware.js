import jwt from 'jsonwebtoken';
import Veterinarian from '../models/Veterinarian.js';

const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const { id } = jwt.verify(token, process.env.JWT_SECRET);

      // storage the session with the user
      req.veterinarian = await Veterinarian.findById(id).select(
        '-password -token -confirmed'
      );

      return next();
    } catch {
      const err = new Error('Invalid token333');
      return res.status(403).json({ msg: err.message });
    }
  }

  if (!token) {
    const error = new Error("Invalid token or don't exist");
    res.status(403).json({ msg: error.message });
  }

  next();
};

export default authMiddleware;
