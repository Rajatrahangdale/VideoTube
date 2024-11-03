import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(() => {
    app.on("error", (err) => {
      console.error("MongoDB connection error: ", err);
      process.exit(1);
    });
  });
/*
const app = express()(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.on("error", (err) => {
      console.error("MongoDB connection error: ", error);
      process.exit(1);
    });
    app.listen(process.env.PORT, () => {
      console.log("Connected to MongoDB!", process.env.PORT);
    });
  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
  }
})();
*/
