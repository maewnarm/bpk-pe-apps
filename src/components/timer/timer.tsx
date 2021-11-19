import { FC, useEffect, useRef, useState } from "react"
import { TimerProps } from "./_types"
import useEffectDidMount from "@/hooks/useEffectDidMount"
import moment from "moment"

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
    const timer = useRef<NodeJS.Timer>()
    var time = "00:00"

    useEffect(() => { //start signal
        if (startSignal && !timer.current) {
            timer.current = setInterval(() => {
                console.log(count)
                setCount(count + 1)
            }, 1000)
        }
    }, [startSignal])

    useEffect(() => { //stop signal
        if (stopSignal && timer.current) {
            clearInterval(timer.current)
        }
    }, [stopSignal])

    useEffect(() => {
        const currentTimer = moment(count)
        time = `${currentTimer.hour().toLocaleString('en-US', { minimumIntegerDigits: 2 })} \
        :${currentTimer.minute().toLocaleString('en-US', { minimumIntegerDigits: 2 })}`
    }, [count])

    return (
        <div className="timer">
            <p>{`Timer : ${time} (${count})`}</p>
        </div>
    )
}

export default Timer