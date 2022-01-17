/**
 * Sistema SISPAG - Node.js + MongoDB
 * @author : Fernando Andrade - www.fdandrade.com.br
 * @email : dev@fdandrade.com.br
 * @version : 1.0
 * @since : 08/03/2021
 * * */

module.exports = {
    isLogged:function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            req.flash("error_msg", "Necessário realizar o login!");
            res.redirect("/admin/login");
        }
    }
}