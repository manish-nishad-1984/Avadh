import ftp from 'basic-ftp';
import path from 'path';
import fs from 'fs';

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚀 Connecting to FTP server WIN8194.site4now.net...');
    await client.access({
      host: 'WIN8194.site4now.net',
      user: 'avadhftp',
      password: 'avadh@123',
      secure: false,
    });

    console.log('✅ FTP Connected successfully.');
    console.log('📤 Uploading frontend production build to site4now hosting...');

    const distPath = path.join(process.cwd(), 'frontend', 'dist');
    if (!fs.existsSync(distPath)) {
      console.error('❌ dist folder not found. Please run "npm run build" in frontend first.');
      process.exit(1);
    }

    await client.uploadFromDir(distPath);
    console.log('🎉 Deployment to site4now completed successfully!');
  } catch (err) {
    console.error('❌ Deployment error:', err);
  } finally {
    client.close();
  }
}

deploy();
