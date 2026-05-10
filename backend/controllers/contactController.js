const ContactMessage = require('../models/ContactMessage');
const Newsletter = require('../models/Newsletter');

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ message: 'Name, email and message required' });
    const msg = await ContactMessage.create({
      name, email,
      subject: subject || 'General Inquiry',
      message,
      userId: req.user?._id || null
    });
    res.status(201).json({ message: 'Message sent successfully!', id: msg._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAllMessages = async (req, res) => {
  try {
    const msgs = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getMyMessages = async (req, res) => {
  try {
    const msgs = await ContactMessage.find({
      $or: [{ userId: req.user._id }, { email: req.user.email }],
      reply: { $ne: null }
    }).sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const replyMessage = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: 'Reply cannot be empty' });
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { reply, repliedAt: new Date(), repliedBy: req.user.name, status: 'replied' },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Reply sent!', data: msg });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const markAsRead = async (req, res) => {
  try {
    await ContactMessage.findByIdAndUpdate(req.params.id, { status: 'read' });
    res.json({ message: 'Marked as read' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const subscribeNewsletter = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Already subscribed!' });
    await Newsletter.create({ email, name: name || 'Subscriber' });
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getSubscribers = async (req, res) => {
  try {
    const subs = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteSubscriber = async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
  submitContact, getAllMessages, getMyMessages,
  replyMessage, markAsRead, deleteMessage,
  subscribeNewsletter, getSubscribers, deleteSubscriber
};