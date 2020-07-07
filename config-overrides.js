module.exports = function override(config, env) {
  return {
    ...config,
    module: {
      ...config.module,
      noParse: /external_api\\.js/,
    },
  };
};
