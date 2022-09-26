
const {
    userLogin,
    userRegister,
    userEmailVerify,
    resetPassword,
    getResetPasswordLink,
} = require('../controllers/user.controller');

module.exports = (app) => {
    app.post('/api/register', async (req, res, next) => {
        try {
            const { email, pwd } = req.body;
            const response = await userRegister(email, pwd);
            res.send({
                status: true,
                response,
            });
        } catch (err) {
            next(err);
        }
    });
    app.post('/api/login', async (req, res, next) => {
        try {
            const { email, pwd } = req.body;
            const response = await userLogin(email, pwd, res);
            res.send(response);
        } catch (err) {
            next(err);
        }
    });
    app.get('/api/users/verification/:token', async (req, res, next) => {
        try {
            const token = req.params.token;
            const emailSecret = process.env.EMAIL_SECRET;
            await userEmailVerify(token, emailSecret);
            res.redirect(`http://localhost:${process.env.PORT}/api/login`);
        } catch (err) {
            next(err);
        }
    });
    app.post('/api/getResetPasswordLink', async (req, res, next) => {
        try {
            const { email } = req.body;
            const response = await getResetPasswordLink(email);
            res.send(response);
        } catch (err) {
            next(err);
        }
    });
    app.post('/api/resetPassword/:token', async (req, res, next) => {
        try {
            const { newPass, oldPass } = req.body;
            const response = await resetPassword(req.params.token, newPass, oldPass);
            res.send(response);
        } catch (err) {
            next(err);
        }
    });
};
