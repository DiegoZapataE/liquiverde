import mongoose from 'mongoose';
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/liquiverde');
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error al conectar MongoDB:', err);
  }
};