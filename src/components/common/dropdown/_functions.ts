import React from "react";

export function toggleDropdownIsActive(e: React.MouseEvent | React.FocusEvent,key: string) {
  let target = document.querySelector(`.${key}.dropdown`)
  if (e.type === "blur") {
    target?.classList.toggle("is-active", false);
  } else {
    target?.classList.toggle("is-active");
  }
}

export const toggleDropdownContent = (e: React.MouseEvent, id: number) => {
  const target = e.currentTarget;
  const classIdentify = target.classList.toString().split(" ").shift();
  const aTagSelected = document.querySelectorAll(
    `.${classIdentify}.otsm__dropdown__item`
  );
  aTagSelected.forEach((element) => {
    if (element.classList.contains(id.toString())) {
      element.classList.add("is-active");
    } else {
      element.classList.remove("is-active");
    }
  });
};
