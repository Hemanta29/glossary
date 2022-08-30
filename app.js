const express = require('express');
const compression = require('compression');
const cors = require('cors');
const dotenv = require('dotenv');

const { dbConnect } = require("./config/dbConnect.js")

const { errorHandler, notFound } = require('./middleware/errorHandling');
const glossaryRoutes = require('./routes/glossary.route');
const userRoutes = require('./routes/user.route');

dotenv.config();
dbConnect();

const app = express();
app.use(cors());

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
glossaryRoutes(app);
userRoutes(app);

app.use(express.static(`${__dirname}/dist/glossary-ui`));

// compress all responses
app.use(compression());

//error middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
