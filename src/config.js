import * as icons from './icons.js';

const defaultTag = {
    title: '<strong>NOTE</strong',
    icon: icons.infoIcon,
    cssClassName: 'note',
};

// Callout types and their corresponding titles and CSS classes
const defaultConfig = {
    tags: {
        'NOTE': { title: '<strong>Note</strong>', icon: icons.infoIcon, cssClassName: 'note' },
        'WARNING': { title: '<strong>Warning</strong>', icon: icons.warningIcon, cssClassName: 'warning' },
        'DEFINITION': { title: '<strong>Definition</strong>', icon: icons.defIcon, cssClassName: 'definition' },
        'TIP': { title: '<strong>Tip</strong>', icon: icons.tipIcon, cssClassName: 'tip' },
        'INFO': { title: '<strong>Info</strong>', icon: icons.infoIcon, cssClassName: 'info' },
        'ADVICE': { title: '<strong>Advice</strong>', icon: icons.warningIcon, cssClassName: 'advice' },
        'ATTENTION': { title: '<strong>Atterntion</strong>', icon: icons.warningIcon, cssClassName: 'attention' },
        'IMPORTANT': { title: '<strong>Important</strong>', icon: icons.warningIcon, cssClassName: 'important' },
        'DANGER': { title: '<strong>Danger</strong>', icon: icons.dangerIcon, cssClassName: 'danger' },
        'CAUTION': { title: '<strong>Caution</strong>', icon: icons.dangerIcon, cssClassName: 'caution' },
    }
};

// Generate the pluggin configuration by merging the default config with the user-provided config
export function genConfig(userConfig) {
    if (Object.keys(userConfig).length === 0) return defaultConfig;
    // console.debug('User Config:', userConfig)
    checkUserConfig(userConfig);

    // Merge user config with default config
    // User config overrides default config
    let config = defaultConfig;
    for (const [userTag, userTagConfig] of Object.entries(userConfig.tags || {})) {
        if (config.tags[userTag]) {
            // Override the default config for the tag with the user-provided config
            config.tags[userTag] = { ...config.tags[userTag], ...userTagConfig };
        } else {
            // Append the user-provided config for the new tag
            let newTag = Object.create(defaultTag);
            Object.assign(defaultTag, userTagConfig);
            config.tags[userTag] = newTag;
        }
    }
    return config;
}

function checkUserConfig(userConfig) {
    validKeys = Object.keys(defaultConfig);
    // console.debug('Valid configuration keys:', validKeys);
    // console.debug('User keys:', Object.keys(userConfig));

    // Check for invalid configuration entries in the user config
    for (const key of Object.keys(userConfig)) {
        if (!validKeys.includes(key)) {
            console.warn(`docsify-better-callouts: Invalid configuration entry "${key}". Valid entries are: ${validKeys.join(', ')}. This entry will be ignored.`);
        }
    }

    // Check for missing required properties in the user config for each tag
    for (const [tag, tagConfig] of Object.entries(userConfig.tags || {})) {
        if (!tagConfig.title) {
            console.warn(`docsify-better-callouts: Missing required property "title" for tag "${tag}". This tag will be rendered without a title.`);
        }
        if (!tagConfig.icon) {
            console.warn(`docsify-better-callouts: Missing required property "icon" for tag "${tag}". This tag will be rendered without an icon.`);
        }
        if (!tagConfig.cssClassName) {
            console.warn(`docsify-better-callouts: Missing required property "cssClassName" for tag "${tag}". This tag will be rendered without a custom CSS class.`);
        }
    }
}
