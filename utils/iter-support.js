/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

function iterSupport(compat, browser) {
  if (browser in compat.support) {
    const data = compat.support[browser];
    return Array.isArray(data) ? data : [data];
  }

  return [{ version_added: null }];
}

module.exports = iterSupport;
