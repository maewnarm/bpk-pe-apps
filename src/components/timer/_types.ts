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