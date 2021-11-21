const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

// Add/ remove favorites
async function addFavorites(userId, recipeId) {
    const db = await dbPromise;

    await db.run(SQL`
    insert or ignore into favorites (userId, recipeId) 
    values (${userId}, ${recipeId})`);
}

async function removeFavorites(userId, recipeId) {
    const db = await dbPromise;

    await db.run(SQL`
    delete from favorites where userId=${userId} and recipeId=${recipeId}`);
}

// Sorting recipes

async function retrieveRecipes(categoryId, userId, sortby) {
    const db = await dbPromise;


    // Change start
    let recipes;
    if (sortby == "title") {
        recipes = await db.all(SQL`
        select 
        r.*,
        f.userId,
        u.username
        from 
        recipes as r
        inner join users as u on r.userId = u.userId
        left join favorites as f on r.recipeId = f.recipeId and f.userId = ${userId}
        where
        categoryId = ${categoryId}
        order by r.title asc`);

    } else if (sortby == "username") {

        recipes = await db.all(SQL`
        select 
        r.*,
        f.userId,
        u.username
        from 
        recipes as r
        inner join users as u on r.userId = u.userId
        left join favorites as f on r.recipeId = f.recipeId and f.userId = ${userId}
        where
        categoryId = ${categoryId}
        order by u.username asc`);

    } else {

        recipes = await db.all(SQL`
        select 
        r.*,
        f.userId,
        u.username
        from 
        recipes as r
        inner join users as u on r.userId = u.userId
        left join favorites as f on r.recipeId = f.recipeId and f.userId = ${userId}
        where
        categoryId = ${categoryId}
        order by r.recipeId desc`);
    }

    return recipes;
}

async function retrieveFavoritesByUserId(userId) {
    const db = await dbPromise;

    const favorites = await db.all(SQL`
    select 
    u.userId,
    u.username,
    r.recipeId,
    r.title,
    r.ingredients,
    r.method,
    r.image
    from 
    favorites as f
	inner join recipes as r on r.recipeId = f.recipeId
    inner join users as u on r.userId = u.userId
    where f.userId = ${userId}
    order by f.date desc`);

    return favorites;
}

async function retrieveRecipesByUserId(userId) {
    const db = await dbPromise;

    const recipes = await db.all(SQL`
    select 
    r.*,
    u.username
    from 
    recipes as r
    inner join users as u on r.userId = u.userId
    where
    r.userId = ${userId}
    order by r.recipeId`);

    return recipes;
}

// Add/ delete recipes
async function addRecipe(recipe, userId) {
    const db = await dbPromise;


    const result = await db.run(SQL`
    insert into recipes (title, ingredients, method, image, userId, categoryId) values
    (${recipe.recipe_name}, ${recipe.recipe_ingredients}, ${recipe.recipe_method}, ${recipe.image},
        ${userId}, ${recipe.recipe_category})`);

    recipe.recipeId = result.lastID;
}

async function deleteRecipe(userId, recipeId) {
    const db = await dbPromise;

    await db.run(SQL`delete from recipes where recipeId = ${recipeId} and userId = ${userId}`);
}

// Retrieve/ add / delete comments
async function getAllComments(recipeId) {
    const db = await dbPromise;

    const allComments = await db.all(SQL`
    select *
    from comments
    where recipeId = ${recipeId};`);

    return allComments;
}
//for comments page
async function retrieveCommentsByRecipeId(recipeId) {
    const db = await dbPromise;

    const comments = await db.all(SQL`
    select 
	c.*,
	u.fname,
	u.lname,
    r.userId as authorId
    from 
    recipes as r
	inner join users as u on u.userId = c.userId
    inner join comments as c on r.recipeId = c.recipeId
    where r.recipeId = ${recipeId}`);

    return comments;
}

async function addComment(comment, userId) {
    const db = await dbPromise;

    const result = await db.run(SQL`
    insert into comments (parentCommentId ,content, userId, recipeId, nestingLevel) values
    (0, ${comment.content}, ${userId}, ${comment.recipeId}, 1)`);

    comment.commentId = result.lastID;
}

async function retrieveRecipe(recipeId) {
    const db = await dbPromise;

    const recipe = await db.all(SQL`
    select 
    r.*,
    u.username
    from 
    recipes as r
    inner join users as u on r.userId = u.userId
    where
    r.recipeId = ${recipeId}`);

    return recipe;
}

async function deleteComment(commentId) {
    const db = await dbPromise;

    await db.run(SQL`delete from comments where commentId = ${commentId}`);
}

// Export functions.
module.exports = {
    retrieveRecipes,
    addFavorites,
    removeFavorites,
    retrieveFavoritesByUserId,
    retrieveRecipesByUserId,
    addRecipe,
    deleteRecipe,
    getAllComments,
    retrieveCommentsByRecipeId,
    addComment,
    retrieveRecipe,
    deleteComment
};


