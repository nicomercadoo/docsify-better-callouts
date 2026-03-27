import * as icons from './icons.js';

// Callout types and their corresponding titles and CSS classes
const defaultConfig = {
    tags: {
        'NOTE': { title: 'Note', icon: icons.infoIcon, cssClassName: 'note' },
        'WARNING': { title: 'Warning', icon: icons.warningIcon, cssClassName: 'warning' },
        'DEFINITION': { title: 'Definition', icon: icons.defIcon, cssClassName: 'definition' },
        'TIP': { title: 'Tip', icon: icons.tipIcon, cssClassName: 'tip' },
        'INFO': { title: 'Info', icon: icons.infoIcon, cssClassName: 'info' },
        'ADVICE': { title: 'Advice', icon: icons.adviceIcon, cssClassName: 'advice' },
        'ATTENTION': { title: 'Atterntion', icon: icons.attentionIcon, cssClassName: 'attention' },
        'IMPORTANT': { title: 'Important', icon: icons.importantIcon, cssClassName: 'important' },
        'DANGER': { title: 'Danger', icon: icons.dangerIcon, cssClassName: 'danger' },
        'CAUTION': { title: 'Caution', icon: icons.cautionIcon, cssClassName: 'caution' },
    }
};

// Generate the pluggin configuration by merging the default config with the user-provided config
export function genConfig(userConfig) {
    // Merge user config with default config
    // User config overrides default config
    const config = { ...defaultConfig, ...userConfig };
    return config;
}
