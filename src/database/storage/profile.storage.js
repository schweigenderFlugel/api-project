import mongoose from "mongoose";
import { ProfileModel } from "../connection.js";

class ProfileStorage {
  async getProfile(id) {
    const isValid = mongoose.isValidObjectId(id)
    if (isValid) {
      const profile = await ProfileModel.findOne({ _id: id });
      return profile;
    }
  }

  async updateProfile(id, data) {
    const isValid = mongoose.isValidObjectId(id)
    if (isValid) {
      const profile = await ProfileModel.findOneAndUpdate({
        id,
        ...data
      })
      return profile;
    }
  }
}

export default ProfileStorage;
