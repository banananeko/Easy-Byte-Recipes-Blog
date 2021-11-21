/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */

drop table if exists comments;
drop table if exists favorites;
drop table if exists recipes;
drop table if exists users;
drop table if exists categories;
drop table if exists vote;


create table users (
    userId integer not null primary key,
	username varchar(200) not null,
	password varchar(64) not null,
	bpassword varchar(64) not null,
	avatar varchar(100) not null,
	fname varchar(100) not null,
	lname varchar(100) not null,
	birthday date not null,
	description text not null,
	authToken varchar(128)
);

create table categories (
	categoryId integer not null primary key,
	name varchar(50) not null,
	description text not null
);

create table recipes (
	recipeId integer not null primary key AUTOINCREMENT,
	title text not null,
	ingredients text not null,
	method text not null,
	image text,
	userId integer not null,
	categoryId integer not null,
	FOREIGN key (userId) REFERENCES users (userId),
	FOREIGN key (categoryId) REFERENCES categories (categoryId)
);

create table comments (
	commentId integer not null primary key AUTOINCREMENT,
	parentCommentId integer,
	content text not null,
	nestingLevel integer not null,
	dateCommented datetime not null DEFAULT current_timestamp,
	userId integer not null,
	recipeId integer not null,
    upArrow INTEGER NOT NULL DEFAULT 0,
	downArrow INTEGER NOT NULL DEFAULT 0,
	FOREIGN key (userId) REFERENCES users (userId),
	FOREIGN key (recipeId) REFERENCES recipes (recipeId)
);

create table favorites (
	userId integer not null,
	recipeId integer not null,
	date datetime NOT NULL DEFAULT current_timestamp,
	primary key (userId, recipeId),
	FOREIGN key (userId) REFERENCES users (userId),
	FOREIGN key (recipeId) REFERENCES recipes (recipeId)
);

CREATE TABLE vote (
	authorId INTEGER,
	commentId INTEGER,
	upOrDown char(1),
	PRIMARY KEY (authorId, commentId),
	FOREIGN KEY (authorId) REFERENCES users (userId),
	FOREIGN KEY (commentId) REFERENCES comments (commentId)
);

insert into users (username, password, bpassword, avatar, fname, lname, birthday, description) VALUES
('username1', 'abc123', 'abc123', '', 'Abram', 'Goh', '2000-01-01', 'This is Abram!'),
('username2', 'efg456', 'efg456', '', 'Colton', 'Randall', '2000-02-02', 'I am Colton!'),
('username3', 'hij789', 'hij789', '', 'Olga', 'Hoxha', '2000-03-03', 'This is Olga!'),
('banananeko', 'klm100', 'klm100', '', 'Yiwei', 'Li', '2000-04-04', 'I am Yiwei!');

insert into categories (name, description) VALUES
('Starters', 'Starters consist of a wide variety of hot or cold dishes served before the main course of a meal. As part of a formal dinner, they may be preceded by soup and hors d''oeuvres.'),
('Mains', 'A main course is the featured or primary dish in a meal consisting of several courses. It usually follows the entrée course.'),
('Desserts', 'Dessert is a course that concludes a meal.');

