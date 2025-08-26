import { ALLOWED_ORIGIN } from "./constants.js";

const corsOptions = {
  origin: ALLOWED_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  credentials: true,
};

export default corsOptions;
