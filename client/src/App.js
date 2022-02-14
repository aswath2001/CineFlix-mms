import './App.css';
import {Route,Switch,Redirect} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import {useSelector} from "react-redux";
import Profile from './pages/Profile';
import Movies from './pages/Movies'
import Shows from "./pages/Shows";
import BuyTicket from './pages/BuyTicket';
import Wrapper from './wrapper/Wrapper';
import AdminLogin from './pages/AdminLogin';
import AdminHome from './pages/AdminHome';
import ErrorPage from './pages/ErrorPage';


function App() {

  //const dispatch = useDispatch();
  const authStatus = useSelector(state =>state.auth.loggedIn);
  const adminStatus = useSelector(state =>state.admin.loggedIn);


  console.log("auth status is : ",authStatus)


  // useEffect(()=>{
  //   console.log("hello");
  //   dispatch(getUserInfo());
  // },[dispatch]);

  

  return (
    <div className="app">
      <Switch>
        <Route path="/" exact>
        <Redirect to='/home' />
        </Route>
        <Route path="/home">
          {adminStatus?<Redirect to="/adminHome" />:<Wrapper><Home /></Wrapper>}
        </Route>
        <Route path="/adminHome">
          {!adminStatus?<Redirect to="/home" />:<AdminHome />}
        </Route>
        <Route path="/login">
          {adminStatus?<Redirect to="/adminHome" /> :authStatus?<Redirect to="/home" />:<Wrapper><Login /></Wrapper>}
        </Route>
        <Route path="/signup">
          {adminStatus?<Redirect to="/adminHome" /> :authStatus?<Redirect to="/home" />:<Wrapper><Signup /></Wrapper>}
        </Route>
        <Route path="/movies/:id">
          {adminStatus?<Redirect to="/adminHome" />:<Wrapper><Movies /></Wrapper>}
        </Route>
        <Route path={`/shows/:id`} exact>
          {adminStatus && <Redirect to="/adminHome" /> }
          {authStatus && <Wrapper><Shows /></Wrapper>}
          {!authStatus && <Redirect to="/login" />}
        </Route>
        <Route path={`/shows/:id/:showId`} exact>
          {adminStatus && <Redirect to="/adminHome" /> }
          {authStatus && <BuyTicket />}
          {!authStatus && <Redirect to="/login" />}
        </Route>
        <Route path="/profile" >
          {adminStatus && <Redirect to="/adminHome" />}
          {authStatus && <Profile />}
          {!authStatus && <Redirect to="/login"/>}
        </Route>
        <Route path="/adminLogin">
          {authStatus?<Redirect to="/home" />:<Wrapper><AdminLogin /></Wrapper>}
        </Route>
        <Route path="*">
          <ErrorPage />
        </Route>
      </Switch>
     

    </div>
  );
}

export default App;
