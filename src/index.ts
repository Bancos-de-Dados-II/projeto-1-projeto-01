import express from 'express';
import institutionRoutes from './routes/institution-routes.js';
import cors from 'cors';
import mongoose from 'mongoose'; 
import 'dotenv/config';          

const server = express();
const port = process.env.PORT || 3333; 

server.use(express.json());
server.use(cors());

server.use('/institution', institutionRoutes);

const mongoUri = process.env.MONGO_URL;

if (!mongoUri) {
  console.error("error: A variável MONGO_URL não está definida no .env");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log("Conectado ao MongoDB Atlas com sucesso!");
    
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar no MongoDB:", error);
  });