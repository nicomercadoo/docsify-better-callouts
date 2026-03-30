import * as icons from './icons.js';

const defaultTag = {
    label: 'NOTE',
    icon: icons.infoIcon,
    cssClass: 'default',
};

// Callout types and their corresponding labels and CSS classes
const defaultConfig = {
    tags: {
        'NOTE': { label: 'Note', icon: icons.infoIcon, cssClass: 'note' },
        'WARNING': { label: 'Warning', icon: icons.warningIcon, cssClass: 'warning' },
        'DEFINITION': { label: 'Definition', icon: icons.defIcon, cssClass: 'definition' },
        'TIP': { label: 'Tip', icon: icons.tipIcon, cssClass: 'tip' },
        'INFO': { label: 'Info', icon: icons.infoIcon, cssClass: 'info' },
        'ADVICE': { label: 'Advice', icon: icons.warningIcon, cssClass: 'advice' },
        'ATTENTION': { label: 'Atterntion', icon: icons.warningIcon, cssClass: 'attention' },
        'IMPORTANT': { label: 'Important', icon: icons.warningIcon, cssClass: 'important' },
        'DANGER': { label: 'Danger', icon: icons.dangerIcon, cssClass: 'danger' },
        'CAUTION': { label: 'Caution', icon: icons.dangerIcon, cssClass: 'caution' },
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
        if (!tagConfig.label) {
            console.warn(`docsify-better-callouts: Missing required property "label" for tag "${tag}". This tag will be rendered without a label.`);
        }
        if (!tagConfig.icon) {
            console.warn(`docsify-better-callouts: Missing required property "icon" for tag "${tag}". This tag will be rendered without an icon.`);
        }
        if (!tagConfig.cssClass) {
            console.warn(`docsify-better-callouts: Missing required property "cssClass" for tag "${tag}". This tag will be rendered without a custom CSS class.`);
        }
    }

    // Check for invalid properties in the user config for each tag
    for (const [tag, tagConfig] of Object.entries(userConfig.tags || {})) {
        const validTagConfigKeys = Object.keys(defaultTag);
        for (const key of Object.keys(tagConfig)) {
            if (!validTagConfigKeys.includes(key)) {
                console.warn(`docsify-better-callouts: Invalid configuration entry "${key}" for tag "${tag}". Valid entries are: ${validTagConfigKeys.join(', ')}. This entry will be ignored.`);
            }
        }
    }
}
