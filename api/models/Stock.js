/**
 * Stock.js
 *
 * @description :: The Stock table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'stock',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id: {
      type: 'integer',
      required: false,
      autoIncrement: true,
      primaryKey: true,
      size: 11
    },
    title: {
      type: 'string',
      required: true,
      size: 45
    },
    description: {
      type: 'string',
      required: false,
      size: 100,
      defaultsTo: null
    },
    date: {
      type: 'datetime',
      required: false,
      // defaultsTo: 'CURRENT_TIMESTAMP'
    },
    updated: {
      type: 'datetime',
      required: false,
      // defaultsTo: 'CURRENT_TIMESTAMP'
    },
    quantity: {
      type: 'float',
      required: true
    },
    transaction_type: {
      type: 'integer',
      required: true,
      size: 11,
      defaultsTo: 0,
      enum: [-1, +1]
    },
    substance: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'substance'
    }
  },
  // Lifecycle Callbacks
  beforeCreate: function(values, callback) {
    return checkIfStockTransactionIsAllowed(values, callback);
  },
  afterCreate: function(insertedRecord, callback) {
    updateNetStock(insertedRecord, callback);
  },
  beforeUpdate: function(values, callback) {
    callback('Stock transaction records cannot be modified!');
  },
};


function checkIfStockTransactionIsAllowed(stockTransaction, callback) {

  // Check if there is enough balance, before reducing the stock
  if (stockTransaction.transaction_type == -1) {
    Net_stock.find({
      substance: stockTransaction.substance
    }).exec(function(err, selectedNetStock) {
      if (err) return callback(err);

      if (selectedNetStock.length <= 0 || selectedNetStock[0].net_quantity < stockTransaction.quantity) {
        callback('Sufficient balance is not available in stock for this material');
      } else {
        callback();
      }

    });
  } else {
    callback();
  }
}

function updateNetStock(stockTransaction, callback) {

  // Update the net_stock based on the transaction.
  Net_stock.find({
    substance: stockTransaction.substance
  }).exec(function(err, selectedNetStock) {
    if (err) return callback(err);

    if (selectedNetStock === null || selectedNetStock.length <= 0) {
      Net_stock.create({
        title: 'Net stock balance for substance - ' + stockTransaction.substance,
        description: 'Net stock balance for substance - ' + stockTransaction.substance,
        substance: stockTransaction.substance,
        net_quantity: stockTransaction.quantity
      }).exec(function(err, createdNetStock) {
        if (err) return callback(err);
        updateRequirements(stockTransaction, callback);
      });

    } else {

      var updatedBalance;
      if (stockTransaction.transaction_type == -1) {
        updatedBalance = selectedNetStock[0].net_quantity - stockTransaction.quantity;
      } else {
        updatedBalance = selectedNetStock[0].net_quantity + stockTransaction.quantity;
      }

      if (updatedBalance < 0) {
        return callback('Net balance cannot go negative!');
      }

      Net_stock.update({
        substance: stockTransaction.substance
      }, {
        net_quantity: updatedBalance
      }).exec(function(err, updatedNetStock) {
        if (err) return callback(err);
        updateRequirements(stockTransaction, callback);
      });
    }

  });
}

function updateRequirements(stockTransaction, callback) {
  var dateSelected = new Date(stockTransaction.date);

  Requirement.find({
    status: 1,
    date: dateSelected,
    substance: stockTransaction.substance
  }).exec(function(err, allRequirements) {

    if(allRequirements === null || allRequirements === undefined || allRequirements.length < 0){
      return callback();
    }

    var totalQuantity = stockTransaction.quantity;
    allRequirements.forEach(function(eachRequirement) {

      if(totalQuantity === 0){
        return callback();
      }

      if(eachRequirement.quantity == totalQuantity){
        totalQuantity = 0;
        eachRequirement.status = 3;
      } else if(eachRequirement.quantity < totalQuantity) {
        totalQuantity -= eachRequirement.quantity;
        eachRequirement.status = 3;
      } else if(eachRequirement.quantity > totalQuantity) {
        eachRequirement.quantity -= totalQuantity;
      }

      Requirement.update({
        id: eachRequirement.id
      },{
        status: eachRequirement.status,
        completed: eachRequirement.quantity
      }).exec();

    });

    return callback();
  });

}
