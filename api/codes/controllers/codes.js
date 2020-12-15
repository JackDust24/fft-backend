'use strict';

const { sanitizeEntity } = require("strapi-utils");


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {


        async findOne(ctx) {
      
          console.log("Code received - ");
          const { slug } = ctx.params;
      
          console.log("Code received 2 - ", slug);
      
      
          const entity = await strapi.services.codes.findOne({ slug });
      
          const model = strapi.models.codes
      
          return sanitizeEntity(entity, { model: model });
        },


};
