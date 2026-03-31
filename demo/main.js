// src/icons.js
var infoIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;
var warningIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm330.5-51.5Q520-263 520-280t-11.5-28.5Q497-320 480-320t-28.5 11.5Q440-297 440-280t11.5 28.5Q463-240 480-240t28.5-11.5ZM440-360h80v-200h-80v200Zm40-100Z"/></svg>`;
var defIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M320-160q-33 0-56.5-23.5T240-240v-120h120v-90q-35-2-66.5-15.5T236-506v-44h-46L60-680q36-46 89-65t107-19q27 0 52.5 4t51.5 15v-55h480v520q0 50-35 85t-85 35H320Zm120-200h240v80q0 17 11.5 28.5T720-240q17 0 28.5-11.5T760-280v-440H440v24l240 240v56h-56L510-514l-8 8q-14 14-29.5 25T440-464v104ZM224-630h92v86q12 8 25 11t27 3q23 0 41.5-7t36.5-25l8-8-56-56q-29-29-65-43.5T256-684q-20 0-38 3t-36 9l42 42Zm376 350H320v40h286q-3-9-4.5-19t-1.5-21Zm-280 40v-40 40Z"/></svg>`;
var tipIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M400-240q-33 0-56.5-23.5T320-320v-50q-57-39-88.5-100T200-600q0-117 81.5-198.5T480-880q117 0 198.5 81.5T760-600q0 69-31.5 129.5T640-370v50q0 33-23.5 56.5T560-240H400Zm0-80h160v-92l34-24q41-28 63.5-71.5T680-600q0-83-58.5-141.5T480-800q-83 0-141.5 58.5T280-600q0 49 22.5 92.5T366-436l34 24v92Zm0 240q-17 0-28.5-11.5T360-120v-40h240v40q0 17-11.5 28.5T560-80H400Zm80-520Z"/></svg>`;
var dangerIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm36-190 114-114 114 114 56-56-114-114 114-114-56-56-114 114-114-114-56 56 114 114-114 114 56 56Zm-2 110h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z"/></svg>`;
function resolveIcon(iconValue, config2) {
  console.debug("Rendering icon for value:", iconValue);
  if (!iconValue || iconValue === "")
    return "";
  const iconStr = String(iconValue).trim();
  if (iconStr.startsWith("<")) {
    return iconStr;
  }
  const isUrlOrPath = /^(https?:\/\/|\.?\/)/i.test(iconStr) || /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(iconStr);
  if (isUrlOrPath) {
    const isSvgPath = /\.svg$/i.test(iconStr);
    if (isSvgPath && config2.svgFileAsRawSvg) {
      return `<div class="svg-file-mask icon" style="-webkit-mask-image: url('${iconStr}'); mask-image: url('${iconStr}');"></div>`;
    }
    return `<img src="${iconStr}" class="icon-img icon" alt="icon"/>`;
  }
  console.warn(`Icon value "${iconValue}" is not a valid HTML string, URL, or image path. Using default icon.`);
}

// src/languages.js
var englishLanguagePack = {
  tags: {
    NOTE: { label: "Note" },
    "WARNING|WARN": { label: "Warning" },
    "DEFINITION|DEF": { label: "Definition" },
    TIP: { label: "Tip" },
    INFO: { label: "Info" },
    ATTENTION: { label: "Attention" },
    IMPORTANT: { label: "Important" },
    DANGER: { label: "Danger" },
    CAUTION: { label: "Caution" }
  }
};
var spanishLanguagePack = {
  tags: {
    NOTE: { label: "Nota" },
    "WARNING|WARN": { label: "Advertencia" },
    "DEFINITION|DEF": { label: "Definición" },
    TIP: { label: "Tip" },
    INFO: { label: "Info" },
    ATTENTION: { label: "Atención" },
    IMPORTANT: { label: "Importante" },
    DANGER: { label: "Peligro" },
    CAUTION: { label: "Cuidado" }
  }
};
var betterCalloutsLanguagePack = {
  en: englishLanguagePack,
  es: spanishLanguagePack
};

