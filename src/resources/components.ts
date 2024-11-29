type Component = {
    name: string
    children?: Component[]
}

export const components: Component[] = [
    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Buttons
    // ------------------------------------------------------------------------------------- //
    { name: 'divider' },

    { name: 'button' },
    { name: 'file-trigger', children: [{ name: 'button' }] },
    { name: 'toggle', children: [{ name: 'button' }] },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Collections
    // ------------------------------------------------------------------------------------- //
    { name: 'divider' },

    { name: 'menu', children: [{ name: 'button' }, { name: 'dropdown' }, { name: 'keyboard' }, { name: 'popover' }] },
    { name: 'list-box', children: [{ name: 'dropdown' }, { name: 'field' }] },
    { name: 'tag-group', children: [{ name: 'field' }, { name: 'badge' }] },
    { name: 'tag-field', children: [{ name: 'tag-group' }] },
    { name: 'table', children: [{ name: 'checkbox' }] },
    { name: 'grid-list', children: [{ name: 'checkbox' }] },
    { name: 'choicebox', children: [{ name: 'checkbox' }] },
    { name: 'tree', children: [{ name: 'checkbox' }] },

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
        ],
    },
    { name: 'color-field', children: [{ name: 'color-picker' }] },
    { name: 'color-area', children: [{ name: 'color-thumb' }] },
    { name: 'color-slider', children: [{ name: 'color-thumb' }, { name: 'field' }] },
    { name: 'color-swatch-picker', children: [{ name: 'color-swatch' }] },
    { name: 'color-wheel', children: [{ name: 'color-thumb' }] },
    { name: 'color-swatch' },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Controls
    // ------------------------------------------------------------------------------------- //
    { name: 'divider' },

    { name: 'slider', children: [{ name: 'field' }] },
    { name: 'switch' },
    { name: 'toolbar', children: [{ name: 'toggle' }, { name: 'separator' }] },
    { name: 'command', children: [{ name: 'separator' }, { name: 'keyboard' }] },
    { name: 'context-menu', children: [{ name: 'menu' }] },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Date and Time
    // ------------------------------------------------------------------------------------- //
    { name: 'divider' },

    { name: 'calendar', children: [{ name: 'button' }] },
    { name: 'range-calendar', children: [{ name: 'calendar' }] },
    { name: 'date-field', children: [{ name: 'field' }] },
    { name: 'time-field', children: [{ name: 'date-field' }, { name: 'field' }] },
    {
        name: 'date-picker',
        children: [{ name: 'popover' }, { name: 'date-field' }, { name: 'range-calendar' }],
    },
    { name: 'date-range-picker', children: [{ name: 'date-picker' }] },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Forms
    // ------------------------------------------------------------------------------------- //
    { name: 'divider' },

    { name: 'form' },
    { name: 'text-field', children: [{ name: 'field' }] },
    { name: 'search-field', children: [{ name: 'field' }, { name: 'button' }] },
    { name: 'textarea', children: [{ name: 'field' }] },
    { name: 'otp' },
    { name: 'number-field', children: [{ name: 'field' }] },
    { name: 'checkbox', children: [{ name: 'field' }] },
    { name: 'radio', children: [{ name: 'field' }] },
    { name: 'drop-zone' },
    { name: 'tag-group', children: [{ name: 'field' }, { name: 'tag-group' }] },
    {
        name: 'rich-text-field',
        children: [{ name: 'toolbar' }, { name: 'menu' }],
    },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Navigation
    // ------------------------------------------------------------------------------------- //
    { name: 'divider' },

    { name: 'link' },
    { name: 'breadcrumbs', children: [{ name: 'link' }] },
    { name: 'pagination', children: [{ name: 'button' }] },
    { name: 'tabs' },
    { name: 'disclosure' },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Surfaces
    // ------------------------------------------------------------------------------------- //
    { name: 'divider' },

    { name: 'card', children: [{ name: 'heading' }] },
    { name: 'separator' },
    { name: 'show-more', children: [{ name: 'button' }] },
    { name: 'description-list' },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Media
    // ------------------------------------------------------------------------------------- //
    { name: 'divider' },

    { name: 'avatar', children: [{ name: 'visually-hidden' }] },
    { name: 'carousel', children: [{ name: 'button' }] },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Overlays
    // ------------------------------------------------------------------------------------- //
    { name: 'divider' },

    { name: 'modal', children: [{ name: 'dialog' }] },
    { name: 'sheet', children: [{ name: 'dialog' }] },
    { name: 'popover', children: [{ name: 'dialog' }] },
    { name: 'tooltip' },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Pickers
    // ------------------------------------------------------------------------------------- //
    { name: 'divider' },

    {
        name: 'combo-box',
        children: [{ name: 'field' }, { name: 'list-box' }, { name: 'popover' }],
    },
    {
        name: 'select',
        children: [{ name: 'field' }, { name: 'list-box' }, { name: 'popover' }],
    },
    {
        name: 'multi-select',
        children: [{ name: 'list-box' }, { name: 'popover' }, { name: 'tag-group' }, { name: 'visually-hidden' }],
    },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Statuses
    // ------------------------------------------------------------------------------------- //
    { name: 'divider' },

    { name: 'badge' },
    { name: 'loader' },
    { name: 'note' },
    { name: 'progress-bar', children: [{ name: 'field' }] },
    { name: 'progress-circle' },
    { name: 'meter', children: [{ name: 'field' }] },
    { name: 'toast', children: [{ name: 'button' }, { name: 'loader' }] },
    { name: 'meter', children: [{ name: 'field' }] },
    { name: 'chart' },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Layouts
    // ------------------------------------------------------------------------------------- //
    { name: 'divider' },

    { name: 'container' },
    { name: 'sidebar', children: [{ name: 'button' }, { name: 'sheet' }, { name: 'tooltip' }] },
    { name: 'navbar', children: [{ name: 'button' }, { name: 'sheet' }] },
]
