//----import packages------------------
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
//--------------------------------------

//----store variable--------------------
const app = express();
const port = 5000;
//--------------------------------------

//----middleware------------------------
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
//--------------------------------------

//---mongo database connection-
const mongo_username = `hashamsaleem75`;
const mongo_password = `f1AGreFY1n2Bxryb`;
const db_url = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.wvpca0x.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(db_url, {
    dbName: "PWA_database",
  })
  .then(() => {
    console.log(`=>database connection is ok`);
  })
  .catch((error) => {
    console.log(`=>error something wnet wrong ${error}`);
  });
//--------------------------------------

//-----mongo data model-----------------
const User = mongoose.model(`users`, {
  userName: String,
  age: Number,
  email: String,
  password: String,
});
//--------------------------------------

// get all user from database
app.get("/api/user/alluser", async (resquest, responce) => {
  try {
    const allUsers = await User.find();
    console.log(allUsers);
    responce.send({
      data: allUsers,
    });
    responce.json({ message: "get api working", data: allUsers });
  } catch (error) {
    console.log(error);
  }
});
/*  ---------------------------------------------------------- */
// add user in database
app.post("/api/user/add", async (resquest, responce) => {
  try {
    const { name, age, email, password } = resquest.body;
    if (!name || !age || !email || !password) {
      throw new error("Data is missing");
    }
    const encriptPasswprd = btoa(password);
    let newUser = new User({
      userName: name,
      age: age,
      email: email,
      password: encriptPasswprd,
    });
    newUser
      .save()
      .then(() => {
        console.log("user added");
        return responce.status(200).send({
          type: "post",
          message: "user added",
        });
      })
      .catch((error) => {
        console.log("=>error", error);
      });
  } catch (error) {
    responce
      .json({
        err: error,
        type: "post",
      })
      .status(400);
  }
});

//server listing to port----------------
app.listen(port, () => {
  console.log(`=>sever start`);
});
//--------------------------------------
