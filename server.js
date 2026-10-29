const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Line added to serve your HTML and CSS files automatically
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/weatherDB')
  .then(() => console.log('Connected to MongoDB successfully!'))
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});