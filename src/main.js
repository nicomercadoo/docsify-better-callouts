//=============================================================================
// Better Callouts - A simple pluggin to enhance the default Docsify
// callout renderer.
// Author: Nicolás Mercado (nicolasmercado452@gmail.com)
// Date: 2026
//=============================================================================

import { genConfig } from './config.js';
import { renderIcon } from './icons';

// GitHub Alert like callouts for Docsify
(function () {
    var betterCalloutsPlugin = function (hook, vm) {
        let config;
        let tagsPattern;

        hook.init(function () {
            config = genConfig(vm.config.betterCallouts || {});
            console.debug('Config:', config);
            tagsPattern = Object.keys(config.tags).join('|');
        })

        hook.beforeEach(function (md) {
            console.debug('Processing markdown for callouts in the page:', vm.route.path);
            console.debug('Original markdown:', md);

            const mdBetterCalloutHeadPattern = new RegExp(`^(?<level>( *>)*) *\\[\\s*!(?<type>${tagsPattern})(?<ignored>[\\s\\S]*?)\\] ?(?<content>[\\s\\S]*?)$`, 'gm');
            // `> [$<type>] \n> $<content>`
            return md.replaceAll(mdBetterCalloutHeadPattern,
                (...args) => {
                    console.debug('Found a callout markdown:', args[0]);
                    const namedCaptureGroups = args.at(-1);
                    const { level: calloutLevel, type: calloutType, ignored: ignoredContentInTag, content: calloutContent } = namedCaptureGroups;

                    let cleanedCalloutHead = `${calloutLevel} [!${calloutType}]\n${calloutLevel}`;
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
                    console.debug('Cleaned callout head markdown:', cleanedCalloutHead);

                    if (ignoredContentInTag) {
                        console.warn('docsify-better-callouts: Ignored content in head tag:', ignoredContentInTag);
                    }

                    return cleanedCalloutHead;
                });
        })

        hook.afterEach(function (html) {
            console.debug('Processing callouts in the page:', vm.route.path);
            console.debug('Processing HTML:', html);

            const htmlBetterCalloutsPattern = new RegExp(`<blockquote>\\s*<p>\\s*\\[\\s*!(?<type>${tagsPattern})\\]\\s?</p>\\s*(?<content>[\\s\\S]*?)\\s*<\\/blockquote>`, 'g');

            return html.replace(htmlBetterCalloutsPattern,
                (...args) => {
                    console.debug('Found a callout:', args[0]);
                    const namedCaptureGroups = args.at(-1);
                    const { type: calloutType,  content: calloutContent } = namedCaptureGroups;

                    const tagConfig = config.tags[calloutType.toUpperCase()];
                    if (!tagConfig) {
                        console.warn(`docsify-better-callouts: No configuration found for callout type "${calloutType}". Using default values.`);
                    }

                    const cssClassName = tagConfig.cssClassName || 'callout';
                    const label = tagConfig.label || calloutType;
                    const icon = renderIcon(tagConfig.icon);
                    console.debug(`Callout type "${calloutType}" will be rendered with label "${label}", CSS class "${cssClassName}", and icon:`, icon);

                    const betterCallout = `<blockquote class="better-callout ${cssClassName}">`
                        + `<div class="head head-${cssClassName}">`
                        + `<div class="icon-container icon-container-${cssClassName}">${icon}</div>`
                        + `<div class="label-continer label-container-${cssClassName}">${label}</div>`
                        + `</div>`
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
