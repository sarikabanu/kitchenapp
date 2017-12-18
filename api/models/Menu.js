/**
 * Menu.js
 *
 * @description :: The Menu table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'menu',
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
    date: {
      type: 'datetime',
      required: true,
      // defaultsTo: 'CURRENT_TIMESTAMP'
    },
    substance: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'substance'
    },
    quantity: {
      type: 'float',
      required: true,
      size: 11
    },
    count: {
      type: 'integer',
      required: false
    },
    parent: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      defaultsTo: null,
      model: 'menu'
    },
  },
  // Lifecycle Callbacks
  beforeCreate: function(values, callback) {
    return updateCount(values, callback);
  },
  beforeUpdate: function(values, callback) {
    return updateCount(values, callback);
  },
  afterCreate: function(record, callback) {
    return updateRequirements(record, callback);
  },
  afterUpdate: function(record, callback) {
    return updateRequirements(record, callback);
  }
};

function updateCount(values, callback) {
  Substance.find({
    id: values.substance
  }).exec(function(err, substance) {
    if(err) return callback(err);
    if(substance[0].type == 3){
      values.count = 1;
    }
    return callback();
  });

}

function updateRequirements(record, callback) {
  var dateSelected = new Date(record.date);
  Requirement.find({
    substance: record.substance,
    date: dateSelected,
    status: 1
  }).exec(function(err, requirement) {
    if(err) return callback(err);
    if(requirement.length > 0){

      Requirement.update({
        id: requirement[0].id
      }, {
        quantity: record.quantity + requirement[0].quantity,
      }).exec(function(err, updatedRequirement) {
        if(err) return callback(err);
        return callback();
      });
    } else {

      Requirement.create({
        substance: record.substance,
        date: dateSelected,
        quantity: record.quantity,
        status: 1,
        completed: 0
      }).exec(function(err, createdRequirement) {
        if(err) return callback(err);
        return callback();
      });
    }
  });

}
