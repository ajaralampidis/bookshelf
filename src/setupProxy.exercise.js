// 🐨 you don't need to do anything in this file for the exercise. This is
// just here for the extra credit. See the instructions for more info.


// `get` to handle requests
// sent to a URL matching this regex: `/\/$/` and redirects to `/discover`.

function proxy(app) {
    // add the redirect handler here
    app.get(/\/$/, function(req, res) {
        res.redirect("/discover")
    });
  }
  
module.exports = proxy



// module.exports = () => {}
