/**
 * InventoryController
 *
 * @description :: Server-side logic for managing Inventories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



  /**
   * `InventoryController.getInventoryBalance()`
   */
  getInventoryBalance: function(req, res) {
    var basicIngreds = {},
      basicIngredIds = [];

    Substance.find({
      type: 1
    }).exec(function(err, result) {
      basicIngreds = result;
      basicIngreds.forEach(function(basicIngred) {
        basicIngredIds.push(basicIngred.id);
      });

      Net_stock.find({
        where: {
          substance: basicIngredIds
        },
        sort: 'updated DESC'
      }).populate('substance').exec(function(err, result) {
        return res.json({
          allBasicIngredsBalance: result,
          basicIngreds: basicIngreds
        });
      });

    });
  },


  /**
   * `InventoryController.inventory_balance()`
   */
  inventory_balance: function(req, res) {
    var basicIngreds = {},
      basicIngredIds = [],
      measurementsMap = {},
      categories = {};

    Measurement.find().exec(function(err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

    Category.find().exec(function(err, result) {
      categories = result;
    });

    Substance.find({
      type: 1
    }).exec(function(err, result) {
      basicIngreds = result;
      basicIngreds.forEach(function(basicIngred) {
        basicIngredIds.push(basicIngred.id);
      });

      Net_stock.find({
          where: {
            substance: basicIngredIds
          },
          sort: 'updated DESC'
        })
        .populate('substance')
        .exec(function(err, result) {
          return res.view('inventory/inventory_balance', {
            allBasicIngredsBalance: result,
            basicIngreds: basicIngreds,
            measurementsMap: measurementsMap,
            categories: categories
          });
        });

    });
  },


  /**
   * `InventoryController.getInventoryBalanceWithRequirements()`
   */
  getInventoryBalanceWithRequirements: function(req, res) {
    var basicIngreds = {},
      basicIngredIds = [],
      netStockWithRequirements = {};

    Substance.find({
      type: 1
    }).exec(function(err, result) {
      basicIngreds = result;
      basicIngreds.forEach(function(basicIngred) {
        basicIngredIds.push(basicIngred.id);
      });

      Net_stock.find({
          where: {
            substance: basicIngredIds
          },
          sort: 'updated DESC'
        })
        .populate('substance')
        .exec(function(err, allNetStocks) {

          var substanceIds = [];
          allNetStocks.forEach(function(eachNetStock) {
            var substanceId = eachNetStock.substance.id;
            substanceIds.push(substanceId);
            netStockWithRequirements[substanceId] = {};
            netStockWithRequirements[substanceId].net_stock = eachNetStock;
            netStockWithRequirements[substanceId].requirement = 0;
          });

          Requirement.find({
            status: 1,
            substance: substanceIds
          }).exec(function(err, allRequirements) {

            allRequirements.forEach(function(eachRequirement) {
              netStockWithRequirements[eachRequirement.substance].requirement += eachRequirement.quantity;
            });

            return res.json({
              netStockWithRequirements: netStockWithRequirements
            });
          });

        });

    });
  },


  /**
   * `InventoryController.inventory_balance_with_requirements()`
   */
  inventory_balance_with_requirements: function(req, res) {
    var basicIngreds = {},
      basicIngredIds = [],
      measurementsMap = {},
      netStockWithRequirements = {};

    Measurement.find().exec(function(err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

    Substance.find({
      type: 1
    }).exec(function(err, result) {
      basicIngreds = result;
      basicIngreds.forEach(function(basicIngred) {
        basicIngredIds.push(basicIngred.id);
      });

      Net_stock.find({
          where: {
            substance: basicIngredIds
          },
          sort: 'updated DESC'
        })
        .populate('substance')
        .exec(function(err, allNetStocks) {

          var substanceIds = [];
          allNetStocks.forEach(function(eachNetStock) {
            var substanceId = eachNetStock.substance.id;
            substanceIds.push(substanceId);
            netStockWithRequirements[substanceId] = {};
            netStockWithRequirements[substanceId].net_stock = eachNetStock;
            netStockWithRequirements[substanceId].requirement = 0;
          });

          Requirement.find({
            status: 1,
            substance: substanceIds
          }).exec(function(err, allRequirements) {

            allRequirements.forEach(function(eachRequirement) {
              netStockWithRequirements[eachRequirement.substance].requirement += eachRequirement.quantity;
            });

            return res.view('inventory/inventory_balance_with_requirements', {
              netStockWithRequirements: netStockWithRequirements,
              basicIngreds: basicIngreds,
              measurementsMap: measurementsMap
            });
          });

        });

    });
  },


  /**
   * `InventoryController.getAllStockTransactionsFor()`
   */
  getAllStockTransactionsFor: function(req, res) {
    var selectedBasicIngred = req.param('selectedBasicIngred');

    Stock.find({
        where: {
          substance: selectedBasicIngred
        },
        sort: 'updated DESC'
      })
      .populate('substance')
      .exec(function(err, result) {
        return res.json({
          allBasicIngredsStock: result
        });
      });
  },


  /**
   * `InventoryController.all_stock_transactions()`
   */
  all_stock_transactions: function(req, res) {
    var selectedBasicIngred = req.param('selectedBasicIngred');
    var measurementsMap = {};

    Measurement.find().exec(function(err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

    Stock.find({
        where: {
          substance: selectedBasicIngred
        },
        sort: 'updated DESC'
      })
      .populate('substance')
      .exec(function(err, result) {
        if (result.length > 0) {
          return res.view('inventory/all_stock_transactions', {
            allBasicIngredsStock: result,
            selectedBasicIngred: selectedBasicIngred,
            selectedMeasurement: measurementsMap[result[0].substance.measurement],
            selectedBasicIngredTitle: result[0].substance.title
          });
        } else {

          Substance.find({
            id: selectedBasicIngred
          }).exec(function(err, selectedSubstance) {
            return res.view('inventory/all_stock_transactions', {
              allBasicIngredsStock: result,
              selectedBasicIngred: selectedBasicIngred,
              selectedMeasurement: measurementsMap[selectedSubstance.measurement],
              selectedBasicIngredTitle: selectedSubstance.title
            });
          });
        }

      });

  }
};
