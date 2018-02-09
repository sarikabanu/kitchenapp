/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



  /**
   * `AdminController.menu_item()`
   */
  menu_item: function (req, res) {
		var categories = {}, measurements = {};
		Category.find().exec(function( err, result) {
			categories = result;
		});
		Measurement.find().exec(function( err, result) {
			measurements = result;
		});

		Substance.find({type: 3}).populate('category').populate('measurement').exec(function (err, result){
      return res.view('admin/menu_item', {allMenuItems: result, categories: categories, measurements: measurements} );
    });
  },


  /**
   * `AdminController.assoc_item()`
   */
  assoc_item: function (req, res) {
		var categories = {}, measurements = {};
		Category.find().exec(function( err, result) {
			categories = result;
		});
		Measurement.find().exec(function( err, result) {
			measurements = result;
		});

		Substance.find({type: 4}).populate('category').populate('measurement').exec(function (err, result){
      return res.view('admin/assoc_item', {allAssocItems: result, categories: categories, measurements: measurements} );
    });
  },



   /**
   * `AdminController.get_assoc_item()`
   */
  get_assoc_item: function (req, res) {
		var categories = {}, measurements = {};
		Category.find().exec(function( err, result) {
			categories = result;
		});
		Measurement.find().exec(function( err, result) {
			measurements = result;
		});

		Substance.find({type: 4}).populate('category').populate('measurement').exec(function (err, result){
        return res.json({allAssocItems: result, categories: categories, measurements: measurements});
    });
  },


  /**
   * `AdminController.basic_ingred()`
   */
  basic_ingred: function (req, res) {
		var categories = {}, measurements = {};
		Category.find().exec(function( err, result) {
			categories = result;
		});
		Measurement.find().exec(function( err, result) {
			measurements = result;
		});

		Substance.find({type: 1}).populate('category').populate('measurement').exec(function (err, result){
      return res.view('admin/basic_ingred', {allBasicIngreds: result, categories: categories, measurements: measurements} );
    });
  },


  /**
   * `AdminController.intmd_item()`
   */
  intmd_item: function (req, res) {
		var categories = {}, measurements = {};
		Category.find().exec(function( err, result) {
			categories = result;
		});
		Measurement.find().exec(function( err, result) {
			measurements = result;
		});

		Substance.find({type: 2}).populate('category').populate('measurement').exec(function (err, result){
      return res.view('admin/intmd_item', {allIntmdItems: result, categories: categories, measurements: measurements} );
    });
  },

  /**
   * `AdminController.menu_item_balance()`
   */
  menu_item_balance: function (req, res) {
		var menuItems = {}, menuItemIds = [], measurementsMap = {};

    Measurement.find().exec(function( err, result) {
      result.forEach(function(measurement) {
				measurementsMap[measurement.id] = measurement.title;
			});
		});

		Substance.find({type: 3}).exec(function (err, result){
      menuItems = result;
			menuItems.forEach(function(menuItem) {
				menuItemIds.push(menuItem.id);
			});

			Net_stock.find({substance: menuItemIds }).populate('substance').exec(function (err, result){
	      return res.view('admin/menu_item_balance', {allMenuItemsBalance: result, menuItems: menuItems, measurementsMap: measurementsMap} );
	    });

    });
  },


  /**
   * `AdminController.basic_ingred_balance()`
   */
  basic_ingred_balance: function (req, res) {
		var basicIngreds = {}, basicIngredIds = [], measurementsMap = {};

    Measurement.find().exec(function( err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

		Substance.find({type: 1}).exec(function (err, result){
      basicIngreds = result;
			basicIngreds.forEach(function(basicIngred) {
				basicIngredIds.push(basicIngred.id);
			});

			Net_stock.find({substance: basicIngredIds }).populate('substance').exec(function (err, result){
	      return res.view('admin/basic_ingred_balance', {allBasicIngredsBalance: result, basicIngreds: basicIngreds, measurementsMap: measurementsMap} );
	    });

    });
  },


  /**
   * `AdminController.assoc_item_balance()`
   */
  assoc_item_balance: function (req, res) {
		var assocItems = {}, assocItemIds = [], measurementsMap = {};

    Measurement.find().exec(function( err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

		Substance.find({type: 4}).exec(function (err, result){
      assocItems = result;
			assocItems.forEach(function(assocItem) {
				assocItemIds.push(assocItem.id);
			});

			Net_stock.find({substance: assocItemIds }).populate('substance').exec(function (err, result){
	      return res.view('admin/assoc_item_balance', {allAssocItemsBalance: result, assocItems: assocItems, measurementsMap: measurementsMap} );
	    });

    });
  },


  /**
   * `AdminController.left_over_balance()`
   */
  left_over_balance: function (req, res) {
		var intmdItems = {}, intmdItemIds = [], measurementsMap = {};

    Measurement.find().exec(function( err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

		Substance.find({type: 2}).exec(function (err, result){
      intmdItems = result;
			intmdItems.forEach(function(intmdItem) {
				intmdItemIds.push(intmdItem.id);
			});

			Net_stock.find({substance: intmdItemIds }).populate('substance').exec(function (err, result){
	      return res.view('admin/left_over_balance', {allIntmdItemsBalance: result, intmdItems: intmdItems, measurementsMap: measurementsMap} );
	    });

    });
  },


  /**
   * `AdminController.menu_item_stock()`
   */
  menu_item_stock: function (req, res) {
    var menuItems = {}, menuItemIds = [], measurementsMap = {};

    Measurement.find().exec(function( err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

		Substance.find({type: 3}).exec(function (err, result){
      menuItems = result;
			menuItems.forEach(function(menuItem) {
				menuItemIds.push(menuItem.id);
			});

			Stock.find({substance: menuItemIds }).populate('substance').exec(function (err, result){
	      return res.view('admin/menu_item_stock', {allMenuItemsStock: result, menuItems: menuItems, measurementsMap: measurementsMap} );
	    });

    });
  },


  /**
   * `AdminController.basic_ingred_stock()`
   */
  basic_ingred_stock: function (req, res) {
		var basicIngreds = {}, basicIngredIds = [], measurementsMap = {};

    Measurement.find().exec(function( err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

		Substance.find({type: 1}).exec(function (err, result){
      basicIngreds = result;
			basicIngreds.forEach(function(basicIngred) {
				basicIngredIds.push(basicIngred.id);
			});

			Stock.find({substance: basicIngredIds }).populate('substance').exec(function (err, result){
	      return res.view('admin/basic_ingred_stock', {allBasicIngredsStock: result, basicIngreds: basicIngreds, measurementsMap: measurementsMap} );
	    });

    });
  },


  /**
   * `AdminController.assoc_item_stock()`
   */
  assoc_item_stock: function (req, res) {
		var assocItems = {}, assocItemIds = [], measurementsMap = {};

    Measurement.find().exec(function( err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

		Substance.find({type: 4}).exec(function (err, result){
      assocItems = result;
			assocItems.forEach(function(assocItem) {
				assocItemIds.push(assocItem.id);
			});

			Stock.find({substance: assocItemIds }).populate('substance').exec(function (err, result){
	      return res.view('admin/assoc_item_stock', {allAssocItemsStock: result, assocItems: assocItems, measurementsMap: measurementsMap} );
	    });

    });
  },


  /**
   * `AdminController.left_over_stock()`
   */
  left_over_stock: function (req, res) {
		var intmdItems = {}, intmdItemIds = [], measurementsMap = {};

    Measurement.find().exec(function( err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

		Substance.find({type: 2}).exec(function (err, result){
      intmdItems = result;
			intmdItems.forEach(function(intmdItem) {
				intmdItemIds.push(intmdItem.id);
			});

			Stock.find({substance: intmdItemIds }).populate('substance').exec(function (err, result){
	      return res.view('admin/left_over_stock', {allIntmdItemsStock: result, intmdItems: intmdItems, measurementsMap: measurementsMap} );
	    });

    });
  },


  /**
   * `AdminController.composition()`
   */
  composition: function (req, res) {
    var substances = {};

    Substance.find().exec(function (err, result){
      substances = result;
    });

    Composition.find().populate('substance').populate('composition').exec(function (err, result){
      return res.view('admin/compositions', {allCompositions: result, substances: substances} );
    });
  },


  /**
   * `AdminController.recipe()`
   */
  recipe: function (req, res) {
    var substances = {}, stations = {};

    Substance.find().exec(function (err, result){
      substances = result;
    });

    Station.find().exec(function (err, result){
      stations = result;
    });

    Recipe.find().populate('substance').populate('station').exec(function (err, result){
      return res.view('admin/recipes', {allRecipes: result, substances: substances, stations:stations} );
    });
  },


  /**
   * `AdminController.recipe_sub_tasks()`
   */
  recipe_sub_tasks: function (req, res) {
    var recipes = {};

    Recipe.find().exec(function (err, result){
      recipes = result;
    });

    Recipe_sub_tasks.find().populate('main_recipe_task').exec(function (err, result){
      return res.view('admin/recipe_sub_tasks', {allRecipeSubTasks: result, recipes: recipes} );
    });
  },


  /**
   * `AdminController.step()`
   */
  step: function (req, res) {
    var substances = {}, recipes = {};

    Substance.find().exec(function (err, result){
      substances = result;
    });

    Recipe.find().exec(function (err, result){
      recipes = result;
    });

    Step.find().populate('substance').populate('recipe').exec(function (err, result){
      return res.view('admin/steps', {allSteps: result, substances: substances, recipes: recipes} );
    });
  },


  /**
   * `AdminController.menu()`
   */
  menu: function (req, res) {
    var menuItems = {}, measurementsMap = {};

    Measurement.find().exec(function( err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

    Substance.find({type: [3, 4]}).exec(function (err, result){
      menuItems = result;
    });

    Menu.find().populate('substance').exec(function (err, result){
      return res.view('admin/menu', {allMenus: result, menuItems: menuItems, measurementsMap: measurementsMap} );
    });
  },


  /**
   * `AdminController.requirement()`
   */
  requirement: function (req, res) {
    var substances = {}, statuses = {}, measurementsMap = {};

    Measurement.find().exec(function( err, result) {
      result.forEach(function(measurement) {
        measurementsMap[measurement.id] = measurement.title;
      });
    });

    Substance.find().exec(function (err, result){
      substances = result;
    });

    Status.find().exec(function (err, result){
      statuses = result;
    });

    Requirement.find().populate('substance').populate('status').exec(function (err, result){
      return res.view('admin/requirements', {allRequirements: result, substances: substances, statuses: statuses, measurementsMap: measurementsMap} );
    });
  },


  /**
   * `AdminController.job()`
   */
  job: function (req, res) {
    var recipes = {}, statuses = {}, measurementsMap = {};

    Substance.find().populate('measurement').exec(function (err, result){
      result.forEach(function(substance) {
        measurementsMap[substance.id] = substance.measurement.title;
      });
    });

    Recipe.find().exec(function (err, result){
      recipes = result;
    });

    Status.find().exec(function (err, result){
      statuses = result;
    });

    Job.find().populate('recipe').populate('status').exec(function (err, result){
      return res.view('admin/jobs', {allJobs: result, recipes: recipes, statuses: statuses, measurementsMap: measurementsMap} );
    });
  },


  /**
   * `AdminController.measurement()`
   */
  measurement: function (req, res) {
		Measurement.find().exec(function (err, result){
      return res.view('admin/measurements', {allMeasurements: result} );
    });
  },


  /**
   * `AdminController.station()`
   */
  station: function (req, res) {
		Station.find().exec(function (err, result){
      return res.view('admin/stations', {allStations: result} );
    });
  },


  /**
   * `AdminController.status()`
   */
  status: function (req, res) {
		Status.find().exec(function (err, result){
      return res.view('admin/status', {allStatus: result} );
    });
  },


  /**
   * `AdminController.type()`
   */
  type: function (req, res) {
		Type.find().exec(function (err, result){
      return res.view('admin/types', {allTypes: result} );
    });
  },


  /**
   * `AdminController.category()`
   */
  category: function (req, res) {
		Category.find().exec(function (err, result){
      return res.view('admin/category', {allCategory: result} );
    });
  },
  getcategory: function (req, res) {
		Category.find().exec(function (err, result){
      return res.json({allCategory: result} );
    });
  }
};
