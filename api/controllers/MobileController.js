/**
 * MobileController
 *
 * @description :: Server-side logic for managing Mobiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  /**
   * `MobileController.all_stations()`
   */
  all_stations_with_status: function(req, res) {
    var stationsMap = [],
      stationsWithStatus = {};

    Station.find().exec(function(err, result) {
      result.forEach(function(station) {
        stationsMap[station.id] = station;
      });

      Job.find().populate('recipe')
        .exec(function(err, allJobsForStations) {

          allJobsForStations.forEach(function(job) {
            if (stationsWithStatus[job.recipe.station]) {
              if (job.status < stationsWithStatus[job.recipe.station].status) {
                stationsWithStatus[job.recipe.station].status = job.status;

              }
            } else {
              stationsWithStatus[job.recipe.station] = {
                station: stationsMap[job.recipe.station],
                status: job.status
              };
            }
          });

          return res.view('mobile/all_stations_with_status', {
            stationsWithStatus: stationsWithStatus,
            selectedStation: ''
          });

        });

    });

  },


  /**
   * `MobileController.requirements_for_station()`
   */
  requirements_for_station: function(req, res) {
    var allStations = {},
      selectedStation = req.param('selectedStation'),
      measurementsMap = {};

    Measurement.find().exec(function(err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

    Station.find().exec(function(err, result) {
      allStations = result;
    });

    Recipe.find({
      station: selectedStation
    }).exec(function(err, result) {
      var substancesForStation = [];
      result.forEach(function(recipe) {
        substancesForStation.push(recipe.substance);
      });

      Requirement.find({
          substance: substancesForStation
        })
        .populate('substance')
        .populate('status')
        .exec(function(err, result) {
          return res.view('mobile/requirements_for_station', {
            allRequirementsForStation: result,
            stationsWithStatus: allStations,
            measurementsMap: measurementsMap,
            selectedStation: selectedStation,
            selectedRequirement: ''
          });
        });
    });

  },


  /**
   * `MobileController.jobs_for_station()`
   */
  jobs_for_station: function(req, res) {

    var allStations = {},
      selectedStation = req.param('selectedStation'),
      measurementsMap = {};

    Measurement.find().exec(function(err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

    Station.find().exec(function(err, result) {
      allStations = result;
    });

    Recipe.find({
      station: selectedStation
    }).exec(function(err, result) {
      var recipesForStation = [];
      result.forEach(function(recipe) {
        recipesForStation.push(recipe.id);
      });

      Job.find({
          recipe: recipesForStation
        })
        .populate('recipe')
        .populate('status')
        .exec(function(err, result) {
          return res.view('mobile/jobs_for_station', {
            allJobsForStations: result,
            stationsWithStatus: allStations,
            measurementsMap: measurementsMap,
            selectedStation: selectedStation,
          });
        });
    });

  },


  /**
   * `MobileController.jobs_for_requirements()`
   */
  jobs_for_requirements: function(req, res) {

    var allStations = {},
      selectedStation = req.param('selectedStation'),
      selectedRequirement = req.param('selectedRequirement'),
      selectedSubstance = req.param('selectedSubstance'),
      measurementsMap = {};

    Measurement.find().exec(function(err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

    Station.find().exec(function(err, result) {
      allStations = result;
    });

    Recipe.find({
      station: selectedStation
    }).exec(function(err, result) {
      var substancesForStation = [];
      result.forEach(function(recipe) {
        substancesForStation.push(recipe.substance);
      });

      Requirement.find({
          substance: substancesForStation
        })
        .populate('substance')
        .populate('status')
        .exec(function(err, result) {
          var allRequirementsForStation = result;

          Recipe.find({
            substance: selectedSubstance
          }).exec(function(err, result) {
            var recipeTasksForRequirement = [];
            result.forEach(function(recipe) {
              recipeTasksForRequirement.push(recipe.id);
            });

            Job.find({
                recipe: recipeTasksForRequirement
              })
              .populate('recipe')
              .populate('status')
              .exec(function(err, result) {
                return res.view('mobile/jobs_for_requirements', {
                  allJobsForRequirements: result,
                  allRequirementsForStation: allRequirementsForStation,
                  stationsWithStatus: allStations,
                  measurementsMap: measurementsMap,
                  selectedStation: selectedStation,
                  selectedRequirement: selectedRequirement
                });
              });

          });
        });
    });

  },

  ////////////////////////////////////////////////////////////////////////////////
  /////////////   Below are Rest APIs ////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * `MobileController.getAllStations()`
   */
  getAllStations: function(req, res) {
    var stationsMap = [],
      stationsWithStatus = {};

    Station.find().exec(function(err, result) {
      result.forEach(function(station) {
        stationsMap[station.id] = station;
      });

      Job.find().populate('recipe')
        .exec(function(err, allJobsForStations) {

          allJobsForStations.forEach(function(job) {
            if (stationsWithStatus[job.recipe.station]) {
              if (job.status < stationsWithStatus[job.recipe.station].status) {
                stationsWithStatus[job.recipe.station].status = job.status;

              }
            } else {
              stationsWithStatus[job.recipe.station] = {
                station: stationsMap[job.recipe.station],
                status: job.status
              };
            }
          });

          return res.json({
            stationsWithStatus: stationsWithStatus,
            selectedStation: ''
          });

        });

    });

  },


  /**
   * `MobileController.getRequirementsForStation()`
   */
  getRequirementsForStation: function(req, res) {
    var selectedStation = req.param('selectedStation');

    Recipe.find({
      station: selectedStation
    }).exec(function(err, result) {
      var substancesForStation = [];
      result.forEach(function(recipe) {
        substancesForStation.push(recipe.substance);
      });

      Requirement.find({
        substance: substancesForStation
      }).populate('substance').populate('status').exec(function(err, result) {
        return res.json({
          allRequirementsForStation: result
        });
      });
    });

  },


  /**
   * `MobileController.getJobsForStation()`
   */
  getJobsForStation: function(req, res) {

    var selectedStation = req.param('selectedStation');

    Recipe.find({
      station: selectedStation
    }).exec(function(err, result) {
      var recipesForStation = [];
      result.forEach(function(recipe) {
        recipesForStation.push(recipe.id);
      });

      Job.find({
          recipe: recipesForStation
        })
        .populate('recipe')
        .populate('status')
        .exec(function(err, result) {
          return res.json({
            allJobsForStations: result
          });
        });
    });

  },


  /**
   * `MobileController.getJobsForRequirements()`
   */
  getJobsForRequirements: function(req, res) {

    var selectedRequirement = req.param('selectedRequirement'),
      selectedSubstance = req.param('selectedSubstance');

    Recipe.find({
      substance: selectedSubstance
    }).exec(function(err, result) {
      var recipeTasksForRequirement = [];
      result.forEach(function(recipe) {
        recipeTasksForRequirement.push(recipe.id);
      });

      Job.find({
        recipe: recipeTasksForRequirement
      }).populate('recipe').populate('status').exec(function(err, result) {
        return res.json({
          allJobsForRequirements: result
        });
      });
    });

  },


  /**
   * `MobileController.getSubTasksForJob()`
   */
  getSubTasksForJob: function(req, res) {
    var jobId = req.param('jobId');

    Job.find({
      id: jobId
    }).exec(function(err, selectedJob) {

      Recipe_sub_tasks.find({
        main_recipe_task: selectedJob[0].recipe
      }).exec(function(err, allSubTasksForJob) {
        return res.json({
          allSubTasksForJob: allSubTasksForJob
        });
      });
    });
  },


  /**
   * `MobileController.getRequiredIngredientsForJob()`
   */
  getRequiredIngredientsForJob: function(req, res) {
    var jobId = req.param('jobId');

    Job.find({
      id: jobId
    }).populate('recipe').exec(function(err, selectedJob) {

      Composition.find({
        substance: selectedJob[0].recipe.substance,
      }).populate('composition').exec(function(err, requiredCompositions) {

        var requiremedIngredients = {};
        for (var index = 0 ; index < requiredCompositions.length; index++) {
          requiremedIngredients[index] = {};
          requiremedIngredients[index].requiredSubstance = requiredCompositions[index].composition.title;
          requiremedIngredients[index].requiredQuantity = (requiredCompositions[index].proportion * selectedJob[0].quantity);
        }
        return res.json({
          requiremedIngredients: requiremedIngredients
        });
      });
    });

  },


  /**
   * `MobileController.startJob()`
   */
  startJob: function(req, res) {
    var jobId = req.param('jobId');

    Job.find({
      id: jobId
    }).populate('recipe').exec(function(err, selectedJob) {

      Composition.find({
        substance: selectedJob[0].recipe.substance,
      }).populate('composition').exec(function(err, requiredCompositions) {

        var stocksToCreate = [];
        for (var index = 0 ; index < requiredCompositions.length; index++) {
          var requiredQuantity = requiredCompositions[index].proportion * selectedJob[0].quantity;
          stocksToCreate.push({
            title: 'Stock received for starting Job ' + selectedJob[0].id,
            description: 'Stock received starting Job : ' + selectedJob[0].id + ' - ' + selectedJob[0].recipe.title,
            quantity: requiredQuantity,
            substance: requiredCompositions[index].composition.id,
            transaction_type: -1
          });
        }

        Stock.create(stocksToCreate).exec(function(err, newStockItem) {
          if(err) return res.serverError(err);

          Job.update({
            id: jobId
          }, {
            status: 2 //In process.
          }).exec(function afterwards(err, updatedJob) {

            if (err) {
              // handle error here- e.g. `res.serverError(err);`
              return res.serverError(err);
            }

            return res.json({
              updatedJob: updatedJob
            });
          });
        });

      });
    });



  },


  /**
   * `MobileController.pauseJob()`
   */
  pauseJob: function(req, res) {
    var jobId = req.param('jobId');
    var completedQuantity = req.param('completedQuantity');

    Job.update({
      id: jobId
    }, {
      status: 4, //Paused
      completed: completedQuantity
    }).exec(function afterwards(err, updatedJob) {

      if (err) {
        // handle error here- e.g. `res.serverError(err);`
        return res.serverError(err);
      }

      return res.json({
        updatedJob: updatedJob
      });
    });
  },


  /**
   * `MobileController.resumeJob()`
   */
  resumeJob: function(req, res) {
    var jobId = req.param('jobId');

    Job.update({
      id: jobId
    }, {
      status: 2 //In process.
    }).exec(function afterwards(err, updatedJob) {

      if (err) {
        // handle error here- e.g. `res.serverError(err);`
        return res.serverError(err);
      }

      return res.json({
        updatedJob: updatedJob
      });
    });
  },


  /**
   * `MobileController.endJob()`
   */
  endJob: function(req, res) {
    var jobId = req.param('jobId');
    var completedQuantity = req.param('completedQuantity');

    Job.update({
      id: jobId
    }, {
      status: 3, //In process.
      completed: completedQuantity
    }).exec(function afterwards(err, updatedJob) {

      if (err) {
        // handle error here- e.g. `res.serverError(err);`
        return res.serverError(err);
      }

      Job.find({
        id: jobId
      }).populate('recipe').exec(function(err, selectedJob) {

        Stock.create({
          title: 'Stock created after completing Job ' + selectedJob[0].id,
          description: 'Stock created after completing Job : ' + selectedJob[0].id + ' - ' + selectedJob[0].recipe.title,
          quantity: completedQuantity,
          substance: selectedJob[0].recipe.substance,
          transaction_type: 1
        }).exec(function(err, newStock) {
          if(err) return res.serverError(err);

          return res.json({
            updatedJob: updatedJob
          });
        });
      });

    });
  }
};
