import { Schema, model } from "mongoose";

const profileSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    default: null, 
  },
  lastName: {
    type: String,
    trim: true,
    default: null, 
  },
  street: {
    type: String,
    default: null, 
  },
  number: {
    type: Number,
    trim: true,
    default: null, 
  },
});

const ProfileModel = model('Profiles', profileSchema);
export default ProfileModel;