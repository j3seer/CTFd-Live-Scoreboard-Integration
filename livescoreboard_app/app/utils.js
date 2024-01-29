
module.exports = {  
  auth: function(req, res, next) {
          var ctfd_token_header = req.headers['Verify-CTFd'.toLowerCase()];
          if (ctfd_token_header != CTFd_TOKEN) {
             res.send('Unauthorized! 🚫');
          }else{
             next()
          }
    },
   admin_auth: function(req, res, next) {
      if (req.session.admin !== true){
         res.render('./dashboard/error',{title:CTF_TITLE,error:`<center><i class="fas fa-times"></i><br>Unauthorized!</center>`})
      }else{
          next()
      }
   }
}

