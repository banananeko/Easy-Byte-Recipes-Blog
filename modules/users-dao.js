const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

// Need to npm install bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Inserts the given user into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the user.
 * 
 * @param user the user to insert
 */
async function createUser(user) {
    const db = await dbPromise;

    bcrypt.genSalt(saltRounds, async function (err, salt) {

        bcrypt.hash(user.bpassword, salt, async function (err, hash) {
            const result = await db.run(SQL`
            insert into users (username, password, bpassword, avatar, fname, lname, birthday, description) values
            (${user.username}, ${user.password}, ${hash}, ${user.avatar}, ${user.fname}, ${user.lname}, ${user.birthday}, ${user.description})`);
            user.userId = result.lastID;
        });
    });
    // Get the auto-generated ID value, and assign it back to the user object.
}

/**
 * Gets the user with the given id from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {number} id the id of the user to get.
 */
async function retrieveUserById(userId) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where userId = ${userId}`);

    return user;
}

/**
 * Gets the user with the given username and password from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} username the user's username
 * @param {string} password the user's password
 */
async function retrieveUserWithCredentials(username, password) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where username = ${username} and password = ${password}`);
    return user;
}

/**
 * Gets the user with the given authToken from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} authToken the user's authentication token
 */
async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where authToken = ${authToken}`);

    return user;
}

/**
 * Gets the user with the given username from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} username the user's username
 */
async function retrieveUserByUsername(username) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where username = ${username}`);

    return user;
}

/**
 * Gets an array of all users from the database.
 */
async function retrieveAllUsers() {
    const db = await dbPromise;

    const users = await db.all(SQL`select * from users`);

    return users;
}

/**
 * Updates the given user in the database, not including auth token
 * 
 * @param user the user to update
 */
async function updateUser(user) {
    const db = await dbPromise;

    await bcrypt.genSalt(saltRounds, async function (err, salt) {

        await bcrypt.hash(user.bpassword, salt, async function (err, hash) {
            const result = await db.run(SQL`
                update users
                set username = ${user.username}, password = ${user.password}, bpassword = ${hash}, avatar = ${user.avatar},
                fname = ${user.fname}, lname = ${user.lname}, birthday = ${user.birthday}, description = ${user.description},
                authToken = ${user.authToken}
                where userId = ${user.userId}`);

            const newuser = await db.get(SQL`
                select * from users
                where username = ${user.username}`);
            return newuser;
        });
    });
}

/**
* Deletes the user with the given id from the database.
* 
* @param {number} id the user's id
*/
async function deleteUser(userId) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from comments
        where userId = ${userId};`);
    await db.run(SQL`
        delete from favorites
        where userId = ${userId};`);
    await db.run(SQL`
        delete from recipes
        where userId = ${userId};`);
    await db.run(SQL`
        delete from users
        where userId = ${userId};`);
}

// Check if the username has already been taken
async function checkUsername(username) {
    const db = await dbPromise;

    const existUsername = await db.get(SQL`
    select *
    from users
    where username = ${username}`);

    return existUsername;
}



// Export functions.
module.exports = {
    createUser,
    retrieveUserById,
    retrieveUserWithCredentials,
    retrieveUserWithAuthToken,
    retrieveUserByUsername,
    retrieveAllUsers,
    updateUser,
    deleteUser,
    checkUsername
};