// src/config.js
var defaultTag = {
  label: "NOTE",
  icon: infoIcon,
  cssClass: "default"
};
var defaultConfig = {
  tags: {
    NOTE: { label: "Note", icon: infoIcon, cssClass: "note" },
    "WARNING|WARN": { label: "Warning", icon: warningIcon, cssClass: "warning" },
    "DEFINITION|DEF": { label: "Definition", icon: defIcon, cssClass: "definition" },
    TIP: { label: "Tip", icon: tipIcon, cssClass: "tip" },
    INFO: { label: "Info", icon: infoIcon, cssClass: "info" },
    ATTENTION: { label: "Attention", icon: warningIcon, cssClass: "attention" },
    IMPORTANT: { label: "Important", icon: warningIcon, cssClass: "important" },
    DANGER: { label: "Danger", icon: dangerIcon, cssClass: "danger" },
    CAUTION: { label: "Caution", icon: dangerIcon, cssClass: "caution" }
  },
  defaultTag,
  svgFileAsRawSvg: true,
  defaultLanguage: "en",
  languagePacks: betterCalloutsLanguagePack,
  processRegularCallouts: true,
  matchLanguageWithCurrentPath: true
};
function getTagConfig(tag, config2) {
  let tagConfig = null;
  for (const tagPattern of Object.keys(config2.tags)) {
    if (RegExp(tagPattern).test(tag)) {
      tagConfig = config2.tags[tagPattern];
      break;
    }
  }
  if (!tagConfig) {
    console.warn(`docsify-better-callouts: No configuration found for callout type "${tag}". Using default values.`);
  }
  return tagConfig || config2.defaultTag;
}
function mergeConfig(baseConfig, userConfig, currentPath) {
  checkUserInvalidConfigEntries(baseConfig, userConfig);
  checkUserMissingRequiredConfigEntries(userConfig);
  let config2 = { ...baseConfig, tags: { ...baseConfig.tags } };
  const resolvedLang = resolveCurrentLanguage(baseConfig, userConfig, currentPath);
  const languagePack = getLanguagePack(resolvedLang, baseConfig, userConfig);
  if (languagePack) {
    config2 = applyTagOverrides(config2, languagePack.tags, baseConfig.defaultTag);
  }
  if (userConfig.tags) {
    config2 = applyTagOverrides(config2, userConfig.tags, baseConfig.defaultTag);
  }
  return config2;
}
function resolveCurrentLanguage(baseConfig, userConfig, currentPath) {
  const shouldMatchPath = userConfig.matchLanguageWithCurrentPath ?? baseConfig.matchLanguageWithCurrentPath;
  const defaultLanguage = userConfig.defaultLanguage || baseConfig.defaultLanguage;
  if (shouldMatchPath && currentPath) {
    const langs = getAvailableLanguageKeys(baseConfig, userConfig);
    const langFromPath = resolveLanguageFromPath(currentPath, langs);
    if (langFromPath) {
      return langFromPath;
    }
  }
  return defaultLanguage;
}
function getAvailableLanguageKeys(baseConfig, userConfig) {
  return [
    ...Object.keys(baseConfig.languagePacks || {}),
    ...Object.keys(userConfig.languagePacks || {})
  ];
}
function resolveLanguageFromPath(path, availableLangs) {
  if (!path || !availableLangs || availableLangs.length === 0) {
    return null;
  }
  const normalizedPath = String(path).toLowerCase();
  const pathSegments = normalizedPath.split("/").filter(Boolean);
  const normalizedLangs = [...new Set(availableLangs.map((lang) => String(lang).toLowerCase()))];
  for (const segment of pathSegments) {
    const matchedLang = normalizedLangs.find((lang) => lang === segment);
    if (matchedLang) {
      return matchedLang;
    }
  }
  return null;
}
function applyTagOverrides(config2, overrides, defaultTag2) {
  if (!overrides)
    return config2;
  for (const [userTag, userTagConfig] of Object.entries(overrides)) {
    let matched = false;
    for (const baseKey of Object.keys(config2.tags)) {
      if (handleExactMatch(config2, baseKey, userTag, userTagConfig)) {
        matched = true;
        break;
      }
      if (handleIntersectionMatch(config2, baseKey, userTag, userTagConfig)) {
        matched = true;
        break;
      }
    }
    if (!matched) {
      handleNewTag(config2, defaultTag2, userTag, userTagConfig);
    }
  }
  return config2;
}
function handleExactMatch(config2, baseKey, userTag, userTagConfig) {
  if (baseKey === userTag) {
    config2.tags[baseKey] = { ...config2.tags[baseKey], ...userTagConfig };
    return true;
  }
  return false;
}
function handleIntersectionMatch(config2, baseKey, userTag, userTagConfig) {
  const baseVariants = baseKey.split("|").map((v) => v.trim());
  const userVariants = userTag.split("|").map((v) => v.trim());
  const intersection = userVariants.filter((v) => baseVariants.includes(v));
  if (intersection.length > 0) {
    const baseProps = config2.tags[baseKey];
    const remainingBaseVariants = baseVariants.filter((v) => !intersection.includes(v));
    const remainingBaseKey = remainingBaseVariants.join("|");
    delete config2.tags[baseKey];
    if (remainingBaseKey !== "") {
      config2.tags[remainingBaseKey] = baseProps;
    }
    config2.tags[userTag] = { ...baseProps, ...userTagConfig };
    return true;
  }
  return false;
}
function handleNewTag(config2, defaultTag2, userTag, userTagConfig) {
  let newTag = Object.create(defaultTag2);
  Object.assign(newTag, userTagConfig);
  config2.tags[userTag] = newTag;
}
function getLanguagePack(lang, baseConfig, userConfig) {
  const userLangs = userConfig.languagePacks ? Object.keys(userConfig.languagePacks) : [];
  const defaultLangs = baseConfig.languagePacks ? Object.keys(baseConfig.languagePacks) : [];
  const availableLangs = `By User: ${userLangs.join(", ") || "None"}; By Better Callouts: ${defaultLangs.join(", ") || "None"}`;
  if (!lang) {
    return null;
  }
  const normalizedLang = String(lang).toLowerCase();
  const userLangKey = userLangs.find((key) => key.toLowerCase() === normalizedLang);
  const defaultLangKey = defaultLangs.find((key) => key.toLowerCase() === normalizedLang);
  if (userLangKey && userConfig.languagePacks) {
    return userConfig.languagePacks[userLangKey];
  }
  if (defaultLangKey && baseConfig.languagePacks) {
    return baseConfig.languagePacks[defaultLangKey];
  }
  console.warn(`docsify-better-callouts: Resolved language "${lang}" has no corresponding language pack. Available languages are: ${availableLangs}.`);
  return null;
}
function checkUserInvalidConfigEntries(baseConfig, userConfig) {
  const validKeys = Object.keys(baseConfig);
  for (const key of Object.keys(userConfig)) {
    if (!validKeys.includes(key)) {
      console.warn(`docsify-better-callouts: Invalid configuration entry "${key}". Valid entries are: ${validKeys.join(", ")}. This entry will be ignored.`);
    }
  }
  for (const [tag, tagConfig] of Object.entries(userConfig.tags || {})) {
    const validTagConfigKeys = Object.keys(baseConfig.defaultTag);
    for (const key of Object.keys(tagConfig)) {
      if (!validTagConfigKeys.includes(key)) {
        console.warn(`docsify-better-callouts: Invalid configuration entry "${key}" for tag "${tag}". Valid entries are: ${validTagConfigKeys.join(", ")}. This entry will be ignored.`);
      }
    }
  }
}
function checkUserMissingRequiredConfigEntries(userConfig) {
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

// src/main.js
(function() {
  var betterCalloutsPlugin = function(hook, vm) {
    let config2;
    let tagsPattern2;
    const userConfig = vm.config.betterCallouts || {};
    hook.init(function() {
      refreshConfig(userConfig, vm.route && vm.route.path);
      console.debug("Config:", config2);
      console.debug("vm:", vm);
    });
    hook.beforeEach(function(md) {
      refreshConfig(userConfig, vm.route && vm.route.path);
      console.debug("Processing markdown for callouts in the page:", vm.route.path);
      console.debug("Original markdown:", md);
      return processBetterCalloutsMD(md, tagsPattern2, config2);
    });
    hook.afterEach(function(html) {
      console.debug("Processing callouts in the page:", vm.route.path);
      console.debug("Processing HTML:", html);
      let processedHTML = processBetterCalloutsHTML(html, tagsPattern2, config2);
      if (config2.processRegularCallouts) {
        processedHTML = processRegularCalloutsHTML(processedHTML, config2);
      }
      return processedHTML;
    });
  };
  $docsify = $docsify || {};
  $docsify.plugins = [].concat(betterCalloutsPlugin, $docsify.plugins || []);
})();
function refreshConfig(userConfig, currentPath) {
  config = mergeConfig(defaultConfig, userConfig, currentPath);
  tagsPattern = Object.keys(config.tags).join("|");
}
function processBetterCalloutsMD(md, tagsPattern2, config2) {
  const mdBetterCalloutsHeadPattern = new RegExp(`^(?<level>( *>)*) *\\[\\s*!(?<tag>${tagsPattern2})(?<ignored>[\\s\\S]*?)\\] ?(?<content>[\\s\\S]*?)$`, "gm");
  return md.replaceAll(mdBetterCalloutsHeadPattern, (...args) => {
    console.debug("Found a callout markdown:", args[0]);
    const namedCaptureGroups = args.at(-1);
    const { level: calloutLevel, tag: calloutTag, ignored: ignoredContentInTag, content: calloutContent } = namedCaptureGroups;
    let cleanedCalloutHead = `${calloutLevel} [!${calloutTag}]
${calloutLevel}`;
    if (calloutContent) {
      cleanedCalloutHead += `
${calloutLevel} ${calloutContent}`;
    }
    console.debug("Cleaned callout head markdown:", cleanedCalloutHead);
    if (ignoredContentInTag) {
      console.warn("docsify-better-callouts: Ignored content in head tag:", ignoredContentInTag);
    }
    return cleanedCalloutHead;
  });
}
function processBetterCalloutsHTML(html, tagsPattern2, config2) {
  const htmlBetterCalloutsPattern = new RegExp(`<blockquote>\\s*<p>\\s*\\[\\s*!(?<tag>${tagsPattern2})\\s*\\]\\s?</p>\\s*(?<content>[\\s\\S]*?)\\s*<\\/blockquote>`, "g");
  return html.replaceAll(htmlBetterCalloutsPattern, (...args) => {
    console.debug("Found a callout:", args[0]);
    const namedCaptureGroups = args.at(-1);
    const { tag: calloutType, content: calloutContent } = namedCaptureGroups;
    const tagConfig = getTagConfig(calloutType, config2);
    const cssClass = tagConfig.cssClass;
    const label = tagConfig.label;
    const icon = resolveIcon(tagConfig.icon, config2);
    console.debug(`Callout tag "${calloutType}" will be rendered with label "${label}", CSS class "${cssClass}", and icon:`, icon);
    const betterCallout = `<div class="better-callouts ${cssClass}">` + `<div class="callout-head">` + `<div class="callout-icon">${icon}</div>` + `<div class="callout-label">${label}</div>` + `</div>` + `<div class="callout-body">${calloutContent}</div>` + `</div>`;
    console.debug("Generated better callout HTML:", betterCallout);
    return betterCallout;
  });
}
function processRegularCalloutsHTML(html, config2) {
  const htmlRegularCalloutsPattern = new RegExp(`<blockquote>(?!\\s*<p>\\s*\\[\\s*![\\s\\S]*?\\s*\\]\\s?</p>)\\s*(?<content>[\\s\\S]*?)\\s*<\\/blockquote>`, "g");
  return html.replaceAll(htmlRegularCalloutsPattern, (...args) => {
    console.debug("Found a regular callout:", args[0]);
    const namedCaptureGroups = args.at(-1);
    const { content: calloutContent } = namedCaptureGroups;
    const betterCallout = `<div class="better-callouts regular-callout">` + `<div class="callout-body">${calloutContent}</div>` + `</div>`;
    console.debug("Generated regular callout HTML:", betterCallout);
    return betterCallout;
  });
}

//# debugId=C6EF88BBEF9748ED64756E2164756E21
//# sourceMappingURL=main.js.map
