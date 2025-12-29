import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

console.log('--- TEST CLOUDINARY CONNECTIVITY ---');

try {
    dotenv.config();
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME ? 'DEFINED' : 'MISSING');
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'DEFINED' : 'MISSING');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'DEFINED' : 'MISSING');

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('Attempting to list resources...'); // Simple ping
    // Note: listing resources might require Admin API usage or specific permissions. 
    // Let's try a simpler 'ping' or just check config. 
    // Actually, cloudinary.api.ping() exists? No. 
    // Let's try to get usage or something simple.

    // Alternative: upload a base64 tiny image.
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==';

    cloudinary.uploader.upload(base64Image, { folder: 'skillshare/test' }, (error, result) => {
        if (error) {
            console.error('❌ FAIL: Upload failed:', error);
            process.exit(1);
        } else {
            console.log('✅ SUCCESS: Upload successful!', result.secure_url);
            console.log('Deleting test image...');
            cloudinary.uploader.destroy(result.public_id, (err, res) => {
                if (err) console.error('Deletion warning:', err);
                else console.log('Test cleanup done.');
                process.exit(0);
            });
        }
    });

} catch (err) {
    console.error('❌ CRASH:', err);
    process.exit(1);
}
