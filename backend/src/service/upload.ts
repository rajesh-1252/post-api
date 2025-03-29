import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

class UploadService {
  private s3Client: S3Client | null;
  private s3Enabled: boolean;

  constructor() {
    this.s3Enabled = process.env.S3_UPLOAD_ENABLED === 'true';

    if (this.s3Enabled) {
      this.s3Client = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
      });
    } else {
      this.s3Client = null;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (this.s3Enabled && this.s3Client) {
      return this.uploadToS3(file);
    } else {
      return this.uploadToLocal(file);
    }
  }

  private async uploadToS3(file: Express.Multer.File): Promise<string> {
    if (!this.s3Client) {
      throw new Error('S3 Client not initialized');
    }

    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;

    const params: PutObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uniqueFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);

      return `https://${params.Bucket}.s3.amazonaws.com/${uniqueFileName}`;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw error;
    }
  }

  private uploadToLocal(file: Express.Multer.File): string {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, file.buffer);
    return `/uploads/${uniqueFileName}`;
  }
}

export default new UploadService();
