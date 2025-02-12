// decrypt-env-into-new-file.mjs
import * as crypto from 'crypto';
import fs from 'fs';
import 'dotenv/config';

const algorithm = 'aes-256-cbc';
const key = '3zTvzr3p67VC61jmV54rIYu1545x4TlY';

const decryptEnvFileIntoNewFile = () => {
  const encryptedData = JSON.parse(fs.readFileSync('.env.enc', 'utf8'));
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(encryptedData.iv, 'hex'),
  );

  let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  // Write the new .env content to a new file
  fs.writeFileSync('.env', decrypted, 'utf8');
  console.log('.env file successfully generated.');
};

decryptEnvFileIntoNewFile();
