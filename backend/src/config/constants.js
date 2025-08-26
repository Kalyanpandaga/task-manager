import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables");
  process.exit(1);
}

if (!JWT_SECRET_KEY) {
  console.error("❌ JWT_SECRET_KEY is not defined in environment variables");
  process.exit(1);
}

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000";

const JWT_SECRET_EXPIRES_IN = "1d";
const BCRYPT_ROUNDS = 12;

export {
  JWT_SECRET_KEY,
  JWT_SECRET_EXPIRES_IN,
  BCRYPT_ROUNDS,
  MONGO_URI,
  PORT,
  ALLOWED_ORIGIN,
};
