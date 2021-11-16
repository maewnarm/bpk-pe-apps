import React, { MouseEvent, useEffect, useState } from "react"
import useEffectDidMount from "@/hooks/useEffectDidMount"
import ProjectSelect from "./_projectSelect"
import MachineSelect from "./_machineSelect"
import MachineSignal from "./_machineSignal"
import { toggleDropdownIsActive, toggleContentIsActiveWithId } from "./_functions"

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