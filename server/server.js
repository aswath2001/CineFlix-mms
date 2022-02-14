const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('my-sql')
// var cors = require("cors"); 
const https = require('https');
const {v4 :uuid} = require('uuid') //for charging the customer only once
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {promisify} = require('util'); //for decoding the cookie id to check whether the user is logged in or not

dotenv.config({path:'./secret.env'});
const stripe = require('stripe')(process.env.TEST_KEY);

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());//to set up cookies
// app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

const db= mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE,
});

db.connect(function(err){
    if(err){
      console.log(err);
    }
    else
    {
      console.log("My SQL Connected!!!")
    }
})

// //to make sure user is isLoggedIn
isLoggedIn = async(req,res,next)=>{
    console.log(req.cookies);
    if(req.cookies.jwt)
    {
      try{
        //we are verifying the token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
        console.log(decoded);
        //check the user exists
        db.query("SELECT * FROM users WHERE id = ?",[decoded.id],function(err,results){
          if(!results){
            return next();
          }
  
          req.user = results[0];
          console.log(req.user);
          return next();
        });
      } catch(err){
        res.status(401).send("Unauthorized:No token provided");
        console.log(err);
        return next();
      }
    }
    else
    {
      next();
    }
}


app.get("/profile",isLoggedIn,(req,res)=>{
    if(req.user){
        console.log("hi");
        console.log(req.user);
        res.send({loginStatus:true,userInfo:req.user});
    }else{
        res.send({loginStatus:false});
    }
});

app.get("/logout",isLoggedIn,(req,res)=>{
    res.cookie("jwt","logout",{
        expires : new Date(Date.now() + 2*1000),
        httpOnly:true
    });
    res.send({loginStatus:false});
});

app.get("/adminLogout",(req,res)=>{ 
    res.cookie("admin","logout",{
        expires : new Date(Date.now() + 2*1000),
        httpOnly:true
    });
    res.send({loginStatus:false});
});

app.get("/getMovies/:city",(req,res)=>{
    console.log(req.params.city)
    const query = "SELECT * from movie where movieId in (SELECT DISTINCT movieId from showtable where ScreenId in (SELECT screenId from screen where theatreId in (SELECT theatreId from theatre where theatreCity = ? )) and showDate >= CURRENT_DATE)";
    db.query(query,[req.params.city],async(err,movies)=>{
        if(err){
            console.log(err);
        }else{
            console.log(movies);
            
            res.send({movies:movies});
        }
    });
})

app.get("/particularMovie/:movieId",(req,res)=>{
    console.log("particular movie is");
    console.log(req.params.movieId);
    db.query("SELECT * from movie where movieId = ? ",[req.params.movieId],async(err,movie)=>{
        if(err){
            console.log(err);
        }else{
            console.log(movie[0]);
            res.send({movie:movie[0]});
        }
    })
});

app.get("/getShowOfMovie/:movieId/:city",(req,res)=>{
    console.log("Get show of movie");
    console.log(req.params.movieId,req.params.city);
    const q1 = "(SELECT theatre.theatreName,theatre.theatreId from theatre where theatre.theatreCity= ? )";
    const timeQuery = "(SELECT NOW() from DUAL)";
    const q2 = "(SELECT screen.screenName,screen.theatreId,showtable.showDate,showtable.showId,showtable.showTime FROM screen INNER JOIN showtable ON screen.screenId=showtable.ScreenId where showtable.movieId=? and showtable.showTime > "+timeQuery+")";
    const query = "SELECT q1.theatreName,q2.screenName,q2.showDate,q2.showTime,q2.showId from "+q1+" as q1 INNER JOIN "+q2+"as q2 where q2.theatreId = q1.theatreId ORDER BY showDate";
    db.query(query,[req.params.city,req.params.movieId],async(err,details)=>{
        if(err){
            console.log(err);
        }else{
            console.log(details);
            res.send({details:details});
        }
    })
});

app.get("/getOrderSummary/:showid",(req,res)=>{
    console.log("get order summary")
    console.log(req.params.showid)

    const q1 = "(SELECT screen.screenName,screen.theatreId,showtable.showTime,showtable.movieId from screen INNER JOIN showtable where showtable.ScreenId = screen.screenId AND showtable.showId = ? )";
    const q2 = "(SELECT q1.screenName,q1.showTime,q1.movieId,theatre.theatreName from "+q1+"  as q1 INNER JOIN theatre where q1.theatreId = theatre.theatreId)";
    const query = "SELECT q2.screenName,q2.showTime,q2.movieId,q2.theatreName,movie.movieName,movie.language,movie.movieCertification from "+q2+ " AS q2 INNER JOIN movie WHERE q2.movieId = movie.movieId ";
    console.log(query);
    db.query(query,[req.params.showid],async(err,details)=>{
        if(err){
            console.log(err);
        }else{
            console.log(details);
            res.send({details : details})
        }
    })
});

