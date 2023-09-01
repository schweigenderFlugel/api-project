import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S[a-z0-9]{8,20}$/, "Only letters and numbers allowed for username"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email adress"],
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
    default: 'customer'
  },
  imageUrl: {
    public_id: {
      type: String,
      required: true
    },
    secure_url: {
      type: String,
      required: true
    }
  },
  profileId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  ordersNumber: {
    type: Number,
    required: true,
    default: 0
  },
  orders: {
    type: [Schema.Types.ObjectId],
    default: null,
    ref: "Orders",
  },
  refreshToken: {
    type: [String],
    required: true,
    default: [],
  },
  recoveryToken: {
    type: String,
    required: true,
    default: null
  },
});

userSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });
const UserModel = model('Users', userSchema);
export default UserModel;