import React, { FC, useState } from "react";
import useEffectDidMount from "@/hooks/useEffectDidMount";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setProject,
  selectedProject,
  projectSelected,
  setProjectSelected,
  projectSelectDisabled,
  projectResetSelection,
  setResetProjectSelection,
  setMachineLists,
} from "@/app/features/otsm/otsmSlice";
import { SelectorProps } from "./_types";
import { getOtsmMachines } from "@/api/otsmAPI";

const ProjectSelect: FC<SelectorProps> = ({
  toggleDropdown,
  toggleContent,
  contentItems,
}) => {
  const dispatch = useAppDispatch();
  const selectedProjectValue = useAppSelector(selectedProject);
  const projectSelectedvalue = useAppSelector(projectSelected);
  const projectSelectDisabledValue = useAppSelector(projectSelectDisabled);
  const resetProjectSelectionValue = useAppSelector(projectResetSelection);

  useEffectDidMount(() => {
    if (projectSelectedvalue) {
      document
        .querySelector(".otsm__project.help")
        ?.classList.replace("is-danger", "is-hide");
      document
        .querySelector(".otsm__project.otsm__dropdown__button")
        ?.classList.replace("is-danger", "is-primary");
    }
  }, [projectSelectedvalue]);

  useEffectDidMount(() => {
    async function func() {
      let machines: any[] = [];
      let result = await getOtsmMachines(selectedProjectValue.id, {
        populate: "*",
      });
      if (result) {
        machines = result.attributes.otsm_machines.data;
        if (Array.isArray(machines)) {
          machines = machines.map((machine) => ({
            name: machine.attributes.machine_name,
            id: machine.id,
          }));
          dispatch(setMachineLists(machines));
        }
      }
    }
    if (selectedProjectValue.id !== 0) {
      func();
    }
  }, [selectedProjectValue]);

  useEffectDidMount(() => {
    if (resetProjectSelectionValue) {
      resetSelection();
    }
  }, [resetProjectSelectionValue]);

  function resetSelection() {
    // console.log("reset")
    document
      .querySelector(".otsm__project.help")
      ?.classList.replace("is-hide", "is-danger");
    document
      .querySelector(".otsm__project.otsm__dropdown__button")
      ?.classList.replace("is-primary", "is-danger");
    document
      .querySelectorAll(".otsm__project.otsm__dropdown__item")
      .forEach((element) => {
        element.classList.toggle("is-active", false);
      });
    dispatch(
      setProject({ id: 0, name: "choose one ...", product: "", part: "" })
    );
    dispatch(setProjectSelected(false))
    dispatch(setResetProjectSelection(false));
  }

  return (
    <div className="otsm__selector">
      <label className="label">Project group :</label>
      <div className="otsm__project__dropdown dropdown">
        <div
          className="otsm__project__dropdown dropdown-trigger"
          onClick={(e) => toggleDropdown(e, projectSelectDisabledValue)}
          onBlur={(e) => toggleDropdown(e, projectSelectDisabledValue)}
        >
          <button
            className="otsm__project otsm__dropdown__button button is-outlined is-danger"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            disabled={projectSelectDisabledValue}
          >
            <span>
              <i>{selectedProjectValue.name}</i>
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
                  className={`otsm__project otsm__dropdown__item ${idx} dropdown-item`}
                  onClick={(e: React.MouseEvent) => {
                    toggleContent(e, idx);
                    dispatch(
                      setProject({
                        id: item.id,
                        name: item.name,
                        product: item.product,
                        part: item.part,
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
      <p className="otsm__project help is-danger">Select project name</p>
    </div>
  );
};

export default ProjectSelect;
