import React, { FC, useState } from "react";
import useEffectDidMount from "@/hooks/useEffectDidMount";
import { SelectorProps } from "./_types";

const MachineSelector: FC<SelectorProps> = ({ toggleDropdown, toggleContent }) => {
    const [selectedMachine, setSelectedMachine] = useState("choose one...")
    const [machineSelected, setMachineSelected] = useState(false)

    useEffectDidMount(() => {
        if (machineSelected) {
            document.querySelector('.otsm__machine.help')?.classList.replace('is-danger', 'is-hide')
            document.querySelector('.otsm__machine.otsm__dropdown__button')?.classList.replace('is-danger', 'is-primary')
        }
    }, [machineSelected])

    return (
        <div className="otsm__selector">
            <label className="label">Machine :</label>
            <div className="otsm__machine__dropdown dropdown">
                <div className="otsm__machine_dropdown dropdown-trigger" onClick={toggleDropdown} onBlur={toggleDropdown}>
                    <button className="otsm__machine otsm__dropdown__button button is-outlined is-danger" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span><i>{selectedMachine}</i></span>
                        <span className="icon is-small">
                            <i className="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        <a className="otsm__machine otsm__dropdown__a 1 dropdown-item" onClick={(e: React.MouseEvent) => {
                            toggleContent(e, 1)
                            setSelectedMachine(e.currentTarget.innerHTML)
                            setMachineSelected(true)
                        }}>
                            Test MC1
                        </a>
                        <a className="otsm__machine otsm__dropdown__a 2 dropdown-item" onClick={(e: React.MouseEvent) => {
                            toggleContent(e, 2)
                            setSelectedMachine(e.currentTarget.innerHTML)
                            setMachineSelected(true)
                        }}>
                            Test MC2
                        </a>
                    </div>
                </div>
            </div>
            <p className="otsm__machine help is-danger">Select machine name</p>
        </div>
    )
}

export default MachineSelector