import React, { FC, useState } from "react"
import useEffectDidMount from "@/hooks/useEffectDidMount"
import { useAppDispatch,useAppSelector } from "@/app/hooks";
import { 
    setProject,
    selectedProject,
    projectSelected,
} from "@/app/features/otsm/otsmSlice";
import { SelectorProps } from "./_types";

const ProjectSelect: FC<SelectorProps> = ({ toggleDropdown, toggleContent }) => {
    const dispatch = useAppDispatch()
    const selectedProjectValue = useAppSelector(selectedProject)
    const projectSelectedvalue = useAppSelector(projectSelected)

    useEffectDidMount(() => {
        if (projectSelectedvalue) {
            document.querySelector('.otsm__project.help')?.classList.replace('is-danger', 'is-hide')
            document.querySelector('.otsm__project.otsm__dropdown__button')?.classList.replace('is-danger', 'is-primary')
        }
    }, [projectSelectedvalue])

    return (
        <div className="otsm__selector">
            <label className="label">Project group :</label>
            <div className="otsm__project__dropdown dropdown">
                <div className="otsm__project__dropdown dropdown-trigger"  onClick={toggleDropdown} onBlur={toggleDropdown}>
                    <button className="otsm__project otsm__dropdown__button button is-outlined is-danger" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span><i>{selectedProjectValue}</i></span>
                        <span className="icon is-small">
                            <i className="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        <a className="otsm__project otsm__dropdown__item 1 dropdown-item" onClick={(e: React.MouseEvent) => {
                            toggleContent(e, 1)
                            dispatch(setProject(e.currentTarget.innerHTML))
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