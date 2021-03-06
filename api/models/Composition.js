/**
 * Composition.js
 *
 * @description :: The Composition table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'composition',
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
    substance: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'substance'
    },
    composition: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'substance'
    },
    proportion: {
      type: 'float',
      required: true
    }
  }
};
