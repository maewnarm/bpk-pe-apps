import { FC, useState } from "react"
import useEffectDidMount from "@/hooks/useEffectDidMount"
import { useAppDispatch } from "@/app/hooks"
import {
    toggleDropdownIsActive,
    toggleDropdownContent
} from './_functions'

interface DropdownProps {
    contentItems: string[]
    selectedItem: string
    setByRedux?: boolean
    setContentFunction: () => void
    helpMessage?: string
}

const Dropdown: FC<DropdownProps> = (props) => {
    const dispatch = useAppDispatch()
    const [selectedContentIndex, setSelectedContentIndex] = useState<number | undefined>()

    useEffectDidMount(() => {
        if (props.selectedItem) {
            document.querySelector('.otsm__machine.help')?.classList.replace('is-danger', 'is-hide')
            document.querySelector('.otsm__machine.otsm__dropdown__button')?.classList.replace('is-danger', 'is-primary')
        }
    }, [props.selectedItem])

    return (
        <div className="dropdown__container">
            <div className="dropdown">
                <div className="dropdown-trigger" onClick={(e) => toggleDropdownIsActive(e)} onBlur={(e) => toggleDropdownIsActive(e)}>
                    <button className=" button is-outlined is-danger" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span><i>{props.selectedItem}</i></span>
                        <span className="icon is-small">
                            <i className="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        {props.contentItems.map((item, idx) => {
                            let classSet = " "
                            if (selectedContentIndex === idx) {
                                classSet = "is-active"
                            }
                            return (
                                <a key={idx} className={`dropdown-item${classSet}`} onClick={(e: React.MouseEvent) => {
                                    setSelectedContentIndex(idx)
                                    if (props.setByRedux) {
                                        // dispatch(setMachine(e.currentTarget.innerHTML))
                                    } else {
                                        //normal functions
                                        props.setContentFunction()
                                    }
                                }}>
                                    {item}
                                </a>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
            {props.helpMessage && <p className="help is-danger">{props.helpMessage}</p>}
        </div>
    )
}

Dropdown.defaultProps = {
    contentItems: [],
    selectedItem: "choose one ...",
    setContentFunction: () => {},
    setByRedux: false,
}

export default Dropdown