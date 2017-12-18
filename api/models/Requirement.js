/**
 * Requirement.js
 *
 * @description :: The Requirement table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'requirement',
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
    substance: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'substance'
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
    completed: {
      type: 'float',
      required: false
    },
    status: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'status'
    }
  }
};
