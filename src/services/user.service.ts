import { UserRole } from "../config/const";
import UserModel, { IUser } from "../models/user.model";
const bcrypt = require('bcryptjs')

const createUser = (name: string, password: string): Promise<IUser> => {
    const hashedPassword = bcrypt.hashSync(password, 12);
    return UserModel.create({ name, password: hashedPassword });
};

const findByName = (name: string): Promise<IUser | null> => {
    return UserModel.findOne({ name }).exec();
};

// Load all users with a specific role
const loadUsers = (): Promise<IUser[]> => {
    return UserModel.find({ role: UserRole.NORMAL }, 'name createdAt').exec();
};

// Delete a user by their ID
const deleteUser = (id: string): Promise<{ deletedCount?: number }> => {
    return UserModel.deleteOne({ _id: id }).exec();
};

// Find a user by their ID
const findById = (id: string): Promise<IUser | null> => {
    return UserModel.findById(id, "name role createdAt").exec();
};

// Change a user's password
const changePassword = (id: string, password: string): Promise<IUser | null> => {
    const hashedPassword = bcrypt.hashSync(password, 12);
    return UserModel.findByIdAndUpdate(id, { $set: { password: hashedPassword } }, { new: true }).exec();
};

// Export the UserService object
const UserService = {
    createUser,
    findByName,
    loadUsers,
    deleteUser,
    findById,
    changePassword
};

export default UserService;
