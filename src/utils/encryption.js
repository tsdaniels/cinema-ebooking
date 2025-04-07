// utils/encryption.js
import crypto from 'crypto';

const getKey = () => {
  const cardKey = process.env.CARD_KEY;
  if (!cardKey) {
    throw new Error("Encryption key not found in environment variables");
  }
  return cardKey;
};

export const encryption = {

  encrypt: (text) => {
    try {
      // Ensure key is the right length for AES-256 (32 bytes)
      const key = crypto.createHash('sha256').update(String(getKey())).digest();
      
      // Generate a random initialization vector
      const iv = crypto.randomBytes(16);
      
      // Create cipher with key and iv
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      
      // Encrypt the text
      let encrypted = cipher.update(text, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      // Combine the IV and encrypted content
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.error('Encryption error:', error.message);
      throw new Error('Failed to encrypt data');
    }
  },

  decrypt: (encryptedText) => {
    try {
      // Ensure key is the right length for AES-256 (32 bytes)
      const key = crypto.createHash('sha256').update(String(getKey())).digest();
      
      // Split the encrypted text into iv and content
      const textParts = encryptedText.split(':');
      if (textParts.length !== 2) {
        throw new Error('Invalid encrypted text format');
      }
      
      const iv = Buffer.from(textParts[0], 'hex');
      const encryptedContent = textParts[1];
      
      // Create decipher with key and iv
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      
      // Decrypt the content
      let decrypted = decipher.update(encryptedContent, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error.message);
      return null;
    }
  }
};

export default encryption;