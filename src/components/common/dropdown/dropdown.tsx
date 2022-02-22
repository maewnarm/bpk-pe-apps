import { Dispatch, FC, SetStateAction, useState } from "react";
import useEffectDidMount from "@/hooks/useEffectDidMount";
import { useAppDispatch } from "@/app/hooks";
import { toggleDropdownIsActive, toggleDropdownContent } from "./_functions";

interface DropdownProps {
  uniqueKey: string;
  defaultText: string;
  contentItems: string[];
  selectedItem: string | undefined;
  setByRedux?: boolean;
  setContentFunction: Dispatch<SetStateAction<string | undefined>>;
  helpMessage?: string;
}

const Dropdown: FC<DropdownProps> = (props) => {
  const {
    uniqueKey,
    defaultText,
    contentItems,
    selectedItem,
    setByRedux,
    setContentFunction,
    helpMessage,
  } = props;
  const dispatch = useAppDispatch();
  const [selectedContentIndex, setSelectedContentIndex] = useState<
    number | undefined
  >();
  var mouseOnContent = false;

  useEffectDidMount(() => {
    let help = document.querySelector(`.${uniqueKey}.dropdown + .help`);
    let button = document.querySelector(
      `.${uniqueKey}.dropdown > div > button`
    );
    help?.classList.toggle("is-danger", !selectedItem);
    help?.classList.toggle("is-hide", !!selectedItem);
    button?.classList.toggle("is-danger", !selectedItem);
    button?.classList.toggle("is-primary", !!selectedItem);
    if (!selectedItem) {
      setSelectedContentIndex(undefined);
    }
  }, [selectedItem]);

  return (
    <div className="dropdown__container">
      <div className={`${uniqueKey} dropdown`}>
        <div className="dropdown-trigger">
          <button
            className="button is-outlined is-danger"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={(e) => toggleDropdownIsActive(e, uniqueKey)}
            onBlur={(e) =>
              !mouseOnContent && toggleDropdownIsActive(e, uniqueKey)
            }
          >
            <span>
              <i>{selectedItem ? selectedItem : defaultText}</i>
            </span>
            <span className="icon is-small">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div
          className="dropdown-menu"
          id="dropdown-menu"
          role="menu"
          onMouseEnter={() => (mouseOnContent = true)}
          onMouseLeave={() => (mouseOnContent = false)}
        >
          <div className="dropdown-content">
            {contentItems.map((item, idx) => {
              let classSet = "";
              if (selectedContentIndex === idx) {
                classSet += " is-active";
              }
              return (
                <a
                  key={idx}
                  className={`${uniqueKey} dropdown-item${classSet}`}
                  onClick={(e: React.MouseEvent) => {
                    setSelectedContentIndex(idx);
                    toggleDropdownIsActive(e, uniqueKey);
                    if (setByRedux) {
                      // dispatch(setMachine(e.currentTarget.innerHTML))
                    } else {
                      //normal functions
                      setContentFunction(item);
                    }
                  }}
                >
                  {item}
                </a>
              );
            })}
          </div>
        </div>
      </div>
      {helpMessage && <p className="help is-danger">{helpMessage}</p>}
    </div>
  );
};

Dropdown.defaultProps = {
  contentItems: [],
  defaultText: "choose one ...",
  selectedItem: undefined,
  setContentFunction: () => {},
  setByRedux: false,
};

export default Dropdown;
