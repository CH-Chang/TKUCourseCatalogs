import RSAConfig from "../configs/RSAConfig";
import JsEncrypt from "@/assets/js/jsencrypt";

export default {
  methods: {
    RSAEncrypt: function(str) {
      let jse = new JsEncrypt();
      jse.setPublicKey(RSAConfig.PublicKey);
      return jse.encrypt(str);
    }
  }
};
