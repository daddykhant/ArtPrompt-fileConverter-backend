const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");

const app = express();

// Enable CORS
app.use(cors());

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST endpoint to handle file conversion
app.post("/convert", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const outputFormat = req.body.format || "webp";

  try {
    // Convert the image in memory
    const convertedImage = await sharp(req.file.buffer)
      .toFormat(outputFormat, { quality: 80 })
      .toBuffer();

    // Send the converted file as a downloadable response
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="converted.${outputFormat}"`
    );
    res.setHeader("Content-Type", `image/${outputFormat}`);
    res.status(200).send(convertedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error during file conversion" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
