const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const router = express.Router();
const GenericCsvData = require('../models/GenericCsvData'); // Import the new model

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        const results = [];
        fs.createReadStream(req.file.path)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => {
              // Save the parsed data to MongoDB
              const csvData = new GenericCsvData({ data: results });
              csvData.save((err, document) => {
                  if (err) {
                      res.status(500).json({ message: 'Error saving data to MongoDB', error: err });
                      return;
                  }
                  console.log('CSV data saved to MongoDB:', document);
                  res.status(200).json({ message: 'File uploaded and data saved to MongoDB' });
              });

              // Optionally, delete the file after processing
              fs.unlink(req.file.path, err => {
                  if (err) console.error(err);
              });
          });
    } else {
        res.status(400).json({ message: 'No file received' });
    }
});

module.exports = router;
