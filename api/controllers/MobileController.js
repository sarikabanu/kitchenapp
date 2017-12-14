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
              if (job.status < stationsWithStatus[job.recipe.station][status]) {
                stationsWithStatus[job.recipe.station][status] = job.status;

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
              if (job.status < stationsWithStatus[job.recipe.station][status]) {
                stationsWithStatus[job.recipe.station][status] = job.status;

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
   * `MobileController.startJob()`
   */
  startJob: function(req, res) {
    return res.json({
      todo: 'startJob() is not implemented yet!'
    });
  },


  /**
   * `MobileController.pauseJob()`
   */
  pauseJob: function(req, res) {
    return res.json({
      todo: 'pauseJob() is not implemented yet!'
    });
  },


  /**
   * `MobileController.endJob()`
   */
  endJob: function(req, res) {
    return res.json({
      todo: 'endJob() is not implemented yet!'
    });
  }
};
