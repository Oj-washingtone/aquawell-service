import express from "express";
import {
  routeProtection,
  authorizeSiteCreation,
} from "../middlewares/auth.middleware.js";

const siteRouter = express.Router();

siteRouter.post(
  "/create",
  routeProtection,
  authorizeSiteCreation,
  (req, res) => {
    res.send("Create site");
  }
);

siteRouter.get("/", (req, res) => {
  res.send("Get all sites");
});

siteRouter.delete("/", (req, res) => {
  res.send("Delete site");
});

export default siteRouter;

// generate apps
// generate apps --name=apps --attributes="siteId:uuid,name:string,status:boolean,apiKey:string,appSecret:string"

// get apps
// get apps --name=apps --attributes="siteId:uuid,name:string,status:boolean,apiKey:string,appSecret:string" --associations="belongsTo:Site" --associations="hasMany:Topics" --associations="hasOne:Organization" --associations="belongsTo:User"
//
