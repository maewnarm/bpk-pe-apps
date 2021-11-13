import { toast } from "react-toastify"

const Main = () => {
    return (
        <div className="main">
            <h1>Main</h1>
            <button className="button is-primary" onClick={() => toast("test")}>Show toast</button>
        </div>
    )
}

export default Main