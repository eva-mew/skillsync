const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  applyJob, getUserApplications, getAllApplications,
  getJobApplications, updateStatus, downloadCV,deleteApplication
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
router.post('/', protect, upload.single('cv'), applyJob);
router.get('/my', protect, getUserApplications);
router.get('/cv/:id', protect, downloadCV);

// Admin routes
router.get('/test', (req, res) => res.json({ message: 'Application routes working!' }));
router.get('/all', protect, getAllApplications);
router.get('/job/:jobId', protect, getJobApplications);
router.put('/:id/status', protect, adminOnly, updateStatus);
router.delete('/:id', protect, deleteApplication);
module.exports = router;