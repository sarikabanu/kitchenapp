/**
 * RecipeMgtController
 *
 * @description :: Server-side logic for managing Recipemgts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  /**
   * `RecipeMgtController.recipe_for_menu_item()`
   */
  recipe_for_menu_item: function(req, res) {
    var allSubstances, measurements, categories, stations,
      basicIngredients = [],
      assocItems = [],
      intmdItems = [],
      allRecipeTasks, selectedMenuItem = [],
      allSteps;
    var selectedMenuItemId = req.param('selectedMenuItemId');

    Station.find().exec(function(err, result) {
      stations = result;

      Category.find().exec(function(err, result) {
        categories = result;

        Measurement.find().exec(function(err, result) {
          measurements = result;

          Substance.find()
            .populate('measurement')
            .exec(function(err, result) {
              allSubstances = result;

              Recipe.find()
                .populate('substance')
                .populate('station')
                .exec(function(err, result) {
                  allRecipeTasks = result;

                  if (selectedMenuItemId) {

                    Substance.find({
                        id: selectedMenuItemId
                      }).populate('measurement')
                      .populate('category')
                      .populate('type')
                      .exec(function(err, result) {
                        selectedMenuItem = result;

                        Composition.find({
                            substance: selectedMenuItemId
                          }).populate('composition')
                          .exec(function(err, allCompositions) {

                            allCompositions.forEach(function(eachComposition) {
                              if (eachComposition.composition.type == 1) {
                                basicIngredients.push(eachComposition);
                              } else if (eachComposition.composition.type == 2) {
                                intmdItems.push(eachComposition);
                              } else if (eachComposition.composition.type == 3) {
                                assocItems.push(eachComposition);
                              }
                            });

                            Step.find({
                                substance: selectedMenuItemId
                              }).populate('recipe')
                              .sort('sequence ASC')
                              .exec(function(err, result) {
                                allSteps = result;

                                return res.view('recipeMgt/recipe_for_menu_item', {
                                  allSubstances: allSubstances,
                                  measurements: measurements,
                                  categories: categories,
                                  allRecipeTasks: allRecipeTasks,
                                  selectedMenuItem: selectedMenuItem,
                                  selectedMenuItemId: selectedMenuItemId,
                                  basicIngredients: basicIngredients,
                                  intmdItems: intmdItems,
                                  assocItems: assocItems,
                                  allSteps: allSteps
                                });

                              });

                          });

                      });

                  } else {

                    return res.view('recipeMgt/recipe_for_menu_item', {
                      allSubstances: allSubstances,
                      measurements: measurements,
                      categories: categories,
                      allRecipeTasks: allRecipeTasks,
                      selectedMenuItem: selectedMenuItem,
                      selectedMenuItemId: selectedMenuItemId,
                      basicIngredients: basicIngredients,
                      intmdItems: intmdItems,
                      assocItems: assocItems,
                      allSteps: allSteps
                    });

                  }

                });

            });

        });

      });

    });

  },


  /**
   * `RecipeMgtController.getRecipeForMenuItem()`
   */
  getRecipeForMenuItem: function(req, res) {
    var allSubstances, measurements, categories, stations,
      basicIngredients = [],
      assocItems = [],
      intmdItems = [],
      allRecipeTasks, selectedMenuItem = [],
      allSteps;
    var selectedMenuItemId = req.param('selectedMenuItemId');

    Station.find().exec(function(err, result) {
      stations = result;

      Category.find().exec(function(err, result) {
        categories = result;

        Measurement.find().exec(function(err, result) {
          measurements = result;

          Substance.find()
            .populate('measurement')
            .exec(function(err, result) {
              allSubstances = result;

              Recipe.find()
                .populate('substance')
                .populate('station')
                .exec(function(err, result) {
                  allRecipeTasks = result;

                  if (selectedMenuItemId) {

                    Substance.find({
                        id: selectedMenuItemId
                      }).populate('measurement')
                      .populate('category')
                      .populate('type')
                      .exec(function(err, result) {
                        selectedMenuItem = result;

                        Composition.find({
                            substance: selectedMenuItemId
                          }).populate('composition')
                          .exec(function(err, allCompositions) {

                            allCompositions.forEach(function(eachComposition) {
                              if (eachComposition.composition.type == 1) {
                                basicIngredients.push(eachComposition);
                              } else if (eachComposition.composition.type == 2) {
                                intmdItems.push(eachComposition);
                              } else if (eachComposition.composition.type == 3) {
                                assocItems.push(eachComposition);
                              }
                            });

                            Step.find({
                                substance: selectedMenuItemId
                              }).populate('recipe')
                              .sort('sequence ASC')
                              .exec(function(err, result) {
                                allSteps = result;

                                return res.json({
                                  allSubstances: allSubstances,
                                  measurements: measurements,
                                  categories: categories,
                                  allRecipeTasks: allRecipeTasks,
                                  selectedMenuItem: selectedMenuItem,
                                  selectedMenuItemId: selectedMenuItemId,
                                  basicIngredients: basicIngredients,
                                  intmdItems: intmdItems,
                                  assocItems: assocItems,
                                  allSteps: allSteps
                                });

                              });

                          });

                      });

                  } else {

                    return res.json({
                      allSubstances: allSubstances,
                      measurements: measurements,
                      categories: categories,
                      allRecipeTasks: allRecipeTasks,
                      selectedMenuItem: selectedMenuItem,
                      selectedMenuItemId: selectedMenuItemId,
                      basicIngredients: basicIngredients,
                      intmdItems: intmdItems,
                      assocItems: assocItems,
                      allSteps: allSteps
                    });

                  }

                });

            });

        });

      });

    });

  },


  /**
   * `RecipeMgtController.all_menu_items()`
   */
  all_menu_items: function(req, res) {
    var categories = {},
      measurements = {};
    Category.find().exec(function(err, result) {
      categories = result;
    });
    Measurement.find().exec(function(err, result) {
      measurements = result;
    });

    Substance.find({
        type: [3, 4]
      })
      .populate('category')
      .populate('measurement')
      .populate('type')
      .exec(function(err, result) {
        return res.view('recipeMgt/all_menu_items', {
          allMenuItems: result,
          categories: categories,
          measurements: measurements
        });
      });
  },


  /**
   * `RecipeMgtController.getAllMenuItems()`
   */
  getAllMenuItems: function(req, res) {
    Substance.find({
        type: [3, 4]
      })
      .populate('category')
      .populate('measurement')
      .populate('type')
      .exec(function(err, result) {
        return res.json({
          allMenuItems: result,
          categories: categories,
          measurements: measurements
        });
      });
  },


  /**
   * `RecipeMgtController.createRecipeTask()`
   */
  recipe_task_details: function(req, res) {
    var selectedRecipeTaskId = req.param('selectedRecipeTaskId');
    var recipeTask, allRecipeSubSteps, recipeSubstanceId, allCompositions;
    var substances = {},
      stations = {};

    Substance.find().exec(function(err, result) {
      substances = result;

      Station.find().exec(function(err, result) {
        stations = result;

        if (selectedRecipeTaskId) {

          Recipe.find({
              id: selectedRecipeTaskId
            }).populate('substance')
            .populate('station')
            .exec(function(err, result) {
              recipeTask = result;
              recipeSubstanceId = result[0].substance.id;

              Recipe_sub_tasks.find({
                  main_recipe_task: selectedRecipeTaskId
                }).populate('main_recipe_task')
                .exec(function(err, result) {
                  allRecipeSubSteps = result;

                  Composition.find({
                      substance: recipeSubstanceId
                    }).populate('composition')
                    .populate('substance')
                    .exec(function(err, result) {
                      allCompositions = result;

                      return res.view('recipeMgt/recipe_task_details', {
                        recipeTask: recipeTask,
                        selectedRecipeTaskId: selectedRecipeTaskId,
                        allRecipeSubSteps: allRecipeSubSteps,
                        substances: substances,
                        recipeSubstanceId: recipeSubstanceId,
                        allCompositions: allCompositions,
                        stations: stations
                      });

                    });

                });

            });
        } else {

          return res.view('recipeMgt/recipe_task_details', {
            recipeTask: recipeTask,
            selectedRecipeTaskId: selectedRecipeTaskId,
            allRecipeSubSteps: allRecipeSubSteps,
            substances: substances,
            recipeSubstanceId: recipeSubstanceId,
            allCompositions: allCompositions,
            stations: stations
          });

        }


      });

    });

  },


  getrecipetaskdetails: function(req, res) {
    var selectedRecipeTaskId = req.param('selectedRecipeTaskId');
    var recipeTask, allRecipeSubSteps, recipeSubstanceId, allCompositions;
    var substances = {},
      stations = {};

    Substance.find().exec(function(err, result) {
      substances = result;

      Station.find().exec(function(err, result) {
        stations = result;

        if (selectedRecipeTaskId) {

          Recipe.find({
              id: selectedRecipeTaskId
            }).populate('substance')
            .populate('station')
            .exec(function(err, result) {
              recipeTask = result;
              recipeSubstanceId = result[0].substance.id;

              Recipe_sub_tasks.find({
                  main_recipe_task: selectedRecipeTaskId
                }).populate('main_recipe_task')
                .exec(function(err, result) {
                  allRecipeSubSteps = result;

                  Composition.find({
                      substance: recipeSubstanceId
                    }).populate('composition')
                    .populate('substance')
                    .exec(function(err, result) {
                      allCompositions = result;

                      return res.json({
                        recipeTask: recipeTask,
                        selectedRecipeTaskId: selectedRecipeTaskId,
                        allRecipeSubSteps: allRecipeSubSteps,
                        substances: substances,
                        recipeSubstanceId: recipeSubstanceId,
                        allCompositions: allCompositions,
                        stations: stations
                      });

                    });

                });

            });
        } else {

          return res.json({
            recipeTask: recipeTask,
            selectedRecipeTaskId: selectedRecipeTaskId,
            allRecipeSubSteps: allRecipeSubSteps,
            substances: substances,
            recipeSubstanceId: recipeSubstanceId,
            allCompositions: allCompositions,
            stations: stations
          });

        }


      });

    });

  },


  /**
   * `RecipeMgtController.all_recipe_tasks()`
   */
  all_recipe_tasks: function(req, res) {
    var substances = {},
      stations = {};

    Substance.find().exec(function(err, result) {
      substances = result;
    });

    Station.find().exec(function(err, result) {
      stations = result;
    });

    Recipe.find().populate('substance').populate('station').exec(function(err, result) {
      return res.view('recipeMgt/all_recipe_tasks', {
        allRecipes: result,
        substances: substances,
        stations: stations
      });
    });
  },


  /**
   * `RecipeMgtController.getAllRecipeTasks()`
   */
  getAllRecipeTasks: function(req, res) {
    Recipe.find().populate('substance').populate('station').exec(function(err, result) {
      return res.json({
        allRecipes: result,
        substances: substances,
        stations: stations
      });
    });
  }
};
