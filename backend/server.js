import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import XLSX from "xlsx";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import CrewData from "./models/InsertedData.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bioDataPath = path.join(__dirname, "Bio_Data_New.xlsx");

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Fetch crew details from Excel
app.get("/fetchUser/:crewId", (req, res) => {
  const crewId = req.params.crewId.trim().toUpperCase();
  if (!fs.existsSync(bioDataPath)) {
    return res.status(404).json({ message: "Bio_Data_New.xlsx not found!" });
  }

  try {
    const workbook = XLSX.readFile(bioDataPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    const user = data.find((r) => r.CREWID?.toString().toUpperCase() === crewId);
    if (!user) return res.status(404).json({ message: "Crew ID not found" });
    res.json(user);
  } catch (err) {
    console.error("Excel read error:", err);
    res.status(500).json({ message: "Failed to read Excel" });
  }
});

// Insert data into MongoDB
app.post("/insertUser", async (req, res) => {
  try {
    const newEntry = new CrewData(req.body);
    await newEntry.save();
    res.status(200).json({ message: "✅ Data inserted successfully!" });
  } catch (error) {
    console.error("❌ Error inserting data:", error);
    res.status(500).json({ message: "Failed to insert data" });
  }
});

// Download all inserted data as Excel
app.get("/download", async (req, res) => {
  try {
    const allData = await CrewData.find();
    if (!allData.length) {
      return res.status(404).json({ message: "No data to download" });
    }

    const ws = XLSX.utils.json_to_sheet(allData.map(d => d.toObject()));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inserted_Data");

    const filePath = path.join(__dirname, "Inserted_Data.xlsx");
    XLSX.writeFile(wb, filePath);

    res.download(filePath, "Inserted_Data.xlsx");
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Download failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
