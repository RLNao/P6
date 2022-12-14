const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
      const sauceObject = JSON.parse(req.body.sauce);

      delete sauceObject._id;

      const sauce = new Sauce({
            ...sauceObject,

            imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
            }`,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
      });

      sauce.save()
            .then(() =>
                  res
                        .status(201)
                        .json({ message: "Nouvelle sauce enregistrée" })
            )
            .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
      // console.log(req.params.id);
      Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                  const filename = sauce.imageUrl.split("/images/")[1];
                  // console.log("reqparamsid:", req.params.id);
                  // console.log("sauce id:", sauce._id);
                  // console.log("sauce userid:", sauce.userId);
                  // console.log("normal userid:", req.file.userId);
                  if (req.params.id == sauce._id) {
                        // check

                        console.log("filename:", filename);

                        if (filename != req.file.filename) {
                              fs.unlink(`images/${filename}`, () => {
                                    const sauceObject = req.file
                                          ? {
                                                  ...JSON.parse(req.body.sauce),
                                                  imageUrl: `${
                                                        req.protocol
                                                  }://${req.get(
                                                        "host"
                                                  )}/images/${
                                                        req.file.filename
                                                  }`,
                                            }
                                          : { ...req.body };

                                    Sauce.updateOne(
                                          { _id: req.params.id },
                                          { ...sauceObject, _id: req.params.id }
                                    )
                                          .then(() =>
                                                res.status(200).json({
                                                      message: "Sauce modifiée",
                                                })
                                          )
                                          .catch((error) =>
                                                res.status(400).json({ error })
                                          );
                              });
                        }
                  } else {
                        res.status(403).json({ error: "unauthorized request" });
                  }
            })
            .catch((error) => res.status(500).json({ error })); // check
};

exports.deleteSauce = (req, res, next) => {
      Sauce.findOne({ _id: req.params.id })

            .then((sauce) => {
                  if (req.params.id == sauce._id) {
                        const filename = sauce.imageUrl.split("/images/")[1];

                        fs.unlink(`images/${filename}`, () => {
                              Sauce.deleteOne({ _id: req.params.id })
                                    .then(() =>
                                          res
                                                .status(200)
                                                .json({
                                                      message: "Sauce supprimée",
                                                })
                                    )
                                    .catch((error) =>
                                          res.status(400).json({ error })
                                    );
                        });
                  } else {
                        res.status(403).json({ error: "unauthorized request" });
                  }
            })

            .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
      Sauce.find()
            .then((sauces) => res.status(200).json(sauces))
            .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
      Sauce.findOne({ _id: req.params.id })
            .then((sauces) => res.status(200).json(sauces))
            .catch((error) => res.status(404).json({ error }));
};

exports.likeSauce = (req, res, next) => {
      Sauce.findOne({ _id: req.params.id }).then((sauce) => {
            if (
                  req.body.like === 1 &&
                  !sauce.usersLiked.includes(req.body.userId)
            ) {
                  // Check
                  console.log("REQ BODY USER ID:", req.body.userId);
                  console.log("REQ BODY:", req.body);
                  console.log("REQ BODY LIKE:", req.body.like);

                  Sauce.updateOne(
                        { _id: req.params.id },
                        {
                              $inc: { likes: req.body.like++ },
                              $push: { usersLiked: req.body.userId },
                        }
                  )

                        .then((sauce) =>
                              res.status(200).json({ message: "Ajout Like" })
                        )
                        .catch((error) => res.status(400).json({ error }));
            } else if (
                  req.body.like === -1 &&
                  !sauce.usersDisliked.includes(req.body.userId)
            ) {
                  // Check
                  Sauce.updateOne(
                        { _id: req.params.id },
                        {
                              $inc: { dislikes: req.body.like++ * -1 },
                              $push: { usersDisliked: req.body.userId },
                        }
                  )
                        .then((sauce) =>
                              res.status(200).json({ message: "Ajout Dislike" })
                        )
                        .catch((error) => res.status(400).json({ error }));
            } else {
                  Sauce.findOne({ _id: req.params.id })
                        .then((sauce) => {
                              if (sauce.usersLiked.includes(req.body.userId)) {
                                    Sauce.updateOne(
                                          { _id: req.params.id },
                                          {
                                                $pull: {
                                                      usersLiked:
                                                            req.body.userId,
                                                },
                                                $inc: { likes: -1 },
                                          }
                                    )
                                          .then((sauce) => {
                                                res.status(200).json({
                                                      message: "Suppression Like",
                                                });
                                          })
                                          .catch((error) =>
                                                res.status(400).json({ error })
                                          );
                              } else if (
                                    sauce.usersDisliked.includes(
                                          req.body.userId
                                    )
                              ) {
                                    Sauce.updateOne(
                                          { _id: req.params.id },
                                          {
                                                $pull: {
                                                      usersDisliked:
                                                            req.body.userId,
                                                },
                                                $inc: { dislikes: -1 },
                                          }
                                    )
                                          .then((sauce) => {
                                                res.status(200).json({
                                                      message: "Suppression Dislike",
                                                });
                                          })
                                          .catch((error) =>
                                                res.status(400).json({ error })
                                          );
                              }
                        })
                        .catch((error) => res.status(400).json({ error }));
            }
      }); // here
};
