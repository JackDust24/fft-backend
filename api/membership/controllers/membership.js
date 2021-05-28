"use strict";

const { sanitizeEntity } = require("strapi-utils");

const lengthOfPackage = 12

require(`dotenv`).config();

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  create: async (ctx) => {

    const { 
      data

     } = ctx.request.body;

    console.log("**** check data - ", data.code, data.codePrice, data.userId, data.paymentType, data.country);

    console.log("**** check data  2 - ", ctx.request.body);

    let code = data.code;
    let codePrice = data.codePrice;
    let userId = data.userId;
    let paymentType = data.packageType;
    let country = data.country;



    let codeId = null

      const foundCode = await strapi.services.codes.findOne({
        code: code,
      });

      if (foundCode) {
        console.log("Check foundCode ", foundCode);
        codeId = foundCode.id
      }

      let price = 0;
      let lengthOfPackage = 12;

      let price_passed = parseInt(price);

      // Then we multiply by 100 as it is in lowest form, i.e. 100 baht is 10000 (including satang).
      price_passed = price_passed * 100;

      const randomString = (length) => {
        var emptyString = "";
        var alphabet =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTVWXYZ0123456789";

        while (emptyString.length < length) {
          emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
        }

        return emptyString;
      };

      const random = randomString(12);
      const membership_id = `FFTMB-${random}`;
      console.log(membership_id);

      const created_date = new Date();

      let membership_expiry = new Date(created_date);
      console.log("Date - ", membership_expiry.toLocaleDateString());
      membership_expiry.setMonth(membership_expiry.getMonth() + lengthOfPackage);
      console.log("New Date - ", membership_expiry.toLocaleDateString());
   
      console.log("Membership Expiry ", membership_expiry);

      const start_date = new Date();
      const end_date = membership_expiry;


      console.log(created_date, start_date, end_date);

      const membership_role = "member"
      const member = userId
      const payment_type = paymentType

    
      // 3 TO DO - Add packages chosen and username
      const entry = {
        membership_id,
        membership_role,
        created_date,
        start_date,
        end_date,
        member,
        payment_type,
        price,
        code: codeId,
        country,
        live: true,
      };

      console.log("create", entry);

      const entity = await strapi.services.membership.create(entry);
      console.log("entity - ", entity);
      console.log("entity 2 - ", entity.member.email);

      //5
      let userEmail = `${entity.member.email}`;
      let userName = `${entity.member.username}`;

      // The colour we will use.
      var fftGreen = "rgba(28, 219, 104)";

      // If they paid we want to show the payment.
      try {
        const send = await strapi.plugins["email"].services.email.send({
          to: userEmail,
          bcc: "staff@ffthai.com",
          subject: `Welcome To Foreigner Friendly Thailand.`,
          text: "Hello there",
          html: `<h1 style="color:${fftGreen};">Hello ${userName},</h1>
            <p></p>
            <p><strong>Foreigner Friendly Thailand</strong> can confirm your membership has been activated.</p>
            <p>You can now claim discounts by going to the Search screen in www.ffthai.com/site/search and clicking on a business.</p>
            <p> From there, click the <strong>Claim Discount</strong> button to show the business.</p>
            <p></p>	
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
        console.log("Problem with email job - ", err);
      }
    
    return sanitizeEntity(entity, { model: strapi.models.membership });
    
  },
};
