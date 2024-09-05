const bcrypt = require('bcryptjs')



const HashPassword = async (localPassword) => {
    // console.log("This is password");
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(localPassword, salt);
    // console.log("HashedPassword ==>", hashPassword);
    return hashPassword;
}



module.exports = {
    HashPassword
}