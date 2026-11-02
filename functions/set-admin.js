// Script satu kali untuk memberikan custom claim admin pada akun pemilik.
// Jangan commit file service-account JSON ke GitHub.
const admin = require('firebase-admin');
const ADMIN_EMAIL = 'qurosuyoch219@gmail.com';
const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialPath) throw new Error('Atur GOOGLE_APPLICATION_CREDENTIALS ke lokasi file service-account JSON terlebih dahulu.');
const serviceAccount = require(credentialPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
(async()=>{
  const user = await admin.auth().getUserByEmail(ADMIN_EMAIL);
  if (!user.emailVerified) throw new Error('Verifikasi email admin di Firebase Authentication terlebih dahulu.');
  await admin.auth().setCustomUserClaims(user.uid, { ...(user.customClaims || {}), admin: true });
  console.log(`Hak admin berhasil diberikan kepada ${ADMIN_EMAIL}. Logout lalu login kembali di website.`);
  process.exit(0);
})().catch(err=>{console.error(err);process.exit(1);});
