/**
 * Recipe.js
 *
 * @description :: The Recipe table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'recipe',
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
      required: true,
      size: 450
    },
    substance: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      defaultsTo: null,
      model: 'substance'
    },
    updated: {
      type: 'datetime',
      required: false,
      // defaultsTo: 'CURRENT_TIMESTAMP'
    },
    duration: {
      type: 'integer',
      required: false,
      size: 11,
      defaultsTo: null
    },
    station: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      defaultsTo: null,
      model: 'station'
    }
  },
  // Lifecycle Callbacks
  afterCreate: function(values, callback) {
    return updateSubstance(values, callback);
  },
  afterUpdate: function(values, callback) {
    return updateSubstance(values, callback);
  },
};

function updateSubstance(values, callback) {
  Substance.find({
    id: values.substance
  }).exec(function(err, substance) {
    if(err) return callback(err);

    if(substance[0].recipe_available === 0){
      Substance.update({
        id: values.substance
      }, {
        recipe_available: 1
      }).exec();
    }
    return callback();
  });

}
