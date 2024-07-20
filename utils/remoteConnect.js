const path = require('path');
// const stream = require('stream');
// require('dotenv').config();
// const process = require('process');
// const { google } = require('googleapis');

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const bucketName = process.env.AWS_BUCKET_NAME || '';
const region = process.env.AWS_BUCKET_REGION || '';
const accessKeyId = process.env.AWS_ACCESS_KEY || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
const awsUrl = process.env.AWS_CDN_URL || '';
const saveLocation = process.env.AWS_PARENT_FOLDER || '';

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const uploadFile = async (fileBuffer, fileName, mimetype) => {
  const fullFileName = saveLocation + fileName;

  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fullFileName,
    ContentType: mimetype,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  return `${awsUrl}/${fullFileName}`;
};

const deleteFile = (fileName) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3Client.send(new DeleteObjectCommand(deleteParams));
};

module.exports = {
  uploadFile,
  deleteFile,
};

// const folder = process.env.DB_FOLDER_NAME || '';
// const SCOPES = ['https://www.googleapis.com/auth/drive'];
// const resource = { role: 'reader', type: 'anyone' };

// const KEYFILEPATH = path.join(__dirname, 'app-credentials.json');
// let driveClient;

// // single file upload
// const saveFile = async (aFile) => {
//   const bufferStream = new stream.PassThrough();
//   bufferStream.end(aFile.buffer);
//   const { data } = await driveClient.files.create({
//     requestBody: {
//       name: aFile.originalname,
//       mimeType: aFile.mimeType,
//       parents: folder ? [folder] : [],
//     },
//     media: {
//       mimeType: aFile.mimeType,
//       body: bufferStream,
//     },
//   });

//   await driveClient.permissions.create({ fileId: data.id, resource: resource });

//   return { name: data.name, file_id: data.id };
// };

// // batch upload
// const saveFiles = async (files) => {
//   let results = [];
//   for (let i = 0; i < files.length; i++) {
//     let sendfile = await saveFile(files[i]);
//     results.push(sendfile);
//   }

//   if (results.length === 1) {
//     return results[0];
//   }

//   return results;
// };

// // single file delete
// const deleteFile = async (fieldValue) => {
//   try {
//     const fileId = fieldValue.split('id=')[1];
//     if (!fileId || fileId.length === 0) {
//       return false;
//     }

//     const result = await driveClient.files.delete({
//       fileId: fileId,
//     });

//     if (result.status === 204) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (err) {
//     return false;
//   }
// };

// const listFiles = async () => {
//   const res = await driveClient.files.list({
//     //      pageSize: 10,
//     fields: 'nextPageToken, files(id, name)',
//   });
//   const files = res.data.files;
//   if (files.length === 0) {
//     console.log('No files found.');
//     return;
//   }

//   console.log('Files:');
//   files.map((file) => {
//     console.log(`${file.name} (${file.id})`);
//   });
// };

// (async () => {
//   const client = new google.auth.GoogleAuth({
//     keyFile: KEYFILEPATH,
//     scopes: SCOPES,
//   });

//   driveClient = await google.drive({
//     version: 'v3',
//     auth: client,
//   });
// })();

// module.exports = {
//   saveFile,
//   saveFiles,
//   listFiles,
//   deleteFile,
// };
