const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 8080;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

var transport = nodemailer.createTransport({
  host: "mail.ncoatnano.com",
  port: 465,
  secure: true,
  auth: {
    user: "support@ncoatnano.com",
    pass: "Mail@support"
  }
});

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

app.post("/mail", (req, res) => {
  var { name, email, subject, body } = req.body;
  fs.readFile("src/template.html", "utf8", (err, template) => {
    console.log("mail");
    template = template.replace(
      "[content]",
      `
      <table style="width:100%">
        <tr>
          <td>
            <b>Name:</b>
          </td>
          <td>
          ${name}
          </td>
        </tr>
        <tr>
          <td>
            <b>Email:</b>        
          </td>
          <td>
          ${email}
          </td>
        </tr>
        <tr>
          <td>
            <b>Contact No:</b>
          </td>
          <td>
          ${subject}
          </td>
        </tr>
        <tr>
          <td>
            <b>Message:</b> 
          </td>
          <td>
          ${body}
          </td>
        </tr>
      </table>
    `
    );
    transport
      .sendMail({
        from: "support@ncoatnano.com", // sender address
        to: email, // list of receivers
        cc: "support@ncoatnano.com, support@ncoat.in",
        subject: "Inquiry Mail from " + capitalize(name), // plain text body
        html: template // html body
      })
      .then(result => {
        res.send();
      });
  });
});

app.get("/", (req, res) => {
  console.log("start");
  res.send("ok");
  // transport
  //   .sendMail({
  //     from: "support@ncoatnano.com", // sender address
  //     to: "viky.viky884@gmail.com", // list of receivers
  //     subject: "Working", // Subject line
  //     text: "Hello world?", // plain text body
  //     html: "<h1>Hello world?</h1>" // html body
  //   })
  //   .then(result => {
  //     console.log(result);
  //     res.send("send :-)");
  //   });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
