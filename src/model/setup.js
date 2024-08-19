import db_config from "../../configs/db.js";
import Apps from "./Apps.js";
import User from "./User.js";
import Site from "./Site.js";
import Topics from "./Topics.js";

// associations
Apps.belongsTo(Site, { foreignKey: "siteId" });
Site.hasMany(Apps, { foreignKey: "siteId" });

User.belongsTo(Site, { foreignKey: "siteId" });
Site.hasMany(User, { foreignKey: "siteId" });

Topics.belongsTo(Apps, { foreignKey: "appId" });
Apps.hasMany(Topics, { foreignKey: "appId" });

async function syncModels() {
  try {
    await db_config.sync({ alter: true }).then(() => {
      console.log("Database & tables created!");
    });
  } catch (err) {
    console.log(err);
  }
}

export default syncModels;
