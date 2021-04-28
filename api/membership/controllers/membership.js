"use strict";

const { sanitizeEntity } = require("strapi-utils");

const lengthOfPackage = 12

require(`dotenv`).config();

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /*  setUpOmise: async (ctx) =>  {
    console.log("setupOmise called")

    const {
      cart
    } = ctx.request.body;


    console.log("Called Omise Backend ", cart[0].nonce, cart[0].amountForOmise, cart[0].customer_email, cart[0].return_uri)

    let tok = cart[0].nonce
    let amount = cart[0].amountForOmise
    let email = cart[0].customer_email
    let user = cart[0].customer

    let omiseResponseCustomer;
    let omiseResponseCard;

    let return_uri = cart[0].return_uri

    try {

      let omiseCustomer = await omise.customers.create({
        'email':       email,
        'description': user,
        'card':        tok,
      }, function(err, resp) {
          // resp.setHeader('Access-Control-Allow-Origin',"http://localhost:8000");
          // resp.setHeader('Access-Control-Allow-Headers',"*");
          // resp.header('Access-Control-Allow-Credentials', true);
          if (resp) {
            console.log("Response Success Customer - ", resp)
            omiseResponseCustomer = resp
            //Success
          } else {
            //Handle failure
            console.log("Response Customer Error - ", err)
    
            // throw resp.failure_code;
          }
        });
  
      console.log("Response 1 - ", omiseResponseCustomer)

      let description = `Payment for ${email}`
  
      let omiseCharges = await omise.charges.create({
          'description': description,
          'amount': amount, // 1,000 Baht
          'currency': 'thb',
          // 'capture': false,
          'customer': omiseCustomer.id,
          'return_uri': return_uri
        }, function(err, resp) {

          if (resp) {
            console.log("Response Success Card - ", resp)
            omiseResponseCard = resp
            //Success
          } else {
            //Handle failure
            console.log("Response Card Error - ", err)
    
            // throw resp.failure_code;
          }
        });
  
        console.log("Response 2 - ", omiseResponseCard)

        return omiseResponseCard


      } catch (error) {
      console.log("Thrown Error - ", error)

      }


  }, */

  create: async (ctx) => {
   /* const { 
      code,
      codePrice,
      userId,
      paymentType,
      test,

     } = ctx.request.body;

     console.log("**** check data - ", code, codePrice, userId, paymentType, test);
*/

    const { 
      data

     } = ctx.request.body;

    console.log("**** check data - ", data.code, data.codePrice, data.userId, data.paymentType);

    console.log("**** check data  2 - ", ctx.request.body);

    let code = data.code;
    let codePrice = data.codePrice;
    let userId = data.userId;
    let paymentType = data.packageType


    //2. Part of Omise 3D security, check that the chargeId matches the charge.

    // If user has paid by QR this is not needed
    if (!paymentType === "Free" || !codePrice === 0) {
      // This needs to be done later
      console.log("User has paid through Omise");
    }
      /*
    let omiseCheckCharge = await omise.charges.retrieve(chargeId, function(err, resp) {

      if (resp) {
       console.log("******** Omise Check- ", resp)
 
       console.log("******** Omise Check 2- ", resp.status)
 
       if (resp.status !== "successful") {
         console.log("******** Omise Check Failure- ")
         ctx.response.status = 402;
         return { error: "Payment did not go through" };
       }
 
       //Success
     } else {
       //Handle failure
       console.log("******** Omise Check Err - ", err)
       ctx.response.status = 402;
 
       // throw resp.failure_code;
     }
   });
 
 
     //Check if paymentIntent was not already used to generate an order
     const alreadyExistingOrder = await strapi.services.order.find({
       payment_intent_id: chargeId,
     });
 
     if (alreadyExistingOrder && alreadyExistingOrder.length > 0) {
       console.log("ALready Used - ");
 
       ctx.response.status = 402;
       return { error: "This payment intent was already used" };
     }

    } */

    let codeId = null

      const foundCode = await strapi.services.codes.findOne({
        code: code,
      });

      if (foundCode) {
        console.log("Check foundCode ", foundCode);
        codeId = foundCode.id
      }

      /*

    let paymentInfo;

    const payment_intent_id = chargeId;

    */

      let price = 0;
      let lengthOfPackage = 12;

      let price_passed = parseInt(price);

      // Then we multiply by 100 as it is in lowest form, i.e. 100 baht is 10000 (including satang).
      price_passed = price_passed * 100;

      /*  console.log("order.create Check price ", price);
    console.log("order.create Check price_passed ", price_passed);
    // console.log("order.create Check Amount ", paymentInfo.amount);

    console.log("order.create Check price ", package_type);

    console.log(typeof price);
    console.log(typeof price_passed);
    // console.log(typeof paymentInfo.amount); */


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
          subject: `Welcome To Your Foreigner Friendly Thailand Membership.`,
          text: "Hello there",
          html: `<h1 style="color:${fftGreen};">Hello ${userName},</h1>
            <p></p>
            <p><strong>Foreigner Friendly Thailand</strong> can confirm your membership has been activated.</p>
            <p>You can now claim discounts by clicking on the Claim Discount button under each listing.</p>
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
