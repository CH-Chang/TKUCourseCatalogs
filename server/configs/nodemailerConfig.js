let config = {
  smtp: {
    get service() {
      return "gmail";
    },
    get user() {
      return "FLYAppService@gmail.com";
    },
    get pass() {
      return "puzklhxxdkxviuhr";
    }
  },
  get code() {
    return Math.random()
      .toString(16)
      .slice(2, 6)
      .toUpperCase();
  },
  get expire() {
    return new Date().getTime() + 10 * 60 * 1000;
  }
};

module.exports = config;
