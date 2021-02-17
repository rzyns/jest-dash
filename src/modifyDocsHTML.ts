
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import config from './config';

import { getIndexedFiles } from './IndexedFiles';

const indexedFiles = getIndexedFiles();

if (!Array.isArray(indexedFiles)) {
    throw new Error("Expected indexedFiles.json to contain an array!");
}

// remove the left column and the nav bar so that it fits dash's usually small
// browser screen
indexedFiles.forEach(function(array) {
    //console.log(array);
    const htmlFilePath = __dirname + '/../Jest.docset/Contents/Resources/Documents/' + config.name + '/docs/en/' + array.name + '.html';
    const src = fs.readFileSync(htmlFilePath, 'utf8');
    const $ = cheerio.load(src);

    var headerClasses = config.pageSubHeaders.toString();
    var $headers = $(headerClasses);

    $headers.each(function(_, elem) {
        // Remove "Edit this Page" Button
        $('.edit-page-link').remove();

        var name = $($(elem).contents().get(1)).text();

        // TODO: Change "array.toc to somehting more relevant on a page-by-page basis in indexedFiles"
        $(elem).prepend('<a name="//apple_ref/cpp/' + array.toc + '/' + encodeURIComponent(name) + '" class="dashAnchor"></a>');
        $.html();
    });

    // Remove Header
    $('.fixedHeaderContainer').remove();
    // Remove Side Navigation
    // $('.docsNavContainer').remove();
    // Remove Footer
    $('.nav-footer').remove();
    // Clean up size of page
    $('.sideNavVisible').attr('style', 'min-width:inherit;padding-top:0');
    $('.docMainWrapper').attr('style', 'width:inherit;');
    $('.post').attr('style', 'float:none;margin:auto;');

    fs.writeFileSync(htmlFilePath, $.html(), 'utf8');
});
