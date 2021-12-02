import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({
        path: require('path').resolve(__dirname, '../../.env'),
});

const uri = process.env.DB_PATH;
let conn;
export default async () => {
//	if (conn == null) {
		return mongoose.connect(uri, {
//			bufferCommands: false,
//			bufferMaxEntries: 0,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		})
	//}
//	return Promise.resolve();
}
