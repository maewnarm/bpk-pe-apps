import React, { useState, useEffect } from "react";
import ProjectSelect from "@/components/otsm/_projectSelect";
import MachineSelect from "@/components/otsm/_machineSelect";
import MachineSignal from "@/components/otsm/_signalOperation";
import TableSetting from "@/components/otsm/_tableSetting";
import {
  toggleDropdownIsActive,
  toggleContentIsActiveWithId,
} from "@/components/otsm/_functions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  machineLists,
  projectLists,
  setResetProjectSelection,
} from "@/app/features/otsm/otsmSlice";

const Otsm = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(projectLists);
  const machines = useAppSelector(machineLists);
  const [currentTab, setCurrentTab] = useState(1);

  function selectTab(e: React.MouseEvent, tabIndex: number) {
    const tabLists = document.querySelectorAll(".otsm__tabs ul li");
    tabLists.forEach((list) => {
      list.classList.toggle("is-active", false);
    });
    e.currentTarget.classList.toggle("is-active", true);
    setCurrentTab(tabIndex);
  }

  useEffect(() => {
    const tabs = document.querySelectorAll(".otsm__tabs__tab");
    tabs.forEach((tab) => {
      if (tab.classList.contains(`tab--${currentTab}`)) {
        tab.classList.toggle("is-hide", false);
      } else {
        tab.classList.toggle("is-hide", true);
      }
    });
  }, [currentTab]);

  // function toggleProjectContent(
  //   e: React.MouseEvent,
  //   index: number,
  //   projectId?: number
  // ) {
  //   toggleContentIsActiveWithId(e, index);
  // }

  return (
    <div className="otsm">
      <div className="otsm__tabs tabs is-centered">
        <ul>
          <li
            className="is-active"
            onClick={(e) => {
              selectTab(e, 1);
              dispatch(setResetProjectSelection(true));
            }}
          >
            <a>
              <span className="icon is-small">
                <i className="fas fa-wave-square" aria-hidden="true"></i>
              </span>
              <span>Operation</span>
            </a>
          </li>
          <li onClick={(e) => selectTab(e, 2)}>
            <a>
              <span className="icon is-small">
                <i className="fas fa-cogs" aria-hidden="true"></i>
              </span>
              <span>Setting</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="otsm__tabs__tab tab--1">
        <div className="otsm__grid-container">
          <ProjectSelect
            toggleDropdown={toggleDropdownIsActive}
            toggleContent={toggleContentIsActiveWithId}
            contentItems={projects}
          />
          <MachineSelect
            toggleDropdown={toggleDropdownIsActive}
            toggleContent={toggleContentIsActiveWithId}
            contentItems={machines}
          />
        </div>
        <MachineSignal />
      </div>
      <div className="otsm__tabs__tab tab--2 is-hide">
        <TableSetting />
      </div>
    </div>
  );
};

export default Otsm;
