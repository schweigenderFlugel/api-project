import ProfileStorage from "../database/storage/profile.storage.js";
import boom from "@hapi/boom";

const storage = new ProfileStorage();

class ProfileService {
  async getProfile(id) {
    const profile = await storage.getProfile(id);
    if (!profile) throw boom.notFound("Profile not found!");
    return profile;
  }

  async updateProfile(id, data) {
    const profile = await storage.updateProfile(id, data);
    if (!profile) throw boom.notFound("Profile not found!");
  }
}

export default ProfileService;
