const express = require('express');
const Router = express.Router();

var nodemailer = require('nodemailer');


Router.post('/sendmail', async (req, res) => {
    try {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: 'linkinmailer@gmail.com',
                pass: 'link123##'
            }
          });
        
        var mailOptions = {
            from: 'linkinmailer@gmail.com',
            to: req.body.email,
            subject: 'Application accepted',
            text: `Congratulations! ${req.body.recruiter} accepted your application.` 
        };

        await transporter.sendMail(mailOptions, (err, info) => {
            if(err)
                console.log(err);
            else 
                console.log("Mail sent: "+ info.response);  
            res.status(200).json({message: "sent"});
        })

    } catch {
        console.log("Could not send email");
    }
})

module.exports = Router;