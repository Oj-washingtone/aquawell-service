import db_config from "../../configs/db.js";
import App from "./Apps.js";
import User from "./User.js";
import Site from "./Site.js";
import Topics from "./Topics.js";
import Organization from "./Organization.js";

Organization.hasMany(Site, { foreignKey: "organizationId" });
Site.belongsTo(Organization, { foreignKey: "organizationId" });

// associations
Site.hasOne(App, { foreignKey: "siteId" });
App.belongsTo(Site, { foreignKey: "siteId" });

User.belongsTo(Organization, { foreignKey: "organizationId" });
Organization.hasMany(User, { foreignKey: "organizationId" });

Topics.belongsTo(App, { foreignKey: "appId" });
App.hasMany(Topics, { foreignKey: "appId" });

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
