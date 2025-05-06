import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { CreatePresignedUrlDto } from './dto/s3.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private readonly bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
  ) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>(
        'AWS_S3_SECRET_ACCESS_KEY',
      ),
      region: this.configService.get<string>('AWS_S3_REGION'),
    });
  }

  async generatePresignedUrls(userId: number, files: CreatePresignedUrlDto[]) {
    const promises = files.map(async (file) => {
      const newFile = await this.filesService.create({ ...file, userId });

      const url = this.s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: file.fileName,
        Expires: 60 * 5,
        ContentType: file.fileType,
      });

      return {
        file: {
          id: newFile.id,
          name: newFile.name,
        },
        url,
      };
    });

    return await Promise.all(promises);
  }
}
