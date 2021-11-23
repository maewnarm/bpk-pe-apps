import { useRef, useEffect } from "react"

const useInterval = (
    callback: () => void,
    delay: number,
    runningSignal?: boolean | undefined
) => {
    const savedCallback = useRef<() => void>()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        function trigger() {
            if (savedCallback.current && runningSignal) {
                savedCallback.current()
            }
        }
        let intervalInstance = setInterval(() => {
            trigger()
        }, delay)

        return (() => {
            clearInterval(intervalInstance)
        })
    }, [])
}

export default useInterval