const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Can't be blank"],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Can't be blank"],
      index: true,
      validate: [isEmail, 'invalid email'],
    },
    password: {
      type: String,
      required: [true, "Can't be blanks"],
    },
    picture: {
      type: String,
    },
    dob_day: {
      type: String,
    },
    dob_month: {
      type: String,
    },
    dob_year: {
      type: String,
    },
    gender_identity: {
      type: String,
    },
    mother_tongue: {
      type: String,
    },
    learning_languages: {
      type: Array,
    },
    about: {
      type: String,
    },
    // notifications
    newMessages: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: 'online',
    },
    isAdmin: {
      type: Boolean,
      default: 'false',
    },
    isBanned: {
      type: Boolean,
      default: 'false',
    },
  },
  { minimize: false }
);

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User doesn't exist, please sign up!");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password!');
  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
