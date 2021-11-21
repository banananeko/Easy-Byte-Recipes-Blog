
Final project &ndash; A personal blogging system &ndash; Starter project
==========
This repository contains a starting point for your team's final project.
Your team should update this README to include the information required, as presented in the project handout available on Canvas. <br>

<strong style="font-size:20px">Team Name: <br></strong> Easy Byte Recipes <br>

<strong style="font-size:20px">What it does: <br></strong> Easy Byte Recipes is a recipe-sharing blogging website where users from around the world can create, find, and comment on recipes. Recipes, at the moment, are categorised into either Starters, Mains and Desserts where it can be sorted by the title, username, and date. When users are logged in, they will be transported to their own personal user homepage which will show a personal greeting alongside the user's favourite recipes. Users that are logged in can then find other recipes that they like and favourite them for future use as they will be displayed at the top of the user's homepage. <br>

For a new user that wishes to sign up, they will have to click on the 'Create New Account' button on the Login page. There, users will need to add their name, date-of-birth, username, password and an avatar. Users have to ensure that their passwords are exactly the same when confirming it. There are additional functionalities with the 'New Account' page such as showing an error message if the username has already been taken, showing an error message if the passwords are not the same and making the submit button inaccessible if users have not filled out the entire form. When the form has been submitted, it will INSERT the new user into our database where the password will be hashed and salted for additional security. <br>

If there are homemade recipes that users would like to publish and share, they can simply sign in and click on the 'add recipe' tab where they can add the name, content (i.e. the ingredients and method) and an optional picture of the final product! By submitting the new recipe, it will INSERT the new recipe into the database where it then can be viewed by anyone that visits the website. Users can also delete their own recipes they've previously added, if they wish to do so. <br>

On the home page, logged in users can access the comments page where they can comment on a particular recipe. They can also upvote or dwonvote certain comments and can delete their own comments. <br>  

Users that wish to update or edit their profile, they can simply click on the 'Edit Profile'. Submitting the new information will UPDATE the database with the user's new information. <br>

<strong style="font-size:20px">Are there any special setup instructions:</strong> <br>
- added uuid package to auth-routes.js to enable authentication of user when loggin in and registering (npm install uuid)
- added a custom handlebar to convert HTML back to text when we display the recipe information via handlebars : <br>
const Handlebars = require("handlebars"); <br>
    Handlebars.registerHelper('encodeMyString',function(inputData){ <br>
    return new Handlebars.SafeString(inputData); <br>
});
- Handlebars.registerHelper( "if_eq",function(operand_1, operator, operand_2, options) { <br>
    let operators = { <br>
     'eq': function(l,r) { return l == r; } <br>
    } <br>
    , result = operators[ operator (operand_1,operand_2); <br>
    if (result) return options.fn(this); <br>
    else  return options.inverse(this); <br>
  });
- added bcrypt package for hashing and salting functionality (npm install bcrypt)
- added quill package for text editing (npm install quill@1.3.6)
- added multer and fs (npm install multer & npm install fs)
- added the sqlite packages (copy folders sqlite and sqlite3 into node_modules)

<strong style="font-size:20px">Existing Username / Password for demo purposes:</strong>

Username: test <br>
Password: test

---
<strong style="font-size:20px">Olga, Yiwei, Abram, Colton</strong>
