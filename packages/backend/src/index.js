import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config({
        path: require('path').resolve(__dirname, '../.env'),
});
console.log(process.env.DB_PATH);
import express from "express";
import serverless from "serverless-http";
import graphiql from "graphql-playground-middleware-express";
import { ApolloServer, gql } from "apollo-server-express";
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import connectDB from './database/conn';
import User from './database/models/user';
import {ApolloError} from 'apollo-server-errors';
import syncSheetWithDB from './cron/sync-sheet-with-db';
const app = express();

const server = new ApolloServer({
	typeDefs,
	playground: process.env.NODE_ENV === 'development',
	resolvers,
	path: "/graphql",
	context: async ctx => {
		const { req } = ctx;
		let _headerreq = req.rawHeaders.findIndex(h => h.toLowerCase() === 'authorization');
		if (_headerreq !== -1) {
			const token = req.rawHeaders[++_headerreq].replace('Bearer ', '');
			if (token && token !== 'null') {
				let user;
				try {
					const { sub } = jwt.verify(token, process.env.JWT_SECRET);
					user = await User.findById(sub);
				} catch (e) {
					throw new ApolloError(e.toString(), "AUTH_ERROR");
				}
				return { ...ctx, user }
			}
		}
		return { ...ctx };
	}
});
app.get('/', (req, res) => res.send('Ok').status(200));
app.get('/initCron', async (req, res) => {
	if (req.headers.authorization !== process.env.CRON_AUTH)
		return res.send('FORBIDDEN').status(500);
		await syncSheetWithDB();
	res.send('ok').status(200);
});
server.applyMiddleware({ app });
app.listen(3000, () => connectDB().then(() => console.log('running') ));

// const handler = serverless(app);
// const test = (event, context, callback) => {
// 	const response = {
// 		statusCode: 200,
// 		body: JSON.stringify({
// 			message: `Hello, the current time is ${new Date().toTimeString()}.`,
// 		}),
// 	};
//
// 	callback(null, response);
// };
// export {
// 	handler,
// 	test,
// }
