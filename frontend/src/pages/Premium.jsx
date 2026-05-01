import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Premium = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [payments, setPayments] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [txnForInvoice, setTxnForInvoice] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const invoiceRef = useRef();

  const status = searchParams.get('status');
  const txn = searchParams.get('txn');

useEffect(() => {
  fetchStatus();
  if (status === 'success' && txn) setTxnForInvoice(txn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const fetchStatus = async () => {
    try {
      const [statusRes, paymentsRes] = await Promise.all([
        API.get('/payment/status'),
        API.get('/payment/my')
      ]);
      setPremiumStatus(statusRes.data);
      setPayments(paymentsRes.data);
    } catch (err) { console.error(err); }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await API.post('/payment/init');
      window.location.href = res.data.url;
    } catch (err) {
      alert('Payment initialization failed. Please try again.');
    }
    setLoading(false);
  };

  const handleDownloadInvoice = async (txnId) => {
    try {
      const res = await API.get(`/payment/invoice/${txnId}`);
      const inv = res.data;
      const invoiceHTML = `
        <html>
        <head>
          <title>Invoice - SkillSync Premium</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 3px solid #1a7a3a; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: 800; color: #1a7a3a; }
            .invoice-no { font-size: 14px; color: #666; margin-top: 4px; }
            .badge { background: #1a7a3a; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #1a7a3a; color: white; padding: 12px; text-align: left; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .total { font-size: 20px; font-weight: 800; color: #1a7a3a; text-align: right; margin-top: 20px; }
            .footer { text-align: center; margin-top: 40px; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
            .success { color: #1a7a3a; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SkillSync</div>
            <div class="invoice-no">Invoice No: ${inv.invoiceNo}</div>
            <div style="margin-top:8px"><span class="badge">✓ PAID</span></div>
          </div>
          <h2>Payment Receipt</h2>
          <table>
            <tr><th colspan="2">Customer Details</th></tr>
            <tr><td>Name</td><td>${inv.userName}</td></tr>
            <tr><td>Email</td><td>${inv.userEmail}</td></tr>
            <tr><th colspan="2">Payment Details</th></tr>
            <tr><td>Transaction ID</td><td>${inv.transactionId}</td></tr>
            <tr><td>Plan</td><td>SkillSync Premium — Monthly</td></tr>
            <tr><td>Amount</td><td>৳${inv.amount} BDT</td></tr>
            <tr><td>Currency</td><td>${inv.currency}</td></tr>
            <tr><td>Payment Date</td><td>${new Date(inv.paidAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
            <tr><td>Valid Until</td><td>${new Date(inv.expiresAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
            <tr><td>Status</td><td class="success">✓ Payment Successful</td></tr>
          </table>
          <div class="total">Total Paid: ৳${inv.amount} BDT</div>
          <div class="footer">
            Thank you for subscribing to SkillSync Premium!<br/>
            For support: meweva@gmail.com<br/>
            SkillSync — Intelligent Career & Startup Recommendation System © 2026
          </div>
        </body>
        </html>
      `;
      const win = window.open('', '_blank');
      win.document.write(invoiceHTML);
      win.document.close();
      win.print();
    } catch (err) {
      alert('Could not load invoice');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />

      {/* Status Banner */}
      {status === 'success' && (
        <div style={{ background: 'var(--green)', padding: '16px', textAlign: 'center' }}>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>
            🎉 Payment Successful! You are now a Premium member!
          </span>
        </div>
      )}
      {status === 'failed' && (
        <div style={{ background: '#dc2626', padding: '16px', textAlign: 'center' }}>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>
            ❌ Payment failed. Please try again.
          </span>
        </div>
      )}
      {status === 'cancelled' && (
        <div style={{ background: 'var(--orange)', padding: '16px', textAlign: 'center' }}>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>
            ⚠️ Payment cancelled.
          </span>
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>👑</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-1px' }}>
            SkillSync Premium
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Unlock exclusive job opportunities and advanced features with Premium access.
          </p>
        </div>

        {/* Current Status Card */}
        {premiumStatus && (
          <div className="card" style={{ padding: '24px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '36px' }}>{premiumStatus.isPremium ? '👑' : '🔓'}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Current Plan: {premiumStatus.isPremium ? 'Premium Member ✅' : 'Free Plan'}
              </h3>
              {premiumStatus.isPremium && (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Valid until: {new Date(premiumStatus.premiumExpiresAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
              {!premiumStatus.isPremium && (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Upgrade to access exclusive premium jobs
                </p>
              )}
            </div>
            {premiumStatus.isPremium && (
              <span style={{ padding: '6px 16px', borderRadius: '100px', background: 'var(--green-light)', color: 'var(--green)', border: '1px solid var(--green-border)', fontSize: '13px', fontWeight: '700' }}>
                ✓ Active
              </span>
            )}
          </div>
        )}

        {/* Pricing Card */}
        {!premiumStatus?.isPremium && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '20px', marginBottom: '32px' }}>

            {/* Free Plan */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Free Plan</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>৳0</div>
              {[
                '✅ Browse all free jobs',
                '✅ Startup recommendations',
                '✅ Job comparison',
                '✅ Save & bookmark',
                '❌ Premium exclusive jobs',
                '❌ Priority application',
              ].map((f, i) => (
                <div key={i} style={{ fontSize: '13px', color: f.startsWith('❌') ? 'var(--text-muted)' : 'var(--text-secondary)', marginBottom: '8px' }}>{f}</div>
              ))}
              <button disabled className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '20px', opacity: 0.6 }}>
                Current Plan
              </button>
            </div>

            {/* Premium Plan */}
            <div className="card" style={{ padding: '28px', border: '2px solid var(--accent)', background: 'var(--accent-light)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--accent)', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '700' }}>
                RECOMMENDED
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>👑 Premium</div>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)' }}>৳299</span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '6px' }}>/month</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Billed monthly — cancel anytime</div>
              {[
                '✅ Everything in Free',
                '✅ Exclusive Premium jobs',
                '✅ Priority job applications',
                '✅ Premium company profiles',
                '✅ Download payment invoice',
                '✅ Premium badge on profile',
              ].map((f, i) => (
                <div key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>{f}</div>
              ))}
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '12px', fontSize: '15px' }}
              >
                {loading ? 'Redirecting...' : '👑 Subscribe Now — ৳299/month'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>
                🔒 Secured by SSLCommerz
              </p>
            </div>
          </div>
        )}

        {/* Payment History */}
        {payments.length > 0 && (
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
              💳 Payment History
            </h3>
            {payments.map((pay, i) => (
              <div key={pay._id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: i < payments.length - 1 ? '1px solid var(--border)' : 'none', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    SkillSync Premium — Monthly
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Invoice: {pay.invoiceNo} · {new Date(pay.paidAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--green)' }}>
                  ৳{pay.amount}
                </div>
                <span style={{ padding: '3px 10px', borderRadius: '100px', background: 'var(--green-light)', color: 'var(--green)', border: '1px solid var(--green-border)', fontSize: '12px', fontWeight: '600' }}>
                  ✓ Paid
                </span>
                <button
                  onClick={() => handleDownloadInvoice(pay.transactionId)}
                  className="btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  📄 Download Invoice
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Features */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
            ⚡ Why Go Premium?
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '16px' }}>
            {[
              { icon: '🔒', title: 'Exclusive Jobs', desc: 'Access premium-only job listings not available to free users' },
              { icon: '🏢', title: 'Company Profiles', desc: 'View detailed company information before applying' },
              { icon: '⚡', title: 'Priority Apply', desc: 'Your applications are highlighted to employers' },
              { icon: '📄', title: 'Invoice Download', desc: 'Download official payment receipts for records' },
            ].map((f, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', textAlign: 'center', padding: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
        SkillSync © 2026 — Payments secured by SSLCommerz 🔒
      </footer>
    </div>
  );
};

export default Premium;