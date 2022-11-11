import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
	firstName: { type: String, trim: true },
	address: { type: String, trim: true },
	lastName: { type: String, trim: true },
	phone: { type: String, trim: true, sparse: true },
	email: { type: String, required: true, trim: true, lowercase: true, sparse: true },
	total: { type: Number },
	isPaidFor: { type: Boolean },
	products: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "product",
	}]
});

const OrderModel = mongoose.model("order", OrderSchema);
export default OrderModel;