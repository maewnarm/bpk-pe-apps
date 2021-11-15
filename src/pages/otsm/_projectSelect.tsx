import React, { FC, useState } from "react"
import useEffectDidMount from "@/hooks/useEffectDidMount"
import { SelectorProps } from "./_types";

const ProjectSelect: FC<SelectorProps> = ({ toggleDropdown, toggleContent }) => {
    const [selectedProject, setSelectedProject] = useState("choose one...")
    const [projectSelected, setProjectSelected] = useState(false)

    useEffectDidMount(() => {
        if (projectSelected) {
            document.querySelector('.otsm__project.help')?.classList.replace('is-danger', 'is-hide')
            document.querySelector('.otsm__project.otsm__dropdown__button')?.classList.replace('is-danger', 'is-primary')
        }
    }, [projectSelected])

    return (
        <div className="otsm__selector">
            <label className="label">Project group :</label>
            <div className="otsm__project otsm__dropdown dropdown" onClick={toggleDropdown}>
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
                        <a className="otsm__project otsm__dropdown__a 1 dropdown-item" onClick={(e: React.MouseEvent) => {
                            toggleContent(e, 1)
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
    )
}

export default ProjectSelect