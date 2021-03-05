"use strict";

const stripe = require('stripe')(process.env.STRIPE_KEY);

const { sanitizeEntity } = require("strapi-utils");
const path = require("path");

const omise = require('omise')({
  'secretKey': process.env.OMISE_SECRET_KEY,
  'omiseVersion': '2015-09-10'
});

const return_uri2 = `http://localhost:8000/cart/confirmation/`

require(`dotenv`).config()


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  setUpStripe: async (ctx) => {
    let total = 100;
    let validatedCart = [];
    let receiptCart = [];

    // Set up what we will be sengding to Stripe
    const { cart } = ctx.request.body;
    let customPlan = cart["0"].customplan;
    let customer = "";
    let customer_email = "";
    let sales_rep_email = "";

    console.log("***** Did Test go through? Customer? ", cart["0"].customer);
    console.log(
      "***** Did Test go through? Customer? ",
      cart["0"].customer_email
    );
    console.log(
      "***** Did Test go through? Sales Rep? ",
      cart["0"].sales_rep_email
    );

    // Set up in case, none of this info was received
    if (cart["0"].customer === undefined) {
      customer = "No Customer Name went through";
    } else {
      customer = cart["0"].customer;
    }

    if (cart["0"].sales_rep_email === undefined) {
      sales_rep_email = "No Sales Rep Allocated";
    } else {
      sales_rep_email = cart["0"].sales_rep_email;
    }

    if (cart["0"].customer_email === undefined) {
      customer_email = "staff@ffthai.com";
    } else {
      customer_email = cart["0"].customer_email;
    }

    if (customPlan == true) {
      console.log("Custom Plan = true");
    } else {
      console.log("Custom Plan = NOT true");
    }

    console.log("**** Check cart 1 ", cart["0"].price);

    // We need to set if custom plan
    await Promise.all(
      cart.map(async (packages) => {
        const validatedPackage = await strapi.services.packages.findOne({
          id: packages.id,
        });

        console.log("Check Price - ", packages.price);

        if (!customPlan) {
          console.log("Not customn Plan ");

          console.log("validatedPackage", validatedPackage);
          if (validatedPackage) {
            validatedPackage.lengthOfPackage = packages.lengthOfPackage;

            validatedCart.push(validatedPackage);

            receiptCart.push({
              id: packages.id,
              name: packages.name,
              price: packages.price,
              lengthOfPackage: packages.lengthOfPackage,
              customer: customer,
              sales_rep_email: sales_rep_email,
            });
          }
        } else {
          // For not a custom plan
          console.log("validatedPackage", validatedPackage);
          // Check first it is validated - then check the price with Codes

          if (validatedPackage) {
            const validatedCustomPage = await strapi.services.codes.findOne({
              price: packages.price,
            });

            if (validatedCustomPage) {
              validatedCustomPage.lengthOfPackage = packages.lengthOfPackage;
              console.log(
                "customn lengthOfPackage " + packages.lengthOfPackage
              );

              validatedCart.push(validatedCustomPage);

              receiptCart.push({
                id: packages.id,
                name: packages.name,
                price: packages.price,
                lengthOfPackage: packages.lengthOfPackage,
                customer: customer,
                sales_rep_email: sales_rep_email
              });
            }

            return validatedCustomPage;
          }

        }

        return validatedPackage;
      })
    );

    console.log("validatedCart - ", validatedCart);

    //Use the data from strapi to calculate the price of each product
    //Basically calculate the total that way
    total = strapi.config.functions.cart.cartTotal(validatedCart);
    console.log("total - ", total);

    let customerID = '';

    const createCustomer = await stripe.customers.create({
        description: "My First Test Customer (created for API docs)",
        name: customer,
        email: customer_email,
      });

      console.log("Did create customer + ", createCustomer);

      console.log("Did create customer ID  + ", createCustomer.id);

      customerID = createCustomer.id;

      console.log("Did create customer customerID + ", customerID);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100, // We do this to change satang to proper baht
        currency: "THB",
        metadata: { cart: JSON.stringify(receiptCart) },
        customer: customerID,
        receipt_email: customer_email,
      });

      console.log("Created paymentIntent", paymentIntent);

      return paymentIntent;
    
  },

  
  setUpOmise: async (ctx) =>  {
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


  }, 

  create: async (ctx) => {
    const {
      chargeId,
      order_name,
      sales_rep,
      username,
      user_email,
      business_name,
      sales_rep_email,
      cart,
      language_pref,
      hasPaidQRCode,
      hasFreePlan,
    } = ctx.request.body;

    // 1
    //Payment intent for validation

    console.log("**** check data - " + chargeId,
    order_name,
    sales_rep,
    username,
    user_email,
    business_name,
    sales_rep_email,
    cart,
    language_pref);

    console.log("**** check QR - ", hasPaidQRCode);

    console.log("**** check Free Plan - ", hasFreePlan);

    //2. Part of Omise 3D security, check that the chargeId matches the charge.

    // If user has paid by QR this is not needed
   if (!hasPaidQRCode && !hasFreePlan) {

    console.log("User has paid through Omise");

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
    }



    let paymentInfo;

    const payment_intent_id = chargeId;

    //Check if the data is proper 2

    console.log("order.create cart - ", cart["0"].price);

    console.log("Check cart name - ", cart["0"].name);


    let price = 0;
    let packagesChosen = [];
    let sanitizedCart = [];
    let lengthOfPackage = 0;
    let tax = 0;
    let vat = 0;
    let customplan = false;
    let package_type = cart["0"].name;
    let free_months = 0;
    let order_type = cart["0"].type 

    // Use the business_username from the user name field
    let business_username = username;

    // 6
    // We will need to do this for businesses***
    await Promise.all(
      cart.map(async (packages) => {
        const foundPackage = await strapi.services.packages.findOne({
          id: packages.strapiId,
        });

        if (foundPackage) {
          // product_qty.push({
          //     id: product.strapiId,
          //     qty: product.qty
          // })

          console.log("Check foundPackage " + packages.customplan);

          let customPlan = packages.customplan;

          if (!customPlan == true) {
            console.log("Not a custom plan");

            price = packages.price;
            lengthOfPackage = packages.lengthOfPackage;
            tax = packages.tax;
            vat = packages.vat;
            customplan = packages.customplan;
            package_type = packages.name;
            free_months = packages.free_months;
          } else {
            const foundCustomPackage = await strapi.services.codes.findOne({
              price: packages.price,
            });

            console.log("A Custom Plan ");

            price = packages.price;
            lengthOfPackage = packages.lengthOfPackage;
            tax = packages.tax;
            vat = packages.vat;
            customplan = packages.customplan;
            free_months = packages.free_months;
            // These use different settings here
            // package_type = packages.code;
          }

          packagesChosen.push(foundPackage);

          sanitizedCart.push({ ...foundPackage });
        }

        return foundPackage;
      })
    );

    // 4
    // console.log("order.create product_qty", product_qty)
    console.log("sanitizedCart", sanitizedCart);

    let price_passed = parseInt(price);

    // Then we multiply by 100 as it is in lowest form, i.e. 100 baht is 10000 (including satang).
    price_passed = price_passed * 100;

    console.log("order.create Check price ", price);
    console.log("order.create Check price_passed ", price_passed);
    // console.log("order.create Check Amount ", paymentInfo.amount);

    console.log("order.create Check price ", package_type);

    console.log(typeof price);
    console.log(typeof price_passed);
    // console.log(typeof paymentInfo.amount);

    let created_date = new Date();

    console.log(created_date);

    const randomString = (length) => {
      var emptyString = "";
      var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTVWXYZ0123456789";

      while (emptyString.length < length) {
          emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      
      return emptyString;
    }; 

    const random = randomString(12);
    const order_reference = `FFTOD-${random}`
    console.log(order_reference);

    // 3 TO DO - Add packages chosen and username
    const entry = {
      sales_rep,
      sales_rep_email,
      user_email,
      business_username,
      order_name,
      price,
      tax,
      vat,
      lengthOfPackage,
      payment_intent_id,
      customplan,
      package_type,
      free_months,
      created_date,
      order_reference,
      business_name,
      order_type
    };

    //5
    const entity = await strapi.services.order.create(entry);

    let userEmail = user_email;

    // The colour we will use.
    var fftGreen = "rgba(28, 219, 104)"; 

    // If they paid we want to show the payment.
    if (!hasFreePlan) {
      if(language_pref === "TH") {

        try {
          const send = await strapi.plugins["email"].services.email.send({
            to: userEmail,
            cc: sales_rep_email,
            bcc: "staff@ffthai.com",
            subject: `Welcome ${username}! Your Foreigner Friendly Thailand package for the ${package_type} has been activated.`,
            text: "Hello there",
            html: `<h1 style="color:${fftGreen};">Hello ${username},</h1>
                  <p></p>
                  <p>Firstly, thank you for your interest in Foreigner Friendly Thailand! <strong>${sales_rep}</strong>, will help guide you through the first steps of your setup.</p>
                  <p></p>
                  <p>We can confirm your payment of <strong>฿${price}</strong> has been received and your order number is <strong>${order_reference}</strong>. You can now add your initial details about your business through the Dashboard. If you are unable to access the screen, please just log in again, the website is currently under construction and <strong>${sales_rep}</strong> can help guide you through when you start uploading data.</p>
                  <p></p>
                  <p>Thank you again, for joining us at Foreigner Friendly Thailand. If you have any questions at all, send a message on to <strong>${sales_rep}</strong> any time and we'll be happy to assist you!</p>
                  <p></p>
                  <p><strong>Price Paid: ฿${price}</strong></p>
                  <p><strong>Tax (included in price): ฿${tax}</strong></p>
                  <p></p>	
                  <p>Best regards,</p>
                  <p></p>
                  <h5>FFThai Support</h5>
                  <p></p>
                  <h2 style="color:${fftGreen};font-size:24px;">With Foreigner Friendly Thailand, everyone gets what they want!</h2>`,
          });
    
          console.log("send", send);
        } catch (err) {
          console.log("Problem with email job - ", err);
        }
  
      } else {
        try {
          const send = await strapi.plugins["email"].services.email.send({
            to: userEmail,
            cc: sales_rep_email,
            bcc: "staff@ffthai.com",
            subject: `Welcome ${username}! Your Foreigner Friendly Thailand package for the ${package_type} has been activated.`,
            text: "Hello there",
            html: `<h1 style="color:${fftGreen};">Hello ${username},</h1>
            <p></p>
            <p>Firstly, thank you for your interest in Foreigner Friendly Thailand! <strong>${sales_rep}</strong>, will help guide you through the first steps of your setup.</p>
            <p></p>
            <p>We can confirm your payment of <strong>฿${price}</strong> has been received and your order number is <strong>${order_reference}</strong>. You can now add your initial details about your business through the Dashboard. If you are unable to access the screen, please just log in again, the website is currently under construction and <strong>${sales_rep}</strong> can help guide you through when you start uploading data.</p>
            <p></p>
            <p>Thank you again, for joining us at Foreigner Friendly Thailand. If you have any questions at all, send a message on to <strong>${sales_rep}</strong> any time and we'll be happy to assist you!</p>
            <p></p>
            <p><strong>Price Paid: ฿${price}</strong></p>
            <p><strong>Tax (included in price): ฿${tax}</strong></p>
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
      }
    } else {
      // For Free Users
      if(language_pref === "TH") {

        try {
          const send = await strapi.plugins["email"].services.email.send({
            to: userEmail,
            cc: sales_rep_email,
            bcc: "staff@ffthai.com",
            subject: `Welcome ${username}! Your Foreigner Friendly Thailand package for the Free Custom Plan has been activated.`,
            text: "Hello there",
            html: `<h1 style="color:${fftGreen};">Hello ${username},</h1>
                  <p></p>
                  <p>Firstly, thank you for your interest in Foreigner Friendly Thailand! <strong>${sales_rep}</strong>, will help guide you through the first steps of your setup.</p>
                  <p></p>
                  <p>We can confirm that you have signed up to the free plan and can now start adding your details to our system. You can now update your initial details about your business through the Dashboard. If you are unable to access the screen, please just log in again, the website is currently under construction and <strong>${sales_rep}</strong> can help guide you through when you start uploading data.</p>
                  <p></p>
                  <p>Thank you again, for joining us at Foreigner Friendly Thailand. If you have any questions at all, send a message on to <strong>${sales_rep}</strong> any time and we'll be happy to assist you!</p>
                  <p></p>	
                  <p>Best regards,</p>
                  <p></p>
                  <h5>FFThai Support</h5>
                  <p></p>
                  <h2 style="color:${fftGreen};font-size:24px;">With Foreigner Friendly Thailand, everyone gets what they want!</h2>`,
          });
    
          console.log("send", send);
        } catch (err) {
          console.log("Problem with email job - ", err);
        }
  
      } else {
        try {
          const send = await strapi.plugins["email"].services.email.send({
            to: userEmail,
            cc: sales_rep_email,
            bcc: "staff@ffthai.com",
            subject: `Welcome ${username}! Your Foreigner Friendly Thailand package for the Free Custom Plan has been activated.`,
            text: "Hello there",
            html: `<h1>Hello ${username},</h1>
            <p></p>
            <p>Firstly, thank you for your interest in Foreigner Friendly Thailand! <strong>${sales_rep}</strong>, will help guide you through the first steps of your setup.</p>
            <p></p>
            <p>We can confirm that you have signed up to the free plan and can now start adding your details to our system. You can now update your initial details about your business through the Dashboard. If you are unable to access the screen, please just log in again, the website is currently under construction and <strong>${sales_rep}</strong> can help guide you through when you start uploading data.</p>
            <p></p>
            <p>Thank you again, for joining us at Foreigner Friendly Thailand. If you have any questions at all, send a message on to <strong>${sales_rep}</strong> any time and we'll be happy to assist you!</p>
            <p></p>	
            <p>Best regards,</p>
            <p></p>
            <h5>FFThai Support</h5>
            <p></p>
            <h2>With Foreigner Friendly Thailand, everyone gets what they want!</h2>`,
          });
    
          console.log("send", send);
        } catch (err) {
          console.log("Problem with email job - ", err);
        }
      }
    }

   

    

    return sanitizeEntity(entity, { model: strapi.models.order });
  },
};
