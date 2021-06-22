const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

router.route("/").get(async (req, res) => {
  await addressController.getAllAddresses(req.body).then((result) => {
    console.log("result at line 10: ", result);
    if (result.status) {
      res.status(200).json(result.response);
    } else {
      res.status(204).send(result.response);
    }
  });
});

// let bookHandler1 = (req, res, next) => {
//   let id = req.params.bookID;
//   if (Number(id !== NaN && Number(id) > 0)) {
//     next();
//   } else {
//     res.send("Invalid Book Id");
//   }
// };
// let booksHandler2 = (req, res) => {
//   res.send("Book requested: " + req.params.bookID);
// };

// router.get('/add-new', async (req, res) => {
//   let categories = await addressController.printAllCategories();
//   let catArr = [];
//   if (categories.length > 0) {
//     categories.forEach(cat => {
//       catArr.push(cat.name);
//     });
//   }
//   res.render('addNew',{categories: catArr});
// })
router.post("/add-new", async (req, res) => {
  console.log("request is: ", req.body);

  await addressController.addAddress(req.body).then((data) => {
    console.log("data on line 39: ", data);
    if (data.status) {
      res.status(201).send(data.response);
    } else {
      res.status(204).send(data.response);
    }
  });
});

router.delete("/:addressID", async (req, res) => {
  await addressController
    .removeAddressByID(req.params.addressID)
    .then((data) => {
      if (data.status) {
        res.status(201).send(data.response);
      } else {
        res.status(204).send(data.response);
      }
    });
});

router.post("/:searchTerm", async (req, res) => {
  let payload = { email: req.body.email, searchTerm: req.params.searchTerm };
  console.log(payload);
  await addressController.searchAddress(payload).then((data) => {
    console.log(data);
    if (data.status) {
      res.status(201).send(data.response);
    } else {
      res.status(204).send(data.response);
    }
  });
});

router.patch("/:addressID", async (req, res) => {
    let payload = {addressID: req.params.addressID, dataToUpdate: req.body}
    await addressController.updateAddress(payload).then((data) => {
        console.log(data);
        if (data.status) {
          res.status(201).send(data.response);
        } else {
          res.status(204).send(data.response);
        }
      });
});
// router.get("/:bookID", [bookHandler1, booksHandler2]);
module.exports = router;
