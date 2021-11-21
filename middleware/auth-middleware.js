const userDao = require("../modules/users-dao.js");

// Access all user data
async function addUserToLocals(req, res, next) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    // You can use "user" in every where now (e.g. handlebars: {{user.username}}; route handler: res.locals.user)
    res.locals.user = user;
    next();
}

// Verify authentication
function verifyAuthenticated(req, res, next) {
    if (res.locals.user) {
        next();
    }
    else {
        res.redirect("./login");
    }
}

module.exports = {
    addUserToLocals,
    verifyAuthenticated
}