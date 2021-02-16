export interface Config {
    "name" : string,
    "properName" : string,
    "index" : string,
    "sectionClass" : string,
    "headerTag" : string,
    "defaultPageType" : string,
    "defaultPageTOC" : string,
    "pageHeader" : string,
    "pageSubHeaders" : string[],
    "ignoreSection" : {
        "sectionsArray" : string[]
    },
    "ignorePage" : {
        "pagesArray" : string[]
    }
}

const config: Config = {
    "name" : "jestjs.io",
    "properName" : "Jest",
    "index" : "getting-started.html",
    "sectionClass" : "navGroup",
    "headerTag" : "h3",
    "defaultPageType" : "Guides",
    "defaultPageTOC" : "Section",
    "pageHeader" : "header h1",
    "pageSubHeaders" : ["article h2", "article h3"],
    "ignoreSection" : {
        "sectionsArray" : []
    },
    "ignorePage" : {
        "pagesArray" : []
    }
}

export default config;