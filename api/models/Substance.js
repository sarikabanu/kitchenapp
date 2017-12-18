/**
 * Substance.js
 *
 * @description :: The Substance table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'substance',
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
    updated: {
      type: 'datetime',
      required: false,
      // defaultsTo: 'CURRENT_TIMESTAMP'
    },
    type: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'type'
    },
    measurement: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'measurement'
    },
    category: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      defaultsTo: null,
      model: 'category'
    },
    recipe_available: {
      type: 'boolean',
      required: false
    }
  },
  afterCreate: function(insertedRecord, callback) {
    updateNetStock(insertedRecord, callback);
  },
};

function updateNetStock(substanceInserted, callback) {

  // Update the net_stock based on the transaction.
  Net_stock.find({
    substance: substanceInserted.id
  }).exec(function(err, selectedNetStock) {
    if (err) return callback(err);

    if (selectedNetStock === null || selectedNetStock.length <= 0) {
      Net_stock.create({
        title: 'Net stock balance for substance - ' + substanceInserted.id,
        description: 'Net stock balance for substance - ' + substanceInserted.id,
        substance: substanceInserted.id,
        net_quantity: 0
      }).exec(function(err, createdNetStock) {
        if (err) return callback(err);
        return callback();
      });

    }

  });
}
