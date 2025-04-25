type Component = {
  name: string;
  deps?: string[];
  children?: Component[];
};

export const components: Component[] = [
  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Buttons
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  { name: 'button' },
  { name: 'file-trigger', children: [{ name: 'button' }] },
  { name: 'toggle' },

  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Collections
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  { name: 'menu', children: [{ name: 'keyboard' }], deps: ['motion'] },
  { name: 'list-box', children: [{ name: 'collections' }] },
  {
    name: 'tag-group',
    children: [{ name: 'field' }, { name: 'badge' }, { name: 'collections' }],
  },
  { name: 'table', children: [{ name: 'checkbox' }, { name: 'collections' }] },
  {
    name: 'grid-list',
    children: [{ name: 'checkbox' }, { name: 'collections' }],
  },
  { name: 'tree' },

  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Colors
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  {
    name: 'color-picker',
    children: [
      { name: 'color-area' },
      { name: 'color-field' },
      { name: 'color-slider' },
      { name: 'color-swatch' },
      { name: 'field' },
      { name: 'popover' },
    ],
  },
  {
    name: 'color-field',
    children: [
      { name: 'color-picker' },
      { name: 'color-field' },
      { name: 'field' },
    ],
  },
  { name: 'color-area', children: [{ name: 'color-thumb' }] },
  {
    name: 'color-slider',
    children: [{ name: 'color-thumb' }, { name: 'field' }],
  },
  { name: 'color-swatch-picker', children: [{ name: 'color-swatch' }] },
  { name: 'color-wheel', children: [{ name: 'color-thumb' }] },
  { name: 'color-swatch' },

  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Controls
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  { name: 'slider', children: [{ name: 'field' }] },
  { name: 'switch', children: [{ name: 'field' }] },
  { name: 'toolbar', children: [{ name: 'toggle' }] },
  { name: 'command', children: [{ name: 'modal' }, { name: 'separator' }, { name: 'keyboard' }] },
  { name: 'context-menu', children: [{ name: 'menu' }] },

  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Date and Time
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  { name: 'calendar', children: [{ name: 'button' }, { name: 'menu' }] },
  { name: 'range-calendar', children: [{ name: 'calendar' }] },
  { name: 'date-field', children: [{ name: 'field' }] },
  { name: 'time-field', children: [{ name: 'date-field' }] },
  {
    name: 'date-picker',
    children: [
      { name: 'popover' },
      { name: 'date-field' },
      { name: 'range-calendar' },
    ],
  },
  { name: 'date-range-picker', children: [{ name: 'date-picker' }] },

  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Forms
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  { name: 'form' },
  { name: 'text-field', children: [{ name: 'field' }] },
  { name: 'search-field', children: [{ name: 'field' }] },
  { name: 'textarea', children: [{ name: 'field' }] },
  { name: 'otp', deps: ['input-otp'] },
  { name: 'number-field', children: [{ name: 'field' }] },
  { name: 'checkbox', children: [{ name: 'field' }] },
  { name: 'radio', children: [{ name: 'field' }] },
  { name: 'selection-box', children: [{ name: 'field' }] },
  { name: 'drop-zone' },
  {
    name: 'rich-text-field',
    children: [{ name: 'toolbar' }, { name: 'menu' }],
    deps: ['lexical @lexical/react'],
  },

  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Navigation
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  { name: 'link' },
  { name: 'breadcrumbs' },
  { name: 'pagination' },
  { name: 'tabs' },
  { name: 'disclosure' },

  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Surfaces
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  { name: 'card' },
  { name: 'separator' },
  { name: 'spoiler', children: [{ name: 'button' }], deps: ['motion'] },
  { name: 'description-list' },

  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Media
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  { name: 'avatar' },
  { name: 'carousel', deps: ['embla-carousel-react embla-carousel-autoplay'] },
  { name: 'user', children: [{ name: 'avatar' }] },

  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Overlays
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  { name: 'modal', deps: ['motion'] },
  { name: 'sheet', deps: ['motion'] },
  { name: 'popover', deps: ['motion'] },
  { name: 'tooltip' },

  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Pickers
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  { name: 'combo-box', children: [{ name: 'field' }] },
  { name: 'select', children: [{ name: 'field' }] },
  { name: 'multi-select', children: [{ name: 'field' }] },

  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Statuses
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  { name: 'badge' },
  { name: 'note' },
  { name: 'progress', children: [{ name: 'field' }], deps: ['motion'] },
  { name: 'meter', children: [{ name: 'field' }], deps: ['motion'] },
  { name: 'toast', deps: ['motion'] },
  { name: 'chart', deps: ['recharts'] },

  // ------------------------------------------------------------------------------------- //
  // ⌘ The children of Layouts
  // ------------------------------------------------------------------------------------- //
  { name: 'divider' },

  { name: 'container' },
  {
    name: 'sidebar',
    children: [
      { name: 'button' },
      { name: 'sheet' },
      { name: 'badge' },
      { name: 'tooltip' },
    ],
  },
  { name: 'navbar', children: [{ name: 'button' }, { name: 'sheet' }] },
];
