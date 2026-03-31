//=============================================================================
// Better Callouts - A simple pluggin to enhance the default Docsify
// callout renderer.
// Author: Nicolás Mercado (nicolasmercado452@gmail.com)
// Date: 2026
//=============================================================================

import { applyUserOverrides, defaultConfig, getTagConfig } from './config.js';
import { resolveIcon } from './icons.js';

// GitHub Alert like callouts for Docsify
(function () {
    var betterCalloutsPlugin = function (hook, vm) {
        let config;
        let tagsPattern;

        hook.beforeEach(function (md) {
            const userConfig = vm.config.betterCallouts || {};
            const currentPath = vm.route.path;
            console.debug('User Config:', userConfig);

            config = applyUserOverrides(defaultConfig, userConfig, currentPath);
            tagsPattern = Object.keys(config.tags).join('|');

            console.debug('Config:', config);
            console.debug('vm:', vm);

            return processBetterCalloutsMD(md, tagsPattern, config);
        });

        hook.afterEach(function (html) {
            let processedHTML = processBetterCalloutsHTML(html, tagsPattern, config);

            if (config.processRegularCallouts) {
                processedHTML = processRegularCalloutsHTML(processedHTML, config);
            }

            return processedHTML;
        });
    }

    // Add plugin to docsify's plugin array
    $docsify = $docsify || {}
    $docsify.plugins = [].concat(betterCalloutsPlugin, $docsify.plugins || [])
})();


function processBetterCalloutsMD(md, tagsPattern, config) {
    const mdBetterCalloutsHeadPattern = new RegExp(`^(?<level>( *>)*) *\\[\\s*!(?<tag>${tagsPattern})(?<ignored>[\\s\\S]*?)\\] ?(?<content>[\\s\\S]*?)$`, 'gm');

    return md.replaceAll(mdBetterCalloutsHeadPattern,
        (...args) => {
            const namedCaptureGroups = args.at(-1);
            const { level: calloutLevel, tag: calloutTag, ignored: ignoredContentInTag, content: calloutContent } = namedCaptureGroups;

            let cleanedCalloutHead = `${calloutLevel} [!${calloutTag}]\n${calloutLevel}`;
            if (calloutContent) {
                /*
                    It appends '\n${calloutLevel}' again because the first one is needed to break the line after the callout head,
                    and the second one is needed to ensure that the content of the callout head is rendered as a separate
                    paragraph inside the blockquote, independent of the content of the callout body.
                    Then the head is isolated in its own '<p></p>' tags.
                    Also, this way, it avoids potential empty '<p></p>' tags if the first content of the callout body is not text.
                */
                cleanedCalloutHead += `\n${calloutLevel} ${calloutContent}`;
            }

            if (ignoredContentInTag) {
                console.warn('docsify-better-callouts: Ignored content in head tag:', ignoredContentInTag);
            }

            return cleanedCalloutHead;
        });
}

function processBetterCalloutsHTML(html, tagsPattern, config) {
    const htmlBetterCalloutsPattern = new RegExp(`<blockquote>\\s*<p>\\s*\\[\\s*!(?<tag>${tagsPattern})\\s*\\]\\s?</p>\\s*(?<content>[\\s\\S]*?)\\s*<\\/blockquote>`, 'g');

    return html.replaceAll(htmlBetterCalloutsPattern,
        (...args) => {
            const namedCaptureGroups = args.at(-1);
            const { tag: calloutType, content: calloutContent } = namedCaptureGroups;

            const tagConfig = getTagConfig(calloutType, config);

            const cssClass = tagConfig.cssClass;
            const label = tagConfig.label;
            const icon = resolveIcon(tagConfig.icon, config);

            const betterCallout = `<div class="better-callouts ${cssClass}">`
                + `<div class="callout-head">`
                + `<div class="callout-icon">${icon}</div>`
                + `<div class="callout-label">${label}</div>`
                + `</div>` // end callout-head
                + `<div class="callout-body">${calloutContent}</div>`
                + `</div>`; // end better-callouts

            return betterCallout;
        });
}

function processRegularCalloutsHTML(html, config) {
    const htmlRegularCalloutsPattern = new RegExp(`<blockquote>(?!\\s*<p>\\s*\\[\\s*![\\s\\S]*?\\s*\\]\\s?</p>)\\s*(?<content>[\\s\\S]*?)\\s*<\\/blockquote>`, 'g');

    return html.replaceAll(htmlRegularCalloutsPattern,
        (...args) => {

            const namedCaptureGroups = args.at(-1);
            const { content: calloutContent } = namedCaptureGroups;

            const betterCallout = `<div class="better-callouts regular-callout">`
                + `<div class="callout-body">${calloutContent}</div>`
                + `</div>`; // end regular callout


            return betterCallout;
        });
}
