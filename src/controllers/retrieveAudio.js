const { getSignedUrlFromS3 } = require("../utils/s3");

module.exports = (fastify) => ({
  method: "GET",
  url: "/retrieve",
  handler: async (req, reply) => {
    try {
      const url = await getSignedUrlFromS3(fastify.s3, process.env.AWS_BUCKET_NAME, "merged_audio.webm");
      reply.send({ url });
    } catch (error) {
      console.error("Error retrieving audio:", error);
      reply.status(500).send({ error: "Error retrieving audio file" });
    }
  },
});