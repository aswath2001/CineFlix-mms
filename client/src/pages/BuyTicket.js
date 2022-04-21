import { Fragment, useState, useEffect } from "react";
import {useSelector} from "react-redux"
import { Redirect, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import useRequest from "../hooks/use-request";
import LoadingModal from "../modals/LoadingModal";
import ShowScreen from "../components/ShowScreen";
import DetailsOfShow from "../components/DetailsOfShow";
import ShowButton from "../components/ShowButton";
import Payment from "../components/Payment";

const BuyTicket = ()=>{

    const info = useParams();
    const history = useHistory();
    const movieId = info.id;
    const showId = info.showId;


    const movieDetails = useSelector(state=>state.movie.movies)
    const showDetails = useSelector(state=>state.showInfo.show)

    const {
        error:error,
        setError:setError,
        sendRequest:getTicket,
    }=useRequest();

    const [seatsOccupied,setSeatsOccupied] = useState([]);
    const [loading,setLoading] = useState(true);
    const [seatSelected,setSeatSelected] = useState([]);
    const [Submitted,setSubmitted] = useState(false);
    const [totalCost,setTotalCost] = useState(0);

    let validCredentials = true;

    console.log(movieDetails)
    console.log(showDetails)

    if((movieDetails === null || showDetails === null)){
        validCredentials = false;
    }

    const movie = movieDetails === null?null:movieDetails.filter(movie=>movie.movieId === parseInt(movieId))
    console.log(movie);
    if(movie === null ){
        validCredentials = false;
    }

    useEffect(()=>{
        let mounted = true;
        const seatsOccupiedHandler = (data)=>{
            console.log(data.seatsOccupied);
            if(data.seatsOccupied.length !== 0){
                const seats = data.seatsOccupied.map((seat,index,array)=>{
                    return seat.seats.split(',')
                }).reduce((accumulator,seat)=>{
                    return [...accumulator,...seat]
                })
                setSeatsOccupied(seats)
            }
            setLoading(false);
        }
        if(mounted){
            const configObject = {url:`/getSeats/${showId}`};
            getTicket(configObject,seatsOccupiedHandler)
        }
        return ()=> mounted=false;
    },[]);

    if(loading){
        return <LoadingModal />
    }


    const addSeat = (seatNo)=>{
        if(seatSelected.length === 10){
            alert("MAX_COUNT REACHED")

            return false;

        }
        setSeatSelected((prev)=>{
            return [...prev,seatNo]
        });
        return true;
    }
    const removeSeat = (seatNo)=>{
        setSeatSelected((prev)=>{
            return prev.filter(item => item!==seatNo);
        })
        console.log("Delete seat ",seatNo);

    }

    console.log(seatsOccupied);
    console.log(validCredentials)

    const submitHandler = (cost)=>{
        console.log(cost);
        setSubmitted(true);
        setTotalCost(cost);
    }

    console.log(movieDetails)

    return <Fragment>
    {!validCredentials && <Redirect to="/home" />}
    { validCredentials && <DetailsOfShow showInfo={showDetails} movieInfo={movie[0]} count={seatSelected.length}/>}
    {!Submitted && validCredentials && <ShowScreen seatsOccupied = {seatsOccupied} addSeat={addSeat} removeSeat={removeSeat}/> }
    {!Submitted && validCredentials && <ShowButton seats={seatSelected} submit = {submitHandler}/>}
    {Submitted && <Payment seats={seatSelected} cost={totalCost} showInfo={showDetails} movieInfo={movie[0]}/>}


    </Fragment>;

}

export default BuyTicket;