import React from 'react'

export const useMediaQuery = (query: string) => {
    const [value, setValue] = React.useState(false)

    React.useEffect(() => {
        const onChange = (e: MediaQueryListEvent) => {
            setValue(e.matches)
        }

        const result = matchMedia(query)
        result.addEventListener('change', onChange)
        setValue(result.matches)

        return () => result.removeEventListener('change', onChange)
    }, [query])

    return value
}
