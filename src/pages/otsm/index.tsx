import React, { MouseEvent, useEffect, useState } from "react"
import useEffectDidMount from "@/hooks/useEffectDidMount"

const Otsm = () => {
    const [selectedProject, setSelectedProject] = useState("choose one...")
    const [projectSelected, setProjectSelected] = useState(false)
    const [selectedMachine, setSelectedMachine] = useState("choose one...")
    const [machineSelected, setMachineSelected] = useState(false)

    useEffectDidMount(() => {
        document.querySelector('.otsm__project.help')?.classList.replace('is-danger', 'is-hide')
        document.querySelector('.otsm__project.otsm__dropdown__button')?.classList.replace('is-danger', 'is-primary')
    },[projectSelected])

    useEffectDidMount(() => {
        document.querySelector('.otsm__machine.help')?.classList.replace('is-danger', 'is-hide')
        document.querySelector('.otsm__machine.otsm__dropdown__button')?.classList.replace('is-danger', 'is-primary')
        // document.querySelector('.machine-select-help')?.classList.add('is-success')
    }, [machineSelected])

    const toggleDropdownIsActive = (e: MouseEvent) => {
        const target = e.currentTarget
        const classIdentify = target.classList.toString().split(" ").shift()
        if (classIdentify) {
            document.querySelector(`.${classIdentify}`)?.classList.toggle("is-active")
        }
    }

    const toggleContentIsActiveWithId = (e: MouseEvent, id: number) => {
        const target = e.currentTarget
        const classIdentify = target.classList.toString().split(" ").shift()
        const aTagSelected = document.querySelectorAll(`.${classIdentify}.otsm__dropdown__a`)
        aTagSelected.forEach((element) => {
            if (element.classList.contains(id.toString())) {
                element.classList.add("is-active")
            } else {
                element.classList.remove("is-active")
            }
        })
    }

    return (
        <div className="otsm__grid-container">
            <div className="otsm__selector">
                <label className="label">Project group :</label>
                <div className="otsm__project otsm__dropdown dropdown" onClick={(e: MouseEvent) => toggleDropdownIsActive(e)}>
                    <div className="dropdown-trigger">
                        <button className="otsm__project otsm__dropdown__button button is-outlined is-danger" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span><i>{selectedProject}</i></span>
                            <span className="icon is-small">
                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                        <div className="dropdown-content">
                            <a className="otsm__project otsm__dropdown__a 1 dropdown-item" onClick={(e: MouseEvent) => {
                                toggleContentIsActiveWithId(e, 1)
                                setSelectedProject(e.currentTarget.innerHTML)
                                setProjectSelected(true)
                            }}>
                                Test Project1
                            </a>
                        </div>
                    </div>
                </div>
                <p className="otsm__project help is-danger">Select project name</p>
            </div>
            <div className="otsm__selector">
                <label className="label">Machine :</label>
                <div className="otsm__machine__dropdown dropdown" onClick={(e: MouseEvent) => toggleDropdownIsActive(e)}>
                    <div className="dropdown-trigger">
                        <button className="otsm__machine otsm__dropdown__button button is-outlined is-danger" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span><i>{selectedMachine}</i></span>
                            <span className="icon is-small">
                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                        <div className="dropdown-content">
                            <a className="otsm__machine otsm__dropdown__a 1 dropdown-item" onClick={(e: MouseEvent) => {
                                toggleContentIsActiveWithId(e, 1)
                                setSelectedMachine(e.currentTarget.innerHTML)
                                setMachineSelected(true)
                            }}>
                                Test MC1
                            </a>
                            <a className="otsm__machine otsm__dropdown__a 2 dropdown-item" onClick={(e: MouseEvent) => {
                                toggleContentIsActiveWithId(e, 2)
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
        </div>
    )
}

export default Otsm