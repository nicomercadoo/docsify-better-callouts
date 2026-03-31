import * as icons from './icons.js';
import { betterCalloutsLanguagePack } from './languages.js';

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
        'TIP': { label: 'Tip', icon: icons.tipIcon, cssClass: 'tip' },
        'INFO': { label: 'Info', icon: icons.infoIcon, cssClass: 'info' },
        'ATTENTION': { label: 'Attention', icon: icons.warningIcon, cssClass: 'attention' },
        'IMPORTANT': { label: 'Important', icon: icons.warningIcon, cssClass: 'important' },
        'DANGER': { label: 'Danger', icon: icons.dangerIcon, cssClass: 'danger' },
        'CAUTION': { label: 'Caution', icon: icons.dangerIcon, cssClass: 'caution' },
    },
    defaultTag: defaultTag, // Default configuration for tags that are not explicitly defined
    svgFileAsRawSvg: true, // Whether to treat SVG file paths as raw SVG content for icon rendering
    defaultLanguage: 'en', // Default language for callout labels
    languagePacks: betterCalloutsLanguagePack, // Built-in language packs
    processRegularCallouts: true, // Whether to process regular callouts (without the [!TAG] syntax)
    matchLanguageWithCurrentPath: true, // Whether to automatically match the language pack based on the current page path (e.g., /en/, /fr/, /zh-ch/ in the URL)
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
        console.warn(`docsify-better-callouts: No configuration found for callout type "${tag}". Using default values.`);
    }

    return tagConfig || config.defaultTag;
}


export function applyUserOverrides(defaultConfig, userConfig, currentPath) {
    checkUserInvalidConfigEntries(defaultConfig, userConfig);
    checkUserMissingRequiredConfigEntries(userConfig);

    const spetialTreatedKeys = ['tags', 'languagePacks', 'defaultLanguage'];
    const directOverrideKeys = Object.keys(defaultConfig).filter(key => !spetialTreatedKeys.includes(key));
    let config = { ...defaultConfig };

    // 1. Overrides first level, simple fields (non-nested, non-spetial-treated)
    for (const [key, value] of Object.entries(userConfig)) {
        if (directOverrideKeys.includes(key)) {
            config[key] = value;
        }
    }

    // 2. Handle potential default language issues before applying language pack overrides
    if (userConfig.defaultLanguage && !defaultConfig.languagePacks?.[userConfig.defaultLanguage] && !userConfig.languagePacks?.[userConfig.defaultLanguage]) {
        console.warn(`docsify-better-callouts: The specified default language "${userConfig.defaultLanguage}" does not have a corresponding language pack. Available languages are: ${Object.keys(defaultConfig.languagePacks || {}).join(', ') || 'None'}. Falling back to the default language specified in the base configuration: ${defaultConfig.defaultLanguage}`);
    } else if (userConfig.defaultLanguage) {
        config.defaultLanguage = userConfig.defaultLanguage;
    }

    // 3. Overrides the language packs
    config.languagePacks = { ...defaultConfig.languagePacks, ...userConfig.languagePacks };

    // 4. Handle language pack overrides (lower priority than specific user tags)
    const resolvedLang = resolveCurrentLanguage(config, currentPath);
    const languagePack = config.languagePacks[resolvedLang];
    if (languagePack) {
        config = applyTagOverrides(config, languagePack.tags, defaultConfig.defaultTag);
    }

    // 5. Handle user tag overrides (highest priority)
    if (userConfig.tags) {
        config = applyTagOverrides(config, userConfig.tags, defaultConfig.defaultTag);
    }

    return config;
}

function resolveCurrentLanguage(config, currentPath) {
    if (config.matchLanguageWithCurrentPath && currentPath) {
        const langs = getAvailableLanguageKeys(config);
        const langFromPath = resolveLanguageFromPath(currentPath, langs);
        if (langFromPath) {
            return langFromPath;
        }
    }

    return config.defaultLanguage;
}

function getAvailableLanguageKeys(config) {
    return Object.keys(config.languagePacks || {});
}

function resolveLanguageFromPath(path, availableLangs) {
    if (!path || !availableLangs || availableLangs.length === 0) {
        return null;
    }

    const normalizedPath = String(path).toLowerCase();
    const pathSegments = normalizedPath.split('/').filter(Boolean);
    const normalizedLangs = [...new Set(availableLangs.map(lang => String(lang).toLowerCase()))];

    for (const segment of pathSegments) {
        const matchedLang = normalizedLangs.find(lang => lang === segment);
        if (matchedLang) {
            return matchedLang;
        }
    }

    return null;
}

/**
 * Core Logic: Applies a set of overrides to the current configuration
 */
function applyTagOverrides(config, overrides, defaultTag) {
    if (!overrides) return config;

    for (const [userTag, userTagConfig] of Object.entries(overrides)) {
        let matched = false;

        for (const baseKey of Object.keys(config.tags)) {
            if (handleExactMatch(config, baseKey, userTag, userTagConfig)) {
                matched = true;
                break;
            }
            if (handleIntersectionMatch(config, baseKey, userTag, userTagConfig)) {
                matched = true;
                break;
            }
        }

        if (!matched) {
            handleNewTag(config, defaultTag, userTag, userTagConfig);
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

function checkUserInvalidConfigEntries(baseConfig, userConfig) {
    const validKeys = Object.keys(baseConfig);

    // Check for invalid configuration entries in the user config
    for (const key of Object.keys(userConfig)) {
        if (!validKeys.includes(key)) {
            console.warn(`docsify-better-callouts: Invalid configuration entry "${key}". Valid entries are: ${validKeys.join(', ')}. This entry will be ignored.`);
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

function checkUserMissingRequiredConfigEntries(userConfig) {

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
}
