import { config } from "dotenv";
import { ConnectDB } from "../database/dbConnection";

export const Configure = () => {
  config();
  ConnectDB();
};
