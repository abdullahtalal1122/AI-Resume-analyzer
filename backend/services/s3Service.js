const { S3Client, DeleteObjectCommand, HeadBucketCommand, CreateBucketCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl: getSignedUrlV3 } = require('@aws-sdk/s3-request-presigner');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Initialize S3 client with v3
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// S3 configuration
const bucketName = process.env.AWS_S3_BUCKET_NAME || 'fyp-resume-analyzer';

// Create S3 bucket if it doesn't exist
const createBucketIfNotExists = async () => {
    try {
        const headCommand = new HeadBucketCommand({ Bucket: bucketName });
        await s3Client.send(headCommand);
        console.log(`S3 bucket '${bucketName}' exists`);
    } catch (error) {
        if (error.name === 'NotFound') {
            try {
                const createCommand = new CreateBucketCommand({ Bucket: bucketName });
                await s3Client.send(createCommand);
                console.log(`S3 bucket '${bucketName}' created successfully`);
            } catch (createError) {
                console.error('Error creating S3 bucket:', createError);
            }
        } else {
            console.error('Error checking S3 bucket:', error);
        }
    }
};

// Generate unique filename with user folder structure
const generateS3Key = (userId, originalFileName) => {
    const timestamp = Date.now();
    const extension = path.extname(originalFileName);
    const baseName = path.basename(originalFileName, extension);
    return `users/${userId}/resumes/${timestamp}-${baseName}${extension}`;
};

// Configure multer for S3 upload
const uploadToS3 = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const s3Key = generateS3Key(req.user.id, file.originalname);
            req.s3Key = s3Key; // Store for later use
            cb(null, s3Key);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// Function to delete file from S3
const deleteFromS3 = async (s3Key) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: s3Key
        });
        await s3Client.send(command);
        console.log(`File deleted from S3: ${s3Key}`);
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw error;
    }
};

// Function to generate signed URL for temporary access
const getSignedUrl = async (s3Key, expires = 3600) => {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: s3Key
        });
        return await getSignedUrlV3(s3Client, command, { expiresIn: expires });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
};

// Function to get file from S3
const getFileFromS3 = async (s3Key) => {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: s3Key
        });
        const data = await s3Client.send(command);
        return data.Body;
    } catch (error) {
        console.error('Error getting file from S3:', error);
        throw error;
    }
};

module.exports = {
    uploadToS3,
    deleteFromS3,
    getSignedUrl,
    getFileFromS3,
    createBucketIfNotExists,
    s3Client,
    bucketName
};
