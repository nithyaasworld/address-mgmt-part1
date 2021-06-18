const AddressModel = require("../models/address");
const UserModel = require("../models/user");
const addressController = require("./addressController");
const greenColor = "\x1b[32m";
const resetColor = "\x1b[0m";

const getAllAddresses = async ({ email }) => {
  console.log("email is: ", email);
  let result = {};
  await UserModel.find({ email })
    .populate("addresses")
    .then((data) => {
      console.log(data[0]["addresses"]);
      result["status"] = true;
      result["response"] = data[0]["addresses"];
      console.log("result at line 16", result);
    })
    .catch((err) => {
      result = { status: false, response: err };
    });
  return result;

  // console.log(greenColor + "=============================" + resetColor);
  // books.forEach((book) =>
  //   console.error(
  //     greenColor +
  //       "Title: " +
  //       book.title +
  //       "\nCategory: " +
  //       book.category.name +
  //       "\nAuthors: " +
  //       book.author.join(", ") +
  //       "\nPrice: " +
  //       book.price +
  //     "\n=============================" +
  //     resetColor
  //   )
  // );
};

//city, pincode, state, country, addressLine1, addressLine2, label
const addAddress = async ({
  email,
  city,
  pincode,
  state,
  country,
  addressLine1,
  addressLine2,
  label,
}) => {
  let userToAddAddress = await UserModel.findOne({ email: email });
  console.log("available list of address is: ", userToAddAddress.addresses);
  let result = {};
  if (userToAddAddress) {
    const address = new AddressModel({
      email,
      city,
      pincode,
      state,
      country,
      addressLine1,
      addressLine2,
      label,
    });
    await address.save().then(async (data) => {
      console.log("added added to db with data as: ", data);
      console.log("user to add new address", userToAddAddress);
      userToAddAddress.addresses.push(data._id);
      console.log("new set of addressess are: ", userToAddAddress.addresses);
      await UserModel.findOneAndUpdate(
        { email: email },
        { $set: { addresses: userToAddAddress.addresses } }
      )
        .then((data) => {
          result["status"] = true;
          result[
            "response"
          ] = `Address added successfully with the following data: ${data}`;
        })
        .catch((err) => {
          result["status"] = false;
          result["response"] = err;
        });
    });
  } else {
    result.status = false;
    result.response = "There is no such User";
    console.log(greenColor + "\nThere is no such User" + resetColor);
  }
  return result;
};
const searchAddress = async ({searchTerm, email}) => {
    let result = {};
    // city, pincode, state
  if (!searchTerm || searchTerm.length === 0) {
      result.status = false;
      result.response = "Search query is missing. Please try with valid search query".
    console.log(
      greenColor +
        "\n searchTerm is missing. Please try again with some Book searchTerm." +
        resetColor
    );
    return result;
  }
  let re = new RegExp(searchTerm, "i");
  await UserModel.find({email})
  .then(result =>{
      if(result.length > 0) {
          let subResult = [];
        for(let item in result.addresses){
            if(item["city"].includes(searchTerm) || item["pincode"].includes(searchTerm) 
            || item["state"].includes(searchTerm)){
                subResult.push(item);
            }
        }
        if (subResult.length > 0){
            result.status = true;
            result.response = subResult;
        }else {
            result.status = false;
            result.response = "No matching results found";
        }
      }else{
          result.status = false;
          result.response = "User doesn't exist"
      }
  })
//   await AddressModel.find({ searchTerm: re })
//     .then((docs) => {
//       if (!docs || docs.length === 0) {
//         console.log(greenColor + "\nNo matching records found." + resetColor);
//       } else {
//         console.log(greenColor + "\nMatching docs are" + docs + resetColor);
//       }
//     })
//     .catch((err) => console.log(err));
};
// const removeBook = async (bookToDelete) => {
//   if (!bookToDelete || bookToDelete.length === 0) {
//     console.log(
//       "\nBook address is missing. Please try again with some Book title."
//     );
//   } else {
//     await BookModel.findOne({ title: bookToDelete })
//       .then((doc) => {
//         if (!doc || doc.length === 0) {
//           console.log(
//             greenColor +
//               `\nBook with title ${bookToDelete} doesn't exist.` +
//               resetColor
//           );
//         } else {
//           doc.remove();
//           console.log(
//             greenColor +
//               `\nBook ${bookToDelete} deleted successfully` +
//               resetColor
//           );
//         }
//       })
//       .catch((err) => console.log(err));
//   }
// };
const removeAddressByID = async (addressID) => {
  let result = {};
  if (!addressID || addressID.length === 0) {
    result = "address id is missing. Please try again with valid address ID.";
  } else {
    await AddressModel.findOne({ _id: addressID })
      .then(async (doc) => {
        console.log("doc is: ", doc);
        if (!doc || doc.length === 0) {
          console.log(`address with ID: ${addressID} doesn't exist in DB`);
          result["status"] = false;
          result[
            "response"
          ] = `address with ID: ${addressID} doesn't exist in DB`;
        } else {
          await doc
            .remove()
            .then(() => {
              console.log(
                `address with ID ${addressID} is deleted successfully`
              );
              result["status"] = true;
              result["response"] = `address with ID ${addressID} is deleted successfully`;
            })
            .catch((err) => {
                result["status"] = false;
                result["response"] = err;
            })}})
      .catch((err) => {
        result["status"] = false;
        result["response"] = err;
      });
  }
  return result;
};
module.exports = {
  //   printAllBooks,
  addAddress,
  getAllAddresses,
  removeAddressByID,
//   searchAddress,
};
