const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '580058641671-94vbldknff76jspucqchf10bobig2nmg.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//047FYOtsocESkCgYIARAAGAQSNwF-L9Ir2hYf1RIQiM5MkT978rgDeNLuYmxwZ8aLY1lJ7U-fLlAImM7j58z3t_ReU5HMtLCNfWU';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function senMail(message) {
  const accessToken = await oAuth2Client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'factory.sharm@gmail.com',
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken,
    },
  });

  await transport.sendMail(message, (error, result) => {
    transport.close();
  });
}

module.exports = senMail;
