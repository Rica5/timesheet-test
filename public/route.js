const express = require("express");
const routeExp = express.Router();
const mongoose = require("mongoose");
const UserSchema = require("../models/User");
const TimesheetsSchema = require("../models/Timesheets");
const projectSchema = require("../models/Project");
const nodemailer = require("nodemailer");
const moment = require("moment");
const ExcelFile = require("sheetjs-style");

//Variable globale
var hours = 0;
var minutes = 0;
var data = [];
var totaltime = "";
var datatowrite;
var ws;
var filename;
var date_data = [];
 var admins;

//Mailing
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "developpeur.solumada@gmail.com",
    pass: "S0!um2d2",
  },
});
function sendEmail(receiver, subject, text) {
  var mailOptions = {
    from: "Timesheets Optimum solution",
    to: receiver,
    subject: subject,
    html: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
 mongoose
    .connect(
      "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
    admins = await UserSchema.find({occupation:"admin"});
 });

//Page login
routeExp.route("/").get(async function (req, res) {
 
  session = req.session;
  if (session.occupation_u == "user") {
    res.redirect("/timedefine");
  } else if (session.occupation_a == "admin") {
    res.redirect("/management");
  } else {
    res.render("LoginPage.html", { erreur: "" });
  }
});
//Post login
routeExp.route("/login").post(async function (req, res) {
  session = req.session;
  var email = req.body.username;
  var password = req.body.pwd;
  mongoose
    .connect(
      "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      var logger = await UserSchema.findOne({
        username: email,
        password: password,
      });
      if (logger) {
        if (logger.occupation == "user") {
          session.occupation_u = logger.occupation;
          session.m_code = logger.m_code;
          session.num_agent = logger.num_agent;
          admins = await UserSchema.find({occupation:"admin"});
          res.redirect("/timedefine");
        } else {
    admins = await UserSchema.find({occupation:"admin"});
           session.occupation_a = logger.occupation;
          res.redirect("/management"); 
        }
      } else {
        res.render("LoginPage.html", {
          erreur: "Email or password is wrong",
        });
      }
    });
});
//Reset password
routeExp.route("/reset").get(async function (req, res) {
  session = req.session;
  if (session.mailconfirm) {
    res.redirect("/code");
  } else {
    res.render("reset.html", { err: "" });
  }
});
//New password
routeExp.route("/code").post(async function (req, res) {
  session = req.session;
  var email = req.body.username;
  mongoose
    .connect(
      "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      if (await UserSchema.findOne({ username: email })) {
        session.mailconfirm = email;
        session.code = randomCode();
        sendEmail(
          session.mailconfirm,
          "Verification code timesheets",
          htmlVerification(session.code)
        );
        res.redirect("/code");
      } else {
        res.render("reset.html", { err: "Username does not exist" });
      }
    });
});
//code
routeExp.route("/code").get(async function (req, res) {
  session = req.session;
  if (session.mailconfirm) {
    res.render("code.html", { err: "" });
  } else {
    res.redirect("/");
  }
});
//Check code
routeExp.route("/check").post(async function (req, res) {
  session = req.session;
  if (session.code == req.body.code) {
    res.send("match");
  } else {
    res.send("not");
  }
});
//Change password
routeExp.route("/change").post(async function (req, res) {
  var newpass = req.body.pass;
  session = req.session;
  mongoose
    .connect(
      "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      await UserSchema.findOneAndUpdate(
        { username: session.mailconfirm },
        { password: newpass }
      );
      session.mailconfirm = null;
      session.code = null;
      res.send("Ok");
    });
});

//Management Page
routeExp.route("/management").get(async function (req, res) {
  session = req.session;
  if (session.occupation_a == "admin") {
    res.render("ManagementPage.html");
  } else {
    res.redirect("/");
  }
});

