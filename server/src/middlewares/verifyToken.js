require('dotenv').config();
const jwt = require('jsonwebtoken');


function verifyToken (req, res, next){
  const authToken = req.headers.authorization;
  if (authToken){
    const token = authToken.split(" ")[1];
    try{
      const decodepayload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodepayload;
      next();
    }catch(error){
      return res.status(401).json({ message: "Invalid token" });
    }
  }else{
    return res.status(401).json({ message: "No Token Provided" });
  }
}


function verifyTokenAndUserId(req, res, next){
  verifyToken(req, res, () => {
    if (req.user.id == req.params.id){
      next();
    }else{
      return res.status(401).json({ message: "Not allowed, only the user himself" });
    }
  });
}

module.exports = {
  verifyTokenAndUserId,
  verifyToken
};