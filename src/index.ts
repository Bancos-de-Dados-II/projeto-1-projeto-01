import express from 'express';
import institutionRoutes from './routes/institution-routes.js';
import cors from 'cors';

const server = express();
const port = 3000;

server.use(express.json());
server.use(cors());

server.use('/institutions', institutionRoutes);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



