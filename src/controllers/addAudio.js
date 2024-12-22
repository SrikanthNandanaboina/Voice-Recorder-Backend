const fs = require("fs/promises");
const path = require("path");
const { validateFile } = require("../utils/validation");

// Defines the directory where uploaded audio chunks will be temporarily stored.
const UPLOAD_DIR = path.join(__dirname, "uploads");

module.exports = (fastify) => ({
  method: "POST",
  url: "/add",
  handler: async (req, reply) => {
    // Get uploaded file
    const data = await req.file();
    if (!data) {
      reply.status(400).send({ error: "No audio file provided" });
      return;
    }

    const validationResult = validateFile(data.filename, data.mimetype); // Validate file type and name
    if (!validationResult.isValid) {
      reply.status(400).send({ error: validationResult.message });
      return;
    }

    const filepath = path.join(UPLOAD_DIR, data.filename);

    try {
      // Check if file already exists
      if (await fs.stat(filepath).catch(() => false)) {
        reply.status(400).send({ error: "File already exists" });
        return;
      }

      await fs.writeFile(filepath, await data.toBuffer()); // Save the file to disk
      reply.send({
        message: "Audio chunk uploaded successfully",
        filename: data.filename,
      });
    } catch (error) {
      console.error("Error saving file:", error);
      reply.status(500).send({ error: "Error saving audio chunk" });
    }
  },
});
