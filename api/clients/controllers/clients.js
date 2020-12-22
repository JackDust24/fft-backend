'use strict';
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    create: async (ctx) => {
        const {
            business_name,
            business_display_name,
            client_contact,
            client_email,
            franchise,
            sales_rep,
            sales_rep_email,
            business_category,
            business_sub_category,
            terms,
            address,
            coordinates,
            setup_by,
            client_id,
            discount_info
        } = ctx.request.body

       
        //Check if the data is proper 2
        console.log("clients.create cart ", business_name)
        console.log("clients.create cart ", business_display_name)
        console.log("clients.create cart ", client_contact)
        console.log("clients.create cart ", client_email)
        console.log("clients.create cart ", franchise)
        console.log("clients.create cart ", sales_rep)
        console.log("clients.create cart ", address, coordinates, setup_by)
        console.log("clients.create cart ", client_id)
        console.log("clients.create cart ", sales_rep_email)
        console.log("clients.create cart ", business_category)
        console.log("clients.create cart ", business_sub_category)
        console.log("clients.create cart ", terms)
        console.log("clients.create cart ", discount_info)

        console.log("clients.create ctx.request.body ", ctx.request.body)

         console.log(typeof setup_by)

         const randomString = (length) => {
            let chars = [],
              output = "";
            for (let i = 33; i < 127; i++) {
              chars.push(String.fromCharCode(i));
            }
            for (let i = 0; i < length; i++) {
              output += chars[Math.floor(Math.random() * chars.length)];
            }
            return output;
          };
      
          const internalID = `FFT${randomString(25)}`;
          console.log("******** Check bus ID - " + internalID);

        // DO a double check here:
        const client_user = client_id


        const entry = {
            business_name,
            business_display_name,
            client_contact,
            client_email,
            franchise,
            sales_rep,
            address,
            coordinates,
            setup_by,
            client_user,
            terms,
            sales_rep_email,
            business_category,
            business_sub_category,
            discount_info,
            internalID
        }

        let userEmail = client_email;
        let username = setup_by;

        console.log("Email went to - " + userEmail);
    
        try {
          const send = await strapi.plugins["email"].services.email.send({
            to: userEmail,
            cc: sales_rep_email,
            bcc: "staff@ffthai.com",
            subject: `Hello ${username}!  ${business_name} has been created.`,
            text: "Hello there",
            html: `<h1>Hello ${username},</h1>
                  <p></p>
                  <p>Am writing to confirm we have received your initial details regarding <strong>${business_name}</strong>, which has been updated onto our system.</p>
                  <p></p>
                  <p>The site is currently under construction and in the coming weeks, <strong>${sales_rep}</strong>, will help guide you through on how to add more information.</p>
                 
                  <p>Thank you again for joining us at Foreigner Friendly Thailand.</p>
                  <p></p>	
                  <p>Best regards,</p>
                  <p></p>
                  <h5>FFThai Support</h5>
                  <p></p>
                  <h2 style="color:blue;font-size:24px;">With Foreigner Friendly Thailand, everyone gets what they want!</h2>`,
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
          console.log("Problem with email business - ", err);
        }
    
        const entity = await strapi.services.clients.create(entry);

        // return entity

        return sanitizeEntity(entity, { model: strapi.models.clients })

    }

};
