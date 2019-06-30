/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-06-28.
 */

'use strict';

const execSync = require('child_process').execSync;

function countDocsAndWords(tag) {
  const out = execSync(`grep -rl "${tag}" ./src | xargs wc -l`).toString();
  const splittedOut = out.split('\n');
  const totalWordCount = splittedOut[splittedOut.length - 2].trim().split(' ')[0];
  const totalDocs = splittedOut.length - 2;

  return {
    totalDocs,
    totalWordCount
  };
}

const refactored = countDocsAndWords('TS2019-DONE');
const inProgress = countDocsAndWords('TODO TS2019');
const allDocuments = countDocsAndWords('LINKURIOUS CONFIDENTIAL');

console.log('Percentage of documents refactored: ' +
  Math.round(refactored.totalDocs / allDocuments.totalDocs * 100) + '%');
console.log('Percentage of words refactored: ' +
  Math.round(refactored.totalWordCount / allDocuments.totalWordCount * 100) + '%');
console.log('Percentage of documents in refactoring: ' +
  Math.round(inProgress.totalDocs / allDocuments.totalDocs * 100) + '%');
