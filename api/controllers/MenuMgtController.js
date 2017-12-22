/**
 * MenuMgtController
 *
 * @description :: Server-side logic for managing Menumgts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



  /**
   * `MenuMgtController.createMenuForTheDay()`
   *
   *  Sample data format
   *  {
   *		menuDate: '17 Dec 2017',
   *		selectedMenuItemsMap: {
   *			"7":{"quantity":"10"},
   *			"8":{"quantity":"25"},
   *			"11":{
   *				"quantity":"100",
   *				"assocItems":{
   *					"16":4000,
   *					"18":4500
   *				}
   *			}
   *		}
   *	}
   */
  createMenuForTheDay: function(req, res) {

    var data = JSON.parse(Object.keys(req.body)[0]);
    var menuDate = sails.moment(data.menuDate, 'DD MMM YYYY').toDate();
    var menuTitle = sails.moment(menuDate, 'DD MMM YYYY').format('DD-MM-YYYY');
    var selectedMenuItemsMap = data.selectedMenuItemsMap;

    Menu.find({
        title: menuTitle
      })
      .exec(function(err, result) {

        if (err) return res.serverError(err);
        if (result.length > 0) {
          return res.serverError("Menu for the selected day is already available!");
        }

        for (var itemId in selectedMenuItemsMap) {
          var menuToCreate = {
            title: menuTitle,
            description: 'Prepare ' + selectedMenuItemsMap[itemId].quantity + ' quantity',
            date: menuDate,
            quantity: selectedMenuItemsMap[itemId].quantity,
            substance: itemId
          };

          Menu.create(menuToCreate).exec(function(err, createdMenu) {
            if (err) return res.serverError(err);

            var assocItems = selectedMenuItemsMap[itemId].assocItems;
            if (assocItems) {
              var assocMenus = [];

              for (var assocId in assocItems) {
                assocMenus.push({
                  title: menuTitle,
                  description: 'Prepare ' + assocItems[assocId] + ' quantity',
                  date: menuDate,
                  quantity: assocItems[assocId],
                  substance: assocId,
                  parent: createdMenu.id
                });
              }
              Menu.create(assocMenus).exec(function(err, createdChildAssocs) {
              	console.log("*********\n", createdChildAssocs, "\n**********");
              });
            }

          });
        }

        return res.json({
          result: 'Menu created successfully'
        });

      });

  },


  /**
   * `MenuMgtController.createMenuForTheDay()`
   */
  create_menu_for_day: function(req, res) {
    var allMenuItems;
    var measurementsMap = {};

    Measurement.find().exec(function(err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

    Substance.find({
        type: 3,
        recipe_available: true
      })
      .populate('category')
      .populate('measurement')
      .exec(function(err, result) {

        return res.view('menuMgt/create_menu_for_day', {
          allMenuItems: result,
          measurementsMap: measurementsMap
        });
      });
  },


  /**
   * `MenuMgtController.all_menu_for_days()`
   */
  all_menu_for_days: function(req, res) {

    Menu.find()
      .groupBy('date')
      .sum('count')
      .exec(function(err, result) {
        return res.view('menuMgt/all_menu_for_days', {
          allMenuForDays: result
        });
      });
  },


  /**
   * `MenuMgtController.getAllMenuForDays()`
   */
  getAllMenuForDays: function(req, res) {
    Menu.find()
      .groupBy('date')
      .sum('count')
      .exec(function(err, result) {
        if (err) return res.json(err);
        return res.json({
          allMenuForDays: result
        });
      });
  },


  /**
   * `MenuMgtController.menu_for_a_day()`
   */
  menu_for_a_day: function(req, res) {
    var measurementsMap = {};
    var selectedDate = req.param('selectedDate');

    Measurement.find().exec(function(err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

    Menu.find({
        date: new Date(sails.moment(selectedDate, 'DD-MM-YYYY').toDate())
      })
      .populate('substance')
      .populate('parent')
      .exec(function(err, result) {

        return res.view('menuMgt/menu_for_a_day', {
          allMenus: result,
          selectedDate: sails.moment(selectedDate, 'DD-MM-YYYY').toDate(),
          measurementsMap: measurementsMap
        });
      });
  },


  /**
   * `MenuMgtController.getMenuForADay()`
   */
  getMenuForADay: function(req, res) {
    var selectedDate = req.param('selectedDate');

    Menu.find({
        date: new Date(sails.moment(selectedDate, 'DD-MM-YYYY').toDate())
      })
      .populate('substance')
      .exec(function(err, result) {

        return res.json({
          allMenus: result,
        });
      });
  },


  /**
   * `MenuMgtController.all_menu_items()`
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
        type: [3, 4],
        recipe_available: true
      })
      .populate('category')
      .populate('measurement')
      .populate('type')
      .exec(function(err, result) {
        return res.view('menuMgt/all_menu_items', {
          allMenuItems: result,
          categories: categories,
          measurements: measurements
        });
      });
  },


  /**
   * `MenuMgtController.getAllMenuItems()`
   */
  getAllMenuItems: function(req, res) {
    Substance.find({
        type: [3, 4],
        recipe_available: true
      })
      .populate('category')
      .populate('measurement')
      .populate('type')
      .exec(function(err, result) {
        return res.json({
          allMenuItems: result
        });
      });
  },


  /**
   * `MenuMgtController.getAllMainMenuItems()`
   */
  getAllMainMenuItems: function(req, res) {
    Substance.find({
        type: 3
      })
      .populate('category')
      .populate('measurement')
      .exec(function(err, result) {
        return res.json({
          allMenuItems: result
        });
      });
  },

  /**
   * `MenuMgtController.getAssociatedMenuItemsForMainItem()`
   */
  getAssociatedMenuItemsForMainItem: function(req, res) {
    var selectedMenuItem = req.param('selectedMenuItem');

    Composition.find({
        substance: selectedMenuItem
      }).populate('composition')
      .exec(function(err, allCompositions) {

        var associatedItems = [];
        allCompositions.forEach(function(eachComposition) {
          if (eachComposition.composition.type == 4) {
            associatedItems.push(eachComposition);
          }
        });

        return res.json({
          associatedItems: associatedItems
        });

      });

  }


};
