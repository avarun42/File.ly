var mongoose = require('mongoose');
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var path = require('path');

var uploads_base = path.join("~/Development", "filedb");
var uploads = path.join(uploads_base, "uploads");

var fileSchema = new mongoose.Schema({
  email: { type: String, lowercase: true },
  code: { type: String, lowercase: true },
  uuid: String,
  expired: Boolean
});

fileSchema.plugin(filePlugin, {
    name: "file",
    upload_to: make_upload_to_model(uploads, 'files'),
    relative_to: uploads_base
});

fileSchema.methods.gravatar = function(size) {
  if (!size) size = 200;

  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  }

  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('Filely', fileSchema);

// /**
//  * Hash the password for security.
//  * "Pre" is a Mongoose middleware that executes before each user.save() call.
//  */

// fileSchema.pre('save', function(next) {
//   var user = this;

//   if (!user.isModified('password')) return next();

//   bcrypt.genSalt(5, function(err, salt) {
//     if (err) return next(err);

//     bcrypt.hash(user.password, salt, null, function(err, hash) {
//       if (err) return next(err);
//       user.password = hash;
//       next();
//     });
//   });
// });

// /**
//  * Validate user's password.
//  * Used by Passport-Local Strategy for password validation.
//  */

// fileSchema.methods.comparePassword = function(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

/**
 * Get URL to a user's gravatar.
 * Used in Navbar and Account Management page.
 */