const jwt = require('jsonwebtoken');

function authenticateToken(req , res , next) {
    const authHeader  = req.headers ["authorization"]
    const token = authHeader && authHeader.split(" ")[1];

if (!token) return res.sendStatus(401);

jwt.verify(token,  process.env.ACCESS_TOKEN_SECRET, (err , user) => {

    if(err) return res.sendStatus(401);
    req.user = user ;
    next(); 
});
};


function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
}

module.exports = {
    authenticateToken,
    requireAdmin
};
