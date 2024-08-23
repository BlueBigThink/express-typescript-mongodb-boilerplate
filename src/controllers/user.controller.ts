const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { ObjectId } = require('mongodb');
import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { IUser } from '../models/user.model';
import { logError } from '../utils/logger';
dotenv.config();

const handleCreateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password } = req.body;
    const user = await UserService.findByName(name);
    if (user) throw new Error(`User(${name}) already exists`);
    if (password.length < 6) throw new Error("Password length is too short! More 6 characters required");
    await UserService.createUser(name, password);
    const users = await UserService.loadUsers();
    res.json({ success: true, message: "Create User", payload: { users } });
  } catch (error) {
    logError(error);
    res.json({ success: false, message: (error as Error).message });
  }
};

const handleLoginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password } = req.body;
    const user = await UserService.findByName(name);
    if (!user) throw new Error(`User(${name}) is not registered`);
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw new Error("The password is incorrect");
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY || "SECRET_KEY_FNC", { expiresIn: "1d" });
    res.json({ success: true, message: "Login User", payload: { name, token } });
  } catch (error) {
    logError(error);
    res.json({ success: false, message: (error as Error).message });
  }
};

const handleDeleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const user = await UserService.findByName(name);
    if (!user) throw new Error(`User(${name}) is not found`);
    if (typeof user._id === 'string') {
      await UserService.deleteUser(user._id);
    } else {
      throw new Error("Invalid user ID");
    }
    const users = await UserService.loadUsers();
    res.json({ success: true, message: "Delete User", payload: { users } });
  } catch (error) {
    logError(error);
    res.json({ success: false, message: (error as Error).message });
  }
};

const handleLoadUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserService.loadUsers();
    res.json({ success: true, message: "Load Users", payload: { users } });
  } catch (error) {
    logError(error);
    res.json({ success: false, message: (error as Error).message });
  }
};

const handleChangePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password, newPassword } = req.body;
    const user = await UserService.findByName(name);
    if (!user) throw new Error(`User(${name}) is not registered`);
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) throw new Error("The old password is incorrect");
    if (user._id instanceof ObjectId) {
      await UserService.changePassword(user._id?.toString() ?? '', newPassword);
    } else {
      throw new Error("Invalid user ID");
    }
    res.json({ success: true, message: "Change Password" });
  } catch (error) {
    logError(error);
    res.json({ success: false, message: (error as Error).message });
  }
};

const handleReloadUser = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    res.json({ success: true, message: "Reload User", payload: { name: req.user?.name } });
  } catch (error) {
    logError(error);
    res.json({ success: false, message: (error as Error).message });
  }
};

const UserCtrl = {
  handleCreateUser,
  handleLoginUser,
  handleDeleteUser,
  handleChangePassword,
  handleLoadUsers,
  handleReloadUser,
};

export default UserCtrl;
