import React, { FC, useState } from "react";
import useEffectDidMount from "@/hooks/useEffectDidMount";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setProject,
  selectedProject,
  projectSelected,
  projectSelectDisabled,
  setMachineLists,
} from "@/app/features/otsm/otsmSlice";
import { SelectorProps } from "./_types";

const ProjectSelect: FC<SelectorProps> = ({
  toggleDropdown,
  toggleContent,
  contentItems,
}) => {
  const dispatch = useAppDispatch();
  const selectedProjectValue = useAppSelector(selectedProject);
  const projectSelectedvalue = useAppSelector(projectSelected);
  const projectSelectDisabledValue = useAppSelector(projectSelectDisabled);

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
    fetch(
      `http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:${process.env.NEXT_PUBLIC_STRAPI_PORT}/project-lists/${selectedProjectValue.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        let lists: any[] = data.machine_lists;
        if (Array.isArray(lists)) {
          lists = lists.map((machine) => ({
            name: machine.machine_name,
            id: machine.id,
          }));
          dispatch(setMachineLists(lists));
        }
      });
  }, [selectedProjectValue]);

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
      <p className="otsm__project help is-danger">Select project name</p>
    </div>
  );
};

export default ProjectSelect;
