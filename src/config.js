// Callout types and their corresponding titles and CSS classes
const defaultConfig = {
    tags: {
        'NOTE': { title: 'Note', icon: '', cssClassName: 'note' },
        'WARNING': { title: 'Warning', icon: '', className: 'warning' },
        'DEFINITION': { title: 'Definition', className: 'definition' },
        'TIP': { title: 'Tip', icon: '', className: 'tip' },
        'INFO': { title: 'Info', icon: '', className: 'info' },
        'ADVICE': { title: 'Advice', icon: '', className: 'advice' },
        'ATTENTION': { title: 'Atterntion', icon: '', className: 'attention' },
        'IMPORTANT': { title: 'Important', icon: '', className: 'important' },
        'DANGER': { title: 'Danger', icon: '', className: 'danger' },
        'CAUTION': { title: 'Caution', icon: '', className: 'caution' },
    }
};

// Generate the pluggin configuration by merging the default config with the user-provided config
export function genConfig(userConfig) {
    // Merge user config with default config
    // User config overrides default config
    const config = { ...defaultConfig, ...userConfig };
    return config;
}
