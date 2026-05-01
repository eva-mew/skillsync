const SSLCommerzPayment = require('sslcommerz-lts');
const Payment = require('../models/Payment');
const User = require('../models/User');

const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWORD;
const is_live = false; // true for production

// Generate invoice number
const generateInvoice = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `SS-${year}${month}-${rand}`;
};

// @route POST /api/payment/init
const initiatePayment = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const transactionId = `TXN-${Date.now()}-${req.user._id}`;
    const invoiceNo = generateInvoice();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    // Save pending payment
    await Payment.create({
      userId: req.user._id,
      userName: user.name,
      userEmail: user.email,
      amount: 299,
      transactionId,
      invoiceNo,
      status: 'pending',
      expiresAt
    });

    const data = {
      total_amount: 299,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${process.env.BACKEND_URL}/api/payment/success`,
      fail_url: `${process.env.BACKEND_URL}/api/payment/fail`,
      cancel_url: `${process.env.BACKEND_URL}/api/payment/cancel`,
      ipn_url: `${process.env.BACKEND_URL}/api/payment/ipn`,
      shipping_method: 'NO',
      product_name: 'SkillSync Premium Subscription',
      product_category: 'Digital Service',
      product_profile: 'non-physical-goods',
      cus_name: user.name,
      cus_email: user.email,
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: '01700000000',
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      res.json({ url: apiResponse.GatewayPageURL, transactionId });
    } else {
      res.status(400).json({ message: 'Payment initialization failed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/payment/success
const paymentSuccess = async (req, res) => {
  try {
    const { tran_id } = req.body;

    const payment = await Payment.findOne({ transactionId: tran_id });
    if (!payment) return res.redirect(`${process.env.FRONTEND_URL}/premium?status=failed`);

    // Update payment
    payment.status = 'success';
    payment.paidAt = new Date();
    await payment.save();

    // Activate premium for user
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await User.findByIdAndUpdate(payment.userId, {
      isPremium: true,
      premiumExpiresAt: expiresAt,
      premiumPlan: 'monthly'
    });

    res.redirect(`${process.env.FRONTEND_URL}/premium?status=success&txn=${tran_id}`);
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL}/premium?status=failed`);
  }
};

// @route POST /api/payment/fail
const paymentFail = async (req, res) => {
  try {
    const { tran_id } = req.body;
    await Payment.findOneAndUpdate({ transactionId: tran_id }, { status: 'failed' });
    res.redirect(`${process.env.FRONTEND_URL}/premium?status=failed`);
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL}/premium?status=failed`);
  }
};

// @route POST /api/payment/cancel
const paymentCancel = async (req, res) => {
  try {
    const { tran_id } = req.body;
    await Payment.findOneAndUpdate({ transactionId: tran_id }, { status: 'cancelled' });
    res.redirect(`${process.env.FRONTEND_URL}/premium?status=cancelled`);
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL}/premium?status=cancelled`);
  }
};

// @route GET /api/payment/my
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id, status: 'success' })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/payment/status
const getPremiumStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const now = new Date();

    // Auto-expire premium if date passed
    if (user.isPremium && user.premiumExpiresAt < now) {
      user.isPremium = false;
      user.premiumPlan = null;
      await user.save();
    }

    res.json({
      isPremium: user.isPremium,
      premiumExpiresAt: user.premiumExpiresAt,
      premiumPlan: user.premiumPlan
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/payment/invoice/:txn
const getInvoice = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      transactionId: req.params.txn,
      userId: req.user._id,
      status: 'success'
    });
    if (!payment) return res.status(404).json({ message: 'Invoice not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// @route POST /api/payment/ipn
const paymentIPN = async (req, res) => {
  try {
    console.log("IPN data:", req.body);

    const { tran_id, status } = req.body;
    const payment = await Payment.findOne({ transactionId: tran_id });

    if (!payment) {
      return res.status(404).send("Payment not found");
    }

    if (status === "VALID") {
      payment.status = "success";
      payment.paidAt = new Date();
      await payment.save();

      // Activate premium for user
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await User.findByIdAndUpdate(payment.userId, {
        isPremium: true,
        premiumExpiresAt: expiresAt,
        premiumPlan: "monthly"
      });
    } else {
      payment.status = "failed";
      await payment.save();
    }

    res.status(200).send("IPN processed");
  } catch (err) {
    console.error("IPN error:", err);
    res.status(500).send("IPN failed");
  }
};


module.exports = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  getMyPayments,
  getPremiumStatus,
  getInvoice,
  paymentIPN
};