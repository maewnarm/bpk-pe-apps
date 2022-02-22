import React, { useEffect, useState } from "react";
import useEffectDidMount from "@/hooks/useEffectDidMount";
import useInterval from "@/hooks/useInterval";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  loaderIsActive,
  setLoaderIsActive,
} from "@/app/features/loader/loaderSlice";
import ScaleLoader from "react-spinners/ScaleLoader";

const Loader = () => {
  const dispatch = useAppDispatch();
  const isActiveValue = useAppSelector(loaderIsActive);
  const [loaderColor, setLoaderColor] = useState(0);

  useEffectDidMount(() => {
    document
      .querySelector(`.loader-modal.modal`)
      ?.classList.toggle("is-active", isActiveValue);
  }, [isActiveValue]);

  useInterval(
    () => {
      let color = loaderColor;
      if (color >= 360) {
        color = 0;
      }
      color += 10;
      setLoaderColor(color);
    },
    50,
    isActiveValue
  );

  return (
    <div>
      <div className="modal loader-modal">
        <div className="modal-background"></div>
        <div className="modal-content">
          <ScaleLoader color={`hsl(${loaderColor},100%,80%)`} />
          <span>
            <text>Loading ...</text>
          </span>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => dispatch(setLoaderIsActive(false))}
        ></button>
      </div>
    </div>
  );
};

export default Loader;
