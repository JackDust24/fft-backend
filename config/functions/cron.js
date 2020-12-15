'use strict';

const path = require('path');


/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '* * * * * *': () => {
  //   console.log("Cron every second")
  // }
/*
  '0 * * * * *': async () => {
    console.log("Cron every second")

let sales_rep = "Jason"

let sales_rep_email = "jason.bournemouth72@gmail.com"

    try{
      const send = await strapi.plugins['email'].services.email.send({
        to: 'jason_bournemouth@yahoo.co.uk',
        subject: 'Your Payment Went Through',
        text: 'TIGER MAN',
        html: `<h1>Congratulations You</h1>
        <h1>Hey {username},</h1>
              <p></p>
              <p>First off, thanks for your interest in Foreigner Friendly Thailand! <strong>${sales_rep}</strong>, will help guide you through the first steps of your setup.</p>
              <p></p>
              <p>We can confirm your payment of ฿{price} has been received and you can now update your initial details about your business in the business link (on the dashboard). If you are unable to access the screen, please just log in again, the website is currently under construction and {sales_rep} can guide you through when you start uploading data.</p>
              <p></p>
              <p>Thank you again, for doing us at Foreigner Friendly Thailand. If you have any questions at all, send a message on to {sales_rep} any time and we'll be happy to assist you!</p>
              <p></p>
              <p></p>	
              <p>Best regards,</p>
              <p></p>
              <p>FFT Team</p>
              // <a href={"mailto:" + ${sales_rep_email}}>Contact Us</a>
              <p></p>
              <h2 style="color:blue;font-size:24px;"}>With Foreigner Friendly Thailand, everyone gets what they want!</h2>`
      });
  
      console.log("send", send)
    } catch(err) {
      console.log("Problem with cron job - ", err);
    }

  } */
    // await strapi.plugins['email'].services.email.send({
    //   to: 'zeawbsbtfmngpwmbwn@twzhhq.online',
    //   from: 'joelrobuchon@strapi.io',
    //   cc: 'helenedarroze@strapi.io',
    //   bcc: 'ghislainearabian@strapi.io',
    //   replyTo: 'annesophiepic@strapi.io',
    //   subject: 'Use strapi email provider successfully',
    //   text: 'Hello world!',
    //   html: 'Hello world!',
    // });




  // }
};
