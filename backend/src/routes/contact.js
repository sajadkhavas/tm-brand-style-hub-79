const express = require('express');

const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'name, email, subject, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate field lengths
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    }
    if (subject.length < 3 || subject.length > 200) {
      return res.status(400).json({ error: 'Subject must be between 3 and 200 characters' });
    }
    if (message.length < 10 || message.length > 2000) {
      return res.status(400).json({ error: 'Message must be between 10 and 2000 characters' });
    }

    // Log the contact form submission (in production, you'd save to database or send email)
    console.log('📧 Contact form submission:', {
      name,
      email,
      phone: phone || 'Not provided',
      subject,
      message: message.substring(0, 100) + '...',
      timestamp: new Date().toISOString()
    });

    // TODO: In production, implement one or more of these:
    // 1. Save to database (create a ContactMessage model)
    // 2. Send email notification to admin
    // 3. Integrate with CRM or support ticket system
    // 4. Send confirmation email to user

    res.json({ 
      success: true,
      message: 'پیام شما با موفقیت ارسال شد' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

module.exports = router;
