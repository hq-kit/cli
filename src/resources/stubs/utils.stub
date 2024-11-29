'use client'

import React from 'react'

import { type ClassValue, clsx } from 'clsx'
import { useVisuallyHidden } from 'react-aria'
import { composeRenderProps } from 'react-aria-components'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

function composeTailwindRenderProps<T>(
    className: string | ((v: T) => string) | undefined,
    tw: string | Array<string | undefined>
): string | ((v: T) => string) {
    return composeRenderProps(className, (className) => twMerge(tw, className))
}

const focusRing = tv({
    base: 'outline-none focus:outline-none forced-colors:outline-1 forced-colors:outline-[Highlight]',
    variants: {
        isFocused: { true: 'ring-4 ring-primary/20' },
        isInvalid: { true: 'ring-4 ring-danger/20' }
    }
})

const focusStyles = tv({
    extend: focusRing,
    variants: {
        isFocused: { true: 'border-primary/85' },
        isInvalid: { true: 'border-danger' }
    }
})

const focusButtonStyles = tv({
    base: 'outline outline-primary forced-colors:outline-[Highlight] outline-offset-2',
    variants: {
        isFocusVisible: {
            false: 'outline-0',
            true: 'outline-2'
        }
    }
})

const useMediaQuery = (query: string) => {
    const [value, setValue] = React.useState(false)

    React.useEffect(() => {
        const onChange = (event: MediaQueryListEvent) => {
            setValue(event.matches)
        }

        const result = matchMedia(query)
        result.addEventListener('change', onChange)
        setValue(result.matches)

        return () => result.removeEventListener('change', onChange)
    }, [query])

    return value
}

const VisuallyHidden = ({ children }: { children: React.ReactNode }) => {
    const { visuallyHiddenProps } = useVisuallyHidden()
    return <span {...visuallyHiddenProps}>{children}</span>
}

export {
    cn,
    composeRenderProps as cr,
    composeTailwindRenderProps as ctr,
    focusButtonStyles,
    focusRing,
    focusStyles,
    useMediaQuery,
    VisuallyHidden
}
