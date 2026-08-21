import ftp from 'basic-ftp';
import path from 'path';
import fs from 'fs';

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚀 Connecting to FTP server win8194.site4now.net...');
    await client.access({
      host: 'win8194.site4now.net',
      port: 21,
      user: 'jigneshsatani-001',
      password: 'avadh@123', // NOTE: Replace with your actual SmarterASP.net password if different
      secure: false,
    });

    console.log('✅ FTP Connected successfully.');
    console.log('📤 Uploading frontend production build to site4now hosting (jigneshsatani-001-subsite4)...');

    const distPath = path.join(process.cwd(), 'frontend', 'dist');
    if (!fs.existsSync(distPath)) {
      console.error('❌ dist folder not found. Please ensure "npm run build" in frontend is completed.');
      process.exit(1);
    }

    // Navigate to remote site directory if applicable
    try {
      await client.cd('/AVADH');
      console.log('📂 Navigated to /AVADH remote folder');
    } catch (cdErr) {
      console.log('ℹ️ /AVADH folder auto-created or uploading to default root directory.');
    }

    await client.uploadFromDir(distPath);
    console.log('🎉 Deployment to jigneshsatani-001-subsite4 completed successfully!');
  } catch (err) {
    console.error('❌ Deployment error:', err);
  } finally {
    client.close();
  }
}

deploy();

