import React from "react";

export interface SelectorProps {
    toggleDropdown: (e: React.MouseEvent | React.FocusEvent) => void,
    toggleContent: (e: React.MouseEvent, id: number) => void
}