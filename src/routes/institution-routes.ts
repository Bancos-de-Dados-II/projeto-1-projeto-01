import express from 'express';

const intitutionRoutes = express.Router();

intitutionRoutes.get('/', (req, res) => {
  res.send('List of institutions');
});

intitutionRoutes.post('/', (req, res) => {
  res.send('Create a new institution');
});

export default intitutionRoutes;    