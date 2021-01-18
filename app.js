const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();
const port = process.env.PORT || 3000;
const portHeroku = process.env.PORT; // heroku port for live site
const app = express();
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));


// Body-parser middleware 
app.use(bodyParser.urlencoded({extended:false})) 

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
    
});

app.post("/", function(req, res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    console.log(firstName, lastName, email);

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]

    }


    var jsonData = JSON.stringify(data);
    const url = "https://us7.api.mailchimp.com/3.0/lists/" + process.env.MAIL_CHIMP_ID;
    const options ={
        method: "POST",
        auth: "bernardo:" + process.env.API_KEY
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){

    res.redirect("/");
} );

app.listen(process.env.PORT, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

//unique ID mailChimp: e5d189102e
//MailChimp apiKey: 