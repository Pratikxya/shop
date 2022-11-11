import express from "express";
import passport from "passport";
const { Router } = express;
import Products from "../models/product.js";
import checkRole from "../utils/checkRole.js";
import validator, { createProductSchema } from "../utils/validator.js";

const router = Router();

export async function getProducts(req, res) {
	try {
		const ProductList = await Products.find({});
		res.send({ Products: ProductList });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ Error: error });
	}
}
export async function getProduct(req, res) {
	try {
		const Product = await Products.findOne({ _id: req.params.id });
		res.send({ Product });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ Error: error });
	}
}
export async function createProduct(req, res) {

	try {
		const Product = new Products(req.body);
		await Product.save();
		res.send({ Product });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ Error: error.message });
	}
}
export async function deleteProduct(req, res) {
	try {
		const Product = await Products.findByIdAndDelete(req.params.id);

		if (!Product) return res.status(404).send({ Error: "No items Found" });
		res.send({ message: "Product deleted" });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ Error: error });
	}
}
export async function updateProduct(req, res) {
	try {
		await Products.findByIdAndUpdate(req.params.id, req.body);
		const Product = await Products.findOne({ _id: req.params.id });
		res.send({ Product });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ Error: error });
	}
}
router.get("/all", getProducts);
router.get("/:id", getProduct);
router.post("/", passport.authenticate('jwt', { session: false }), checkRole(["ADMIN"]), checkRole(["ADMIN"]), validator.body(createProductSchema), createProduct);
router.patch("/:id", passport.authenticate('jwt', { session: false }), checkRole(["ADMIN"]), checkRole(["ADMIN"]), updateProduct);
router.delete("/:id", passport.authenticate('jwt', { session: false }), checkRole(["ADMIN"]), checkRole(["ADMIN"]), deleteProduct);

export default router;
