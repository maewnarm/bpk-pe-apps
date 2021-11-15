import React from 'react'

export function toggleDropdownIsActive(e: React.MouseEvent | React.FocusEvent) {
    const target = e.currentTarget
    const classIdentify = target.classList.toString().split(" ").shift()
    if (classIdentify) {
        if (e.type === "blur") {
            document.querySelector(`.${classIdentify}.dropdown`)?.classList.toggle("is-active", false)
        } else {
            document.querySelector(`.${classIdentify}.dropdown`)?.classList.toggle("is-active")
        }
    }
}

export const toggleContentIsActiveWithId = (e: React.MouseEvent, id: number) => {
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