const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

router.post("/signup", async (req, res) => {
  console.log(req.body);
  let result = await userController.addUser(req.body);
  console.log(result);
  if (result.status) {
    let payload = {
      email: result.user.email,
    };
    let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });
    console.log("access token is: ", token);
    let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
    });
    console.log("refresh token is: ", refreshToken);
    refreshTokens.push(refreshToken);
    res.status(201).json({ access_token: token, refresh_token: refreshToken });
  } else {
    res.status(400).json(result.result);
  }
});

router.post("/token", async (req, res) => {
  const { token, email } = req.body;
  console.log('token is: ', token);
  console.log('email is: ', email);
  if (!token || !refreshTokens.includes(token)) { 
    res.send(403);
  } else {
    try {
      let payload = { email: email };
      let newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
      });
      console.log("newly generated access token", newAccessToken);
      res.status(201).json({ access_token: newAccessToken });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  }
});

router.post("/login", async (req, res) => {
  console.log("reached the router");
  console.log(req.body);
  let result = await userController.loginUser(req.body);
  if (result.status) {
    console.log(result.result);
    let payload = {
      email: result.result.email,
    };
    let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });
    console.log(token);
    let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
    });
    refreshTokens.push(refreshToken);
    res.status(201).json({ access_token: token, refresh_token: refreshToken });
  } else {
    res.status(400).json(result.result);
  }
});

router.post("/logout", async(req, res) => {
  console.log(req.body);
  let {refreshToken} = req.body;
  console.log(refreshToken);
  let refreshTokenIndex = refreshTokens.findIndex(e => e === refreshToken);
  console.log({refreshTokenIndex});
  if(refreshTokenIndex !== -1){
    refreshTokens.splice(refreshTokenIndex,1);
  }
  res.status(201).send("User is logged out");
})

module.exports = router;