//Employees page
routeExp.route("/employees").get(async function (req, res) {
  session = req.session;
  if (session.occupation_a == "admin") {
    mongoose
      .connect(
        "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        {
          useUnifiedTopology: true,
          UseNewUrlParser: true,
        }
      )
      .then(async () => {
        var timesheets = await TimesheetsSchema.find({ validation: true }).sort(
          { $natural: -1 }
        );
        datatowrite = timesheets;
        var projects = await projectSchema.find({ status: "In Progress" });
        res.render("Employees.html", {
          timesheets: timesheets,
          available_project: projects,
        });
      });
  } else {
    res.redirect("/");
  }
});
//New employee
routeExp.route("/newemployee").get(async function (req, res) {
  session = req.session;
  if (session.occupation_a == "admin") {
    res.render("newemployee.html");
  } else {
    res.redirect("/");
  }
});
//Filter data
var request = {
  validation: true,
  occupation: "user",
};
routeExp.route("/filter").post(async function (req, res) {
  var mcode = req.body.mcode;
  var project = req.body.project;
  var datestart = req.body.startdate;
  var dateend = req.body.enddate;
  var datecount = [];
  var datatosend = [];
  mongoose
    .connect(
      "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      mcode == "" ? delete request.m_code : (request.m_code = mcode);
      project == "" ? delete request.projects : (request.projects = project);
      datestart == "" ? "" : datecount.push(1);
      dateend == "" ? "" : datecount.push(2);
      if (datecount.length == 2) {
        var day = moment
          .duration(
            moment(dateend, "YYYY-MM-DD").diff(moment(datestart, "YYYY-MM-DD"))
          )
          .asDays();
        for (i = 0; i <= day; i++) {
          request.date = datestart;
          date_data.push(request.date);
          var getdata = await TimesheetsSchema.find(request).sort({
            $natural: -1,
          });
          if (getdata.length != 0) {
            datatosend.push(getdata);
          }
          var addday = moment(datestart, "YYYY-MM-DD")
            .add(1, "days")
            .format("YYYY-MM-DD");
          datestart = addday;
        }
        for (i = 1; i < datatosend.length; i++) {
          datatosend[0].push(datatosend[i][0]);
        }
        datatowrite = datatosend[0];
        res.send(datatosend[0]);
      } else if (datecount.length == 1) {
        if (datecount[0] == 1) {
          request.date = datestart;
          datatosend = await TimesheetsSchema.find(request).sort({
            $natural: -1,
          });
          datatowrite = datatosend;
          res.send(datatosend);
        } else {
          request.date = dateend;
          datatosend = await TimesheetsSchema.find(request).sort({
            $natural: -1,
          });
          datatowrite = datatosend;
          res.send(datatosend);
        }
      } else {
        delete request.date;
        datatosend = await TimesheetsSchema.find(request).sort({
          $natural: -1,
        });
        datatowrite = datatosend;
        res.send(datatosend);
      }
    });
});
//Add employee
routeExp.route("/addemp").post(async function (req, res) {
  var email = req.body.email;
  var mcode = req.body.mcode;
  var num_agent = req.body.num_agent;
  mongoose
    .connect(
      "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      if (
        await UserSchema.findOne({
          $or: [
            { username: email },
            { m_code: mcode },
            { num_agent: num_agent },
          ],
        })
      ) {
        res.send("error");
      } else {
        var passdefault = randomPassword();
        var new_emp = {
          username: email,
          password: passdefault,
          m_code: mcode,
          num_agent: num_agent,
          occupation: "user",
        };
        await UserSchema(new_emp).save();
        sendEmail(
          email,
          "Authentification Timesheets",
          htmlRender(email, passdefault)
        );
        res.send(email);
      }
    });
});
//add new project
routeExp.route("/addproject").post(async function (req, res) {
  var project = req.body.projet;
  var status = req.body.status;
  var new_project = {
    project_name: project,
    status: status,
  };
  mongoose
    .connect(
      "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      if (await projectSchema.findOne({ project_name: project })) {
        res.send("Project " + project + " already exist");
      } else {
        await projectSchema(new_project).save();
        res.send("Project " + project + " added successfuly");
      }
    });
});

