const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Utility for uploading a file to S3
module.exports.uploadToS3 = async (s3Client, bucket, key, body, contentType) => {
  try {
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType });
    await s3Client.send(command);
  } catch (error) {
    throw new Error("Failed to upload to S3: " + error.message);
  }
};

// Utility for deleting a file from S3
module.exports.deleteFromS3 = async (s3Client, bucket, key) => {
  try {
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    await s3Client.send(command);
  } catch (error) {
    throw new Error("Failed to delete from S3: " + error.message);
  }
};

// Utility for generating a signed URL for S3
module.exports.getSignedUrlFromS3 = async (s3Client, bucket, key, expiresIn = 3600) => {
  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    throw new Error("Failed to generate signed URL: " + error.message);
  }
};
