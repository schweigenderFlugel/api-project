import mongoose from 'mongoose';
import { ProfileModel, UserModel } from "../connection.js";

class UserStorage {
  async getUserByEmail(email) {
    const user = await UserModel.findOne({ email: email })
      .populate({ path: "orders", select: "products" })
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

  async createUser(data, image) {
    const objectId = new mongoose.Types.ObjectId;
    await UserModel.create({
      ...data,
      profileId: objectId,
      image: image,
    });
    await ProfileModel.create({
      _id: objectId
    });
  }

  async changePassword (id, password) {
    const valid = mongoose.isValidObjectId(id);
    if (valid) {
      await UserModel.findOneAndUpdate({
        id, 
        password: password
      });
    }
  }

  async saveRefreshToken(id, refreshToken) {
    await UserModel.findOneAndUpdate({
      id, 
      refreshToken
    })
  }

  async saveRecoveryToken(id, recoveryToken) {
    await UserModel.findOneAndUpdate({
      id,
      recoveryToken
    })
  }
}

export default UserStorage;