insert into recipes (title, ingredients, method, image, userId, categoryId) VALUES
('Duck & orange salad', '<li>2 x 150 g duck breast fillets , skin on</li>
                    <li>1 baguette</li>
                    <li>15 g shelled unsalted walnut halves</li>
                    <li>3 regular oranges , or blood oranges</li>
                    <li>30 g watercress</li>', '<li>Score the duck skin, rub all over with sea salt and black pepper, then place skin side down in a large non-stick frying pan on a medium-high heat.</li>
                    <li>Sear for 6 minutes, or until the skin is dark golden, then turn and cook for 5 minutes, or to your liking. Remove to a board to rest, leaving the pan on the heat.</li>
                    <li>Slice 10 thin slices of baguette (keeping the rest for another day).Place in the hot pan with the walnuts to toast and get golden in the duck fat, then remove and arrange the toasts on your plates.</li>
                    <li>Meanwhile, top and tail the oranges, cut away the peel, then finely slice into rounds (removing any pips).</li>
                    <li>Finely slice the duck, place on the toasts, dotting any extra slices in between, then add the oranges in and around.</li>
                    <li>Dress the watercress with any resting juices on the board, then sprinkle over. Finely grate or crumble over the walnuts, sprinkle from a height with a little extra seasoning, and serve.</li>', 'recipe1.jpg', 1, 1),
('Sweet potato, coconut & cardamom soup', '<li>3 green cardamom pods</li>
                    <li>1 onion</li>
                    <li>600 g sweet potato</li>
                    <li>4cm piece of ginger</li>
                    <li>2 cloves of garlic</li>
                    <li>2 tablespoons groundnut oil</li>
                    <li>1 x 400 ml tin of low-fat coconut milk</li>
                    <li>800 ml organic vegetable or chicken stock</li>
                    <li>1 lemon</li>
                    <li>1 tablespoon groundnut oil</li>
                    <li>1 teaspoon coriander seeds</li>
                    <li>1 pinch of dried chilli flakes</li>
                    <li>4 large or 12 mini poppadoms , optional</li>
                    <li>2 jarred roasted peppers</li>
                    <li>100 g baby spinach</li>', '<li>Bruise the cardamom pods and shake out the seeds, then roughly crush them with a pestle and mortar.</li>
                    <li>Peel and chop the onion and sweet potato, peel and finely grate the ginger, then peel and crush the garlic.</li>
                    <li>Heat the oil in a large pan over a low heat. Add the onion and a small pinch of sea salt and cook for 10 minutes, or until soft and sweet, stirring often.</li>
                    <li>Stir in the sweet potato, ginger, garlic and crushed cardamom seeds. Cook for 2 minutes, before adding the coconut milk.</li>
                    <li>Let it simmer for 1 to 2 minutes, then stir in the stock. Cover with a lid, and leave to simmer gently for 15 minutes.</li>
                    <li>Liquidise the soup with a stick blender until smooth, then season to taste with a pinch of salt and black pepper and a squeeze of lemon juice.</li>
                    <li>To make the red pepper topping, heat the oil in a frying pan, then roughly crush and add the coriander seeds and add the chilli flakes. Cook for 1 minute, or until lovely and fragrant.</li>
                    <li>In a dry pan, toast the coconut flakes (if using).</li>
                    <li>Rinse and finely slice the peppers, then add to the spices with the spinach. Continue cooking until the spinach has wilted down, then season and stir in the toasted coconut flakes.</li>
                    <li>Ladle the soup into bowls, finishing with a dollop of red pepper topping, then serve with broken up pieces of poppadoms on the side, if you like.</li>', 'recipe2.jpg', 2, 1),
('Japanese-inspired seafood salad', '<li>1 squid, cleaned, from sustainable sources</li>
                    <li>olive oil</li>
                    <li>½ tablespoon soy sauce</li>
                    <li>250 g cooked octopus, from sustainable sources</li>
                    <li>8 large cooked peeled prawns, from sustainable sources</li>
                    <li>1 generous handful of salad leaves</li>
                    <li>1 small handful of edible flowers</li>
                    <li>1 tablespoon sesame seeds</li>
                    <li>3 tablespoons toasted sesame oil</li>
                    <li>½ tablespoon soy sauce</li>
                    <li>1 tablespoon yuzu juice (or the juice of ½ a lime)</li>
                    <li>1 teaspoon togarashi spice mix</li>', '<li>Slice the squid. Heat ½ tablespoon of olive oil in a small frying pan over a medium heat, add the squid and cook for 3 to 4 minutes.</li>
                    <li>Turn the heat up to high, add the soy sauce and stir continuously for a further 2 minutes, or until the squid is tender and coated in soy. Transfer to a salad bowl.</li>
                    <li>Toast the sesame seeds in a dry frying pan until golden, then remove to a small bowl and combine with the remaining dressing ingredients.</li>
                    <li>Slice the octopus, then place in the salad bowl, with the prawns and salad leaves.</li>
                    <li>Add the dressing and toss together well. Sprinkle with the edible flowers and serve.</li>', 'recipe3.jpg', 3, 1),
('Avocado on rye toast with ricotta', '<li>1 heaped teaspoon ricotta cheese</li>
                    <li>1 x 75 g slice of rye bread</li>
                    <li>½ a ripe avocado</li>
                    <li>1 ripe tomato</li>
                    <li>1 lemon</li>
                    <li>1 teaspoon toasted pine nuts</li>
                    <li>1 sprig of fresh basil , optional</li>', '<li>Spread the ricotta cheese over the rye bread or toast.</li>
                    <li>Finely slice the avocado and tomato, then toss with a squeeze of lemon juice.</li>
                    <li>Season to taste and arrange on the toast.</li>
                    <li>Sprinkle over the pine nuts and a few fresh baby basil leaves, if you’ve got them.</li>', 'recipe4.jpg', 4, 2),
('Chicken & tofu noodle soup', '<li>2 shallots</li>
                    <li>2 cloves of garlic</li>
                    <li>2 cm piece of ginger</li>
                    <li>4 free-range chicken thighs , skin off, bone in</li>
                    <li>groundnut oil</li>
                    <li>sesame oil</li>
                    <li>1 star anise</li>
                    <li>2 tablespoons low-salt soy sauce</li>
                    <li>100 g fine rice noodles</li>
                    <li>½ a bunch of fresh coriander , (15g)</li>
                    <li>½ a bunch of fresh mint , (15g)</li>
                    <li>100 g tofu</li>
                    <li>4 spring onions</li>
                    <li>4 seaweed nori sheets</li>
                    <li>1 lime</li>', '<li>Peel and finely slice the shallots, garlic and ginger. Remove the meat from the chicken thighs, reserving the bones, and slice it into nice thin strips.</li>
                    <li>Place a large pan over a medium–low heat with a good lug of groundnut oil, then fry the shallots, ginger and garlic for 5 minutes, or until soft.</li>
                    <li>Add the chicken with 1 tablespoon of sesame oil and fry for a few minutes more.</li>
                    <li>Throw in the chicken bones and star anise, then cover with 700ml of water. Gently bring to the boil, reduce the heat to low, then cover and simmer for 35 to 40 minutes, or until the chicken is tender.</li>
                    <li>Season the broth with the soy sauce and black pepper. Fish out and discard the bones.</li>
                    <li>Meanwhile, cook the noodles according to the packet instructions, then divide between two deep bowls.</li>
                    <li>Pick the herbs, chop the tofu into 1cm cubes, trim and finely slice the spring onions, then finely slice the chilli.</li>
                    <li>Ladle the broth over the noodles, then top with the herbs, spring onions, chilli, spinach and tofu.</li>
                    <li>Roughly chop and scatter over the nori, then finish with a squeeze of lime, and tuck in!</li>', 'recipe5.jpg', 1, 2),
('Thai-style mussels', '<li>1 kg mussels , debearded, from sustainable sources</li>
                    <li>4 spring onions</li>
                    <li>2 cloves of garlic</li>
                    <li>½ a bunch of fresh coriander</li>
                    <li>1 stick of lemongrass</li>
                    <li>1 fresh red chilli</li>
                    <li>groundnut oil</li>
                    <li>1 x 400 ml tin of reduced fat coconut milk</li>
                    <li>1 tablespoon fish sauce</li>
                    <li>1 lime</li>', '<li>Wash the mussels thoroughly, discarding any that aren’t tightly closed.</li>
                    <li>Trim and finely slice the spring onions, peel and finely slice the garlic. Pick and set aside the coriander leaves, then finely chop the stalks. Cut the lemongrass into 4 pieces, then finely slice the chilli.</li>
                    <li>In a wide saucepan, heat a little groundnut oil and soften the spring onion, garlic, coriander stalks, lemongrass and most of the red chilli for around 5 minutes.</li>
                    <li>Add the coconut milk and fish sauce and bring to the boil, then add the mussels and cover the pan.</li>
                    <li>Steam the mussels for 5 minutes, or until they''ve all opened and are cooked. Discard any unopened mussels.</li>
                    <li>Finish with a squeeze of lime juice, then sprinkle with coriander leaves and the remaining chilli to serve.</li>', 'recipe6.jpg', 2, 2),
('Christmas crumble', '<li>1.5 kg mixed eating apples and pears</li>
                    <li>100 g quality cranberry sauce</li>
                    <li>1 tablespoon sherry, brandy, Vin Santo, whisky, rum , optional</li>
                    <li>1 clementine</li>
                    <li>50 g unsalted butter , (cold)</li>
                    <li>100 g plain flour</li>
                    <li>50 g golden caster sugar</li>
                    <li>50 g flaked almonds or unsalted festive nuts</li>
                    <li>1 mince pie , (60g)</li>', '<li>Preheat the oven to 180°C/350°F.</li>
                    <li>Peel and core the apples and pears, then quarter and chop into 3cm chunks.</li>
                    <li>Place in a pan on a medium heat with the cranberry sauce and booze (if using), then finely grate in the clementine zest and squeeze in the juice.</li>
                    <li>Cook with the lid on for 10 minutes, or until the fruit has softened, stirring occasionally, then remove from the heat and leave to cool slightly.</li>
                    <li>Cut the butter into cubes and place in a mixing bowl with the flour and a pinch of sea salt. Rub together with your fingertips until it resembles breadcrumbs, then scrunch in the sugar to add a little texture. Roughly chop and stir through the almonds or nuts, and crumble in the mince pie.</li>
                    <li>Transfer the fruit to a 25cm x 30cm baking dish and sprinkle over the crumble topping, then bake for 25 to 30 minutes, or until golden and bubbling. Delicious served with custard, ice cream or brandy butter.</li>', 'recipe7.jpg', 3, 3),
('Vanilla custard', '<li>1 vanilla pod</li>
                    <li>600 ml whole milk</li>
                    <li>4 large free-range egg yolks</li>
                    <li>2 tablespoons caster sugar</li>
                    <li>1 tablespoon cornflour</li>', '<li>Halve the vanilla pod and scrape out the seeds. Add both the pod and seeds to a pan on a medium-low heat, pour in the milk and bring just to the boil.</li>
                    <li>Remove from the heat and leave to cool slightly, then pick out the vanilla pod.</li>
                    <li>In a large mixing bowl, whisk the egg yolks with the sugar and cornflour until pale.</li>
                    <li>Gradually add the warm milk, a ladle at a time, whisking well before each addition.</li>
                    <li>Pour the mixture back into the pan and cook gently on a low heat for about 20 minutes or until thickened, whisking continuously. Delicious served with all kinds of crumble.</li>', 'recipe8.jpg', 4, 3),
('Pear & ginger pudding', '<li>55 g unsalted butter , softened, plus extra for greasing</li>
                    <li>55 g self-raising flour</li>
                    <li>55 g caster sugar</li>
                    <li>1 large free-range egg</li>
                    <li>1 piece of stem ginger in syrup</li>
                    <li>1 orange</li>
                    <li>1 ripe pear</li>
                    <li>golden syrup or reserved ginger syrup</li>', '<li>Start by making 2 greaseproof paper discs to top the puddings: place 2 teacups or ramekins upside down on greaseproof paper, draw round them, then cut out the circles, just inside the line.</li>
                    <li>Lightly grease one side with butter, then grease the inside of the teacups or ramekins.</li>
                    <li>In a food processor, blitz the flour, sugar, butter and egg to make a batter.</li>
                    <li>Chop and add the ginger, finely grate in the orange zest, then pulse once or twice.</li>
                    <li>Peel, core and cut the pear into 1cm chunks.</li>
                    <li>Pour a little golden syrup or reserved ginger syrup into the base of each cup or ramekin, then top with half the chopped pear each.</li>
                    <li>Divide the batter between the two, then lightly press a circle of paper on top, butter-side down.</li>
                    <li>Cook in the microwave on full power for 4 minutes, or until it feels springy to the touch.</li>
                    <li>Leave to cool for a couple of minutes, then carefully turn out and enjoy with lashings of hot custard.</li>', 'recipe9.jpg', 1, 3);

insert into comments (parentCommentId, content, nestingLevel, dateCommented, userId, recipeId) VALUES
(0, 'Looks delicious!', 1, '2021-04-29 13:45:30', 1, 1),
(1, 'I''ll cook this tonight!', 2, '2021-05-01 08:00:15', 2, 1),
(2, 'Good idea', 3, '2021-05-01 20:00:00', 3, 1),
(0, 'Thanks for sharing the recipe.', 1, '2021-05-20 18:30:30', 4, 9);


-- insert into favorites VALUES
-- (1, 1, '2020-05-01 19:00:00'),
-- (1, 4, '2019-04-10 20:00:00'),
-- (2, 9, '2020-06-01 15:00:00'),
-- (3, 7, '2020-07-01 19:40:00'),
-- (3, 9, '2020-09-01 03:00:00'),
-- (4, 3, '2020-10-01 19:35:00');

-- delete from comments
-- where userId = 1;
-- delete from favorites
-- where userId = 1;
-- delete from recipes
-- where userId = 1;
-- delete from users
-- where userId = 1;
