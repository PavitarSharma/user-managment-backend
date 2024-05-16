import express from "express"; // Corrected typo in "express"
import userController from "../controller/user.controller.js";

const userRoutes = express.Router(); // Corrected typo in "express"

userRoutes
  .get("/", userController.getUser)
  .post("/add", userController.addUser)
  .post("/edit", userController.editUser)
  .delete("/delete/:id", userController.deleteUser);

export default userRoutes;
