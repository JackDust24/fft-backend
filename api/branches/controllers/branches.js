'use strict';
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  // This is the handler for creating a comment
  review: async (ctx) => {
   
    const date = new Date();
     console.log(ctx.state.user);

    ctx.request.body.author = ctx.state.user.id;
    ctx.request.body.branch = ctx.params.id;
    ctx.request.body.posted_date = date;

    console.log(ctx.request.body);
    console.log("Check for the branch");

    console.log("Check for the comment, ", ctx.request.body.content);

      const findBranch = await strapi.services.branches.findOne({
        id: ctx.request.body.branch,
      });

      console.log("Check for the branch 2");


      if (findBranch) {
        // console.log("Check findBranch ", findBranch);
        console.log("Check for the branch 2.1");

        // console.log("Check findBranch client_email ", findBranch.client.client_email);
        console.log("Check findBranch contact_business ", findBranch.client.ccontact_business);
        console.log("Check findBranch findBranch ", findBranch);
        console.log("Check findBranch findBranch.client ", findBranch.client);


        const client_email = findBranch.client.contact_business;
        const branch_name = findBranch.client_name;
        const member = ctx.state.user.username;
        const title = ctx.request.body.title;
        const content = ctx.request.body.content;

         // The colour we will use.
         var fftGreen = "rgba(28, 219, 104)";

        try {
          const send = await strapi.plugins["email"].services.email.send({
            to: client_email,
            subject: `An FFThai member left a comment on ${branch_name}`,
            text: "Hello",
            html: `<h1 style="color:${fftGreen};">Hello,</h1>
                  <p></p>
                  <p>Am writing to inform you member <strong>${member}</strong> added a comment to <strong>${branch_name}</strong>.</p>
                  <p></p>
                  <p>Please login to www.ffthai.com/login to access this branch under Accounts>Branches to either Accept or Reject this comment to appear on your page.</p>
                  <p></p>
                  <p>The comment from ${member} is:</p>
                  <p></p>
                  <pre>${title}</pre>
                  <pre>${content}</pre>
                  <p></p>
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

      };

      console.log("Check for the branch 3");


    let entity = await strapi.services.reviews.create(ctx.request.body);
 
    return sanitizeEntity(entity, { model: strapi.models.reviews });
  },

    create: async (ctx) => {
        const {
           branchData,
           clientId,
           userId,
           username,
           user_email,
           sales_rep_email,
           membership_premium
        } = ctx.request.body

        console.log("Backend called = ", ctx.request.body)
        console.log("Backend called branchData ", branchData)
        console.log("Backend called name ", branchData.name)
        console.log("Backend called categories ", branchData.categories)
        console.log("Backend called subcategories ", branchData.subcategories)
        console.log("Backend called district ", branchData.district)
        console.log("Backend called phone ", branchData.phone)
        console.log("Backend called discount ", branchData.discount)
        console.log("Backend called businessDiscount ", branchData.businessDiscount)
        console.log("Backend called clientId ", clientId)
        console.log("Backend called userId ", userId)
        console.log("Backend called sales_rep_email ", sales_rep_email)
        console.log("Backend called membership_premium ", membership_premium)

       let created_date = new Date();

       console.log(created_date);

        let client_name = branchData.name; // We will remove this soon and only have branch name.
        let branch_name = branchData.name;
        let Branch_contact = branchData.email;
        let branch_number = branchData.phone;
        // let Category = branchData.category;
        // let Sub_category = branchData.subCategory;
        let categories = branchData.categories;
        let subcategories = branchData.subcategories;
        let Address_line_1 = branchData.address1;
        let Address_line_2 = branchData.address2;
        let District = branchData.district;
        let Province = branchData.province;
        let postCode = branchData.postCode;
        let location = branchData.location;
        let Date_created = created_date;
        let website_url = branchData.website;
        let social_media_fb = branchData.facebook;
        let social_media_instagram = branchData.instagram;
        let branch_description_small = branchData.smDescription;
        let branch_description_long = branchData.lgDescription;
        let Discount_alt = branchData.discount;  // This is the discount at branch level
        let Discount = branchData.businessDiscount; // This is the discount at business level
        let client = clientId;
        let branch_user = userId;
        let premium_membership = membership_premium

        console.log("Check called categories ", branchData.categories)
        console.log("Check called district ", branchData.district)

        const entry = {
            client_name,
            branch_name,
            Branch_contact,
            client,
            categories,
            subcategories,
            // Category,
            // Sub_category,
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
            Discount,
            Discount_alt,
            branch_user,
            premium_membership,
            sales_rep_email,
        }

        console.log("Create entity")
        console.log("Email went to - " + user_email);

        // The colour we will use.
        var fftGreen = "rgba(28, 219, 104)"; 
    
        try {
          const send = await strapi.plugins["email"].services.email.send({
            to: user_email,
            cc: sales_rep_email,
            bcc: "sales@ffthai.com",
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
    },

    // async findCategories
    // (ctx) {
    //   console.log("Find categories")
    // }
};
