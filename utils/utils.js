import jsonwebtoken from 'jsonwebtoken'
import { JWT_SECRET } from './envset.js';

export const issueJWT = (user) => {
	const { _id } = user;
	const expiresIn = '7d';
	const payload = {
		sub: _id,
		iat: Date.now()
	};

	const signedToken = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: expiresIn });

	return {
		token: "Bearer " + signedToken,
		expires: expiresIn
	}
}
