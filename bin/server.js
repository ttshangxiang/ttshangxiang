require('babel-register')({
  plugins: ['transform-async-to-generator']
});

require("../server/app.js");