//Validation page
routeExp.route("/validation").get(async function (req, res) {
  session = req.session;
  if (session.occupation_a == "admin") {
    mongoose
      .connect(
        "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        {
          useUnifiedTopology: true,
          UseNewUrlParser: true,
        }
      )
      .then(async () => {
        var timesheets = await TimesheetsSchema.find({ validation: false });
        res.render("Validation.html", { timesheets: timesheets });
      });
  } else {
    res.redirect("/");
  }
});
//Validation
routeExp.route("/validate").post(async function (req, res) {
  var id = req.body.id;
  mongoose
    .connect(
      "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      await TimesheetsSchema.findOneAndUpdate(
        { _id: id },
        { validation: true }
      );
      res.send("Ok");
    });
});
//Denied
routeExp.route("/denied").post(async function (req, res) {
  var id = req.body.id;
  var m_code = req.body.m_code;
  var message = req.body.message;
  var task = req.body.task;
  var project = req.body.projetr;
  mongoose
    .connect(
      "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      var user = await UserSchema.findOne({ m_code: m_code });
      await TimesheetsSchema.findOneAndDelete({ _id: id });
      var text =
        "<p>Hello,</p>" +
        "<p>Your task <b>" +
        task +
        "</b> in project <b>"+ project +"</b> is rejected because:</p>" +
        "<p style='margin-left:30px;'>" +
        message +
        "<p><p>Regards</p>";
      sendEmail(user.username, "Rejected Time logged", text);
      res.send("Ok");
    });
});
//Validate all
routeExp.route("/valideall").get(async function (req, res) {
  session = req.session;
  if (session.occupation_a == "admin") {
    mongoose
      .connect(
        "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        {
          useUnifiedTopology: true,
          UseNewUrlParser: true,
        }
      )
      .then(async () => {
        await TimesheetsSchema.updateMany(
          { validation: false },
          { validation: true }
        );
        res.redirect("/employees");
      });
  } else {
    res.redirect("/");
  }
});

//Project
routeExp.route("/about").get(async function (req, res) {
  session = req.session;
  if (session.occupation_a == "admin") {
    mongoose
      .connect(
        "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        {
          useUnifiedTopology: true,
          UseNewUrlParser: true,
        }
      )
      .then(async () => {
        var projects = await projectSchema.find({ status: "In Progress" });
        res.render("Projects.html", { available_project: projects });
      });
  } else {
    res.redirect("/");
  }
});

//Project information
routeExp.route("/getinfo").post(async function (req, res) {
  var project = req.body.project;
  mongoose
    .connect(
      "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      var alltimes = await TimesheetsSchema.find({
        projects: project,
        validation: true,
      });
      const endOfMonth = moment().daysInMonth();
      var actually = 1;
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
      var datetosearch = startOfMonth;
      while (actually <= endOfMonth) {
        var one = await TimesheetsSchema.find({
          projects: project,
          date: datetosearch,
          validation: true,
        });
        for (i = 0; i < one.length; i++) {
          calcul_timediff(one[i].time_start, one[i].time_end);
        }
        actually++;
        datetosearch = moment(datetosearch, "YYYY-MM-DD")
          .add(1, "days")
          .format("YYYY-MM-DD");
      }
      var timepassed = hours + " H : " + minutes + " MN";
      var amount = calcul_euro(6.5, hours, minutes).toFixed(2) + " €";
      hours = 0;
      minutes = 0;
      var send = project_info(alltimes) + "," + timepassed + "," + amount;
      res.send(send);
    });
});

//Define time page
routeExp.route("/timedefine").get(async function (req, res) {
  session = req.session;
  if (session.occupation_u == "user") {
    mongoose
      .connect(
        "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        {
          useUnifiedTopology: true,
          UseNewUrlParser: true,
        }
      )
      .then(async () => {
        var projects = await projectSchema.find({ status: "In Progress" });
        res.render("Timedefine.html", { available_project: projects });
      });
  } else {
    res.redirect("/");
  }
});
//Savetime user
routeExp.route("/savetime").post(async function (req, res) {
  session = req.session;
  var project = req.body.project;
  var date = moment(req.body.date).format("YYYY-MM-DD");
  var start_time = req.body.start;
  var end_time = req.body.end;
  var task = req.body.task;
  var new_time = {
    m_code: session.m_code,
    num_agent: session.num_agent,
    projects: project,
    date: date,
    time_start: start_time,
    time_end: end_time,
    task: task,
    validation: false,
  };
  mongoose
    .connect(
      "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      await TimesheetsSchema(new_time).save();
     
      for (i=0;i<admins.length;i++){
        sendEmail(
          admins[i].username,
          "Time logged",
          htmlAlert(session.m_code, project)
        );
      }
      res.send("Time for task " + task + " saved");
    });
});

