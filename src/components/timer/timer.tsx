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
    const [time, setTime] = useState("00:00")
    const timeCountUp = useRef<() => void>()

    function countUp() {
        timeCountUp.current = function () {
            console.log(count)
            setCount(count + 1)
        }
    }

    useEffect(() => { //start signal
        console.log("start is changed")
        if (startSignal && !timer.current) {
            timer.current = setInterval(() => {
                countUp()
            }, 1000)
        }
    }, [startSignal])

    useEffect(() => { //stop signal
        if (stopSignal && timer.current) {
            clearInterval(timer.current)
        }
    }, [stopSignal])

    useEffect(() => {
        const currentTimer = moment(count * 1000)
        let timeValue = `${currentTimer.hour().toLocaleString('en-US', { minimumIntegerDigits: 2 })}` +
            `:${currentTimer.minute().toLocaleString('en-US', { minimumIntegerDigits: 2 })}`
        setTime(timeValue)
    }, [count])

    return (
        <div className="timer">
            <p>{`Timer : ${time} (${count})`}</p>
        </div>
    )
}

export default Timer