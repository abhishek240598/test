module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            res.status(400).json({
                "response": {
                    status: "400",
                    message: "Please Login First",
                    data: {}
                }
            });
        }
    }
}