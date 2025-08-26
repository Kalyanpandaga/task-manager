import app from "./app.js";
import { PORT } from "./config/constants.js";
import connectDB from "./config/database.js";

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server listening on port: ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
})();
