import cors from "cors";
import express, { json } from "express";
import helmet from 'helmet'

import "./db/mongoose.js";
import allRoutes from './routes/index.js'
import configuredPassport from './utils/passport.js'

const app = express();

const PORT = process.env.port || 3000;

// sasas(passport);

app.use(json());
app.use(helmet())
app.use(configuredPassport.initialize())

app.use(cors({ origin: '*' }));

app.get("/", (req, res) => res.send("Hello World!"));
app.use(allRoutes)
app.listen(PORT, () => console.log(`Example app listening on ${PORT}!`));