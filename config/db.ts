import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) console.log(`Error: ${error.message}`);

    process.exit(1);
  }
}
