const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const { S3Client } = require("@aws-sdk/client-s3");

const fp = require("fastify-plugin");
require('dotenv').config();

// Validate necessary environment variables
if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY || !process.env.AWS_REGION) {
  throw new Error("Missing AWS environment variables. Check your .env file.");
}

// Configure CORS to allow cross-origin requests
fastify.register(cors, {
  credentials: true,
  strictPreflight: false,
  origin: process.env.ALLOWED_ORIGIN,
  methods: ["POST", "PATCH", "DELETE"],
});

// Enable file upload via multipart requests
fastify.register(require("@fastify/multipart"));

// Register AWS S3 client as a Fastify decorator
fastify.register(
  fp((fastify, opts, done) => {
    fastify.decorate(
      "s3",
      new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY,
        },
        requestHandler: {
          connectTimeout: 120000, // Increase to 2 minutes
          socketTimeout: 120000, // Increase to 2 minutes
        },
      })
    );

    done();
  })
);

// Register API routes
const audioRoutes = require("./routes");
fastify.register(audioRoutes, { prefix: "/audio" });

// Global error handler to catch all errors
fastify.setErrorHandler((error, req, reply) => {
  fastify.log.error(error);
  reply.status(error.statusCode || 500).send({ error: error.message || "Internal Server Error" });
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
