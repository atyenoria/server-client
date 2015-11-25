var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    local: {
        username: {
            type: String,
            unique: true
        },
        password: String,
        email: String,
        socketid: String,
    },
    facebook: {
        id: String,
        username: String,
        token: String,
        email: String,
    }
});


UserSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});



// stashed async methods
// UserSchema.methods.generateHash = function generateHash(password, callback) {
//   bcrypt.genSalt(8, function(err, salt) {
//     bcrypt.hash(password, salt, null, function saveHashedPassword(err, hash) {
//       if (err) throw err;
//       callback(hash);
//     });
//   });
// };
//
// UserSchema.methods.checkPassword = function(password, cb) {
// 	bcrypt.compare(password, this.password, function(err, response) {
// 		if (err) {
// 			return cb(err);
// 		}
// 		cb(null, response);
// 	});
// };
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);









var UserSchema2 = mongoose.Schema({
    local: {
        username: {
            type: String,
            unique: true
        },
        password: String,
        email: String,
        socketid: String,
    },
    facebook: {
        id: String,
        username: String,
        token: String,
        email: String,
    }
});

module.exports = mongoose.model('User3', UserSchema2);
// set up a mongoose model
var Schema = mongoose.Schema;
module.exports = mongoose.model('User2', new Schema({
    name: String,
    password: String,
    admin: Boolean
}));