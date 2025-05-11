import Turf from '../models/model.turf.js';

export const createTurf = async (req, res) => {
  try {
    const { name, location, pricePerHour } = req.body;
    const turf = await Turf.create({ name, location, pricePerHour });
    res.status(201).json(turf);
  } catch (error) {
    console.error('Error creating turf:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTurfs = async (req, res) => {
  try {
    const turfs = await Turf.findAll();
    res.status(200).json(turfs);
  } catch (error) {
    console.error('Error fetching turfs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
