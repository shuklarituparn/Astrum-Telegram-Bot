import mongoose from "mongoose";
export const ConnectDB = function () {
  mongoose
    .connect(`${process.env.DB_URI}`)
    .then(() => {
      console.log("Connected to DB Successfully!");
    })
    .catch((err) => {
      console.log("Error connecting " + err.message);
    });
};
