const { getGfs,getGridfsBucket } = require("./gridFsConfig");

const checkGfsInitialized = async (req, res, next) => {
  try {
    req.gfs = await getGfs();
    req.gfsBucket = await getGridfsBucket();
    next();
  } catch (error) {
    res.status(503).json({ message: "GridFS not initialized", error: error.message });
  }
};

module.exports = checkGfsInitialized;