
/**
 * package
 */
const crypto = require('crypto');
/**
 * config
 */
const { cipher_algorithm, cipher_key, cipher_iv } =  require('../../config/config');
const algorithm = cipher_algorithm;
const key = cipher_key;
const iv = cipher_iv;

module.exports.encrypt = (text) => {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), Buffer.from(iv, 'hex'));
    let encrypted = cipher.update(Buffer.from(text, 'utf8'));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
};

module.exports.decrypt = (text) => {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

