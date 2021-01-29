const Users = require("../users/users-model");

module.exports = {
    validUser,
    uniqueUser
}

function validUser(req, res, next) {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ message: "username and password required" });
    } else {
        next();
    }
}

function uniqueUser(req, res, next) {
    Users.getBy(req.body.username)
        .then(user => {
            if (user) {
                res.status(400).json({ message: "username taken" });
            } else {
                next();
            }
        });
}