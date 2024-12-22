const { deleteFromS3 } = require("../utils/s3");

module.exports = (fastify) => ({
  method: "DELETE",
  url: "/remove",
  handler: async (req, reply) => {
    try {
      await deleteFromS3(fastify.s3, process.env.AWS_BUCKET_NAME, "merged_audio.webm");
      reply.send({ message: "Audio file removed from S3 successfully" });
    } catch (error) {
      console.error("Error removing audio:", error);
      reply.status(500).send({ error: "Error removing audio file" });
    }
  },
});