app.get("/getSeats/:showId",(req,res)=>{
    console.log("Get show ")
    console.log(req.params.showId);
    db.query("SELECT seats from ticket where showId = ?",[req.params.showId],async(err,seats)=>{
        if(err){
            console.log(err);
        }else{
            console.log(seats);
            res.send({seatsOccupied:seats});
        }

    });
});

app.post("/register",function(req,res){
    const name = req.body.name;
    const email = req.body.email;
    const city = req.body.city;
    const cpassword = req.body.cpassword;
    const password = req.body.password;
    if(!name || !email || !city || !cpassword || !password){
        return res.status(401).json({message:"All fields are not set",registered:false});
    }

    console.log(name,email,city,cpassword,password);

    db.query("SELECT email from users where email = ?",[email],async function(err,results){
      if(err){
        console.log(err);
      }
      else
      {
        console.log(results);
        if(results.length >0)
        {
            console.log("email exists");
            return res.json({message:"Email Exists",registered:false});
        }
        else if(cpassword != password){
            console.log("passwords dont match");
            return res.json({message:"Password Don't Match",registered:false});
        }

        let hashedPassword = await bcrypt.hash(password,8);

        db.query("INSERT into users SET ?",{name:name,email:email,city:city,password:hashedPassword},function(err,result){
            if(err){
                console.log(err);
            }
            else
            {
                console.log(result);
                return res.status(201).json({message:"User registered successfully",registered:true})
            }
        });

      }
    });
});

app.get("/getAllTheatreDetails",(req,res)=>{
    db.query("SELECT * from theatre",[],(err,theatre)=>{
        if(err){
            console.log(err);
        }else{
            console.log(theatre);
            res.send({theatre:theatre});
        }

    });
})

app.get("/getAllShowDetails",async(req,res)=>{
   await db.query("SELECT * from movie",[],async(err,movies)=>{
       if(err){
           console.log(err);
       }else{
           console.log(movies);
           await db.query("SELECT * from theatre ",[],async(e,theatre)=>{
               if(e){
                   console.log(e);
               }else{
                   console.log(theatre);
                   await db.query("SELECT * from screen ",[],(error,screen)=>{
                       if(error){
                           console.log(error);
                       }else{
                           console.log(screen);
                           res.send({movies:movies,theatre:theatre,screen:screen});
                       }

                   });
                  
               }
           })
       }
    })
});

app.get("/getTicketDetails/:id",(req,res)=>{
    let q1 = "SELECT q5.movieName,q5.movieImage,q5.showTime,q5.totalCost,q5.seats,q5.bookingDate,q5.screenName,theatre.theatreName from theatre inner join "
    let q2 = "(SELECT q4.movieName,q4.movieImage,q4.showTime,q4.totalCost,q4.seats,q4.bookingDate,screen.screenName,screen.theatreId from screen inner join "
    let q3 = "(SELECT movie.movieName,movie.movieImage,q3.showTime,q3.totalCost,q3.seats,q3.bookingDate,q3.ScreenId from movie INNER JOIN"
    let q4 = "(SELECT showtable.ScreenId,showtable.movieId,showtable.showTime,q2.totalCost,q2.seats,q2.bookingDate FROM showtable inner join "
    let q5 = "(SELECT showId,totalCost,seats,bookingDate FROM ticket where userId = ?)"
    let q6 = " as q2 where q2.showId = showtable.showId) as q3 WHERE movie.movieId = q3.movieId) as q4 where screen.screenId = q4.screenId) as q5 where q5.theatreID = theatre.theatreId"

    let query = q1+q2+q3+q4+q5+q6

    db.query(query,[req.params.id],(err,ticket)=>{
        if(err){
            console.log(err);
        }else{
            console.log(ticket)
            res.send({booking : ticket})
        }
    })

});

