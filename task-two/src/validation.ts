/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
import fs from 'fs';
import dns from 'dns';
import emailValidator from 'email-validator';

async function validateEmailAddresses(inputPath: string[], outputFile: string) {
  // console.log('Complete the implementation in src/validation.ts');

  const fsemails = fs.readFileSync(inputPath[0], 'utf8');
  const emails = fsemails.split('\n');
  emails.shift();
  emails.pop();
  console.log(emails);
  const checklist: string[] = [];
  const completeMails: string[] = [];
  for (let j = 0; j < emails.length; j++) {
    completeMails.push(emails[j]);
    emails[j] = emails[j].split('@')[1];
    try {
      await resolveDNS(emails[j]);
      checklist.push(emails[j]);
    } catch (err) {
      console.log(err);
    }
  }
  let outPutArray: string[] = [];
  let finalOutput = '';
  console.log(completeMails);
  for (let n = 0; n < completeMails.length; n++) {
    for (let m = 0; m < checklist.length; m++) {
      if (completeMails[n].includes(checklist[m])) {
        outPutArray.push(completeMails[n]);
      }
    }
  }

  const set = new Set(outPutArray);
  outPutArray = [...set];
  finalOutput = `Emails \n${outPutArray.join('\n')}`;
  console.log(finalOutput);

  async function resolveDNS(params: string) {
    const validateDomains = new Promise((resolve, reject) => {
      try {
        dns.resolveMx(params, (error, addresses) => {
          if (error) {
            reject(error);
          } else {
            resolve(addresses);
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
    return validateDomains;
  }

  fs.writeFile(outputFile, finalOutput, 'utf-8', (err) => {
    if (err) console.log(err);
    else console.log('result saved');
  });
}
validateEmailAddresses(
  [
    '/Users/decagon/Desktop/week-4-task-Samuel-Adeyeye/task-two/fixtures/inputs/small-sample.csv',
  ],
  'validation.csv',
);
export default validateEmailAddresses;
