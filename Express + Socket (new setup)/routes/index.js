const express = require('express');
const router = express.Router();

const stats = require("../controllers/stats")

router.post('/mean', stats.findMean);
router.post('/median', stats.findMedian);
router.post('/mode', stats.findMode);
router.post('/sd', stats.findStandardDeviation);
router.post('/min', stats.findMin);
router.post('/max', stats.findMax);

module.exports = router;