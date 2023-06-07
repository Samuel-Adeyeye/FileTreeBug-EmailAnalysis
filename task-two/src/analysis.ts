/* eslint-disable no-prototype-builtins */
/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
import fs from 'fs';
import EmailValidator from 'email-validator';

function analyseFiles(inputPaths: string[], outputPath: string) {
  interface totalData {
    'valid-domains': string[];
    totalEmailsParsed: number;
    totalValidEmails: number;
    categories: Record<string, number>;
  }

  let fetchedArray: string[] = [];
  const validEmail: string[] = [];
  const output: totalData = {
    'valid-domains': [],
    totalEmailsParsed: 0,
    totalValidEmails: 0,
    categories: {},
  };

  let mails = '';
  for (let i = 0; i < inputPaths.length; i++) {
    fs.readFile(inputPaths[i], 'utf-8', (err, data) => {
      for (let j = 0; j < data.length; j++) {
        mails += data[j];
      }
      // console.log(mails);
      fetchedArray = mails.split('\n');
      fetchedArray.shift(); // removes 'Email' from the beginning of the array
      fetchedArray.pop();
      console.log(fetchedArray);

      for (let k = 0; k < fetchedArray.length; k++) {
        if (EmailValidator.validate(fetchedArray[k])) {
          validEmail.push(fetchedArray[k]);
        }
      }

      const splitEmail: string[][] = [];
      for (let l = 0; l < validEmail.length; l++) {
        splitEmail.push(validEmail[l].split('@'));
      }
      console.log(splitEmail);
      const flatArray: string[] = splitEmail.flat();
      console.log(flatArray);

      let domainName: string[] = [];
      for (let n = 0; n < flatArray.length; n++) {
        if (flatArray[n].includes('.')) {
          domainName.push(flatArray[n]);
        }
      }
      const domainCount: Record<string, number> = {};
      for (let d = 0; d < domainName.length; d++) {
        if (domainCount.hasOwnProperty(domainName[d])) {
          domainCount[domainName[d]]++;
        } else {
          domainCount[domainName[d]] = 1;
        }
      }
      const set = new Set(domainName);
      domainName = [...set];
      output.categories = domainCount;
      output['valid-domains'] = domainName;
      output.totalValidEmails = validEmail.length;
      output.totalEmailsParsed = fetchedArray.length;

      console.log(output);

      fs.writeFile(outputPath, JSON.stringify(output), 'utf-8', (err) => {
        if (err) console.log(err);
        else console.log('result saved');
      });
    });
  }
}

// console.log('Complete the implementation in src/analysis.ts');

analyseFiles(
  [
    '/Users/decagon/Desktop/week-4-task-Samuel-Adeyeye/task-two/fixtures/inputs/small-sample.csv',
  ],
  'analysis.json',
);
export default analyseFiles;
