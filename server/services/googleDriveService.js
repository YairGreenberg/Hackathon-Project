import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CREDENTIALS_PATH = path.join(__dirname, "./oauth-credentials.json");
const TOKEN_PATH = path.join(__dirname, "../token.json");
const FOLDER_ID = process.env.FOLDER_ID;

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
const { client_id, client_secret, redirect_uris } = credentials.installed;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
oAuth2Client.setCredentials(token);

const drive = google.drive({ version: "v3", auth: oAuth2Client });

export const uploadToDrive = async (fileName, mimeType, fileStream) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: mimeType,
        body: fileStream,
      },
      fields: "id",
    });
    return response.data;
  } catch (error) {
    console.error("שגיאה בהעלאה לגוגל דרייב:", error);
    throw error;
  }
};