app.post("/addMovies",(req,res)=>{
    const addedMovie = req.body;
    console.log(addedMovie);
    db.query("INSERT INTO movie SET ?",{movieName:addedMovie.movieName,movieCast:addedMovie.movieCast,movieDirector:addedMovie.movieDirector,movieDescription:addedMovie.movieDescription,language:addedMovie.language,movieRunTime:addedMovie.movieRunTime,movieReleaseDate:addedMovie.movieReleaseDate,movieImage:addedMovie.movieImage,movieGenre:addedMovie.movieGenre,movieCertification:addedMovie.movieCertification,movieTrailer:addedMovie.movieTrailer},(err,addedMovies)=>{
        if(err){
            console.log(err);
            res.send({message:"Failed to add new Movie"})
        }else{
            console.log(addedMovies);
            res.send({message:"Movie Added Successfully"})
        }
    });
})

app.post("/addTheatre",(req,res)=>{
    const addedTheatre = req.body;
    db.query("INSERT INTO theatre SET ?",{theatreName:addedTheatre.theatreName,theatreCity:addedTheatre.theatreCity,contactNumber:addedTheatre.contactNumber},(err,addTheatre)=>{
        if(err){
            console.log(err);
            res.send({message:"Failed to add new Theatre"})
        }else{
            console.log(addTheatre);
            res.send({message:"Theatre Added Successfully"})
        }
    });
});

app.post("/addScreen",async(req,res)=>{
    const addedScreen = req.body;
    await db.query("SELECT * FROM screen where screen.theatreId = ? and screen.screenName = ?",[addedScreen.theatreId,addedScreen.screenName],(err,screen)=>{
        if(err){
            console.log(err);
            res.send({message:"Failed to add new Screen"})
        }else{
            console.log(screen);
            if(screen.length > 0){
                res.send({message:`Failed to Add new Screen.Screen ${addedScreen.screenName} exists`});
            }else{
                db.query("INSERT INTO screen SET ? ",{theatreId:addedScreen.theatreId,screenName:addedScreen.screenName},(e,addScreen)=>{
                    if(e){
                        console.log(e);
                        res.send({message:"Failed to add new Screen"})
                    }else{
                        console.log(addScreen);
                        res.send({message:"Screen Added Successfully"})
                    }
                });

            }
        }
    })
})

app.post("/addShow",async(req,res)=>{
    const addedShow = req.body;
    await db.query("SELECT * from showtable where ScreenId = ? and showTime = ?",[addedShow.screenId,addedShow.showTime],async(e,shows)=>{
        if(e){
            console.log(e)
        }else{
            console.log(shows)
            if(shows.length !== 0){
                res.send({message:"Show Already Exists. Adding Show Failed "})
            }else{
                await db.query("INSERT INTO showtable SET ? ",{ScreenId:addedShow.screenId,movieId:addedShow.movieId,showTime:addedShow.showTime,showDate:addedShow.showDate},(err,addShow)=>{
                    if(err){
                        console.log(err);
                        res.send({message:"Failed to add new Show Table"})
                    }else{
                        console.log(addShow);
                        res.send({message:"Show Added Successfully"})
                    }
                });
            }
        }

    });
    
});

app.post("/login",function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    if( !email || !password){
        return res.status(401).json({message:"All fields are not set",registered:false});
    }

    db.query('SELECT * FROM users WHERE email = ?',[email],async function(err,results){
        console.log(results);
        if(results.length >0)
        {
            console.log(results[0]);
            const isMatch = await bcrypt.compare(password,results[0].password);
            if(!isMatch)
            {
                return res.json({message:"That email and password don't match our records. Please try again",loginStatus:false});
            }  
            else
            {
                // Authentication
                const id=results[0].id;
                const token = jwt.sign({ id: id },process.env.JWT_SECRET,{
                expiresIn : process.env.JWT_EXPIRES_IN
                });
                console.log("The token is " + token);

                const cookieOptions = {
                    expires:new Date(
                        Date.now()+ 10 *24* 60*60*1000
                    ),
                    httpOnly:true,
                }

                res.cookie("jwt",token,cookieOptions);

                res.status(200).json({message:"Login Successful",loginStatus:true,token:token,userDetails:results[0]});
            }
            //keeping cookie in browser
        }
        else
        {
            return res.json({message:"That email and password don't match our records. Please try again",loginStatus:false});
        }
    });
});


