import * as icons from './icons.js';

const defaultTag = {
    label: 'NOTE',
    icon: icons.infoIcon,
    cssClass: 'default',
};

// Callout types and their corresponding labels and CSS classes
export const defaultConfig = {
    tags: {
        'NOTE': { label: 'Note', icon: icons.infoIcon, cssClass: 'note' },
        'WARNING|WARN': { label: 'Warning', icon: icons.warningIcon, cssClass: 'warning' },
        'DEFINITION|DEF': { label: 'Definition', icon: icons.defIcon, cssClass: 'definition' },
        // 'WARNING': { label: 'Warning', icon: icons.warningIcon, cssClass: 'warning' },
        // 'DEFINITION': { label: 'Definition', icon: icons.defIcon, cssClass: 'definition' },
        'TIP': { label: 'Tip', icon: icons.tipIcon, cssClass: 'tip' },
        'INFO': { label: 'Info', icon: icons.infoIcon, cssClass: 'info' },
        'ADVICE': { label: 'Advice', icon: icons.warningIcon, cssClass: 'advice' },
        'ATTENTION': { label: 'Atterntion', icon: icons.warningIcon, cssClass: 'attention' },
        'IMPORTANT': { label: 'Important', icon: icons.warningIcon, cssClass: 'important' },
        'DANGER': { label: 'Danger', icon: icons.dangerIcon, cssClass: 'danger' },
        'CAUTION': { label: 'Caution', icon: icons.dangerIcon, cssClass: 'caution' },
    },
    defaultTag: defaultTag, // Default configuration for tags that are not explicitly defined
    svgFileAsRawSvg: true, // Whether to treat SVG file paths as raw SVG content for icon rendering
};

export function getTagConfig(tag, config) {
    let tagConfig = null;

    for (const tagPattern of Object.keys(config.tags)) {
        if (RegExp(tagPattern).test(tag)) {
            tagConfig = config.tags[tagPattern];
            break;
        }
    }

    if (!tagConfig) {
        console.warn(`docsify-better-callouts: No configuration found for callout type "${calloutType}". Using default values.`);
    }

    return tagConfig || config.defaultTag;
}

// Generate the plugin configuration by merging the default config with the user-provided config
// Merge user config with default config
// User config overrides default config
export function mergeConfig(baseConfig, userConfig) {
    if (Object.keys(userConfig).length === 0) return baseConfig;

    checkUserConfigWith(baseConfig, userConfig);

    const config = { ...baseConfig, tags: { ...baseConfig.tags } };

    if (!userConfig.tags) return config;

    for (const [userTag, userTagConfig] of Object.entries(userConfig.tags)) {
        let matched = false;

        for (const baseKey of Object.keys(config.tags)) {
            // Case A: Direct exact match
            if (handleExactMatch(config, baseKey, userTag, userTagConfig)) {
                matched = true;
                break; // Processed, move to the next user tag
            }

            // Case B: Subset intersection
            if (handleIntersectionMatch(config, baseKey, userTag, userTagConfig)) {
                matched = true;
                break; // Processed, move to the next user tag
            }
        }

        // Case C: The user created a new tag
        if (!matched) {
            handleNewTag(config, baseConfig.defaultTag, userTag, userTagConfig);
        }
    }

    return config;
}

/**
 * Case A: Direct exact match
 * Checks if the user tag exactly matches a base key.
 */
function handleExactMatch(config, baseKey, userTag, userTagConfig) {
    if (baseKey === userTag) {
        config.tags[baseKey] = { ...config.tags[baseKey], ...userTagConfig };
        return true;
    }
    return false;
}

/**
 * Case B: Subset intersection
 * Handles cases where the user overrides a specific subset of a compound tag.
 */
function handleIntersectionMatch(config, baseKey, userTag, userTagConfig) {
    const baseVariants = baseKey.split('|').map(v => v.trim());
    const userVariants = userTag.split('|').map(v => v.trim());

    // Find which user variants exist in the current base key
    const intersection = userVariants.filter(v => baseVariants.includes(v));

    if (intersection.length > 0) {
        const baseProps = config.tags[baseKey];

        // 1. Filter out the variants that were NOT overwritten
        const remainingBaseVariants = baseVariants.filter(v => !intersection.includes(v));
        const remainingBaseKey = remainingBaseVariants.join('|');

        // 2. Remove the original composite key
        delete config.tags[baseKey];

        // 3. If any original variants survived, save them with their intact props
        if (remainingBaseKey !== '') {
            config.tags[remainingBaseKey] = baseProps;
        }

        // 4. Save the user's subset, inheriting the base props
        config.tags[userTag] = { ...baseProps, ...userTagConfig };

        return true;
    }
    return false;
}

/**
 * Case C: New Tag
 * Appends the user-provided config for a completely new tag.
 */
function handleNewTag(config, defaultTag, userTag, userTagConfig) {
    let newTag = Object.create(defaultTag);
    Object.assign(newTag, userTagConfig);
    config.tags[userTag] = newTag;
}


function checkUserConfigWith(baseConfig, userConfig) {
    validKeys = Object.keys(baseConfig);
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
        const validTagConfigKeys = Object.keys(baseConfig.defaultTag);
        for (const key of Object.keys(tagConfig)) {
            if (!validTagConfigKeys.includes(key)) {
                console.warn(`docsify-better-callouts: Invalid configuration entry "${key}" for tag "${tag}". Valid entries are: ${validTagConfigKeys.join(', ')}. This entry will be ignored.`);
            }
        }
    }
}
