const { MulterAzureStorage } = require("multer-azure-blob-storage");

const azureStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  containerName: process.env.CONTAINER_NAME,
  containerAccessLevel: 'blob',
  blobName: (req, file) => {
    return new Promise((resolve) => {
       const category = req.query.category;

      console.log("Category received in multer:", category);


      const blobName = `${category}/${Date.now()}-${file.originalname}`;
      resolve(blobName);
    });
  },
});

module.exports = { azureStorage };
