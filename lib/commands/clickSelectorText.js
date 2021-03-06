const { debug } = require('../utils');
const { STATUS } = require('../utils/constants');
const findAll = require('../page/findAll');
const fetchTextFromElement = require('../page/fetchTextFromElement');
const visible = require('../page/visible');
const waitFor = require('./waitFor');

/**
 * @param {!RemoteBrowser=} context
 * @param {string|{type: string, path: string}} selector
 * @param {string} text
 * @param {Function=} onTimeout
 * @returns {Promise}
 */
module.exports = async function clickSelectorText(context, selector, text, onTimeout) {
  return waitFor(context, async () => {
    const errorWithUsefulStack = new Error();
    const throwError = (status) => {
      debug(`debug: clickSelectorText error: ${status}`, 'error');
      errorWithUsefulStack.message = `clickSelectorText(${selector}, ${text}): ${status}`;
      throw errorWithUsefulStack;
    };

    let visibleElement;
    let matchedByTextElement;
    const els = await findAll(context.page, selector);

    if (els.length === 0) {
      throwError(STATUS.NOT_FOUND);
    }

    for (const el of els) { // eslint-disable-line no-restricted-syntax
      const elementText = await fetchTextFromElement(context, el);

      if (elementText === text) {
        matchedByTextElement = el;

        if (await visible(context, el)) {
          visibleElement = el;
          break;
        }
      }
    }

    if (!matchedByTextElement) {
      throwError(STATUS.NOT_FOUND);
    }

    if (!visibleElement) {
      throwError(STATUS.INVISIBLE);
    }

    try {
      await visibleElement.click();
    } catch (e) {
      debug(e, 'error');
      throwError('clickError');
    }
  }, 'clickSelectorText', onTimeout);
};
