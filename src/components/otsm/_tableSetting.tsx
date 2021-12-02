import { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as qs from "qs";
import useEffectDidMount from "@/hooks/useEffectDidMount";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  projectLists,
  machineLists,
  setProjectLists,
  setMachineLists,
} from "@/app/features/otsm/otsmSlice";
import { TableProjectProps, TableMachineProps } from "./_types";
import { getOtsmProjects, getOtsmMachines } from "@/api/otsmAPI";

const TableProject: FC<TableProjectProps> = (props) => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(projectLists);

  function selectProject(projectId: number) {
    async function func() {
      let machines: any[] = [];
      let result = await getOtsmMachines(projectId, {
        populate: "*",
      });
      if (result) {
        machines = result.attributes.otsm_machines.data;
        if (Array.isArray(machines)) {
          machines = machines.map((machine) => ({
            name: machine.attributes.machine_name,
            id: machine.attributes.machine_index,
          }));
          dispatch(setMachineLists(machines));
          props.setShowMachine(true);
        }
      }
    }
    func();
  }

  return (
    <table className="otsm__table--project table is-bordered">
      <thead>
        <tr>
          <th>Project name</th>
          <th>Product</th>
          <th>Part name</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, index) => {
          return (
            <tr key={index} onClick={() => selectProject(project.id)}>
              <td>{project.name}</td>
              <td>{project.product}</td>
              <td>{project.part}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const TableMachine: FC<TableMachineProps> = (props) => {
  const machines = useAppSelector(machineLists);

  return (
    <table className="otsm__table--machine table is-bordered">
      <thead>
        <tr>
          <th>
            <span
              className="icon is-small"
              onClick={() =>
                props.setShowMachine && props.setShowMachine(false)
              }
            >
              <abbr title="back">
                <i className="fas fa-arrow-alt-circle-left" />
              </abbr>
            </span>
          </th>
          <th>No.</th>
          <th>Machine</th>
        </tr>
      </thead>
      <tbody>
        {machines.map((machine, index) => {
          return (
            <tr key={index}>
              <td></td>
              <td>{machine.id}</td>
              <td>{machine.name}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const TableSetting = () => {
  const dispatch = useAppDispatch();
  const [machineListsState, setMachineListsState] = useState<any[]>([]);
  const [showMachine, setShowMachine] = useState(false);

  useEffect(() => {
    async function func() {
      let projects: any[] = [];
      let result: any[] = await getOtsmProjects({
        fields: "project_name,product,part",
      });
      if (result) {
        if (Array.isArray(result)) {
          projects = result.map((project) => ({
            id: project.id,
            name: project.attributes.project_name,
            product: project.attributes.product,
            part: project.attributes.part,
          }));
          dispatch(setProjectLists(projects));
        }
      }
    }
    func();
  }, []);

  // useEffect(() => {
  //   console.log(projectListsState);
  //   let lists = projectListsState.map((project) => ({
  //     id: project.id,
  //     name: project.attributes.project_name,
  //     product: project.attributes.product,
  //     part: project.attributes.part,
  //   }));
  //   dispatch(setProjectLists(lists));
  // }, [projectListsState]);

  useEffect(() => {
    let lists = machineListsState.map((machine) => ({
      id: machine.machine_index,
      name: machine.machine_name,
    }));
    dispatch(setMachineLists(lists));
  }, [machineListsState]);

  useEffectDidMount(() => {
    if (!showMachine) {
      setMachineListsState([]);
    }
  }, [showMachine]);

  return (
    <div className="otsm__table">
      {showMachine ? (
        <TableMachine setShowMachine={setShowMachine} />
      ) : (
        <TableProject setShowMachine={setShowMachine} />
      )}
    </div>
  );
};

export default TableSetting;
