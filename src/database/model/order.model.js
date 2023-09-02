import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  products: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "Products"
  },
  customer: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const OrderModel = model("Orders", orderSchema);
export default OrderModel;
