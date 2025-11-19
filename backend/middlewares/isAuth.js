// middlewares/isAuth.js

import jwt from "jsonwebtoken";

// HTTP Middleware
export default function isAuth(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.userId;

    next();
  } catch {
    return res.send({ message: "Auth failed" });
  }  
}

// WebSocket Middleware
export const isSocketAuth = (socket, next) => {
  if (!socket.handshake.query || !socket.handshake.query.token) {
    return next(new Error("Authentication Invalid"));
  }

  try {
    const data = jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET);
    socket.userId = data.userId;
    next();
  } catch (e) {
    next(e);
  }
};
