import CryptoJS from "crypto-js";
import AES256Config from "../configs/AES256Config";

export default {
  methods: {
    AES256Encrypt(str) {
      let key = AES256Config.AES256Key;
      let iv = AES256Config.AES256Iv;
      let keyWordArray = CryptoJS.enc.Utf8.parse(key);
      let ivWordArray = CryptoJS.enc.Utf8.parse(iv);
      let strWordArray = CryptoJS.enc.Utf8.parse(str);
      let encrypted = CryptoJS.AES.encrypt(strWordArray, keyWordArray, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return encrypted.toString();
    },
    AES256Decrypt(str) {
      let key = AES256Config.AES256Key;
      let iv = AES256Config.AES256Iv;
      let keyWordArray = CryptoJS.enc.Utf8.parse(key);
      let ivWordArray = CryptoJS.enc.Utf8.parse(iv);
      let decrypted = CryptoJS.AES.decrypt(str, keyWordArray, {
        mode: CryptoJS.mode.CBC,
        iv: ivWordArray,
        padding: CryptoJS.pad.Pkcs7
      });
      return CryptoJS.enc.Utf8.stringify(decrypted).toString();
    }
  }
};
