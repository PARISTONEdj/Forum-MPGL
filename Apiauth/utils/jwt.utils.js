var jwt = require("jsonwebtoken");

const JWT_SIGN_SECRET = "etgryjtukiyuoipo^p415424856ery(uhjtnhrgter";
module.exports = {
    generateTokenUser: function(userdata){
        return jwt.sign({
            userId : userdata.id,
            isAdmin : userdata.isadmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn : "1h"
        })
    }
}