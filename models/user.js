import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
	sid: { type: String, unique: true },
	firstName: { type: String, trim: true },
	lastName: { type: String, trim: true },
	email: { type: String, required: true, trim: true, lowercase: true, unique: true, sparse: true },
	password: { type: String },
	roles: [{
		type: String,
		enum: ['ADMIN', 'USER'],
		default: 'USER'
	}]
});

const UserModel = mongoose.model("user", UserSchema);
export default UserModel;