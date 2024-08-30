import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

class TokenProvider {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  setToken(payload, expiresIn = "1d") {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  verifyToken(token) {
    return jwt.verify(token, this.secretKey);
  }
}

export default new TokenProvider(process.env.AUTH_SECRET);
