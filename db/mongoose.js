import mongoose from "mongoose";
const { connect } = mongoose;
import { DB_URL } from '../utils/envset.js'

connect(DB_URL, {
	useNewUrlParser: true,
}).then(e => console.log("connected to db")).catch((e) => {
	console.log(e);
});
