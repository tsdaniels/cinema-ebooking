// utils/encryption.js
import crypto from 'crypto';

// Uses AES-256-CBC symmetric encryption
export const encryption = {

  encrypt: (text, secretKey) => {
    // Ensure key is the right length for AES-256 (32 bytes)
    const key = crypto.createHash('sha256').update(String(secretKey)).digest();
    
    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher with key and iv
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Combine the IV and encrypted content
    return iv.toString('hex') + ':' + encrypted;
  },

  decrypt: (encryptedText, secretKey) => {
    try {
      // Ensure key is the right length for AES-256 (32 bytes)
      const key = crypto.createHash('sha256').update(String(secretKey)).digest();
      
      // Split the encrypted text into iv and content
      const textParts = encryptedText.split(':');
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