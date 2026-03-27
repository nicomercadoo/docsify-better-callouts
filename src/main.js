//=============================================================================
// Better Callouts - A simple pluggin to enhance the default Docsify
// callout renderer.
// Author: Nicolás Mercado (nicolasmercado452@gmail.com)
// Date: 2026
//=============================================================================
import { genConfig } from './config.js';
import { renderIcon } from './icons';

(function () {
    var betterCalloutsPlugin = function (hook, vm) {
        let config;

        hook.init(function () {
            config = genConfig(vm.config.betterCallouts || {});
            console.debug('Config:', config);
        })

        hook.afterEach(function (html) {
            console.debug('Processing callouts in the page:', vm.route.path);
            console.debug('Processing HTML:', html);

            const tagsPattern = Object.keys(config.tags).join('|');
            const betterCalloutsPattern = new RegExp(`<blockquote>\\s*<p>\\s*\\[\\s*!(?<type>${tagsPattern})(?<ignored>[\\s\\S]*?)\\]\\s?(?<content>[\\s\\S]*?)\\s*<\\/blockquote>`, 'g');
            // const betterCalloutsPattern = /<blockquote>\s*<p>\s*\[\s*!(?<type>[a-zA-Z]+)[\s\S]*\]\s?(?<content>[\s\S]*)<\/p>\s*<\/blockquote>/g;

            return html.replace(betterCalloutsPattern,
                (...args) => {
                    console.debug('Found a callout:', args[0]);
                    // console.debug('Callout type:', args[1]);
                    console.debug('Callout content:', args[2]);
                    // console.debug('Match groups:', args.at(-1));
                    // console.debug('All arguments:', args);
                    // console.debug('Last Arg:', args.at(-1));
                    const namedCaptureGroups = args.at(-1);
                    // console.debug('Named capture groups:', namedCaptureGroups);
                    const { type: calloutType, ignored: ignoredContentInTag, content: calloutContent } = namedCaptureGroups;
                    if (ignoredContentInTag) {
                        console.warn('docsify-better-callouts: Ignored content in tag:', ignoredContentInTag);
                    }
                    // console.debug('Callout type (from groups):', calloutType);
                    // console.debug('Callout content (from groups):', calloutContent);

                    const tagConfig = config.tags[calloutType.toUpperCase()];
                    if (!tagConfig) {
                        console.warn(`docsify-better-callouts: No configuration found for callout type "${calloutType}". Using default values.`);
                    }

                    const cssClassName = tagConfig.cssClassName || 'callout';
                    const title = tagConfig.title || calloutType;
                    const icon = renderIcon(tagConfig.icon);
                    console.debug(`Callout type "${calloutType}" will be rendered with title "${title}", CSS class "${cssClassName}", and icon:`, icon);

                    const betterCallout = `<blockquote class="better-callout ${cssClassName}">`
                        + `<p class="title title-${cssClassName}">`
                        + `<span class="icon-container icon-container-${cssClassName}">` + icon + `</span>`
                        + title
                        + `</p>`
                        + `<p>`
                        + calloutContent
                        + `</blockquote>`;
                    console.debug('Generated better callout HTML:', betterCallout);

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
