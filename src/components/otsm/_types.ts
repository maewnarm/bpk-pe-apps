import React, { Dispatch, SetStateAction } from "react";

export interface SelectorProps {
  toggleDropdown: (
    e: React.MouseEvent | React.FocusEvent,
    isDisabled?: boolean
  ) => void;
  toggleContent: (e: React.MouseEvent, index: number) => void;
  contentItems: {
    id: number;
    name: string;
    product?: string;
    part?: string;
  }[];
}

export interface MqttConnectionProps {
  setIsConnected: Dispatch<SetStateAction<boolean>>;
  signalStatus: { [key: string]: number };
  setSignalStatus: Dispatch<SetStateAction<{ [key: string]: number }>>;
  sendSignalStatus: { [key: string]: number };
  setSendSignalStatus: Dispatch<SetStateAction<{ [key: string]: number }>>;
  signalReadyStatus: number;
  setSignalReadyStatus: Dispatch<SetStateAction<number>>;
  setResetSignal: Dispatch<SetStateAction<boolean>>;
  projectSelected: boolean;
  machineSelected: boolean;
}

export interface TableProjectProps {
  selectProject?: (lists: any[]) => void;
  setShowMachine: Dispatch<SetStateAction<boolean>>;
}

export interface TableMachineProps {
  setShowMachine: Dispatch<SetStateAction<boolean>>;
}
