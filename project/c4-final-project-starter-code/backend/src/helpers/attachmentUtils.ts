import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {createLogger} from "../utils/logger";
import Jimp from "jimp";

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('attachmentUtils')


// TODO: Implement the fileStogare logic

export class attachmentUtils {

  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  getAttachmentUrl(attachmentId: string): string {
    return `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`;
  }

  async getUploadUrlToS3(attachmentId: string): Promise<string> {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: attachmentId,
      Expires: parseInt(this.urlExpiration)
    })
  }

  async deleteS3Object(attachmentId: string) {
    var params = {
      Bucket: this.bucketName,
      Key: attachmentId
    };
    this.s3.deleteObject(params, function(err, data) {
      if (err) {
        logger.error('delete attachment failed: ' + err.message)
        throw new Error('Fail to delete attachment')
      }
      else logger.error('delete attachment success :' + data)
    });
  }

  async resizeImage(attachmentId: string, width: number, height: number) {

    if (!attachmentId || !width || !height) return;

    logger.error('Get current object')
    logger.error('attachmentId: ' + attachmentId)

    const s3ObjectRes = await this.s3.getObject({
          Bucket: this.bucketName,
          Key: attachmentId
        }
    ).promise();

    if (!s3ObjectRes || !s3ObjectRes.Body) return;

    logger.error('s3ImgStr: ' + s3ObjectRes.Body)

    const body = s3ObjectRes.Body;

    const s3Img = await Jimp.read(<Buffer> body);
    logger.error('s3ImgStr: ' + await s3Img.getBufferAsync('-1'))

    await s3Img.resize(width, height);

    const convertedImgBuffer = await s3Img.getBufferAsync('-1');

    logger.error('convertedImgBuffer: ' + convertedImgBuffer)
    // override the current object

    await this.s3.putObject({
          Bucket: this.bucketName,
          Key: attachmentId,
          Body: convertedImgBuffer
        }
    ).promise();

  }


}