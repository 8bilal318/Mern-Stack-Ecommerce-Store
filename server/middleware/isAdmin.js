// Ye middleware authMiddleware ke BAAD chalta hai (req.user pehle se set hona chahiye).
// Sirf role "admin" wale users ko aage jaane deta hai, warna 403 return karta hai.
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }

  next();
};

export default isAdmin;