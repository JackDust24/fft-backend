'use strict';
const { sanitizeEntity } = require("strapi-utils");


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    create: async (ctx) => {
        const {
           data,
           clientId,
           userId
        } = ctx.request.body

        console.log("Backend called = ", ctx.request.body)

        console.log("Backend called data ", data)
        console.log("Backend called name ", data.name)
        console.log("Backend called category ", data.category)
        console.log("Backend called district ", data.district)
        console.log("Backend called Image ", data.mainImage)

        console.log("Backend called clientId ", clientId)
        console.log("Backend called userId ", userId)


       let created_date = new Date();

       console.log(created_date);

        let client_name = data.name; // We will remove this soon and only have branch name.
        let branch_name = data.name;
        let Branch_contact = data.email;
        let phone = data.phone;
        let Category = data.category;
        let Sub_category = data.subCategory;
        let Address_line_1 = data.address1;
        let Address_line_2 = data.address2;
        let District = data.district;
        let Province = data.province;
        let postCode = data.postCode;
        let location = data.location;
        let Date_created = created_date;
        // let Fair_pricing = data.fftBool;
        // let English_speaking = data.englishBool;
        // let Parking = data.parkingBool;
        // let family_friendly = data.familyBool;
        // let wifi = data.wifiBool;
        let website_url = data.website;
        let social_media_fb = data.facebook;
        let social_media_instagram = data.instagram;
        let branch_description_small = data.smDescription;
        let branch_description_long = data.lgDescription;
        let Discount_alt = data.discount;
        let client = clientId;
        let branch_user = userId;
        // let branch_logo = data.logo;
        // let main_image = 'Have to agree the docs are poor. Knowing how to upload a file from React to a new entry into a content type has got me stumped all day. Still stuck.'

        console.log("Check called category ", data.category)
        console.log("Check called district ", data.district)

        const entry = {
            client_name,
            branch_name,
            Branch_contact,
            client,
            Category,
            Sub_category,
            Address_line_1,
            Address_line_2,
            District,
            Province,
            postCode,
            Date_created,
            location,
            phone,
            website_url,
            social_media_fb,
            social_media_instagram,
            branch_description_small,
            branch_description_long,
            Discount_alt,
            branch_user,
                       // Fair_pricing,
            // English_speaking,
            // Parking,
            // family_friendly,
            // wifi,
        }

        console.log("Create entity")

        const entity = await strapi.services.branches.create(entry);
        return sanitizeEntity(entity, { model: strapi.models.branches })
    }
};
