const fs = require("fs/promises");
const path = require("path");
const { uploadToS3 } = require("../utils/s3");

const UPLOAD_DIR = path.join(__dirname, "uploads");
const MERGED_FILE = path.join(UPLOAD_DIR, "merged_audio.webm");

module.exports = (fastify) => ({
  method: "POST",
  url: "/merge",
  handler: async (req, reply) => {
    try {
      const files = await fs.readdir(UPLOAD_DIR); // List all files in the upload directory
      const chunks = files.filter((file) => file !== "merged_audio.webm");

      if (chunks.length === 0) {
        reply.status(400).send({ error: "No audio chunks to merge" });
        return;
      }

      const fileBuffers = await Promise.all(
        chunks.map((chunk) => fs.readFile(path.join(UPLOAD_DIR, chunk))) // Read all chunk files
      );

      const mergedBuffer = Buffer.concat(fileBuffers); // Merge chunks into one file
      await fs.writeFile(MERGED_FILE, mergedBuffer); // Save merged file
      
      // Uploads the merged audio file to the specified S3 bucket.
      await uploadToS3(
        fastify.s3,
        process.env.AWS_BUCKET_NAME,
        "merged_audio.webm",
        mergedBuffer,
        "audio/webm"
      );

      // Cleanup: Delete chunk files and merged file
      await Promise.all(chunks.map((chunk) => fs.unlink(path.join(UPLOAD_DIR, chunk))));
      await fs.unlink(MERGED_FILE);

      reply.send({ message: "Audio merged and uploaded to S3 successfully" });
    } catch (error) {
      console.error("Error merging audio:", error);
      reply.status(500).send({ error: "Error merging audio chunks" });
    }
  },
});
