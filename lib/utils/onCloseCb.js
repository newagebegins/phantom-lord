const debug = require('./debug');
const { STATE } = require('./constants');

/**
 * @callback RemoteBrowser~onCloseCb
 * @param {!RemoteBrowser} context
 * @param {string} cbType - 'close' or 'exit'
 * @param {number} code
 * @param {string} signal
 */
const onCloseCb = function onCloseCb(context, cbType, code, signal) {
  debug(`Puppeteer ${context.pid} ${cbType}ed with code: ${code}, signal: ${signal}`, 'debug');
  context.emit(cbType, code, signal);
  context.state = STATE.NOT_STARTED;
  context.isInitialized = false;
  context.chromium = null;
};

module.exports = onCloseCb;
