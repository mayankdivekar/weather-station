
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch(err => console.error('Database connection error:', err));

const weatherSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  status: String,
  timestamp: { type: Date, default: Date.now }
});

const Weather = mongoose.model('Weather', weatherSchema);

app.post('/weather/update', async (req, res) => {
  try {
    const newReport = new Weather({
      temperature: req.body.temperature,
      humidity: req.body.humidity,
      status: req.body.status
    });
    await newReport.save();
    res.status(201).json({ message: 'Weather saved!', data: newReport });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.get('/weather/now', async (req, res) => {
  try {
    const latestWeather = await Weather.findOne().sort({ timestamp: -1 });
    if (!latestWeather) return res.status(404).json({ message: 'No data' });
    res.json(latestWeather);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
