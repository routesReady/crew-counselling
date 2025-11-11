import mongoose from "mongoose";

const crewSchema = new mongoose.Schema({
  CREWID: String,
  CREW_NAME: String,
  DSG: String,
  HQ: String,
  CLI_Name: String,
  AuthorizedUser: String,
  RoadRegYear: String,
  RoadRegNumber: String,
  Type: String,
  Place: String,
  Remark: String,
  Date: String,
});

export default mongoose.model("CrewData", crewSchema);
