const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

const usersDao = require("../modules/users-dao.js");

let bodyParser = require('body-parser');
const { route } = require("./application-routes.js");

let newFileName;

router.use(bodyParser.json());

// Get login page
router.get("/login", function (req, res) {

    if (res.locals.user) {
        res.redirect("/userhome");
    }

    else {
        res.locals.message = req.query.message;
        res.render("login");
    }

});

// Send login details
router.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Find a matching user in the database
    const user = await usersDao.retrieveUserWithCredentials(username, password);
    // if there is a matching user...
    if (user) {
        // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
        const authToken = uuid();
        user.authToken = authToken;
        await usersDao.updateUser(user);
        res.cookie("authToken", authToken);
        res.locals.user = user;
        res.status(204).json();
    }
    // Otherwise, if there's no matching user...
    else {
        // Auth fail
        res.locals.user = null;
        res.status(401).json();
    }
});

// Account creation
router.get("/newAccount", function (req, res) {
    res.locals.message = req.query.message;
    res.render("new-account");
})

// Send account details
router.post("/newAccount", async function (req, res) {
    const user = {
        username: req.body.username,
        password: req.body.password,
        bpassword: req.body.repassword,  // should change to bcrypt password later
        avatar: req.body.avatar,
        fname: req.body.fname,
        lname: req.body.lname,
        birthday: req.body.birthday,
        description: req.body.description
    };

    try {
        await usersDao.createUser(user);
        res.redirect("/login?message=Account creation successful. Please login using your new credentials.");
    }
    catch (err) {
        res.redirect("/newAccount?message=Account creation failed. Please try again.");
    }

});


// logout from home page
router.get("/logouthome", function (req, res) {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.redirect("/?message=Successfully logged out!");
});

// logout from user home page
router.get("/logoutuser", function (req, res) {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.redirect("/?message=Successfully logged out!");
});

// Check if the username is taken - the second step in the server
router.get("/checkUsername", async function (req, res) {
    // What goes in checkUsername()???
    const user = await usersDao.checkUsername(req.query.name);
    if (user) {
        res.status(200).json({ userFound: true })
    } else {
        res.status(404).json({ userFound: false })
    }
});


// Edit profile
router.get("/editprofile", function (req, res) {
    res.locals.message = req.query.message;
    res.render("edit_profile");
});

// Send profile information 
router.post("/editprofile", async function (req, res) {
    let user = res.locals.user;
    user.username = req.body.editUsername;
    user.password = req.body.editPassword;
    user.bpassword = req.body.editPassword;
    user.avatar = req.body.editAvatar;
    user.fname = req.body.editFirstName;
    user.lname = req.body.editLastName;
    user.birthday = req.body.editBirthday;
    user.description = req.body.editDescription;

    try {
        let newuser = await usersDao.updateUser(user);
        setTimeout(function () { res.redirect("/userhome?message=Edit profile successful."); }, 250);
    }
    catch (err) {
        res.redirect("/editprofile?message=Edit profile failed. Please try again.");
    }
});

// Get user information
router.get("/getUser", function (req, res) {
    const user = res.locals.user;
    res.status(200).json({ user });
});


// Delete user
router.delete("/deleteUser", async function (req, res) {
    try {
        await usersDao.deleteUser(res.locals.user.userId);
        res.clearCookie("authToken");
        res.locals.user = null;
        res.status(204).json();
    }
    catch (err) {
        res.status(401).json();
    }
});

module.exports = router;