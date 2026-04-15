import dotenv from 'dotenv';
dotenv.config();
import { BlobServiceClient } from '@azure/storage-blob';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING as string;
const containerName = 'certificates';

export async function uploadToAzure(buffer: Buffer, fileName: string): Promise<string> {
  console.log('AZURE:', process.env.AZURE_STORAGE_CONNECTION_STRING);

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: 'application/pdf' },
  });

  return blockBlobClient.url;
}