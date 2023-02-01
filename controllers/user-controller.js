
const { User, Thought } = require("../models");
const {errors}= require('../messages/messages');
const {success}= require('../messages/messages');

const userController = {
  // get all users
  getAllUser(req, res) {
    User.find({})
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: errors.USER_NOT_FOUND });
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // user created
  createUser({ body }, res) {
    User.sa
    User.create(body)
      .then((dbUserData) => res.status(200).json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  // user by id is updated
  updateUser({ params, body }, res) {
    const {id}=params
    User.findOneAndUpdate({ _id: id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: errors.USER_NOT_FOUND });
          return;
        }
        res.status(200).json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: errors.USER_NOT_FOUND });
        }
        // BONUS: get ids of user's `thoughts` and delete them all
        // $in to find specific things
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })
      .then(() => {
        res.json({ message: success.USER_DELETED_SUCCESSFULLY });
      })
      .catch((err) => res.json(err));
  },

  // add friend
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: errors.USER_NOT_FOUND });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // delete friend
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: errors.USER_NOT_FOUND });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};
module.exports = userController;
