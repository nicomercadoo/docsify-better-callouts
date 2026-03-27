//=============================================================================
// Better Callouts - A simple pluggin to enhance the default Docsify
// callout renderer.
// Author: Nicolás Mercado (nicolasmercado452@gmail.com)
// Date: 2026
//=============================================================================

import { genConfig } from './config.js';

(function () {
    var betterCalloutsPlugin = function (hook, vm) {
        let config;

        hook.init(function () {
            config = genConfig(vm.config.betterCallouts || {});
            console.log('Config:', config);
        })

        hook.afterEach(function (html) {
            console.log('Processing callouts in the page:', vm.route.path);
            console.log('Processing HTML:', html);

            const tagsPattern = Object.keys(config.tags).join('|');
            const betterCalloutsPattern = new RegExp(`<blockquote>\\s*<p>\\s*\\[\\s*!(?<type>${tagsPattern})(?<ignored>[\\s\\S]*?)\\]\\s?(?<content>[\\s\\S]*?)\\s*<\\/blockquote>`, 'g');
            // const betterCalloutsPattern = /<blockquote>\s*<p>\s*\[\s*!(?<type>[a-zA-Z]+)[\s\S]*\]\s?(?<content>[\s\S]*)<\/p>\s*<\/blockquote>/g;

            return html.replace(betterCalloutsPattern,
                (...args) => {
                    console.log('Found a callout:', args[0]);
                    // console.log('Callout type:', args[1]);
                    console.log('Callout content:', args[2]);
                    // console.log('Match groups:', args.at(-1));
                    // console.log('All arguments:', args);
                    // console.log('Last Arg:', args.at(-1));
                    const namedCaptureGroups = args.at(-1);
                    console.log('Named capture groups:', namedCaptureGroups);
                    const { type: calloutType, ignored: ignoredContentInTag, content: calloutContent } = namedCaptureGroups;
                    console.log('Ignored content in tag:', ignoredContentInTag);
                    if (ignoredContentInTag) {
                    }
                    console.log('Callout type (from groups):', calloutType);
                    console.log('Callout content (from groups):', calloutContent);

                    const cssClassName = config.tags[calloutType.toUpperCase()].cssClassName || 'callout';
                    const title = config.tags[calloutType.toUpperCase()].title || calloutType;

                    const betterCallout = `<blockquote class="better-callout ${cssClassName}">`
                        + `<p class="title">`
                        + `<span class="icon icon-${cssClassName}"></span>`
                        + `${title}`
                        + `</p>`
                        + `<p>${calloutContent}`
                        + `</blockquote>`;
                    console.log('Generated better callout HTML:', betterCallout);

                    return betterCallout;
                });
        });
    }

    // Add plugin to docsify's plugin array
    $docsify = $docsify || {}
    $docsify.plugins = [].concat(betterCalloutsPlugin, $docsify.plugins || [])
})();


// GitHub Alert like callouts for Docsify
//
// Usage:
// > [ !NOTE ] This is a note callout.
// > [ !WARNING ] This is a warning callout.
// > [ !TIP ] This is a tip callout.
// > [ !INFO ] This is an info callout.
// > [ !DANGER ] This is a danger callout.
// > [ !CAUTION ] This is a caution callout.
// function betterCallouts(quote) {
//     const betterCalloutsPattern = /^>\s*\[ !([a-zA-Z]+) \]\s/;
//     const matches = quote.match(betterCalloutsPattern);
//     if (!matches) {
//         return quote; // Not a callout, return as is
//     }

//     const type = matches[1];
//     const title = matches[2];


//     const calloutTypes = {
//         note: 'Note',
//         warning: 'Warning',
//         tip: 'Tip',
//         info: 'Info',
//         danger: 'Danger',
//         caution: 'Caution',
//     };

//     const calloutType = calloutTypes[type.toLowerCase()] || 'Note';
//     const calloutTitle = title || calloutType;

//     return `<blockquote class="callout ${calloutType.toLowerCase()}"><strong>${calloutTitle}:</strong>`;
//     return quote;
// }
