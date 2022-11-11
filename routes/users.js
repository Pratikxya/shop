import { Router } from "express";
import passport from "passport";
import UserModel from "../models/user.js";
import { issueJWT } from "../utils/utils.js";
import { hash, compare } from 'bcrypt'

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/fail' }), function (req, res) {
	return res.status(200).json(req.user)
});

router.get("/fail", (req, res) => {
	res.status(401).json({ success: false, msg: "Something went wrong" })
});
router.get('/secret', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.send('Very Secret 🤫')
})

router.post('/login', async function (req, res, next) {
	try {
		const { email, password } = req.body;

		if (email && password) {
			const user = await UserModel.findOne({ email })
			if (user !== null) {
				const isValid = await compare(password, user.password);
				if (isValid) {
					const tokenObject = issueJWT(user);
					return res.status(200).json({ success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires });
				} else {
					return res.status(401).json({ success: false, msg: "Login credentials incorrect" });
				}

			}

			return res.status(401).json({ success: false, msg: "could not find user" });
		}

		return res.status(400).json({ success: false, msg: "Make sure each field has a value" });
	} catch (error) {
		return res.status(500).send({ msg: 'something went wrong' })
	}
});

// Register a new user
router.post('/register', async function (req, res, next) {
	try {
		const { firstName, lastName, email, password } = req.body;

		if (email && password) {
			const user = await UserModel.findOne({ email })
			if (user === null) {
				// No User Found
				const data = { ...req.body, roles: ['USER'] };
				data.password = await hash(password, 10);
				UserModel.create(data).then((user) => {
					const tokenObject = issueJWT(user);
					return res.status(200).json({ success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires });
				})
			} else {
				return res.status(400).json({ success: false, msg: "Email already in Use" });
			}
		} else {
			return res.status(400).json({ success: false, msg: "Make sure each field has a valid value" });
		};
	} catch (error) {
		console.log(error)
		return res.status(500).send({ msg: 'something went wrong' })
	}
});

export default router;