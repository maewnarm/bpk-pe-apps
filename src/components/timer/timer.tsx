import { FC, useEffect, useRef, useState } from "react"
import moment from "moment"

export interface TimerProps {
    startSignal?: boolean
    pauseSignal?: boolean
    stopSignal?: boolean
    resetSignal?: boolean
    startFunction?: () => void
    pauseFunction?: () => void
    stopFunction?: () => void
    resetFunction?: () => void
}

const Timer: FC<TimerProps> = ({
    startSignal,
    pauseSignal,
    stopSignal,
    resetSignal,
    startFunction,
    pauseFunction,
    stopFunction,
    resetFunction
}) => {
    const [count, setCount] = useState(0)
    const [time, setTime] = useState("00:00")
    const [timer, setTimer] = useState<NodeJS.Timer>()
    const timerCounter = useRef<() => void>()

    const timerCountUp = () => {
        setCount(count + 1)
    }

    useEffect(() => {
        timerCounter.current = timerCountUp
    }, [timerCountUp])

    useEffect(() => { //start signal
        console.log("start is changed")
        console.log(startSignal)
        if (startSignal) {
            setCount(0)
            let interval = setInterval(() => {
                if (timerCounter.current) {
                    timerCounter.current()
                }
            }, 1000)
            setTimer(interval)
        } else if (timer && !startSignal && stopSignal === undefined) {
            clearInterval(timer)
        }

        return (() => {
            if (timer) {
                clearInterval(timer)
            }
        })
    }, [startSignal])

    useEffect(() => { //stop signal
        console.log(stopSignal)
        if (timer && stopSignal) {
            clearInterval(timer)
        }
    }, [stopSignal])

    useEffect(() => {
        const currentTimer = moment(count * 1000)
        let timeValue = `${currentTimer.minute().toLocaleString('en-US', { minimumIntegerDigits: 2 })}` +
            `:${currentTimer.second().toLocaleString('en-US', { minimumIntegerDigits: 2 })}`
        setTime(timeValue)
    }, [count])

    return (
        <div className="timer">
            <p>Timer : <strong>{time}</strong></p>
        </div>
    )
}

export default Timer