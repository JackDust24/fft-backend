
const hasCustomPlan = (cart) => {
  const customPlan = cart.map((packages) => {
    console.log("True or not " + packages.customplan, packages.price);

    const custom = packages.customplan == true ? "true" : "false";

    console.log(custom);

    return custom;
  });

  if (customPlan == "true") {
    console.log("Custom Plan Package");

    const subTotal = cart["0"].price

    console.log("XXXX Custom Plan Package" + subTotal);

    return subTotal;
  } else {
    console.log("NOT Custom Plan Package");
  }

  const price = cart.map((packages) => {
    return packages.price;
  });

  return price;
}

const cartTotal = (cart) => {
  if (cart.length === 0) {
    return 0;
  }

  // const price = cart.map((packages) => {
  //   return packages.price;
  // }, 0);

  console.log("XXXX Custom Plan Package " + cart);
  console.log("XXXX Custom Plan Package " + cart.price);


  const total = hasCustomPlan(cart);

  return Math.round(total);
}

module.exports = {
  cartTotal,
  hasCustomPlan,
};
