const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol
} = require('@azure/storage-blob');

const accountName = process.env.ACCOUNT_NAME;
const accountKey = process.env.ACCESS_KEY;
const containerName = process.env.CONTAINER_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

async function generateSasUrl(blobName) {
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );

  const sasOptions = {
    containerName: containerName,
    blobName: blobName,
    permissions: BlobSASPermissions.parse("r"), // r = read, w = write, l = list
    startsOn: new Date(new Date().valueOf() - 5 * 60 * 1000), // valid 5 mins ago to avoid clock skew
    expiresOn: new Date(new Date().valueOf() + 60 * 60 * 1000), // valid for 1 hour
    protocol: SASProtocol.Https
  };

  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

  const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

  return sasUrl;
}

module.exports = generateSasUrl;
