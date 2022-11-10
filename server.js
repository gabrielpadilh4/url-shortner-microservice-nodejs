require('dotenv').config();

const { doesNotMatch } = require('assert');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const validUrl = require('valid-url')
const { ShortUrlModel } = require('./ShortUrlModel');

app.use(express.json())

if (!process.env.DISABLE_XORIGIN) {
    app.use(function (req, res, next) {
        var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
        var origin = req.headers.origin || '*';
        if (!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
            console.log(origin);
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        }
        next();
    });
}

app.post("/api/shorturl", async function (req, res) {

    var urlRequest = req.body.url

    if (!validUrl.isWebUri(urlRequest)) {
        res.json({ error: 'invalid url' })
        return
    }

    var shortUrl = ShortUrlModel({ originalUrl: urlRequest })

    shortUrl.save(function (err, data) {
        return res.json({ original_url: data.originalUrl, short_url: data._id })
    })
});

app.get("/api/shorturl/:shortUrl", function (req, res) {
    var shortUrl = req.params.shortUrl

    ShortUrlModel.findById({ _id: shortUrl }, function (err, data) {
        res.redirect(data.originalUrl)
    })
});




const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(port, () => {
    console.log('Node is listening on port ' + port + '...');
})