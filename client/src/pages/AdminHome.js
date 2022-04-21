import styles from "./css/AdminHome.module.css"
import { Fragment,useState } from "react"
import {logoutUser} from "../store/Admin-slice"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import AddMovies from "../components/AddMovies"
import AddScreen from "../components/AddScreen"
import AddTheatre from "../components/AddTheatre"
import AddShow from "../components/AddShow"

const AdminHome = ()=>{

    const [selected,setSelected] = useState({selected:'movie'});
    const dispatch = useDispatch();
    const history = useHistory();

    const logoutHandler = ()=>{
        dispatch(logoutUser());
        history("/home");
    }

    const addMoviesHandler = ()=>{
        setSelected({selected:'movie'});
    }
    const addTheatreHandler = ()=>{
        setSelected({selected:'theatre'});
    }
    const addScreenHandler = ()=>{
        setSelected({selected:'screen'});
    }
    const addShowHandler = ()=>{
        setSelected({selected:'show'});
    }

    return <Fragment>
    <div className={styles.top}>
        <div className={styles.title}>CineFlix</div>
        <div className={styles.logout} onClick={logoutHandler}>logout</div>
    </div>
    <div className={styles.option}>
        <div className={`${styles.addMovies} ${selected.selected === 'movie' && styles.selected}`} onClick={addMoviesHandler}>Add Movies</div>
        <div className={`${styles.addTheatre} ${selected.selected === 'theatre' && styles.selected}`} onClick={addTheatreHandler}>Add Theatre</div>
        <div className={`${styles.addScreen} ${selected.selected === 'screen' && styles.selected}`} onClick={addScreenHandler}>Add Screen</div>
        <div className={`${styles.addShow} ${selected.selected === 'show' && styles.selected}`} onClick={addShowHandler}>Add Show</div>
    </div>
    {selected.selected === 'movie' && <AddMovies />}
    {selected.selected === 'theatre' && <AddTheatre />}
    {selected.selected === 'screen' && <AddScreen />}
    {selected.selected === 'show' && <AddShow />}

    </Fragment>

}

export default AdminHome;