import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
	name: { type: String },
	description: { type: String },
	price: { type: Number }
});

const ProductModel = mongoose.model("product", ProductSchema);
export default ProductModel;