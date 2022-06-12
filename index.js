import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import veterinarianRoutes from "./routes/veterinarianRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

dotenv.config();

connectDB();

const domainAuthorized = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (domainAuthorized.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api/veterinarians", veterinarianRoutes);
app.use("/api/patients", patientRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
