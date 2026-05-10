const ContactMessage = require('../models/ContactMessage');
const Newsletter = require('../models/Newsletter');

// ── User submits contact form ──────────────────
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    const msg = await ContactMessage.create({
      userId: req.user ? req.user._id : null,
      name, email, subject, message
    });
    res.status(201).json({ message: 'Message sent successfully!', id: msg._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── User gets their own messages + replies ─────
exports.getMyMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin gets all messages ────────────────────
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin replies to a message ─────────────────
exports.replyMessage = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: 'Reply cannot be empty' });
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { adminReply: reply, status: 'replied', repliedAt: new Date() },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Reply sent!', data: msg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin marks message as read ────────────────
exports.markAsRead = async (req, res) => {
  try {
    await ContactMessage.findByIdAndUpdate(req.params.id, { status: 'read' });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin deletes a message ────────────────────
exports.deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Newsletter subscribe ───────────────────────
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Already subscribed!' });
    }
    await Newsletter.create({ email });
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin gets all subscribers ─────────────────
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin deletes subscriber ───────────────────
exports.deleteSubscriber = async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};