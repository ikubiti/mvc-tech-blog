const path = require("path");
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');

const KEYFILEPATH = path.join(__dirname, "app-credentials.json");

const clientId = process.env.DB_TYPE || '';
const clientSecret = process.env.PROJECT_ID || '';
const redirectUri = process.env.PRIVATE_KEY_ID || '';
const refreshToken = process.env.PRIVATE_KEY || '';
const clientToken = process.env.CLIENT_EMAIL || '';
const visitorPage = process.env.CLIENT_ID || '';
const refreshAuth = process.env.AUTH_URI || '';
const refreshURI = process.env.TOKEN_URI || '';
const refreshCert = process.env.AUTH_PROVIDER_X509_CERT_URI || '';
const clientCert = process.env.CLIENT_X509_CERT_URI || '';

const authKeys = {
	type: clientId,
	project_id: clientSecret,
	private_key_id: redirectUri,
	private_key: refreshToken,
	client_email: clientToken,
	client_id: visitorPage,
	auth_uri: refreshAuth,
	token_uri: refreshURI,
	auth_provider_x509_cert_url: refreshCert,
	client_x509_cert_url: clientCert
};

// function stringify() {
// 	let objString = '{';
// 	let index = 0;
// 	for (const key in authKeys) {
// 		// Conditionally add the comma
// 		if (index) {
// 			objString += `,`;
// 		}

// 		const value = authKeys[key];
// 		console.log(`"${value}"`);
// 		objString += `"${key}":`;
// 		objString += `"${value}"`;
// 		index++;

// 	}
// 	// close with curly brace
// 	objString += '}';
// 	return objString;
// }

// Custom Stringify to prevent addition of backslashes in key file
function stringify() {
	let objString = '{\n';
	let index = 0;
	for (const key in authKeys) {
		// Conditionally add the comma
		if (index) {
			objString += `,\n`;
		}

		const value = authKeys[key];
		objString += `\t"${key}":`;
		objString += ` "${value}"`;
		index++;

	}
	// close with curly brace
	objString += '\n}';
	return objString;
}

// let authString = stringify();
// console.log(authString);

// Create the authorization file
fs.writeFileSync(
	KEYFILEPATH, stringify()
);
