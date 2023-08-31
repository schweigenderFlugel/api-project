import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true
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
  }
});

const ProductModel = model("Products", productSchema);
export default ProductModel;
