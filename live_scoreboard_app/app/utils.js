module.exports = {  
  authcheck: function(req, res, next) {
          var ctfd_token_header = req.headers['Verify-CTFd'.toLowerCase()];
          if (ctfd_token_header != CTFd_TOKEN) {
             res.send('Unauthorized! 🚫');
          }else{
             next()
          }
    }
}