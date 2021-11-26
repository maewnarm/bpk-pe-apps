import React, { Dispatch, SetStateAction } from "react";

export interface SelectorProps {
  toggleDropdown: (
    e: React.MouseEvent | React.FocusEvent,
    isDisabled?: boolean
  ) => void;
  toggleContent: (e: React.MouseEvent, index: number) => void;
  contentItems: { name: string; id: number }[];
}

export interface MqttConnectionProps {
  setIsConnected: Dispatch<SetStateAction<boolean>>;
  signalStatus: { [key: string]: number };
  setSignalStatus: Dispatch<SetStateAction<{ [key: string]: number }>>;
  sendSignalStatus: { [key: string]: number };
  setSendSignalStatus: Dispatch<SetStateAction<{ [key: string]: number }>>;
  signalReadyStatus: number;
  setSignalReadyStatus: Dispatch<SetStateAction<number>>;
  projectSelected: boolean;
  machineSelected: boolean;
}

export interface TableProjectProps {
  projectLists: any[];
  selectProject: (lists: any[]) => void;
}

export interface TableMachineProps {
  setShowMachine: Dispatch<SetStateAction<boolean>>;
  machineLists: any[];
}
