import { Fragment } from "react";
import NavigationBar from "../components/NavigationBar";

const Wrapper = (props)=>{
    return <Fragment>
        <NavigationBar />
        {props.children}
    </Fragment>

}

export default Wrapper;