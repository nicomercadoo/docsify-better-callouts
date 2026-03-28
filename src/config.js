import * as icons from './icons.js';

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
    // Merge user config with default config
    // User config overrides default config
    const config = { ...defaultConfig, ...userConfig };
    return config;
}
