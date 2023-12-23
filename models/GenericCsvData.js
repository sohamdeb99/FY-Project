// GenericCsvData.js

const mongoose = require('mongoose');

const genericCsvDataSchema = new mongoose.Schema({
    data: mongoose.Schema.Types.Mixed, // This will store any structure
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GenericCsvData', genericCsvDataSchema);
