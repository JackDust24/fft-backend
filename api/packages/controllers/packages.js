'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");


module.exports = {


        async findOne(ctx) {
      
          console.log("Code received - ");
          const { id } = ctx.params;
      
          console.log("Code received 2 - ", id);
      
      
          const entity = await strapi.services.packages.findOne({ id });
      
          const model = strapi.models.packages
      
          return sanitizeEntity(entity, { model: model });
        },

};
