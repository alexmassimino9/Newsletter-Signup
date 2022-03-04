const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const  app = express();
 
 
 
// mailchimp config
client.setConfig({
  apiKey: "0faef3aed91a1a4f2c0144e4639fc44c-us14",
  server: "us14",
});
 
// allowing app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));
 
// allowing app to use express.static to load static files
app.use(express.static("public"));
 
 
 
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
})
 
 
 
app.post("/", function (req, res) {
  // getting information from the signup page using body-parser
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
 
 
// sending request and creating the data to send to the external server
  const run = async () => {
  const response = await client.lists.batchListMembers('a5e1f46441', {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstname,
        LNAME: lastname
      }
    }],
  });
  console.log(response.errors);
  if (response.errors[0] === undefined){
    res.sendFile(__dirname + "/success.html");
  }else{
    res.sendFile(__dirname + "/failure.html");
  }
};
  run();
 });
 
 
app.post("/failure", function (req, res) {
  res.redirect("/")
})
 
app.listen( process.env.PORT || 3000, function (req, res) {
  console.log("Server is running on port 3000");
})

// apiKey: '0faef3aed91a1a4f2c0144e4639fc44c-us14',
// server: 'us14' 
