/**
 * Job.js
 *
 * @description :: The Job table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'job',
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
    updated: {
      type: 'datetime',
      required: false,
      // defaultsTo: 'CURRENT_TIMESTAMP'
    },
    date: {
      type: 'datetime',
      required: false,
      // defaultsTo: 'CURRENT_TIMESTAMP'
    },
    recipe: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'recipe'
    },
    quantity: {
      type: 'integer',
      required: true
    },
    completed: {
      type: 'integer',
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
