import { toast } from "react-toastify";
import { useAppDispatch } from "@/app/hooks";
import { setLoaderIsActive } from "@/app/features/loader/loaderSlice";

const Main = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="main">
      <h1>Main</h1>
      <button className="button is-primary" onClick={() => toast("test")}>
        Show toast
      </button>
      <button className="button is-primary" onClick={() => dispatch(setLoaderIsActive(true))}>
        Show loader
      </button>
    </div>
  );
};

export default Main;
