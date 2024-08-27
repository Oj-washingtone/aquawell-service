import DispenModel from "../src/model/DispenModel.js";
import SmallTank from "../src/model/SmallTank.js";
import MainTank from "../src/model/MainTank.js";
import PurifiedWaterTankLid from "../src/model/PurifiedWaterTankLid.js";
import WasteWaterModel from "../src/model/WasteWaterModel.js";

export const allowedMessageTypes = {
  dispen: DispenModel,
  small_tank: SmallTank,
  main_tank: MainTank,
  purified_water_tank_lid: PurifiedWaterTankLid,
  waste_water: WasteWaterModel,
};
