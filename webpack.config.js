const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify')
    }
  },
  // Optional: Other Webpack settings can be added here (entry, output, module rules, etc.)
};
