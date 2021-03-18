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
           userId,
           username,
           user_email,
           sales_rep_email,
           membership_premium
        } = ctx.request.body

        console.log("Backend called = ", ctx.request.body)

        console.log("Backend called data ", data)
        console.log("Backend called name ", data.name)
        console.log("Backend called category ", data.category)
        console.log("Backend called district ", data.district)
        console.log("Backend called Image ", data.mainImage)

        console.log("Backend called clientId ", clientId)
        console.log("Backend called userId ", userId)
        console.log("Backend called membership_premium ", membership_premium)

       let created_date = new Date();

       console.log(created_date);

        let client_name = data.name; // We will remove this soon and only have branch name.
        let branch_name = data.name;
        let Branch_contact = data.email;
        let branch_number = data.phone;
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
        let premium_membership = membership_premium
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
            branch_number,
            website_url,
            social_media_fb,
            social_media_instagram,
            branch_description_small,
            branch_description_long,
            Discount_alt,
            branch_user,
            premium_membership,
                       // Fair_pricing,
            // English_speaking,
            // Parking,
            // family_friendly,
            // wifi,
        }

        console.log("Create entity")
        console.log("Email went to - " + user_email);

        // The colour we will use.
        var fftGreen = "rgba(28, 219, 104)"; 
    
        try {
          const send = await strapi.plugins["email"].services.email.send({
            to: user_email,
            cc: sales_rep_email,
            bcc: "staff@ffthai.com",
            subject: `Hello ${username}!  ${branch_name} has been created.`,
            text: "Hello there",
            html: `<h1 style="color:${fftGreen};">Hello ${username},</h1>
                  <p></p>
                  <p>Am writing to confirm that your branch <strong>${branch_name}</strong>, which has been updated onto our system.</p>
                  <p></p>
                  <p>Please access the <strong>Accounts</strong> page, followed by <strong>Branches</strong> to access your Branch and edit details.</p>
                 
                  <p>Thank you again for joining us at Foreigner Friendly Thailand.</p>
                  <p></p>	
                  <p>Best regards,</p>
                  <p></p>
                  <h5>FFThai Support</h5>
                  <p></p>
                  <h2 style="color:${fftGreen};font-size:24px;">With Foreigner Friendly Thailand, everyone gets what they want!</h2>`,
            //   <img src="https://drive.google.com/file/d/1MhXXE2qfP6NIzIJ9CAae42eaqHm0NrOi/view?usp=sharing"/>`,
            //   attachments: [
            //     {
            //       filename: 'earlybed_88945d7457.jpg',
            //       path: path.join(
            //         __dirname + '/../../../public/uploads/earlybed_88945d7457.jpg'
            //       ),
            //       cid: 'https://drive.google.com/file/d/1MhXXE2qfP6NIzIJ9CAae42eaqHm0NrOi/view?usp=sharing'
            //     }
            //   ]
          });
    
          console.log("send", send);
        } catch (err) {
          console.log("Problem with email for branch - ", err);
        }

        const entity = await strapi.services.branches.create(entry);
        return sanitizeEntity(entity, { model: strapi.models.branches })
    }
};
