
const mongoose = require('mongoose');
const fs = require('fs');

async function seedWeatherData() {
  try {
    await mongoose.connect(
      'mongodb://127.0.0.1:27017/weatherDB'
    );

    const data = JSON.parse(
      fs.readFileSync('./weather-data.json', 'utf8')
    );

    const Weather = mongoose.model(
      'Weather',
      new mongoose.Schema({
        temperature: Number,
        humidity: Number,
        status: String,
        timestamp: Date
      })
    );

    await Weather.insertMany(data);

    console.log('10 weather records inserted successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedWeatherData();
