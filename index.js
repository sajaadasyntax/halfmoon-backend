const express = require('express');
const app = express();
const mongoose = require('mongoose');
const errors = require('./middlewares/errors');
const authRouter = require('./routes/authRoutes');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)
mongoose.connect(process.env.MONGODB_SECRET, {
}).then(
    () => {
        console.log("Connected to DB");
    },
    (error) => {
        console.log("Error connecting to DB");
        console.log(error);
    }
)
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
app.use('/uploads',express.static('uploads'));
app.use('/api', require("./routes/authRoutes"));
app.use('/api/user', authRouter);
app.use(errors.notFound);
app.use(errors.errorHandler);

app.listen(process.env.PORT || 4000, function () {
    console.log("Server is running on port 4000");
    console.log(process.env.PORT);

});