//Generate excel file
routeExp.route("/generate").post(async function (req, res) {
  var newsheet = ExcelFile.utils.book_new();
  newsheet.Props = {
    Title: "Timesheets",
    Subject: "Logged Time",
    Author: "Optimum solution",
  };
  mongoose
    .connect(
      "mongodb+srv://Rica:ryane_jarello5@cluster0.z3s3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      if (request.m_code) {
        data.push([
          "MCODE",
          "Number of Agent",
          "Project Name",
          "Date",
          "Task ",
          "Start Time",
          "End Time",
        ]);
        generate_excel(datatowrite);
        if (newsheet.SheetNames.includes(request.m_code)) {
        } else {
          newsheet.SheetNames.push(request.m_code);
        }
        newsheet.Sheets[request.m_code] = ws;
        hours = 0;
        minutes = 0;
        data = [];
        if (newsheet.SheetNames.length != 0) {
          filename = request.m_code + ".xlsx";
          ExcelFile.writeFile(newsheet, filename);
        }
        delete request.m_code;
        delete request.date;
        delete request.projects;
        delete request.date;
      } else {
        var all_employes = await UserSchema.find({ occupation: "user" });
        for (e = 0; e < all_employes.length; e++) {
          data.push([
            "MCODE",
            "Number of Agent",
            "Project Name",
            "Date",
            "Task ",
            "Start Time",
            "End Time",
          ]);
          request.m_code = all_employes[e].m_code;
          var datanew = [];
          if (date_data.length != 0) {
            for (i = 0; i < datatowrite.length; i++) {
              if (datatowrite[i].m_code == all_employes[e].m_code) {
                datanew.push(datatowrite[i]);
              }
            }
            generate_excel(datanew);
            datanew = [];
          } else {
            datatowrite = await TimesheetsSchema.find(request);
            generate_excel(datatowrite);
          }

          if (newsheet.SheetNames.includes(all_employes[e].m_code)) {
          } else {
            newsheet.SheetNames.push(all_employes[e].m_code);
          }
          newsheet.Sheets[all_employes[e].m_code] = ws;
          hours = 0;
          minutes = 0;
          data = [];
        }
        delete request.m_code;
        delete request.date;
        delete request.projects;
        delete request.date;
        if (newsheet.SheetNames.length != 0) {
          filename = "Timesheets.xlsx";
          ExcelFile.writeFile(newsheet, filename);
        }
      }

      res.send("Done");
    });
});


//download
routeExp.route("/download").get(async function (req, res) {
  session = req.session;
  if (session.occupation_a == "admin") {
    res.download(filename);
  }
});
//logout
routeExp.route("/exit_a").get(function (req, res) {
  session = req.session;
  session.occupation_a = null;
  res.redirect("/");
});
routeExp.route("/exit_u").get(function (req, res) {
  session = req.session;
  session.occupation_u = null;
  session.mcode = null;
  session.num_agent;
  res.redirect("/");
});

