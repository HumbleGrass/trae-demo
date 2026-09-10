---
name: "ui-consistency"
description: "Ensures Element Plus components maintain consistent sizing (size='default'). Invoke when creating/editing frontend Vue components with Element Plus UI library."
---

# UI Consistency Skill

This skill ensures all Element Plus components in the library management system maintain consistent sizing and styling.

## Purpose

When working with frontend Vue components that use Element Plus UI library, all interactive components should use the default size to maintain visual consistency across the application.

## Core Rules

### 1. Component Size Standard

Element Plus components use `size="default"` as their **default value**. This means:

- **The `size` attribute is OPTIONAL** when using the default size
- When the `size` attribute is omitted, components automatically fall back to `"default"`
- Explicitly adding `size="default"` is allowed but not required

```vue
<!-- Both are CORRECT - size attribute is optional for default size -->
<el-input v-model="value" />
<el-input v-model="value" size="default" />

<el-select v-model="value" />
<el-select v-model="value" size="default" />

<el-button type="primary">Submit</el-button>
<el-button type="primary" size="default">Submit</el-button>

<el-date-picker v-model="date" />
<el-date-picker v-model="date" size="default" />

<!-- INCORRECT - Using non-default sizes in standard forms -->
<el-input v-model="value" size="small" />
<el-input v-model="value" size="large" />
```

### 2. Size Attribute Behavior

| Size Value | Behavior | When to Use |
|------------|----------|-------------|
| (omitted) | Falls back to `default` | Standard forms, tables, dialogs |
| `default` | Explicit default size | Same as omitted - optional |
| `small` | Compact size | Dense tables, inline elements |
| `large` | Large size | Hero sections, primary CTAs |

### 3. Components with Size Support

The following components support the `size` attribute. All default to `"default"` when omitted:

| Component | Default Size | Notes |
|-----------|--------------|-------|
| `el-input` | `default` | Size attribute optional |
| `el-select` | `default` | Size attribute optional |
| `el-button` | `default` | Size attribute optional |
| `el-date-picker` | `default` | Size attribute optional |
| `el-time-picker` | `default` | Size attribute optional |
| `el-cascader` | `default` | Size attribute optional |
| `el-input-number` | `default` | Size attribute optional |
| `el-autocomplete` | `default` | Size attribute optional |
| `el-radio-group` | `default` | Size attribute optional |
| `el-checkbox-group` | `default` | Size attribute optional |
| `el-switch` | `default` | Size attribute optional |
| `el-slider` | `default` | Size attribute optional |
| `el-rate` | `default` | Size attribute optional |
| `el-color-picker` | `default` | Size attribute optional |
| `el-transfer` | `default` | Size attribute optional |

### 4. CSS Height Standards

When custom styling is needed, maintain consistent heights:

```scss
// Standard component height: 32px (matches Element Plus default size)
.el-input__wrapper,
.el-select__wrapper,
.el-date-editor {
  height: 32px !important;
  min-height: 32px !important;
}

// Button heights
.el-button--default {
  height: 32px;
  padding: 8px 16px;
}
```

### 5. Global Configuration (Recommended)

Configure Element Plus globally to ensure consistent default sizing:

```typescript
// main.ts
import ElementPlus from 'element-plus'

app.use(ElementPlus, {
  size: 'default',  // Sets default size for all components
})
```

When configured globally, all components will use `default` size automatically without requiring the `size` attribute.

## When to Invoke This Skill

Invoke this skill when:
1. Creating new Vue components with Element Plus
2. Editing existing components that use Element Plus
3. Reviewing code for UI consistency
4. Fixing UI component size inconsistencies
5. User mentions "UI consistency", "component size", or "Element Plus styling"

## Checklist for UI Consistency

- [ ] Components use default size (either omitted or explicit `size="default"`)
- [ ] No mixed sizes (`small`/`large`/`default`) in the same form unless intentional
- [ ] Custom CSS maintains 32px height standard for default size
- [ ] Form items have consistent spacing and alignment
- [ ] Global Element Plus configuration includes `size: 'default'`

## Common Issues and Fixes

### Issue 1: Mixed Component Sizes

```vue
<!-- Problem: Inconsistent sizes within the same form -->
<el-form-item label="Name">
  <el-input v-model="form.name" size="small" />
</el-form-item>
<el-form-item label="Category">
  <el-select v-model="form.category" />  <!-- Uses default -->
</el-form-item>

<!-- Solution: Use consistent sizing (omit size for default) -->
<el-form-item label="Name">
  <el-input v-model="form.name" />  <!-- Uses default -->
</el-form-item>
<el-form-item label="Category">
  <el-select v-model="form.category" />  <!-- Uses default -->
</el-form-item>
```

### Issue 2: Height Mismatch in Custom Styles

```scss
// Problem: Custom styles don't match default component height
.custom-input .el-input__wrapper {
  height: 28px;  // Wrong - doesn't match default 32px
}

// Solution: Use standard height matching Element Plus default
.custom-input .el-input__wrapper {
  height: 32px !important;
  min-height: 32px !important;
}
```

### Issue 3: Unnecessary Size Attributes

```vue
<!-- Redundant - size="default" is the default -->
<el-input v-model="value" size="default" />
<el-select v-model="value" size="default" />
<el-button size="default">Click</el-button>

<!-- Cleaner - omit size when using default -->
<el-input v-model="value" />
<el-select v-model="value" />
<el-button>Click</el-button>
```

## Project-Specific Notes

This library management system uses:
- Primary color: `#8b6f47`
- Border radius: `4px` (small), `8px` (medium)
- Component height: `32px` (standard, matches Element Plus default)
- Font family: `'Playfair Display', 'Noto Serif SC', serif`

Ensure all components align with these design tokens.

## Summary

| Scenario | Recommendation |
|----------|----------------|
| Standard forms | Omit `size` attribute (uses default) |
| Explicit default | `size="default"` is optional |
| Dense layouts | Use `size="small"` intentionally |
| Hero sections | Use `size="large"` intentionally |
| Global config | Set `size: 'default'` in Element Plus config |
