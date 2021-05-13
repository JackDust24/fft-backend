"use strict";
const { sanitizeEntity } = require("strapi-utils");

const launchDate = '2021-06-01T00:00:00.527Z';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  create: async (ctx) => {
    const {
      business_name,
      client_contact,
      client_email,
      sales_rep,
      sales_rep_email,
      business_category,
      business_sub_category,
      terms,
      setup_by,
      client_id,
      discount_info,
      package_type,
      lengthOfPackage,
      startDate,
    } = ctx.request.body;

    //Check if the data is proper 2
    console.log("clients.create business_name ", business_name);
    console.log("clients.create client_contact ", client_contact);
    console.log("clients.create client_email ", client_email);
    console.log("clients.create sales_rep ", sales_rep);
    console.log("clients.create client_id ", client_id);
    console.log("clients.create sales_rep_email ", sales_rep_email);
    console.log("clients.create business_category ", business_category);
    console.log("clients.create business_sub_category ", business_sub_category);
    console.log("clients.create terms ", terms);
    console.log("clients.create discount_info ", discount_info);
    console.log("clients.create package_type ", package_type);
    console.log("clients.create lengthOfPackage ", discount_info);
    console.log("clients.create startDate ", discount_info);

    console.log("clients.create ctx.request.body ", ctx.request.body);

    console.log(typeof setup_by);

    // Create Internal ID
    const randomString = (length) => {
      var emptyString = "";
      var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTVWXYZ";

      while (emptyString.length < length) {
        emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
      }

      return emptyString;
    };

    const randomNumber = (length) => {
      var emptyString = "";
      var alphabet = "0123456789";

      while (emptyString.length < length) {
        emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
      }

      return emptyString;
    };

    const randomNum = randomNumber(5);
    const randomStr = randomString(3);

    // Set properties for adding entry
    const InternalID = `FFTCLI-${randomNum}${randomStr}A`;
    console.log("******** Check bus ID - " + InternalID);

    const client_user = client_id;

    // Deal with membership packages for the client
    let premium_membership = false
    if (package_type === "Premium") {
      premium_membership = true
      console.log("******** premium_membership true - ", + premium_membership);

    }

    // Work out membership start
    let membership_start;
    let passedInDate = Date.parse(startDate);
    let fftSetDate = Date.parse(launchDate);
    if (passedInDate > fftSetDate) {
      membership_start = Date(startDate);
      console.log("Chosen date is after launch date ", membership_start);
 
    } else {
      membership_start = new Date(launchDate);
      console.log("Chosen date is before launch date ", membership_start);

    }

    // Work out membership end
    // Work out date
    let membership_expiry = new Date(membership_start);
    console.log("Date - ", membership_expiry.toLocaleDateString());
    membership_expiry.setMonth(membership_expiry.getMonth() + lengthOfPackage);
    console.log("New Date - ", membership_expiry.toLocaleDateString());
 
    console.log("Membership Expiry ", membership_expiry);


    const entry = {
      business_name,
      setup_by,
      client_user,
      client_contact,
      terms,
      contact_business: client_email,
      business_category,
      business_sub_category,
      discount_info,
      InternalID,
      premium_membership,
      membership_start,
      membership_expiry
    };

    // Set properties for email
    let userEmail = client_email;
    let username = setup_by;

    console.log("Email went to - " + userEmail);

    // The colour we will use.
    var fftGreen = "rgba(28, 219, 104)";

    try {
      const send = await strapi.plugins["email"].services.email.send({
        to: userEmail,
        cc: sales_rep_email,
        bcc: "staff@ffthai.com",
        subject: `Hello ${username}!  ${business_name} has been created.`,
        text: "Hello there",
        html: `<h1 style="color:${fftGreen};">Hello ${username},</h1>
                  <p></p>
                  <p></strong>Ref: InternalID: <strong>${InternalID}</strong></p>
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
      console.log("Problem with email business - ", err);
    }

    const entity = await strapi.services.clients.create(entry);
    return sanitizeEntity(entity, { model: strapi.models.clients });
  },
};
