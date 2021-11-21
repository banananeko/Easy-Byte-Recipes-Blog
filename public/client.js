window.addEventListener("load", function () {
    //add to favourites - home
    document.querySelectorAll('.add_remove_to_favourites')
        .forEach(input => input.addEventListener('click', AddOrRemoveFavourites));

    // Add/ remove favourites 
    async function AddOrRemoveFavourites(event) {
        let recipeId = event.target.getAttribute("data-recipeid");
        let userId = event.target.getAttribute("data-userid");

        let action = "remove";
        if (userId == "") {
            action = "add";
        }

        fetch(`./Favorites?recipeId=${recipeId}&action=${action}`).then(
            async (data) => {
                data = await data.json()
                if (data.userLoggedIn == false) {
                    window.location = '/login';
                }
                else {
                    if (data.favouritesAdded == true) {
                        document.querySelector("img[data-recipeid='" + data.recipeId + "']").setAttribute("data-userId", data.userId);
                        document.querySelector("img[data-recipeid='" + data.recipeId + "']").src = "./images/full_heart.png";
                    }
                    else {
                        document.querySelector("img[data-recipeid='" + data.recipeId + "']").setAttribute("data-userId", "");
                        document.querySelector("img[data-recipeid='" + data.recipeId + "']").src = "./images/empty_heart.png";
                    }
                }
            }
        );
    }

    //add to favourites - userhome
    document.querySelectorAll('.remove_from_favourites')
        .forEach(input => input.addEventListener('click', RemoveFromFavourites));

    async function RemoveFromFavourites(event) {
        let recipeId = event.target.getAttribute("data-recipeid");
        fetch(`./RemoveFavorites?recipeId=${recipeId}`).then(
            async (data) => {
                data = await data.json()
                if (data.favouritesRemoved == true) {
                    window.location = '/userhome';
                }
            }
        );
    }

    //check if submit button is present, this code is used for login page only
    if (document.getElementById("submit") !== null) {
        const usernameInput = document.querySelector("#txtUsername");
        let userNameValid = false;
        let passwordValid = false;

        document.querySelector("#submit").disabled = true;
        if (usernameInput) {
            // The first step in the client side
            usernameInput.addEventListener("change", function () {
                // Get the username input 
                let usernameValue = usernameInput.value;
                // Use then() to solve the problem of a response object cannot be converted into json object
                fetch(`./checkUsername?name=${usernameValue}`).then(
                    async (data) => {
                        // Check the status and userFound boolean together
                        // if the username has been taken
                        if (data.status === 200) {
                            // Convert into a JSON object
                            data = await data.json()
                            if (data.userFound) {
                                document.querySelector("#usernameError").innerText = "Username has been taken!";
                                document.querySelector("#submit").disabled = true;
                                userNameValid = false;
                            }
                            // if the username is unique
                        } else if (data.status === 404) {
                            data = await data.json()
                            if (!data.userFound) {
                                document.querySelector("#usernameError").innerText = "";
                                userNameValid = true;
                                if (userNameValid && passwordValid) {
                                    document.querySelector("#submit").disabled = false;
                                }
                            } // Need to erase the previous error message
                        }
                    }
                );
            })
        }

        const passwordE = document.querySelector("#txtPassword");
        const rePasswordE = document.querySelector("#txtRePassword");
        if (rePasswordE) {

            rePasswordE.addEventListener("keyup", function () {
                let passwordValue = passwordE.value;
                let rePasswordValue = rePasswordE.value;
                // If the two passwords do not match, give the error message
                if (passwordValue !== rePasswordValue) {
                    document.querySelector("#passwordError").innerText = "Passwords not match!";
                    passwordValid = false;
                    document.querySelector("#submit").disabled = true;
                } else {
                    document.querySelector("#passwordError").innerText = "";
                    passwordValid = true;
                    if (userNameValid && passwordValid) {
                        document.querySelector("#submit").disabled = false;
                    }
                }
            });
        }
        if (passwordE) {

            //in case user enter 're-enter password' before enter 'password'
            passwordE.addEventListener("keyup", function () {
                let passwordValue = passwordE.value;
                let rePasswordValue = rePasswordE.value;

                // If the two passwords do not match, give the error message
                if (passwordValue !== rePasswordValue) {
                    document.querySelector("#passwordError").innerText = "Passwords not match!";
                    passwordValid = false;
                    document.querySelector("#submit").disabled = true;
                } else {
                    document.querySelector("#passwordError").innerText = "";
                    passwordValid = true;
                    if (userNameValid && passwordValid) {
                        document.querySelector("#submit").disabled = false;
                    }
                }
            });
        }
    }


    const loginForm = document.querySelector("#login-form");
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            // any default action normally taken by the implementation as a result of the event will not occur
            e.preventDefault();
            // convert form data to json object
            const formData = new FormData(loginForm);
            const object = {};
            formData.forEach(function (value, key) {
                object[key] = value;
            });
            // convert json object to string
            const formJson = JSON.stringify(object);

            fetch('/login', {
                method: 'POST',
                redirect: 'manual',
                // set original media type of the resource to JSON type
                // send to the server that  JSON content type is understandable by the client
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: formJson
            }).then(res => { // get response from server (.then())
                if (res.status === 204) {
                    setTimeout(function () { document.location.href = "userhome"; }, 250);
                    return;
                } else if (res.status === 401) {
                    window.location = res.url + '?message=unauthorised';
                    return;
                }
            });
        })
    }

    // Select avatars
    const slothAvatar = document.querySelector("#editSloth");
    const avoAvatar = document.querySelector("#editAvo");
    const coffeeAvatar = document.querySelector("#editCoffee");
    const bearAvatar = document.querySelector("#editBear");
    const batmanAvatar = document.querySelector("#editBatman");

    const editForm = document.querySelector("#editForm");
    if (editForm) {

        fetch(`./getUser`).then(async res => {
            let user = await res.json();
            user = user.user;
            if (slothAvatar && user.avatar === 'sloth.png') {
                slothAvatar.checked = true;

            }

            if (avoAvatar && user.avatar === 'avo.webp') {
                avoAvatar.checked = true;

            }

            if (coffeeAvatar && user.avatar === 'coffee.webp') {
                coffeeAvatar.checked = true;

            }

            if (bearAvatar && user.avatar === 'bear.png') {
                bearAvatar.checked = true;

            }

            if (batmanAvatar && user.avatar === 'batman.webp') {
                batmanAvatar.checked = true;

            }

        });

    }


    // ----------- Upvote incrementation ---------
    let likebtn = document.querySelectorAll("#likebtn");
    for (let i = 0; i < likebtn.length; i++) {

        let clicked = false;

        let input1 = likebtn[i].nextElementSibling;
        likebtn[i].addEventListener("click", () => {
            if (!clicked) {
                clicked = true;
                input1.value = parseInt(input1.value) + 1;
            } else {
                clicked = false;
                input1.value = parseInt(input1.value) - 1;
            }
        });


    }
    // Dislike button
    let dislikebtn = document.querySelectorAll("#dislikebtn");
    for (let i = 0; i < dislikebtn.length; i++) {
        let clicked = true;

        let input1 = likebtn[i].nextElementSibling;
        dislikebtn[i].addEventListener("click", () => {
            if (!clicked) {
                clicked = true;
                input1.value = parseInt(input1.value) + 1;
            } else {
                clicked = false;
                input1.value = parseInt(input1.value) - 1;
            }
        });
    }


    //add recipe
    const addRecipe = document.querySelector("#addRecipe");
    if (addRecipe) {
        addRecipe.addEventListener('submit', async (e) => {
            // any default action normally taken by the implementation as a result of the event will not occur
            e.preventDefault();
            document.querySelector("#ingredientsError").innerText = "";
            document.querySelector("#methodError").innerText = "";

            if (recipe_ingredients.getText().trim().length === 0) {
                document.querySelector("#ingredientsError").innerText = "Recipe ingredients are required!";
            }
            else if (recipe_method.getText().trim().length === 0) {
                document.querySelector("#methodError").innerText = "Recipe method is required!";
            }
            else {
                var ingredients = document.querySelector('#recipe_ingredients')
                var method = document.querySelector('#recipe_method')
                const object = {
                    recipe_name: document.querySelector('input[name=recipe_name]').value,
                    recipe_category: document.querySelector('select[name=recipe_category]').value,
                    recipe_ingredients: ingredients.children[0].innerHTML,
                    recipe_method: method.children[0].innerHTML,
                };
                // convert json object to string
                const formJson = JSON.stringify(object);
                const filenameCache = document.querySelector('input[name=filenamecache]').value


                fetch(`/test?filename=${filenameCache}`, {
                    method: 'POST',
                    redirect: 'manual',
                    // set original media type of the resource to JSON type
                    // send to the server that  JSON content type is understandable by the client
                    headers: {
                        "Content-type": "application/json",
                        'Accept': 'application/json'
                    },
                    body: formJson
                }).then(res => { // get response from server (.then())
                    if (res.status === 204) {
                        setTimeout(function () { document.location.href = "/userhome?message=Recipe created successfully"; }, 250);
                        return;
                    } else if (res.status === 401) {
                        window.location = res.url + '?message=Recipe creation failed. Please try again.';
                        return;
                    }
                });
            }
        })
    }

    //delete recipe
    document.querySelectorAll('.delete_recipe')
        .forEach(input => input.addEventListener('click', DeleteRecipe));

    async function DeleteRecipe(event) {
        let recipeId = event.target.getAttribute("data-recipeid");
        fetch(`./deleteRecipe?recipeId=${recipeId}`).then(
            async (data) => {
                data = await data.json()
                if (data.recipeDeleted == true) {
                    window.location = '/userhome?message=Recipe deleted successfully';
                }
            }
        );
    }

    // Show all current comments in db of one recipe
    const commentIcons = document.querySelectorAll("#commentIcon");



    //Add comments
    document.querySelectorAll('#pencilIcon')
        .forEach(input => input.addEventListener('click', viewComments));

    async function viewComments(event) {
        let recipeId = event.target.getAttribute("data-recipeid");
        window.location = '/addComment?recipeId=' + recipeId;
    }

    const addComment = document.querySelector("#addComment");
    if (addComment) {
        addComment.addEventListener('submit', async (e) => {
            // any default action normally taken by the implementation as a result of the event will not occur
            e.preventDefault();

            const object = {
                recipeId: document.querySelector('input[name=recipeId]').value,
                content: document.querySelector('textarea[name=content]').value
            };

            // convert json object to string
            const formJson = JSON.stringify(object);
            fetch(`./addComment?recipeId=${object.recipeId}`, {
                method: 'POST',
                redirect: 'manual',
                // set original media type of the resource to JSON type
                // send to the server that  JSON content type is understandable by the client
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: formJson
            }).then(res => { // get response from server (.then())
                if (res.status === 204) {
                    setTimeout(function () { window.location = res.url + "&message=Comments added successfully"; }, 250);
                    return;
                } else if (res.status === 401) {
                    window.location = res.url + '&message=Comment creation failed. Please try again.';
                    return;
                }
            });
        })
    }

    // Delete comments
    document.querySelectorAll('.delete_comment')
        .forEach(input => input.addEventListener('click', deleteComments));

    async function deleteComments(event) {
        let commentId = event.target.getAttribute("data-commentid");
        let recipeId = event.target.getAttribute("data-recipeid");
        let authorId = event.target.getAttribute("data-authorid");

        fetch(`./deleteComment?recipeId=${recipeId}&commentId=${commentId}&authorId=${authorId}`).then(
            async (data) => {
                data = await data.json()
                if (data.userLoggedIn == false) {
                    window.location = '/login';
                }
                else {
                    if (data.commentDeleted == true) {
                        window.location = '/addComment?recipeId=' + data.recipeId + '&message=Comment deleted successfully';
                    }
                }
            }
        );
    }

    /* Pseudocode for deleting account
       1. Create a dao method for deleting account (users-dao.js)
       2. Create a route handler calling the dao method and pass the json result and status code to client - router.delete("/deleteUser") (auth-routes.js)
       3. Add event listener to "Delete Account" button;
       4. Get userId by using  fetch(`./getUser`).then(async res => {
                let user = await res.json();
                fetch("/deleteUser", {method: 'DELETE'}).then(async res => {
                    check status, if succeed redirect to logout
                    else throw error message
                })
           });
    */
    // delete account
    const deleteBtn = document.querySelector("#deleteAccountBtn");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
            const endpoint = `/deleteUser`;
            fetch(endpoint, {
                method: 'DELETE'
            })
                .then(res => { // get response from server (.then())
                    if (res.status === 204) {
                        setTimeout(function () { document.location.href = "/"; }, 250);
                        return;
                    } else if (res.status === 401) {
                        window.location = res.url + '?message=Unauthorised';
                        return;
                    }
                });
        });
    }
});