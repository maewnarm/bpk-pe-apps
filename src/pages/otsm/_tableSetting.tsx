import { Dispatch, FC, SetStateAction, useState, useEffect } from "react";
import useEffectDidMount from "@/hooks/useEffectDidMount";
import { useAppDispatch } from "@/app/hooks";
import {
  setProjectLists,
  setMachineLists,
} from "@/app/features/otsm/otsmSlice";
import { TableProjectProps, TableMachineProps } from "./_types";

const TableProject: FC<TableProjectProps> = (props) => {
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
        {props.projectLists.map((project, index) => {
          return (
            <tr
              key={index}
              onClick={() => props.selectProject(project.machine_lists)}
            >
              <td>{project.project_name}</td>
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
        {props.machineLists.map((machine, index) => {
          return (
            <tr key={index}>
              <td></td>
              <td>{machine.machine_index}</td>
              <td>{machine.machine_name}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const TableSetting = () => {
  const dispatch = useAppDispatch();
  const [projectListsState, setProjectListsState] = useState<any[]>([]);
  const [machineListsState, setMachineListsState] = useState<any[]>([]);
  const [showMachine, setShowMachine] = useState(false);

  function selectProject(lists: any[]) {
    setMachineListsState(lists);
    setShowMachine(true);
  }

  useEffect(() => {
    fetch(
      `http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:${process.env.NEXT_PUBLIC_STRAPI_PORT}/project-lists`
    )
      .then((res) => res.json())
      .then((data) => {
        let projects: any[] = data;
        setProjectListsState(projects);
      });
  }, []);

  useEffect(() => {
    let lists = projectListsState.map((project) => ({
      name: project.project_name,
      id: project.id,
    }));
    dispatch(setProjectLists(lists));
  }, [projectListsState]);

  useEffect(() => {
    let lists = machineListsState.map((machine) => ({
      name: machine.machine_name,
      id: machine.id,
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
        <TableMachine
          setShowMachine={setShowMachine}
          machineLists={machineListsState}
        />
      ) : (
        <TableProject
          projectLists={projectListsState}
          selectProject={selectProject}
        />
      )}
    </div>
  );
};

export default TableSetting;
