# Better Callouts for Docsify 

A Docsify plugin to improve (and customize) the default callouts.

## Features

- Transforms GitHub-style callout syntax into richer HTML callouts
- Built-in callout types: `NOTE`, `WARNING|WARN`, `DEFINITION|DEF`, `TIP`, `INFO`, `ATTENTION`, `IMPORTANT`, `DANGER`, `CAUTION`
- Supports custom labels, CSS classes, and icons per callout type
- Supports language packs (built-in Spanish `es`)
- Optional processing of regular blockquotes (without `[!TAG]`)
- Supports icon values as:
  - inline raw SVG strings
  - image URLs/paths
  - `.svg` file paths rendered as CSS mask icons


## Installation

### CDN

You can use the plugin directly from JSDelivr:

Paste these lines in your HTML `<head>`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nicomercadoo/docsify-better-callouts@main/dist/styles.css">
```

If you want to use the dark theme as well, load this after the previous line:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nicomercadoo/docsify-better-callouts@main/dist/styles-dark.css">
```

Paste this line in yout HTML `<body>` after loading Docsify:
```html
<script src="https://cdn.jsdelivr.net/gh/nicomercadoo/docsify-better-callouts@main/dist/main.js"></script>
```

### Manual 

Clone and build the plugin:

```bash
bun install
bun run build
```

This generates distributable files in `dist/`:

- `dist/main.js`
- `dist/styles.css`
- `dist/styles-dark.css`

## Usage with Docsify

Include Docsify, then load the plugin assets:

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css">
<link rel="stylesheet" href="path/to/dist/styles.css">

<div id="app"></div>

<script>
  window.$docsify = {
    name: 'My Docs',
    repo: '',
    // oprional plugin config overrides
    betterCallouts: {
      // ...
    }
  };
</script>

<script src="//cdn.jsdelivr.net/npm/docsify@4"></script>
<script src="path/to/dist/main.js"></script>
```

## Markdown Syntax

Use callouts like this:

```md
> [!NOTE]
> This is a note callout.
>
> It can contain multiple lines.
```

Other examples:

```md
> [!WARNING]
> Watch out.

> [!TIP]
> Useful advice.

> [!DANGER]
> High-risk information.
```

## Configuration

Configure through `window.$docsify.betterCallouts`:

```html
<script>
  window.$docsify = {
    betterCallouts: {
      defaultLanguage: 'es',
      matchLanguageWithCurrentPath: true,
      processRegularCallouts: true,
      svgFileAsRawSvg: true,
      tags: {
        NOTE: {
          label: 'Heads up',
          cssClass: 'note',
          icon: '<svg>...</svg>'
        },
        TODO: {
          label: 'Todo',
          cssClass: 'todo',
          icon: '/assets/todo.svg'
        }
      },
      languagePacks: {
        fr: {
          tags: {
            NOTE: { label: 'Remarque' },
            WARNING: { label: 'Avertissement' }
          }
        }
      }
    }
  };
</script>
```

### Config Options

- `tags`
  Map of tag patterns to rendering config. Keys can be single tags (`NOTE`) or alternatives (`WARNING|WARN`).
- `defaultTag`
  Fallback config when no tag matches.
- `svgFileAsRawSvg` (`true` by default)
  If an icon is an `.svg` path, render it as a masked element instead of `<img>`.
- `languagePacks`
  Available label translation packs.
- `defaultLanguage` (`en` by default)
  Fallback language when path-based matching does not resolve a pack.
- `matchLanguageWithCurrentPath` (`true` by default)
  Auto-selects language from URL path segments (for example `/es/guide` -> `es`, `/pt-br/intro` -> `pt-br`).
- `processRegularCallouts` (`true` by default)
  Also style regular blockquotes (`> ...`) as generic callouts.

### Tag Config Shape

Each tag config supports:

- `label` (string)
- `icon` (raw SVG string, image URL/path, or SVG file path)
- `cssClass` (string)

### Plugin-Generated HTML Structure
Each better callout is rendered as:

```md
> [!TAG]
> Callout content...
```

```html
<div class="better-callouts tagConfig.cssClass">
    <div class="callout-head">
        <div class="callout-icon">tagConfig.icon</div>
        <div class="callout-label">tagConfig.label</div>
    </div>
    <div class="callout-body">callout content</div>
</div>
```

And each regular callout (when `processRegularCallouts` is enabled) is rendered as:

```html
<div class="better-callouts regular-callout">
    <div class="callout-body">callout content</div>
