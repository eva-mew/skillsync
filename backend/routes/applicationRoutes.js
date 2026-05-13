const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const {
  applyJob, getUserApplications, getAllApplications,
  getJobApplications, updateStatus, downloadCV
} = require('../controllers/applicationController');

// Multer setup — directly in routes
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only PDF/Word allowed'), false);
  }
});

// User routes
router.post('/', auth, upload.single('cv'), applyJob);
router.get('/my', auth, getUserApplications);
router.get('/cv/:id', auth, downloadCV);

// Admin routes
router.get('/all', auth, getAllApplications);
router.get('/job/:jobId', auth, getJobApplications);
router.put('/:id/status', auth, updateStatus);

module.exports = router;