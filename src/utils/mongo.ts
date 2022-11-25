import mongoose from 'mongoose';

export async function connectToMongo() {
  try {
    await mongoose.connect(process.env.DB_URI!);
    console.log('Connected to Database');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
