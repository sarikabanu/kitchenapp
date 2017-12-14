/*

show databases;

use kitchen_schema;
show tables;

desc type;
select * from type;
select * from measurement;
select * from station;
select * from status;
*/

insert into type (id, title, description) values (1, "Basic Ingredient", "These are basic ingredients, which cannot be further breakdown. Eg, Rice grains, water, dal.");
insert into type (id, title, description) values (2, "Intermidiate Ingredient", "These are composite ingredients. These are intermediate by-products of a recipe. Eg, Dosa Batter");
insert into type (id, title, description) values (3, "Main Dish", "These are main menu items, which cannot be further combined to make any dishes. Eg, Dosa");
insert into type (id, title, description) values (4, "Associated Dish", "These are supplementary menu items. These are not served on their own. Eg, Chutney");


insert into measurement (id, title, description) values (1, "ml", "mili-liter");
insert into measurement (id, title, description) values (2, "ltr", "liters");
insert into measurement (id, title, description) values (3, "mg", "mili-grams");
insert into measurement (id, title, description) values (4, "gms", "grams");
insert into measurement (id, title, description) values (5, "kg", "kilo-grams");
insert into measurement (id, title, description) values (6, "pcs", "pieces");


insert into station (id, title, description) values (1, "Grinding Station", "Station for all Grinding related work.");
insert into station (id, title, description) values (2, "Chopping Station", "Station for all Chopping related work.");
insert into station (id, title, description) values (3, "Dosa Station", "Station for making all kinds of Dosa and related work.");
insert into station (id, title, description) values (4, "Idli Station", "Station for making all kinds of Idli and related work.");


insert into status (id, title, description) values (1, "Requested", "Status to represent requested or ordered jobs");
insert into status (id, title, description) values (2, "In Process", "Status to represent on going jobs");
insert into status (id, title, description) values (3, "Completed", "Status to represent completed jobs");
  insert into status (id, title, description) values (4, "Paused", "Status to represent paused jobs");

commit;
