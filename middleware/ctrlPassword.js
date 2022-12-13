const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

passwordSchema
      .is()
      .min(5) // Minimum length 8 t e s t e r
      .is()
      .max(100) // Maximum length 100
      .has()
      .not()
      .spaces() // Should not have spaces
      .is()
      .not()
      .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

module.exports = (req, res, next) => {
      if (passwordSchema.validate(req.body.password)) {
            next();
      } else {
            return res.status(400).json({
                  error: `Le mot de passe n'est pas assez fort" ${
                        (passwordSchema.validate(`req.body.password`),
                        { list: true })
                  }`,
            });
      }
};
