import React, { Dispatch, SetStateAction } from "react";

export interface SelectorProps {
    toggleDropdown: (e: React.MouseEvent | React.FocusEvent) => void
    toggleContent: (e: React.MouseEvent, id: number) => void
}

export interface MqttConnectionProps {
    setIsConnected: Dispatch<SetStateAction<boolean>>
    signalStatus: { [key: string]: number }
    setSignalStatus: Dispatch<SetStateAction<{ [key: string]: number }>>
    sendSignalStatus: { [key: string]: number }
    projectSelected: boolean
    machineSelected: boolean
}