//Fonction a employer
//Fonction generate excel
function generate_excel(datatowrites) {
  for (i = 0; i < datatowrites.length; i++) {
    var ligne = [
      datatowrites[i].m_code,
      datatowrites[i].num_agent,
      datatowrites[i].projects,
      datatowrites[i].date,
      datatowrites[i].task,
      datatowrites[i].time_start,
      datatowrites[i].time_end,
    ];
    data.push(ligne);
    calcul_timediff(datatowrites[i].time_start, datatowrites[i].time_end);
  }
  totaltime = hours + "H " + minutes + "MN";
  data.push(["", "", "", "", "", "TOTAL", totaltime]);
  data.push([
    "",
    "",
    "",
    "",
    "",
    "AMOUNT",
    calcul_euro(6.5, hours, minutes).toFixed(2) + " €",
  ]);
  ws = ExcelFile.utils.aoa_to_sheet(data);
  var cellule = ["A", "B", "C", "D", "E", "F", "G"];
  for (c = 0; c < cellule.length; c++) {
    for (i = 1; i <= data.length; i++) {
      if (ws[cellule[c] + "" + i]) {
        if (i == 1) {
          ws[cellule[c] + "" + i].s = {
            font: {
              name: "Times New Roman",
              bold: true,
            },
            border: {
              left: { style: "thin", color: { rgb: "FF000000" } },
              right: { style: "thin", color: { rgb: "FF000000" } },
              top: {
                style: "thin",
                color: { rgb: "FF000000" },
                bottom: { style: "thin", color: { rgb: "FF000000" } },
              },
            },
          };
        } else {
          ws[cellule[c] + "" + i].s = {
            font: {
              name: "Times New Roman",
            },
            border: {
              left: { style: "thin", color: { rgb: "FF000000" } },
              right: { style: "thin", color: { rgb: "FF000000" } },
              top: {
                style: "thin",
                color: { rgb: "FF000000" },
                bottom: { style: "medium", color: { rgb: "FF000000" } },
              },
            },
          };
        }
      }
    }
  }
}

//Function Random code for verification
function randomCode() {
  var code = "";
  let v = "012345678";
  for (let i = 0; i < 6; i++) {
    // 6 characters
    let char = v.charAt(Math.random() * v.length - 1);
    code += char;
  }
  return code;
}

//Function random password for new user
function randomPassword() {
  var code = "";
  let v = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!é&#";
  for (let i = 0; i < 8; i++) {
    // 6 characters
    let char = v.charAt(Math.random() * v.length - 1);
    code += char;
  }
  return code;
}
//Function html render
function htmlRender(username, password) {
  var html =
    "<center><h1>Your Timesheets Authentification</h1>" +
    '<table border="1" style="border-collapse:collapse;width:25%;border-color: lightgrey;">' +
    '<thead style="background-color: #619FCB;color:white;font-weight:bold;height: 50px;">' +
    "<tr>" +
    '<td align="center">Username</td>' +
    '<td align="center">Password</td>' +
    "</tr>" +
    "</thead>" +
    '<tbody style="height: 50px;">' +
    "<tr>" +
    '<td align="center">' +
    username +
    "</td>" +
    '<td align="center">' +
    password +
    "</td>" +
    "</tr>" +
    "</tbody>" +
    "</table>";
  return html;
}
function htmlAlert(user, project) {
  var html =
    "<p> Hello,</p>" +
    "<br>" +
    "<p><b>" +
    project +
    "</b></p>" +
    "<p>Employee with M-CODE : <b>" +
    user +
    "</b> logged a time</p>" +
    "<p>Please check it in a timesheets validation page</p>" +
    "<br>" +
    "<p>Regards</p>";
  return html;
}
function calcul_timediff(startTime, endTime) {
  startTime = moment(startTime, "HH:mm:ss a");
  endTime = moment(endTime, "HH:mm:ss a");
  var duration = moment.duration(endTime.diff(startTime));
  //duration in hours
  hours += parseInt(duration.asHours());

  // duration in minutes
  minutes += parseInt(duration.asMinutes()) % 60;
  while (minutes > 60) {
    hours += 1;
    minutes = minutes - 60;
  }
}
function calcul_euro(euro, hour, minutes) {
  var montanthour = euro * hour;
  var montantminutes = (minutes / 60) * euro;
  var realmontant = montanthour + montantminutes;
  return realmontant;
}
function htmlVerification(code) {
  return (
    "<center><h1>YOUR TIMESHEETS CODE AUTHENTIFICATION</h1>" +
    "<h3 style='width:250px;font-size:50px;padding:8px;background-color:#619FCB; color:white'>" +
    code +
    "<h3></center>"
  );
}
function project_info(searchproject) {
  for (i = 0; i < searchproject.length; i++) {
    calcul_timediff(searchproject[i].time_start, searchproject[i].time_end);
  }
  var amount = calcul_euro(6.5, hours, minutes).toFixed(2) + " €";
  var timepassed = hours + " H : " + minutes + " MN";
  hours = 0;
  minutes = 0;
  var all = timepassed + "," + amount;
  return all;
}
module.exports = routeExp;
