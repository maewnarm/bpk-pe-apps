import React, { Dispatch, SetStateAction } from "react";

export interface SelectorProps {
    toggleDropdown: (e: React.MouseEvent | React.FocusEvent,isDisabled?: boolean) => void
    toggleContent: (e: React.MouseEvent, id: number) => void
}

export interface MqttConnectionProps {
    setIsConnected: Dispatch<SetStateAction<boolean>>
    signalStatus: { [key: string]: number }
    setSignalStatus: Dispatch<SetStateAction<{ [key: string]: number }>>
    sendSignalStatus: { [key: string]: number }
    setSendSignalStatus: Dispatch<SetStateAction<{ [key: string]: number }>>
    signalReadyStatus: number
    setSignalReadyStatus: Dispatch<SetStateAction<number>>
    projectSelected: boolean
    machineSelected: boolean
}