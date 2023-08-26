import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  productId: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const OrderModel = model("Orders", orderSchema);
export default OrderModel;
