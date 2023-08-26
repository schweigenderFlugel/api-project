import mongoose from 'mongoose';
import { ProfileModel, UserModel } from "../connection.js";

class UserStorage {
  async getUserByEmail(email) {
    const user = await UserModel.findOne({ email: email })
      .populate({ path: "orders", select: "productId" })
    return user;
  }

  async getUserById(id) {
    const user = await UserModel.findOne({ _id: id });
    return user;
  }

  async getUserByRefreshToken(refreshToken) {
    const user = await UserModel.findOne({ refreshToken })
    return user;
  }

  async createUser(data) {
    const objectId = new mongoose.Types.ObjectId;
    await UserModel.create({
      ...data,
      profileId: objectId,
    });
    await ProfileModel.create({
      _id: objectId
    });
  }

  async saveRefreshToken(id, refreshToken) {
    await UserModel.findOneAndUpdate({
      id, 
      refreshToken
    })
  }
}

export default UserStorage;
