import express from "express";
const { Router } = express;
import OrderModel from "../models/order.js";
import ProductModel from "../models/product.js";
import checkRole from "../utils/checkRole.js";
import passport from "passport";
const router = Router();

export async function getOrders(req, res) {
	try {
		const limit = parseInt(req.query.limit) || 10
		const offset = parseInt(req.query.offset) || 0
		const OrderList = await OrderModel.find({}).limit(limit).skip(offset)
		res.send({ Orders: OrderList });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ Error: error });
	}
}
export async function getOrder(req, res) {
	try {
		const Order = await OrderModel.findOne({ _id: req.params.id }).populate({
			path: "products",
		});
		res.send({ Order });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ Error: error });
	}
}
export async function createOrder(req, res) {
	const { firstName, address, lastName, phone, email, products } = req.body;
	const productIds = products.map(productDesc => productDesc.id)
	const productList = await ProductModel.find().where('_id').in(productIds).exec();
	const totalPrice = productList.reduce((initial, current) => initial + current.price * products.find(product => String(product.id) === String(current._id)).quantity, 0)
	const Order = new OrderModel({ firstName, address, lastName, phone, email, isPaidFor: false, products: productIds, total: totalPrice });
	try {
		await Order.save();
		res.send({ Order });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ Error: error });
	}
}
export async function deleteOrder(req, res) {
	try {
		const Order = await OrderModel.findByIdAndDelete(req.params.id);

		if (!Order) return res.status(404).send({ Error: "No items Found" });
		res.send({ message: "Order deleted" });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ Error: error });
	}
}
export async function updateOrder(req, res) {
	try {
		await Orders.findByIdAndUpdate(req.params.id, req.body);
		const Order = await OrderModel.findOne({ _id: req.params.id });
		res.send({ Order });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ Error: error });
	}
}
router.get("/all", passport.authenticate('jwt', { session: false }), checkRole(["ADMIN"]), getOrders);
router.get("/:id", passport.authenticate('jwt', { session: false }), checkRole(["ADMIN"]), getOrder);
router.post("/", createOrder);
router.patch("/:id", passport.authenticate('jwt', { session: false }), checkRole(["ADMIN"]), updateOrder);
router.delete("/:id", passport.authenticate('jwt', { session: false }), checkRole(["ADMIN"]), deleteOrder);

export default router;
