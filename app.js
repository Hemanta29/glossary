const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./routes/glossary.route');

const app = express();

// Express v4.16.0 and higher
// --------------------------
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

// For Express version less than 4.16.0
// ------------------------------------
// const bodyParser = require('body-parser');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
app.use(cors());
router(app);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/glossaryManagement');
mongoose.connection.on('connected', () => {
	console.log(
		'Mongoose default connection open to ' +
			'mongodb://localhost/glossaryManagement'
	);
});
// If the connection throws an error
mongoose.connection.on('error', (err) => {
	console.log(`Mongoose default connection error: ${err}`);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
	console.log('Mongoose default connection disconnected');
});
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
	mongoose.connection.close(() => {
		console.log(
			'Mongoose default connection disconnected through app termination'
		);
		process.exit(0);
	});
});

app.use((err, req, res, next) => {
	res.status(422).send({
		status: false,
		error: err.message,
	});
});

module.exports = app;
