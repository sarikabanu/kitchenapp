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
    }
  }
};