app.post("/adminLogin",function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    if( !email || !password){
        return res.status(401).json({message:"All fields are not set",registered:false});
    }

    db.query('SELECT * FROM admin WHERE email = ?',[email],async function(err,results){
        console.log(results);
        if(results.length >0)
        {
            console.log(results[0]);
            const isMatch = await bcrypt.compare(password,results[0].password);
            if(!isMatch)
            {
                return res.json({message:"That email and password don't match our records. Please try again",loginStatus:false});
            }  
            else
            {
                // Authentication
                const id=results[0].id;
                const token = jwt.sign({ id: id },process.env.JWT_SECRET,{
                expiresIn : process.env.JWT_EXPIRES_IN
                });
                console.log("The token is " + token);

                const cookieOptions = {
                    expires:new Date(
                        Date.now()+ 10 *24* 60*60*1000
                    ),
                    httpOnly: true,
                }

                res.cookie("admin",token,cookieOptions);
                res.status(200).json({message:"Login Successful",loginStatus:true,token:token,adminDetails:results[0]});
            }
            //keeping cookie in browser
        }
        else
        {
            return res.json({message:"That email and password don't match our records. Please try again",loginStatus:false});
        }
    });
});


app.post("/payment",isLoggedIn,async(req,res)=>{
    console.log(req.user)

    if(typeof(req.user.id) === 'undefined'){
        return res.json({message:"Problem in User Login.Ticket Booking Unsuccessful",bookingStatus:false})
    }
    console.log("hi")
    const {product,token,details} = req.body;
    console.log(details)
    console.log(token)
    console.log("product",product);
    console.log("price",product.price);
    
    const idempotentKey = uuid();

    stripe.customers.create({
        email:token.email,
        source:token.id
    }).then(async(customer) =>{
        stripe.charges.create({
            amount:product.price*100,
            currency:'inr',
            customer:customer.id,
            receipt_email:token.email,
            description:product.name
        },{idempotencyKey: idempotentKey}).then((result) => {
        console.log(result)
        let seats = details.seats
        console.log(seats)
        let currDate = new Date().toISOString().slice(0,19).replace("T",' ');

        db.query("INSERT INTO ticket SET ?",{noOfSeats:seats.length,showId:details.showId,totalCost:product.price,userId:req.user.id,seats:details.seats,chargeId:result.id,bookingDate:currDate},(err,ticket)=>{
            if(err){
                console.log(err)
            }else{
               console.log(ticket)
            }
        })
        res.status(200).json({message:"Tickets Booked Successfully !!",bookingStatus:true});
    })
    })
    .catch(err => console.log(err));
})

app.get("/userBookingDetails",isLoggedIn,(req,res)=>{
    const q1 = "SELECT movie.movieName,movie.movieImage,movie.language,q4.theatreName,q4.theatreCity,q4.screenName,q4.showTime,q4.showDate,q4.ticketId,q4.seats from movie INNER JOIN ";
    const q2 = "(SELECT theatre.theatreName,theatre.theatreCity,q3.screenName,q3.showTime,q3.showDate,q3.movieId,q3.ticketId,q3.seats from theatre INNER JOIN";
    const q3 = " (SELECT screen.theatreId,screen.screenName,q2.showTime,q2.showDate,q2.movieId,q2.ticketId,q2.seats from screen INNER JOIN ";
    const q4 = "(SELECT showtable.ScreenId,showtable.showTime,showtable.showDate,showtable.movieId,q1.ticketId,q1.seats from showtable INNER JOIN ";
    const q5 = "(SELECT ticket.ticketId,ticket.showId,ticket.seats FROM ticket WHERE userId = ?)";
    const q6 = " as q1 where q1.showId = showtable.showId) as q2 where q2.ScreenId = screen.screenId)as q3 where theatre.theatreId = q3.theatreId) as q4 where q4.movieId = movie.movieId";
    const query = q1+q2+q3+q4+q5+q6;

    if(typeof(req.user) === "undefined"){
        res.send({status:false,ticketDetails:[]})
    }

    db.query(query,[req.user.id],(err,ticketDetails)=>{
        if(err){
            console.log(err);
        }else{
            console.log(ticketDetails);
            res.send({status:true,ticketDetails:ticketDetails});
        }
    })

});

app.post("/cancelBooking",async (req,res)=>{
    console.log(req.body.ticketid);
    await db.query("SELECT chargeId from ticket where ticketId = ? ",[req.body.ticketid],async(err,chargeId)=>{
        if(err){
            console.log(err);
        }else{
            console.log(chargeId[0].chargeId);
            const refund = await stripe.refunds.create({
                charge: chargeId[0].chargeId,
            });
            console.log(refund)
        }
    });

    await db.query("DELETE from ticket where ticketId = ?",[req.body.ticketid],(err,response)=>{
        if(err){
            console.log(err);
        }else{
            res.send({cancelled:true});
        }

    });
    
});


// app.post("/register",async(req,res)=>{
//     console.log("route is accessed");
//     console.log(req.body.work);
// });
if(process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"));
}


app.listen(process.env.PORT || 8080,()=>{
    console.log("server running in port ");
});