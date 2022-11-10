const { default: mongoose } = require("mongoose");

const shortUrlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true }
})

const ShortUrlModel = mongoose.model("ShortUrlModel", shortUrlSchema)

exports.ShortUrlModel = ShortUrlModel;