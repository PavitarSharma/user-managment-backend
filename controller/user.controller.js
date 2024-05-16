import express from "express";
import User from "../model/user.model.js";
import Counter from "../model/counter.model.js";

class userController {
  // status codes
  static success = 200;
  static created = 201;
  static notFound = 404;
  static badRequest = 400;
  static internalServer = 500;

  static async getNextSequenceValue(sequenceName) {
    try {
      let counter = await Counter.findById(sequenceName);
      if (!counter) {
        counter = new Counter({ _id: sequenceName });
      }
      counter.sequence_value++;
      await counter.save();
      return counter.sequence_value;
    } catch (error) {
      throw new Error("Error getting next sequence value: " + error.message);
    }
  }

  static getUser = async (req, res) => {
    try {
      const allUser = await User.find();
      if (allUser) {
        res.status(this.success).json({ status: "success", data: allUser });
      } else {
        res.status(this.notFound).json({
          status: "success",
          data: allUser,
          message: "There is no user found",
        });
      }
    } catch (error) {
      res.status(this.error).json({
        status: "error",
        data: null,
        message: "There is internal server error",
      });
    }
  };

  static addUser = async (req, res) => {
    try {
      const { firstName, lastName, email, department } = req.body;
      if (!firstName || !lastName || !email || !department) {
        return res.status(400).json({
          status: "error",
          message: "Please provide all required fields",
        });
      }
      const nextSequenceValue = await this.getNextSequenceValue("employeeid");
      if (!nextSequenceValue) {
        return res.status(400).json({
          status: "error",
          message: "There is error to increament the id",
        });
      }
      const newUser = new User({
        _id: nextSequenceValue,
        firstName,
        lastName,
        email,
        department,
      });

      const savedUser = await newUser.save();

      res.status(this.created).json({
        status: "success",
        message: "User created successfully",
        data: savedUser,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res
        .status(this.internalServer)
        .json({ message: "Internal server error" });
    }
  };

  static editUser = async (req, res) => {
    try {
      const { userId, firstName, lastName, email, department } = req.body;
      if (!firstName && !lastName && !email && !department) {
        return res.status(400).json({
          status: "error",
          message: "Please provide at least one field to update!",
        });
      }
      let findUser = User.findById(userId);
      if (!findUser)
        return res.status(this.notFound).json({
          status: "error",
          message: "There no user containing this ID",
        });

      let updatedFields = {};

      if (firstName) updatedFields.firstName = firstName;
      if (lastName) updatedFields.lastName = lastName;
      if (email) updatedFields.email = email;
      if (department) updatedFields.department = department;

      findUser = await User.findByIdAndUpdate(
        userId,
        { $set: updatedFields },
        { new: true }
      );
      res.status(this.success).json({
        status: "success",
        message: "User updated successfully",
        data: {
          firstName: findUser.firstName,
          lastName: findUser.lastName,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res
        .status(this.internalServer)
        .json({ message: "Internal server error" });
    }
  };

  static deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(this.notFound)
          .json({ status: "success", message: "There is no id" });
      }

      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(this.notFound).json({
          status: "success",
          message: "There is no user with this id!",
        });
      }

      return res.status(this.success).json({
        status: "success",
        message: "User deleted successfully",
        data: {
          firstName: deletedUser.firstName,
          lastName: deletedUser.lastName,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(this.error).json({
        status: "error",
        data: null,
        message: "There is internal server error",
      });
    }
  };
}

export default userController;
