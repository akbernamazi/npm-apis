const express=require('express')
const app=express();

// To use external module for validating the input 
const Joi=require('joi');

// We need to enable JSON object in the body of the req, by default this feature is not enabled [used in .post() to get the data from the page]
app.use(express.json()); // express.json() returns the middleware We call app.use to use that middleware in request processiong pipeline

const users=[
    {id: 1, name: 'Nia'},
    {id: 2, name: 'Nitish'},
    {id: 3, name: 'Vineeth'}
];


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/users", (req,res)=>{
    res.send(users);
});

app.get("/api/users/:id", (req,res)=>{
    // To return an details of the user with user ID, all arrays in node use find function 
    const user=users.find( u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send("User with the given ID is not found");
    res.send(user)
});

app.post("/api/users", (req,res)=>{
    // const schema={  
    //     name: Joi.string().min(3).required()
    // };
    // const result= Joi.validate(req.body, schema)
    // console.log(result.error);
    // if(!req.body.name || req.body.name.length<3){
    //     return res.status(400).send("Invalid name");
    // }
    
    // validation using function and Joi
    const result=validatation(req.body);    
    if(result.error)    return res.status(400).send(result.error.details[0].message);
    

    // Creating new user
    const user={
        id: users.length+1,
        name: req.body.name // we use express.json() conversion here
    };

    users.push(user);
    res.send(user);
});


// app.get("/api/user/:id/:name", (req,res)=>{
//     // res.send(req.params)
//     res.send(req.query)
// });


app.put('/api/users/:id', (req,res) =>{
    //check if id is present

    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.staus(404).send("User Not Found");

    // valid input
    const result=validatation(req.body);    
    if(result.error)    return res.status(400).send(result.error.details[0].message);
    
    // update
    user.name=req.body.name;
    res.send(user);
});

app.delete("/api/users/:id", (req,res)=>{
    // Check for id
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send("User Not Found");
    
    // initialize index
    const index= users.indexOf(user);

    // remove the object
    users.splice(index,1) // delete the user
    return res.send(user);
});

// Validation done usinig Joi
function validatation(user){
    const schema={
        name: Joi.string().min(3).required()
    };
    return Joi.validate(user, schema);
}









// We use global constant called process to assign the port intially available for out machine, if not available we can set using command called $set variable_name= <port.number>
const port = process.env.PORT || 3000
app.listen(port,()=>console.log('Running on port '+port+'...'));

// We can't always relly on arbitary port numbers 
// app.listen(3000,()=>console.log("Running port 3000..."));