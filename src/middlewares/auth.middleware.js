import TokenProvider from "../services/jwtProvider.js";
import App from "../model/Apps.js";

export function routeProtection(req, res, next) {
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = tokenProvider.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired auth token",
    });
  }
}

// authenticate api keys
export function authenticateApp(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  const appSecret = req.headers["x-app-secret"];

  if (!apiKey || !appSecret) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  App.findOne({
    where: {
      apiKey: apiKey,
      appSecret: appSecret,
    },
  })
    .then((app) => {
      if (!app) {
        return res.status(401).json({
          message: "Invalid API key or app secret",
        });
      }

      req.app = app;
      next();
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Internal server error",
      });
    });
}
