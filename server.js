import express from 'express';
import bodyParser from 'body-parser';
import { create_school } from "./api/create-school.js";
import { get_list_of_schools } from './api/fetch-school.js';
const app = express();
const port = 3000
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.post("/addSchool", async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // sanitize inputs
  const sanitizedName = typeof name === 'string' ? name.trim() : '';
  const sanitizedAddress = typeof address === 'string' ? address.trim() : '';
  const sanitizedLatitude = Number.isFinite(latitude) ? latitude : parseFloat(latitude);
  const sanitizedLongitude = Number.isFinite(longitude) ? longitude : parseFloat(longitude);


  if (!sanitizedName || !sanitizedAddress || isNaN(sanitizedLatitude) || isNaN(sanitizedLongitude)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const payload = {
    name: sanitizedName,
    address: sanitizedAddress,
    latitude: sanitizedLatitude,
    longitude: sanitizedLongitude
  }

  try {
    const result = await create_school(payload);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json({ error: 'Failed to create school' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

app.get("/listSchools", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Require latitude and longitude parameters
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    // Validate coordinate ranges
    if (lat < -90 || lat > 90) {
      return res.status(400).json({ error: 'Latitude must be between -90 and 90 degrees' });
    }

    if (lng < -180 || lng > 180) {
      return res.status(400).json({ error: 'Longitude must be between -180 and 180 degrees' });
    }

    const data = await get_list_of_schools({ latitude: lat, longitude: lng });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

app.get("/", (req, res) => {
  res.send("Welcome to School Management System :)")
})

app.listen(port, () => {
  console.log(`Running on: http://localhost:${port}`)
})