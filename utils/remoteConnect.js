const path = require('path');
const stream = require('stream');
require('dotenv').config();
const process = require('process');
const { google } = require('googleapis');

const folder = process.env.DB_FOLDER_NAME || '';
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const resource = { "role": "reader", "type": "anyone" };

const KEYFILEPATH = path.join(__dirname, "app-credentials.json");
let driveClient;

// single file upload
const saveFile = async (aFile) => {
	const bufferStream = new stream.PassThrough();
	bufferStream.end(aFile.buffer);
	const { data } = await driveClient.files.create({
		requestBody: {
			name: aFile.originalname,
			mimeType: aFile.mimeType,
			parents: folder ? [folder] : [],
		},
		media: {
			mimeType: aFile.mimeType,
			body: bufferStream,
		},
	});

	await driveClient.permissions.create({ fileId: data.id, resource: resource });

	return { name: data.name, file_id: data.id };
};


// batch upload
const saveFiles = async (files) => {
	let results = [];
	for (let i = 0; i < files.length; i++) {
		let sendfile = await saveFile(files[i]);
		results.push(sendfile);
	}

	if (results.length === 1) {
		return results[0];
	}

	return results;
};

// single file delete
const deleteFile = async (fieldValue) => {
	try {
		const fileId = fieldValue.split('id=')[1];
		if (!fileId || fileId.length === 0) {
			return false;
		}

		const result = await driveClient.files.delete({
			'fileId': fileId
		});

		if (result.status === 204) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return false;
	}
};

const listFiles = async () => {
	const res = await driveClient.files.list({
		//      pageSize: 10,
		fields: 'nextPageToken, files(id, name)',
	});
	const files = res.data.files;
	if (files.length === 0) {
		console.log('No files found.');
		return;
	}

	console.log('Files:');
	files.map((file) => {
		console.log(`${file.name} (${file.id})`);
	});
};

(async () => {
	const client = new google.auth.GoogleAuth({
		keyFile: KEYFILEPATH,
		scopes: SCOPES,
	});

	driveClient = await google.drive({
		version: 'v3',
		auth: client
	});
})();

module.exports = {
	saveFile,
	saveFiles,
	listFiles,
	deleteFile
};