import * as validator from 'validator';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';
import chalk from 'chalk';

const _userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// Define the INSTANCE METHODS.

// Tell what mongoose should send back when the user model is converted to a json object.
_userSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

_userSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, process.env.JWT_HASH).toString();
  const tokenObject: { access: string, token: string } = {
    access,
    token
  }
  user.tokens.push(tokenObject);
  // Update and save the user object.
  // Return a promise: If there is no error saving, then pass the token to the next .then() call.
  return user.save().then(() => {
    return token;
  });
};

_userSchema.methods.removeToken = function (token) {
  var user = this;
  // Remember that update returns a promise if no then() callback provided.
  return user.update({
    // MongoDB operator '$pull' let us remove items from an array that match certain criterea. 
    $pull: {
      // Define what we want to pull.
      tokens: { token }
    }
  });
};

// Define the MODEL METHODS.

// Hash the password before storeing it.
// Visit the documentation to see how 'pre' operates.
_userSchema.pre('save', function (next) {
  // Get acces to the individual document.
  const user = this;
  // To do not rehash the value every time we update the doc we should use 'isModified()'.
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash((<any>user).password, salt, (error, hash) => {
        (<any>user).password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

_userSchema.statics.findByToken = function (token: string) {
  console.log(chalk.yellow('Finding by token'), token);
  const User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_HASH);
  } catch (e) {
    return new Promise((resolve, reject) => {
      reject();
    });
    // Alternatively.
    //return Promise.reject();
  }
  // Return a promise so we can add a .then() call to the findByToken() call. 
  return User.findOne({
    '_id': decoded._id,
    // alternatively.
    //_id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

_userSchema.statics.findByCredentials = function (email: string, password: string) {
  const User = this;
  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

export const userSchema = _userSchema;
