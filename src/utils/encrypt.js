import bcrypt from 'bcrypt';



/**
 * Encrypt password with Cesar
 *
 * @async
 * @param {String} password_param 
 * @returns {unknown} 
 */
export const encryptPassword = async (password_param) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password_param, salt);
};



/**
 * Compare encrypt password with original
 *
 * @async
 * @param {String} pswParam 
 * @param {String} receivedPsw 
 * @returns {Boolean} 
 */
export const comparePassword = async (pswParam, receivedPsw) => {
    return bcrypt.compare(pswParam, receivedPsw);
};