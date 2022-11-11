import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import UserModel from "../models/user.js";
import { JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } from "./envset.js";
import { issueJWT } from "./utils.js";

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: JWT_SECRET,
}
const googleOptions = {
	clientID: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	callbackURL: GOOGLE_CALLBACK_URL
}
passport.use(new JWTStrategy(options, (jwt_payload, done) => {
	UserModel.findOne({ _id: jwt_payload.sub }, function (err, user) {
		if (err) {
			return done(err, false);
		}
		if (user) {
			return done(null, user);
		} else {
			return done(null, false);
		}
	});
}))

passport.use(new GoogleStrategy(googleOptions, async (accessToken, refreshToken, profile, done) => {
	const { sub, email, given_name, family_name } = profile._json;
	UserModel.findOne({ sid: sub }, async function (err, user) {
		if (user === null) {
			const data = {
				sid: sub,
				email: email,
				firstName: given_name,
				lastName: family_name,
				roles: ['USER']
			}
			await UserModel.create(data)
				.then((user) => {
					const tokenObject = issueJWT(user);
					const data = { ...user._doc, ...tokenObject }
					return done(err, data);
				})
				.catch((err) => {
					return done(err, false);
				})
		} else {
			const tokenObject = issueJWT(user);
			const data = { ...user._doc, ...tokenObject }
			return done(err, data);
		}
	});
}))

export default passport;