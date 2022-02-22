import { useState, useEffect } from "react";
import Dropdown from "@/components/common/dropdown/dropdown";
import useEffectDidMount from "@/hooks/useEffectDidMount";
import delayFunction from "@/hooks/delayFunction";
import { getProductItem } from "@/api/product";
import { useAppDispatch } from "@/app/hooks";
import { setLoaderIsActive } from "@/app/features/loader/loaderSlice";
import {
  selectedMachines,
  setSelectedMachines,
} from "@/app/features/isv/isvSlice";

const MachineSelection = () => {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<{ [key: string]: any }>({});
  const [parts, setParts] = useState<{ [key: string]: any }>([]);
  const [lines, setLines] = useState<{ [key: string]: any }>([]);
  const [machines, setMachines] = useState<{ [key: string]: any }>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>();
  const [selectedPart, setSelectedPart] = useState<string>();
  const [selectedLine, setSelectedLine] = useState<string>();

  useEffect(() => {
    async function getProductsFunction() {
      let prodObject: object = {};
      let result = await getProductItem("products");
      if (result && Array.isArray(result)) {
        result.forEach((product) => {
          prodObject = {
            ...prodObject,
            [product.attributes.name]: {
              id: product.id,
              short: product.attributes.short,
            },
          };
        });
        setProducts(prodObject);
      }
    }
    getProductsFunction();
  }, []);

  useEffectDidMount(() => {
    // selectedProduct changed
    async function getPartsFunction() {
      let partObject: object = {};
      await dispatch(setLoaderIsActive(true));
      if (selectedProduct && products[selectedProduct]) {
        let result = await getProductItem(
          `products/${products[selectedProduct].id}`,
          {
            populate: "*",
          }
        );
        result = result.attributes.parts.data;
        if (result && Array.isArray(result)) {
          result.forEach((part) => {
            partObject = {
              ...partObject,
              [part.attributes.name]: {
                id: part.id,
                short: part.attributes.short,
              },
            };
          });
        }
      }
      setParts(partObject);
      resetSelect(["part", "line", "machine"]);
      delayFunction(setLoaderIsActive(false), 100, dispatch);
    }
    getPartsFunction();
  }, [selectedProduct]);

  useEffectDidMount(() => {
    async function getLinesFunction() {
      let lineObject: object = {};
      await dispatch(setLoaderIsActive(true));
      if (selectedPart && parts[selectedPart]) {
        let result = await getProductItem(`parts/${parts[selectedPart].id}`, {
          populate: "*",
        });
        result = result.attributes.lines.data;
        if (result && Array.isArray(result)) {
          result.forEach((line) => {
            lineObject = {
              ...lineObject,
              [line.attributes.name]: {
                id: line.id,
                section_code: line.attributes.section_code,
                wc_code: line.attributes.wc_code,
              },
            };
          });
        }
      }
      setLines(lineObject);
      resetSelect(["line", "machine"]);
      delayFunction(setLoaderIsActive(false), 100, dispatch);
    }
    getLinesFunction();
  }, [selectedPart]);

  useEffectDidMount(() => {
    async function getMachinesFunction() {
      let machineObject: object = {};
      await dispatch(setLoaderIsActive(true));
      if (selectedLine && lines[selectedLine]) {
        let result = await getProductItem(`lines/${lines[selectedLine].id}`, {
          populate: "*",
        });
        result = result.attributes.machines.data;
        if (result && Array.isArray(result)) {
          result.forEach((machine) => {
            machineObject = {
              ...machineObject,
              [machine.id]: {
                no: machine.attributes.no,
                name: machine.attributes.name,
                index: machine.attributes.index,
                category: machine.attributes.category,
                mt: machine.attributes.mt,
                ht: machine.attributes.ht,
                selected: false,
              },
            };
          });
        }
      }
      setMachines(machineObject);
      resetSelect(["machine"]);
      delayFunction(setLoaderIsActive(false), 100, dispatch);
    }
    getMachinesFunction();
  }, [selectedLine]);

  function resetSelect(types: string[]) {
    types.forEach((type) => {
      switch (type) {
        case "part":
          setSelectedPart(undefined);
          break;
        case "line":
          setSelectedLine(undefined);
          break;
        case "machine":
          setSelectedMachines({});
          break;
      }
    });
  }

  function selectMachine(machineId: string) {
    let currentMachines = machines;
    currentMachines = {
      ...currentMachines,
      [machineId]: {
        ...currentMachines[machineId],
        selected: !currentMachines[machineId].selected,
      },
    };
    setMachines(currentMachines);
    dispatch(setSelectedMachines(currentMachines));
  }

  return (
    <>
      <div className="isv__selection__machine">
        <div className="isv__selection__machine__component">
          <label className="label">Product :</label>
          <Dropdown
            uniqueKey={"isv-product"}
            defaultText="choose product ..."
            contentItems={Object.keys(products)}
            selectedItem={selectedProduct}
            setContentFunction={setSelectedProduct}
            helpMessage={"choose product"}
          />
        </div>
        <div className="isv__selection__machine__component">
          <label className="label">Part :</label>
          <Dropdown
            uniqueKey={"isv-part"}
            defaultText="choose part ..."
            contentItems={Object.keys(parts)}
            selectedItem={selectedPart}
            setContentFunction={setSelectedPart}
            helpMessage={"choose part"}
          />
        </div>
        <div className="isv__selection__machine__component">
          <label className="label">Line :</label>
          <Dropdown
            uniqueKey={"isv-line"}
            defaultText="choose line ..."
            contentItems={Object.keys(lines)}
            selectedItem={selectedLine}
            setContentFunction={setSelectedLine}
            helpMessage={"choose part"}
          />
        </div>
      </div>
      <div className="isv__selection__machine__component isv__selection__machine__component--machine">
        <label className="label">Machine :</label>
        <div className="machines">
          {Object.entries(machines).map(([key, details], idx) => {
            var classSet = "";
            if (!details.selected) {
              classSet += " is-outlined";
            }
            return (
              <button
                key={idx}
                className={`button is-rounded is-primary${classSet}`}
                onClick={() => {
                  selectMachine(key);
                }}
              >
                {details.name}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MachineSelection;