</div>
```


### Custom Styles

You can fully control the visual style of each callout with custom CSS classes.

1. Assign a custom `cssClass` to a tag in `betterCallouts.tags`.
2. Load the plugin CSS first and your custom CSS after, so your rules override defaults.
3. Write custom CSS rules based on the plugin's HTML generated structure and the [plugin's default styles](./src/styles.css). 

Example configuration:

```js
window.$docsify = {
  betterCallouts: {
    defaultLanguage: 'en',
    tags: {
      NOTE: {
        label: 'Heads Up',
        cssClass: 'my-note',
        icon: '/assets/icons/lightbulb.svg'
      },
      TODO: {
        label: 'Todo',
        cssClass: 'my-todo',
        icon: '<svg>...</svg>'
      }
    }
  }
};
```

Example CSS overrides:

```css
.better-callouts.my-note {
  --callout-theme: #0d9488;
  border-left-width: 6px;
  background: color-mix(in srgb, #0d9488 12%, transparent);
}

.better-callouts.my-note .callout-label {
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.better-callouts.my-todo {
  --callout-theme: #2563eb;
}
```

Notes:

- Use scoped selectors like `.better-callouts.my-note` to avoid style collisions.
- You can override global palette variables (`--bc-green`, `--bc-blue`, etc.) in `:root` if you want a project-wide theme.
- If `processRegularCallouts` is enabled, regular blockquotes use `.better-callouts.regular-callout`.

### Dark Theme Stylesheet

The plugin also ships with a dark-only stylesheet: `styles-dark.css`.

- `styles.css` is the base (light) stylesheet.
- `styles-dark.css` overrides color variables and callout background tint for dark UIs.
- Load `styles-dark.css` after `styles.css`.

```html
<link rel="stylesheet" href="path/to/dist/styles.css">
<link rel="stylesheet" href="path/to/dist/styles-dark.css">
```

### How User Overrides Work

Override resolution happens in this order (low -> high priority):

1. Base defaults (`defaultConfig`)
2. Selected language pack
3. User `tags` overrides

User `tags` always win over language-pack labels.

Language selection priority is:

1. Language detected from current path (when `matchLanguageWithCurrentPath` is `true`)
2. `defaultLanguage`

#### Matching Rules for `tags`

When you provide a tag override, the plugin applies one of these cases:

1. Exact key match
   - If your key exactly matches an existing key, fields are merged.
   - Example: overriding `NOTE` updates the built-in `NOTE` config.

2. Intersection with grouped tags
   - Built-in keys can contain alternatives, like `WARNING|WARN`.
   - If your key overlaps one of those variants, the plugin splits the original group:
     - keeps non-overridden variants under the remaining key
     - creates your key with inherited base values + your overrides
   - Example:
     - Base has `WARNING|WARN`
     - You override `WARN`
     - Result:
       - `WARNING` keeps previous config
       - `WARN` gets your custom config and inherits any fields you don't override from the original group config

3. New key
   - If no match/intersection is found, a new tag entry is created.
   - It starts from `defaultTag`, then your fields are applied.

#### Practical Example

```js
betterCallouts: {
  defaultLanguage: 'en',
  matchLanguageWithCurrentPath: true,
  tags: {
    NOTE: { label: 'Read this first' },
    WARN: { cssClass: 'be-careful' },
    TODO: { label: 'Todo', cssClass: 'todo', icon: '/icons/todo.svg' }
  }
}
```

What this does:

- If the URL path includes `/es/`, Spanish labels are selected automatically; otherwise it falls back to `defaultLanguage` (`en`)
- `NOTE` label becomes `Read this first` (overrides default and selected language-pack label)
- `WARN` is split out from `WARNING|WARN` and gets class `be-careful`
- `TODO` becomes a brand-new supported callout type

## Demo

A local demo is included in `demo/`.

- Demo app shell: `demo/index.html`
- Demo markdown page: `demo/README.md`

#### Validation and Warnings

The plugin emits console warnings when:

- unknown top-level config keys are provided
- unknown tag property names are used
- a tag override is missing `label`, `icon`, or `cssClass`
- the resolved language (`path` or `defaultLanguage`) is not found

## Built-in Language Packs

- `en` (English)
- `es` (Spanish)

## Default Callout Types

- `NOTE` -> class `note`
- `WARNING|WARN` -> class `warning`
- `DEFINITION|DEF` -> class `definition`
- `TIP` -> class `tip`
- `INFO` -> class `info`
- `ATTENTION` -> class `attention`
- `IMPORTANT` -> class `important`
- `DANGER` -> class `danger`
- `CAUTION` -> class `caution`

## Development

Available scripts from `package.json`:

```bash
bun run build        # build and minify into dist/
bun run build:dev    # build with sourcemaps
bun run build:watch  # watch mode build
bun run demo         # serve project on port 8080
```

## Project Structure

- `src/main.js` - Docsify plugin hooks and markdown/html transformations
- `src/config.js` - default config, merge logic, language/tag override rules
- `src/icons.js` - built-in SVG icons and icon resolver
- `src/languages.js` - built-in language packs
- `src/styles.css` - callout styling
- `demo/` - example Docsify integration
- `dist/` - build output

## License

GPL-3.0. See [LICENSE](./LICENSE).

## Author

Nicolas Mercado
