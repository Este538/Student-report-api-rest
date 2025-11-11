import bcrypt from 'bcrypt';

export const encryptPassword = async (password_param) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password_param, salt);
};

export const comparePassword = async (pswParam, receivedPsw) => {
    return bcrypt.compare(pswParam, receivedPsw);
};