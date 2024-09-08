const usersStorage = require("../storage/usersStorage");
const {body,validationResult} = require("express-validator");

const alphaErr = "Must only contain letters!";
const lengthErr = "Must be between 1 and 10 characters!";


// validators
const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
  body("email").trim()
    .isEmail().withMessage("Email must be valid!"),
  body("age")
    .optional()
    .trim()
    .isInt({min:18, max:120}).withMessage("Age must be between 18 and 120!"),
  body("bio")
    .optional()
    .trim()
    .isLength({max:200}).withMessage("Maximum bio length is 200 characters!"),
];

// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const {  firstName, lastName, email, age, bio  } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio  });
    res.redirect("/");
  }
];

exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render("updateUser", {
      title: "Update user",
      user: user,
    });
  };
  
  exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
      const user = usersStorage.getUser(req.params.id);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
          title: "Update user",
          user: user,
          errors: errors.array(),
        });
      }
      const { firstName, lastName, email, age, bio } = req.body;
      usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
      res.redirect("/");
    }
  ];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};

exports.usersSearchGet = (req,res) => {
    const name = req.query.name
    const email = req.query.email
    const users = usersStorage.getUsers()
    users.forEach(user=>{
        const fullName = user.firstName + " " + user.lastName
        const userEmail = user.email
        console.log(name, fullName)
        console.log(email,userEmail)
        if (fullName === name & userEmail === email){
            return res.render("search.ejs",{
                title: "Search User",
                user:user
            })
        }
    })
    return res.status(400).render("createUser", {
        title: "Create user",
        errors: [{msg:"No user found"},],
      });
}