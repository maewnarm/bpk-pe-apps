import { FC, useEffect, useRef, useState, Dispatch, SetStateAction } from "react"
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
    abbrMessage?: string
    returnTimerRunningFlagFunction?: (flag: boolean) => void | Dispatch<SetStateAction<boolean>>
}

const Timer: FC<TimerProps> = (props) => {
    const [count, setCount] = useState(0)
    const [time, setTime] = useState("00:00")
    const [timer, setTimer] = useState<NodeJS.Timer>()
    const timerCounter = useRef<() => void>()

    const timerCountUp = () => {
        setCount(count + 1)
    }

    function clearTimerInterval() {
        if (timer) {
            clearInterval(timer)
            if (props.returnTimerRunningFlagFunction) {
                props.returnTimerRunningFlagFunction(false)
            }
        }
    }

    useEffect(() => {
        return (() => {
            clearTimerInterval()
            console.log("clear 2")
        })
    }, [])

    useEffect(() => {
        timerCounter.current = timerCountUp
    }, [timerCountUp])

    useEffect(() => { //start signal
        // console.log("start is changed")
        // console.log(startSignal)
        if (props.startSignal) {
            setCount(0)
            let interval = setInterval(() => {
                if (timerCounter.current) {
                    timerCounter.current()
                }
            }, 1000)
            setTimer(interval)
            if (props.returnTimerRunningFlagFunction) {
                props.returnTimerRunningFlagFunction(true)
            }
        } else if (timer && !props.startSignal && props.stopSignal === undefined) {
            clearTimerInterval()
            console.log("clear 1")
        }
    }, [props.startSignal])

    useEffect(() => { //stop signal
        // console.log(stopSignal)
        if (props.stopSignal) {
            clearTimerInterval()
            console.log("clear 3")
        }
    }, [props.stopSignal])

    useEffect(() => {
        const currentTimer = moment(count * 1000)
        let timeValue = `${currentTimer.minute().toLocaleString('en-US', { minimumIntegerDigits: 2 })}` +
            `:${currentTimer.second().toLocaleString('en-US', { minimumIntegerDigits: 2 })}`
        setTime(timeValue)
    }, [count])

    return (
        <div className="timer">
            <abbr title={props.abbrMessage}>
                <p>Timer : <strong>{time}</strong></p>
            </abbr>
        </div>
    )
}

export default Timer