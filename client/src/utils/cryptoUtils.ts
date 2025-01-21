import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;

export const encryptMessage = (message: string): string => {
	return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
};

export const decryptMessage = (encryptedMessage: string): string => {
	try {
		const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
		const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

		if (!decryptedText) {
			throw new Error("Decryption failed: Invalid key or corrupted data");
		}

		return decryptedText;
	} catch (error) {
		console.error("Decryption error:", error);
		return "Failed to decrypt message";
	}
};
