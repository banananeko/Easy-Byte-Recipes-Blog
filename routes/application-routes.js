const express = require("express");
const router = express.Router();

// //upload image start
// // Setup fs
const fs = require("fs");

// Setup multer (files will temporarily be saved in the "images" folder).
const path = require("path");
const multer = require("multer");
const upload = multer({
    dest: path.join(__dirname, "images")
});
//upload image end

const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const recipesDao = require("../modules/recipes-dao.js");

//this handlebars helper is used to decode html code into a text
const Handlebars = require("handlebars");
Handlebars.registerHelper('encodeMyString', function (inputData) {
    return new Handlebars.SafeString(inputData);
});
//this handlebars helper is used to compare if logged in user id is equal to author id of the recipe
Handlebars.registerHelper("if_eq", function (operand_1, operator, operand_2, options) {
    let operators = {
        'eq': function (l, r) { return l == r; }
    }
        , result = operators[operator](operand_1, operand_2);

    if (result) return options.fn(this);
    else return options.inverse(this);
});

// Sort recipes
router.get("/", async function (req, res) {
    let user = res.locals.user;
    let userId = null;
    if (user) {
        userId = res.locals.user.userId;
    }

    let sortby = req.query.sortby;


    //load recipes
    const recipes_starters = await recipesDao.retrieveRecipes(1, userId, sortby); //1 = starter
    res.locals.recipes_starters = recipes_starters;

    const recipes_mains = await recipesDao.retrieveRecipes(2, userId, sortby); //2 = mains
    res.locals.recipes_mains = recipes_mains;

    const recipes_desserts = await recipesDao.retrieveRecipes(3, userId, sortby); //3 = desserts
    res.locals.recipes_desserts = recipes_desserts;

    res.locals.message = req.query.message;
    res.render("home");
});

// Add favorites
router.get("/Favorites", async function (req, res) {
    let user = res.locals.user;
    if (user) {
        if (req.query.action == "add") {
            await recipesDao.addFavorites(res.locals.user.userId, req.query.recipeId);
            res.json({ favouritesAdded: true, recipeId: req.query.recipeId, userId: res.locals.user.userId })
        }
        else {
            await recipesDao.removeFavorites(res.locals.user.userId, req.query.recipeId);
            res.json({ favouritesAdded: false, recipeId: req.query.recipeId, userId: res.locals.user.userId })
        }
    }
    else {
        res.json({ userLoggedIn: false });
    }
});

// Remove favorites
router.get("/RemoveFavorites", async function (req, res) {
    let user = res.locals.user;
    if (user) {
        await recipesDao.removeFavorites(user.userId, req.query.recipeId);
        res.json({ favouritesRemoved: true });
    }
});

// Retrieve favorites for user home
router.get("/userhome", async function (req, res) {
    let user = res.locals.user;
    if (user) {
        const favorites = await recipesDao.retrieveFavoritesByUserId(user.userId);
        res.locals.favorites = favorites;

        const myrecipes = await recipesDao.retrieveRecipesByUserId(user.userId);
        res.locals.myrecipes = myrecipes;

        res.locals.message = req.query.message;
        res.render("user_home");
    }
});

// Upload recipes. Need to use "test", other names won't work...
router.post("/test", async function (req, res) {

    const recipe = {
        recipe_name: req.body.recipe_name,
        recipe_category: req.body.recipe_category,
        recipe_ingredients: req.body.recipe_ingredients,
        recipe_method: req.body.recipe_method,
        image: req.query.filename
    };

    try {
        await recipesDao.addRecipe(recipe, res.locals.user.userId);
        res.status(204).json();
    }
    catch (err) {
        res.status(401).json();
    }

});

// Add recipe
router.get("/addRecipe", function (req, res) {
    res.locals.message = req.query.message;
    res.locals.filename = req.query.filename;
    res.render("add_recipe");
});

// Upload image file
router.post("/uploadFile", upload.single("recipe_picture"), function (req, res) {

    const fileInfo = req.file;
    // Move the file somewhere more sensible
    const oldFileName = fileInfo.path;
    const newFileName = `./public/images/${fileInfo.originalname}`;
    fs.renameSync(oldFileName, newFileName);

    // send filename to handlebar after uploaded
    res.redirect(`/addrecipe?filename=${fileInfo.originalname}`);

});

// Delete recipe
router.get("/deleteRecipe", async function (req, res) {
    let user = res.locals.user;
    if (user) {
        await recipesDao.deleteRecipe(user.userId, req.query.recipeId);
        res.json({ recipeDeleted: true });
    }
});

// --------- Comments ------------ 
router.get("/comments", async function (req, res) {
    // res.locals.message = req.query.message;
    res.render("comments");
});

// Construct the structure and then display the comments in handlebars using three each loops.
router.get("/addComment", async function (req, res) {
    let user = res.locals.user;
    if (user) {
        res.locals.loggedInUserId = res.locals.user.userId;
        const recipe = await recipesDao.retrieveRecipe(req.query.recipeId);
        res.locals.recipe = recipe;
        const comments = await recipesDao.retrieveCommentsByRecipeId(req.query.recipeId);
        const apiData = comments;
        let output = [], pArr = [{ arr: output, commentId: 0 }];
        for (let el of apiData) {

            let idx = pArr.findIndex(p => p.commentId === el.parentCommentId);
            if (!Array.isArray(pArr[idx].arr)) { pArr[idx].arr = pArr[idx].arr.children = [] }
            pArr[idx].arr.push(nv = Object.assign({}, el))
            pArr[++idx] = { arr: nv, commentId: el.commentId }

        }
        res.locals.comments = output;
        res.locals.message = req.query.message;
        res.render("comments");
    }
    else {
        res.redirect("/login");
    }
});

// Add comment
router.post("/addComment", async function (req, res) {
    let user = res.locals.user;
    if (user) {
        const comment = {
            recipeId: req.body.recipeId,
            content: req.body.content,
            parentCommentId: 0
        };

        try {
            await recipesDao.addComment(comment, res.locals.user.userId);
            res.status(204).json();
        }
        catch (err) {
            res.status(401).json();
        }
    }
});

// Delete comment
router.get("/deleteComment", async function (req, res) {
    let user = res.locals.user;
    if (user) {
        if (req.query.authorId = res.locals.user.userId) {
            await recipesDao.deleteComment(req.query.commentId);
            res.json({ commentDeleted: true, userLoggedIn: true, recipeId: req.query.recipeId })
        }
    }
    else {
        res.json({ userLoggedIn: false });
    }
});

// Render home page
router.get("/", verifyAuthenticated, async function (req, res) {
    res.locals.title = "Easy Byte Recipes";
    res.render("home");
});

module.exports = router;