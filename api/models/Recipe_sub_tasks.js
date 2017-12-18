/**
 * Recipe_sub_tasks.js
 *
 * @description :: The Recipe_sub_tasks table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'recipe_sub_tasks',
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
      size: 45,
      defaultsTo: null
    },
    updated: {
      type: 'datetime',
      required: false,
      // defaultsTo: null
    },
    main_recipe_task: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'recipe'
    },
    sequence: {
      type: 'integer',
      required: true,
      size: 11
    }
  }
};
