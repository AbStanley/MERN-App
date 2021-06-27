const config = require('./config');
const mongoose = require("mongoose");

mongoose.set("useUnifiedTopology", true);

const uri = `mongodb://${config.db.host}/${config.db.name}`;
mongoose.connect(uri, config.mongoose.options);

module.exports = mongoose;
