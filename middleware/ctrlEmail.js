const validator = require("email-validator");
validator.validate("test@email.com"); // true

module.exports = (req, res, next) => {
      const { email } = req.body;

      if (validator.validate(email)) {
            console.log(`email valide ${validator.validate(email)}`);
            next();
      } else {
            return res.status(400).json({ error: "email non valide" });
      }
};
