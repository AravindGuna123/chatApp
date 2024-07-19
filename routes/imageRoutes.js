const express = require("express");
const router = express.Router();
const checkGfsInitialized = require("../middleware/checkGfsInitialized");

router.get("/:filename", checkGfsInitialized, async (req, res) => {
    try {
        const file = await req.gfs.files.findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        const readStream = req.gfsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    } catch (error) {
        console.log(error,"error")
        res.status(404).json({ message: error.message });
    }
});


module.exports = router;