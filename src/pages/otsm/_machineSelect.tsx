import React, { FC, useEffect, useState } from "react";
import useEffectDidMount from "@/hooks/useEffectDidMount";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setMachine,
  selectedProject,
  selectedMachine,
  machineSelected,
  machineSelectDisabled,
} from "@/app/features/otsm/otsmSlice";
import { SelectorProps } from "./_types";

const MachineSelect: FC<SelectorProps> = ({
  toggleDropdown,
  toggleContent,
  contentItems,
}) => {
  const dispatch = useAppDispatch();
  const selectedProjectValue = useAppSelector(selectedProject);
  const selectedMachineValue = useAppSelector(selectedMachine);
  const machineSelectedvalue = useAppSelector(machineSelected);
  const machineSelectDisabledValue = useAppSelector(machineSelectDisabled);

  useEffectDidMount(() => {
    if (machineSelectedvalue) {
      document
        .querySelector(".otsm__machine.help")
        ?.classList.replace("is-danger", "is-hide");
      document
        .querySelector(".otsm__machine.otsm__dropdown__button")
        ?.classList.replace("is-danger", "is-primary");
    }
  }, [machineSelectedvalue]);

  useEffect(() => {
    resetSelection();
  }, [selectedProjectValue]);

  function resetSelection() {
    document
      .querySelector(".otsm__machine.help")
      ?.classList.replace("is-hide", "is-danger");
    document
      .querySelector(".otsm__machine.otsm__dropdown__button")
      ?.classList.replace("is-primary", "is-danger");
    document
      .querySelectorAll(".otsm__machine.otsm__dropdown__item")
      .forEach((element) => {
        element.classList.toggle("is-active", false);
      });
  }

  return (
    <div className="otsm__selector">
      <label className="label">Machine :</label>
      <div className="otsm__machine__dropdown dropdown">
        <div
          className="otsm__machine__dropdown dropdown-trigger"
          onClick={(e) => toggleDropdown(e, machineSelectDisabledValue)}
          onBlur={(e) => toggleDropdown(e, machineSelectDisabledValue)}
        >
          <button
            className="otsm__machine otsm__dropdown__button button is-outlined is-danger"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            disabled={machineSelectDisabledValue}
          >
            <span>
              <i>{selectedMachineValue.name}</i>
            </span>
            <span className="icon is-small">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {contentItems.map((item, idx) => {
              return (
                <a
                  key={idx}
                  className={`otsm__machine otsm__dropdown__item ${idx} dropdown-item`}
                  onClick={(e: React.MouseEvent) => {
                    toggleContent(e, idx);
                    dispatch(
                      setMachine({
                        name: e.currentTarget.innerHTML,
                        id: item.id,
                      })
                    );
                  }}
                >
                  {item.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <p className="otsm__machine help is-danger">Select machine name</p>
    </div>
  );
};

export default MachineSelect;
