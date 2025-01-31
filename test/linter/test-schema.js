/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const Ajv = require('ajv').default;
const ajvErrors = require('ajv-errors');
const addFormats = require('ajv-formats');
const betterAjvErrors = require('better-ajv-errors').default;
const { Logger } = require('../utils.js');

/**
 * @typedef {import('../utils').Logger} Logger
 */

const ajv = new Ajv({ allErrors: true });
// We use 'fast' because as a side effect that makes the "uri" format more lax.
// By default the "uri" format rejects ① and similar in URLs.
addFormats(ajv, { mode: 'fast' });
// Allow for custom error messages to provide better directions for contributors
ajvErrors(ajv);

/**
 * Test a file to make sure it follows the defined schema
 *
 * @param {string} dataFilename The file to test
 * @param {string} [schemaFilename] A specific schema file to test with, if needed
 * @returns {boolean} If the file contains errors
 */
function testSchema(
  dataFilename,
  schemaFilename = './../../schemas/compat-data.schema.json',
) {
  const schema = require(schemaFilename);
  const data = require(dataFilename);

  const logger = new Logger('JSON Schema');

  if (!ajv.validate(schema, data)) {
    // Output messages by one since better-ajv-errors wrongly joins messages
    // (see https://github.com/atlassian/better-ajv-errors/pull/21)
    ajv.errors.forEach((e) => {
      logger.error(betterAjvErrors(schema, data, [e], { indent: 2 }));
    });
  }

  logger.emit();
  return logger.hasErrors();
}

module.exports = testSchema;
