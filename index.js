const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

//creating variables for storing data
let rooms = [{
    roomId:"R1",
    seatsAvailable:"4",
    amenities:"AC",
    pricePerhr:"100"
}];
let bookings = [{
    customer: "Renu",
    bookingDate: "2023/06/12",
    startTime: "12:00pm",
    endTime: "11:59am",
    bookingID: "B1",
    roomId: "R1",
    roomname:'deluxe',
    status: "booked",
    booked_On: "3/7/2023"
}
];
let customers = [
    { name: 'Renu',
     bookings: [ 
        {
            customer: 'Renu',
            bookingDate: '2023/06/12',
            startTime: '12:00pm',
            endTime: '11:59am',
            bookingID: 'B1',
            roomId: 'R1',
            roomname:'deluxe',
            status: 'booked',
            booked_On: '3/7/2023'
          }
      ] }
];



// view all Rooms and its details
app.get('/rooms/all', (req, res)=> {
    res.status(200).json({RoomsList : rooms});
    console.log(rooms)
  })


// 1) API endpoint for creating room
app.post('/rooms/create',(req,res) => {
    const room = req.body;
    const idExists = rooms.find((el)=> el.roomId === room.roomId)
    if(idExists !== undefined){
        return res.status(400).json({message:"room already exists."});
    }
    else{
    rooms.push(room);
    res.status(201).json({message:"room created"});
}   
});


// 2) api endpoint for booking room
app.post("/booking/create/:id", (req,res)=>{
    try{
      const {id} = req.params;
      let bookRoom = req.body; 
      let date = new Date();
      let dateFormat = date.toLocaleDateString();
      let idExists = rooms.find((el)=> el.roomId === id)
      if(idExists === undefined){
          return res.status(400).json({message:"room does not exist.", RoomsList:rooms});
  
      }
//verifying the booked date      
      let matchID = bookings.filter((b)=> b.roomId===id) 
      if(matchID.length > 0){
          let dateCheck = matchID.filter((m)=>{ return m.bookingDate === bookRoom.bookingDate});
          if(dateCheck.length===0){
              let newID = "B"+(bookings.length + 1);
              let newbooking = {...bookRoom, bookingID: newID, roomId:id, status:"booked", booked_On: dateFormat}
              bookings.push(newbooking);
              return res.status(201).json({message:"hall booked", Bookings:bookings, added:newbooking});
          }
          else{
              return res.status(400).json({message:"hall already booked for this date, choose another hall", Bookings:bookings});
          }
      }
      else{
              let newID = "B"+(bookings.length + 1);
              let newbooking = {...bookRoom, bookingID: newID, roomId:id, status:"booked",booked_On: dateFormat}
              bookings.push(newbooking);
              const customerdetails = customers.find(cust => 
                cust.name === newbooking.customer);
                if (customerdetails) {
                    customerdetails.bookings.push(newbooking);
                } else {
                    customers.push({ name:newbooking.customer,bookings:[newbooking]});
                }
              return res.status(201).json({message:"hall booked", Bookings:bookings, added:newbooking});
  
      }
    }
    catch(error){
        res.status(400).json({message:"error booking room", error: error, data:bookings});
    }
})



// 3) api endpoint for viewing all the booked room
app.get('/viewbooking',(req,res) => {
    const bookedRooms = bookings.map(booking => {
        const {roomId ,roomname,status,customer,bookingDate,startTime,endTime} = booking;
        return {roomId ,roomname,status,customer,bookingDate,startTime,endTime} 
    });
    res.status(201).json(bookedRooms);
});



// 4) api to list all the customers with booked data
app.get('/customers', (req, res) => {
    const customerBookings = customers.map(customer => {
      const { name, bookings } = customer;
      const customerDetails = bookings.map(booking => {
        const { roomId, bookingDate, startTime, endTime } = booking;
        return { name, roomId, bookingDate, startTime, endTime };
      });
     
      return customerDetails;
    })
   
    res.json(customerBookings);
  });

  

// 5) api to list how many times the user booked the room
  app.get('/customer/:name', (req, res) => {
    const { name } = req.params;
    const customer = customers.find(cust => cust.name === name);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    const customerBookings = customer.bookings.map(booking => {
      const { customer,roomId, startTime, endTime, bookingID, status, bookingDate,booked_On } = booking;
      return { customer, roomId, startTime, endTime, bookingID, status, bookingDate,booked_On };
    });
    res.json(customerBookings);
  });


//app.listen(4000, ()=> console.log("started server hallbooking"));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Your app is running with ${port}`));





































