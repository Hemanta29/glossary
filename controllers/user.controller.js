const mongoose = require('mongoose');
const emailValidator = require("email-validator");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const User = require('../models/user.model');
const { generateToken, refreshToken } = require('../helper/generateToken');

const userRegister = async (email, pwd) => {
    console.log(email, pwd)
    const valid_email = emailValidator.validate(email);
    console.log(valid_email);
    if (valid_email) {
        const user = await User.create({
            email,
            pwd,
        });
        console.log(user);
        if (user) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                secure: true,
                auth: {
                    user: process.env.EMAIL,    // your email
                    pass: process.env.PASS,     // email pass, put them in .env file & turn the 'Less secure apps' option 'on' in gmail settings
                },
            });

            const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d',
            });
            const url = `http://localhost:${process.env.PORT}/api/users/verification/${token}`;       //localhost
            // const url = `${process.env.PROD_SERVER}/api/users/verification/${token}`;

            const emailSent = await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: 'Email verification to complete your registration!',
                text: 'Email Verification',
                html: `<p>Please click this link to verify yourself. <a href="${url}">${url}</a></p>`,
            });
            if (emailSent) {
                const date = new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true,
                }).format(new Date());

                return {
                    status: 'Registration successful!',
                    message: `An email was sent to ${email} at ${date}. Please check your email for verification.`,
                };
            } else {
                throw new Error('Registration failed, Email sending failed!');
            }
        } else {
            throw new Error('Registration failed!');
        }
    } else {
        throw new Error('Invalid Email!');
    }
};

const userEmailVerify = async (token, emailSecret) => {
    const { id } = jwt.verify(token, emailSecret);
    console.log(id);
    if (id) {
        const updatedUser = await User.findByIdAndUpdate(id, { confirmed: true });
        if (updatedUser) {
            return;       // localhost
            // return res.redirect(`${process.env.PROD_CLIENT}/login`);
        } else {
            throw new Error('User not found!');
        }
    } else {
        throw new Error('User not found!');
    }
}

const userLogin = async (email, pwd, res) => {
    const user = await User.findOne({ email: email });
    if (user && (await user.matchPassword(pwd))) {
        if (user.confirmed) {
            return {
                email: user.email,
                access_token: generateToken(user._id),
                refresh_token: refreshToken(user._id),
            };
        } else {
            res.status(403);
            throw new Error('Please check you email and verify yourself!');
        }
    } else {
        res.status(404);
        throw new Error('Invalid Email or Password!');
    }
}

const getResetPasswordLink = async (email) => {
    const user = await User.findOne({ email: email });
    if (user) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });

        const token = await jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30min',
        });

        const url = `http://localhost:${process.env.PORT}/createNewPassword/${token}`;    //localhost
        // const url = `${process.env.PROD_CLIENT}/createNewPassword/${token}`;

        const emailSent = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset Password',
            text: 'Reset your pwd for Glossary app.',
            html: `<p>Please click this link to reset password. <a href="${url}">${url}</a></p>`,
        });
        if (emailSent) {
            return {
                status: 'Password reset email sent.',
                message: `Password reset link was sent to ${email}.`,
            };
        } else {
            throw new Error('Password reset failed, Email sending failed!');
        }
    } else {
        throw new Error('There is no account associated with this email!');
    }
}

const resetPassword = async (token, newPass, oldPass) => {
    const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (id) {
        if (newPass !== oldPass) {
            const salt = await bcrypt.genSalt(10);
            newPass = await bcrypt.hash(newPass, salt);
            const updatedUser = await User.findByIdAndUpdate(id, {
                pwd: newPass,
            });
            updatedUser.save();
            if (updatedUser) {
                return { status: 'Password reset successfully!' };
            } else {
                throw new Error('Password reset failed!');
            }
        } else {
            throw new Error('New password can not be same as old password!');
        }
    } else {
        throw new Error('User not found!');
    }
}

module.exports = {
    userRegister,
    userEmailVerify,
    userLogin,
    getResetPasswordLink,
    resetPassword
};
