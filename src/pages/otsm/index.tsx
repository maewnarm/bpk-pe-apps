import React,{useEffect,useRef} from "react"
import ProjectSelect from "./_projectSelect"
import MachineSelect from "./_machineSelect"
import MachineSignal from "./_machineSignal"
import { toggleDropdownIsActive, toggleContentIsActiveWithId } from "./_functions"
import mqtt from 'mqtt'

const Otsm = () => {
    return (
        <div className="otsm">
            <div className="otsm__grid-container">
                <ProjectSelect toggleDropdown={toggleDropdownIsActive} toggleContent={toggleContentIsActiveWithId} />
                <MachineSelect toggleDropdown={toggleDropdownIsActive} toggleContent={toggleContentIsActiveWithId} />
            </div>
            <MachineSignal />
        </div>
    )
}

export default Otsm