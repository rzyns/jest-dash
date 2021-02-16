import cheerio from 'cheerio';
import * as fs from 'fs';
import config from './config';
import flatten from 'lodash.flatten';

import { getIndexedFiles } from "./IndexedFiles";

const indexedFiles = getIndexedFiles();

if (!Array.isArray(indexedFiles)) {
    throw new Error(`Error parsing indexedFiles.json:\n\t${indexedFiles}`);
}

// this assumes build.sh has been run, and the jest docs fetched into
// Contents/Resources/Documents/jest
export default function getData() {
    if (!Array.isArray(indexedFiles)) {
        throw new Error(`Error parsing indexedFiles.json:\n\t${indexedFiles}`);
    }

    var res = indexedFiles.map(function(array) {
        var path = __dirname + '/../Jest.docset/Contents/Resources/Documents/' + config.name + '/docs/en/' + array.name + '.html';
        var src = fs.readFileSync(path, 'utf-8');
        var $ = cheerio.load(src);

        var $headers = $(config.pageHeader).first();

        var names: string[] = [];

        $headers.each(function(_, elem) {
            var name = $($(elem).contents()).text();

            names.push(name.trim());
        });

        var url = config.name + '/docs/en/' + array.name + '.html';

        var res = names.map(function(n) {
            return {
                name: n,
                type: array.type,
                path: url + '#_',
            };
        });

        return res;
  });

  return flatten(res);
}