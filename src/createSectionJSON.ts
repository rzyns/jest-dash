import cheerio from 'cheerio';
import * as fs from 'fs';
import { basename as path_basename } from 'path';
import config from "./config";

import { Page } from "./Page";

// get base file to itterate over
const basePath = __dirname + '/../Jest.docset/Contents/Resources/Documents/' + config.name + '/docs/en/' + config.index;
const baseSrc = fs.readFileSync(basePath, 'utf8');
const $ = cheerio.load(baseSrc);
const pageNamesArray: Page[] = [];
const $section = $('.' + config.sectionClass);
const path = __dirname + '/../indexedFiles.json';

// import * as O from 'fp-ts/Option';
// import { pipe } from 'fp-ts/function';

function getPageName(element: cheerio.Element) {
    const href = $(element).attr('href');
    if (!href) {
        return 'untitled';
    }

    try {
        const url = new URL(href);
        return path_basename(url.pathname);
    } catch (e) {
        if (href.endsWith('.html')) {
            return path_basename(href, '.html');
        }
        return 'untitled';
    }
}

$section.each(function(_, elem){

    // TODO: create a better config pointer
    const $sectionHeader = $(elem).children(config.headerTag).text();
    const $sectionLink = $(elem).children('ul').children('li').children('a');

    $sectionLink.each(function(_, elem){
        const page: Page = {} as any;

        if (config.ignoreSection.sectionsArray.indexOf($sectionHeader) !== -1) {
            return;
        }

        // $(this).attr('href') returns ie.(guides-containers.html#content)
        // substring removes last 13 characters '.html#content' from href.
        // page.name = $(elem).attr('href')?.substring(0, len ? len - 13 : 0) ?? "Untitled";
        page.name = getPageName(elem);

        if(config.ignorePage.pagesArray.indexOf(page.name) !== -1) {
            return;
        }

        // set the Dash types based on the doc headers.
        switch ($sectionHeader) {
            case 'Core Concepts':
                page.type = 'Library';
                page.toc = 'Property';
                break;
            case 'Reference':
                page.type = 'Resource';
                page.toc = 'Property';
                break;
            default:
                page.type = config.defaultPageType;
                page.toc = config.defaultPageTOC;
        };
        pageNamesArray.push(page);
    });
});

fs.writeFileSync(path, JSON.stringify(pageNamesArray, null, 4), 'utf8');
