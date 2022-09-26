const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        pwd: {
            type: String,
            required: true,
        },
        confirmed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.pwd);
};

UserSchema.pre('save', async function (next) {
    console.log("Modified pwd" + this.isModified('pwd'));
    if (!this.isModified('pwd')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.pwd = await bcrypt.hash(this.pwd, salt);
});

const User = mongoose.model('User', UserSchema);

module.exports = User;