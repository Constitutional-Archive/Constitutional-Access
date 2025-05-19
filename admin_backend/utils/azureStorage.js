const { MulterAzureStorage } = require("multer-azure-blob-storage");

const azureStorage = new MulterAzureStorage({
  accessKey: process.env.ACCESS_KEY,
  accountName: process.env.ACCOUNT_NAME,
  containerName: process.env.CONTAINER_NAME,
  containerAccessLevel: 'blob',
  blobName: (req, file) => {
    return new Promise((resolve, reject) => {
      const category = req.query.category;

      console.log("Category received in multer:", category);


      const blobName = `${category}/${Date.now()}-${file.originalname}`;
      resolve(blobName);
    });
  },
});

module.exports = { azureStorage };
