const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../../config/s3");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../config/logger");

const uploadFile = async (file) => {
  const key = uuidv4();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    logger.info(`Object ${key} was successfuly uploaded to s3`);
  } catch (err) {
    throw Error("Error uploading file to S3");
  }
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
};

const deleteFile = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    logger.info(`Object ${key} was successfuly deleted from s3`);
  } catch (err) {
    throw new Error("Error deleting file from S3");
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
