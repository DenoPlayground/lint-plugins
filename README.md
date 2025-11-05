# Lint Plugins

[![Run Linter](https://github.com/loat-dev/lint-plugins/actions/workflows/lint.yml/badge.svg)](https://github.com/loat-dev/lint-plugins/actions/workflows/lint.yml)
[![Run Unit Tests](https://github.com/loat-dev/lint-plugins/actions/workflows/test.yml/badge.svg)](https://github.com/loat-dev/lint-plugins/actions/workflows/test.yml)

## Colon Spacing
This plugin ensures consistent spacing before and after the colon for type definitions.

```js
{
  ...
  "lint": {
    ...
    "plugins": [
      "jsr:@loat-dev/lint-plugins/colon_spacing"
    ]
  }
}
```

## Imports
This plugin ensures consistent formatting for imports.

```js
{
  ...
  "lint": {
    ...
    "plugins": [
      "jsr:@loat-dev/lint-plugins/imports"
    ]
  }
}
```

## Arrays
This plugin ensures consistent formatting for arrays.

```js
{
  ...
  "lint": {
    ...
    "plugins": [
      "jsr:@loat-dev/lint-plugins/arrays"
    ]
  }
}
```
