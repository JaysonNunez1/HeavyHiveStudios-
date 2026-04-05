/**
 * ============================================
 * Heavy Hive Studios - Beat Checkout Service
 * ============================================
 * 
 * This server handles:
 * 1. Stripe webhook for completed checkouts
 * 2. AWS S3 presigned URL generation for beat downloads
 * 3. Email delivery with download links
 * 
 * Author: Heavy Hive Studios
 * Version: 1.0.0
 */

// Load environment variables first
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const Stripe = require('stripe');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const nodemailer = require('nodemailer');

// ============================================
// Configuration & Initialization
// ============================================

const app = express();
app.use(cors({
  origin: 'https://heavy-hive-studios.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
const PORT = process.env.PORT || 3001;

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use the latest stable API version
});

// Initialize AWS S3 Client (SDK v3)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Initialize Nodemailer transporter
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ============================================
// Middleware Configuration
// ============================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST'],
}));

// IMPORTANT: The Stripe webhook endpoint needs raw body for signature verification
// This must come BEFORE the JSON parser middleware
app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }));

// JSON parser for all other routes
app.use(express.json());

// ============================================
// Helper Functions
// ============================================

/**
 * Generates a presigned URL for downloading a beat from S3
 * @param {string} beatFileKey - The S3 object key (e.g., "beats/beat-001.wav")
 * @param {number} expiresIn - URL expiration time in seconds (default: 24 hours)
 * @returns {Promise<string>} - The presigned download URL
 */
async function generatePresignedDownloadUrl(beatFileKey, expiresIn = 86400) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: beatFileKey,
      // Optional: Set content disposition to force download with filename
      ResponseContentDisposition: `attachment; filename="${beatFileKey.split('/').pop()}"`,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresIn, // 24 hours in seconds
    });

    console.log(`[S3] Generated presigned URL for: ${beatFileKey}`);
    return presignedUrl;
  } catch (error) {
    console.error('[S3] Error generating presigned URL:', error);
    throw new Error('Failed to generate download link');
  }
}

/**
 * Sends a welcome email with the beat download link
 * @param {string} customerEmail - Customer's email address
 * @param {string} beatName - Name of the purchased beat
 * @param {string} downloadUrl - Presigned S3 download URL
 * @returns {Promise<void>}
 */
async function sendDownloadEmail(customerEmail, beatName, downloadUrl) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #050505; color: #EDEDED; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: bold; letter-spacing: 2px; }
        .logo-gold { color: #D4AF37; }
        .logo-white { color: #FFFFFF; }
        .content { background-color: #0A0A0A; border: 1px solid #D4AF37; padding: 40px; margin-bottom: 30px; }
        h1 { color: #D4AF37; font-size: 24px; margin-bottom: 20px; }
        p { line-height: 1.8; color: #CCCCCC; }
        .beat-name { color: #D4AF37; font-weight: bold; font-size: 18px; }
        .download-btn { display: inline-block; background-color: #D4AF37; color: #000000; padding: 15px 40px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 30px 0; }
        .download-btn:hover { background-color: #F4C430; }
        .warning { background-color: #1A1A1A; border-left: 4px solid #D4AF37; padding: 15px 20px; margin: 20px 0; }
        .warning p { margin: 0; font-size: 14px; color: #999999; }
        .footer { text-align: center; color: #666666; font-size: 12px; margin-top: 40px; }
        .social-links { margin: 20px 0; }
        .social-links a { color: #D4AF37; text-decoration: none; margin: 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <span class="logo-gold">HEAVY</span><span class="logo-white">HIVE</span>
          </div>
          <p style="color: #D4AF37; letter-spacing: 3px; font-size: 12px;">STUDIOS</p>
        </div>
        
        <div class="content">
          <h1>Thank You For Your Purchase! 🎵</h1>
          <p>Your beat is ready to download. We appreciate you choosing Heavy Hive Studios for your music production needs.</p>
          
          <p><strong>Your Purchase:</strong></p>
          <p class="beat-name">${beatName}</p>
          
          <div style="text-align: center;">
            <a href="${downloadUrl}" class="download-btn">Download Your Beat</a>
          </div>
          
          <div class="warning">
            <p>⚠️ <strong>Important:</strong> This download link will expire in 24 hours. Please download your beat and save it to a secure location.</p>
          </div>
          
          <p>If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:heavystudios@gmail.com" style="color: #D4AF37;">heavystudios@gmail.com</a></p>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="https://www.instagram.com/heavyhivestudios">Instagram</a>
          </div>
          <p>© ${new Date().getFullYear()} Heavy Hive Studios. All rights reserved.</p>
          <p>A creative hub made for artists, by artists.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: `🎧 Your Beat is Ready - ${beatName} | Heavy Hive Studios`,
    html: emailHtml,
    // Plain text fallback
    text: `
      Thank You For Your Purchase!
      
      Your beat "${beatName}" is ready to download.
      
      Download Link: ${downloadUrl}
      
      IMPORTANT: This link expires in 24 hours.
      
      Questions? Contact us at heavystudios@gmail.com
      
      - Heavy Hive Studios
    `,
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log(`[EMAIL] Successfully sent download email to: ${customerEmail}`);
  } catch (error) {
    console.error('[EMAIL] Error sending email:', error);
    throw new Error('Failed to send download email');
  }
}

/**
 * Maps a Stripe product ID to an S3 file key
 * Customize this function based on how you organize your beats in S3
 * @param {string} productId - Stripe product ID
 * @param {object} metadata - Product metadata from Stripe
 * @returns {string} - S3 object key for the beat file
 */
function getS3KeyForProduct(productId, metadata = {}) {
  // Option 1: Use metadata if you store the S3 key in Stripe product metadata
  if (metadata.s3_key) {
    return metadata.s3_key;
  }
  
  // Option 2: Use a naming convention based on product ID
  // Example: Product ID "prod_ABC123" -> S3 key "beats/prod_ABC123.wav"
  return `beats/${productId}.wav`;
}

// ============================================
// API Routes
// ============================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Heavy Hive Beat Checkout Service',
    timestamp: new Date().toISOString() 
  });
});

/**
 * Stripe Webhook Endpoint
 * 
 * This endpoint receives webhook events from Stripe when a checkout is completed.
 * It verifies the signature, processes the order, generates a download link,
 * and sends an email to the customer.
 * 
 * Stripe Dashboard Setup:
 * 1. Go to Developers > Webhooks
 * 2. Add endpoint: https://yourdomain.com/api/webhook/stripe
 * 3. Select event: checkout.session.completed
 * 4. Copy the Signing secret to your .env file
 */
app.post('/api/webhook/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  // ========================================
  // Step 1: Verify Stripe Webhook Signature
  // ========================================
  try {
    // Verify the event came from Stripe using the signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log(`[STRIPE] Webhook verified. Event type: ${event.type}`);
  } catch (err) {
    console.error(`[STRIPE] Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ========================================
  // Step 2: Handle checkout.session.completed
  // ========================================
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    console.log(`[STRIPE] Processing checkout session: ${session.id}`);

    try {
      // ========================================
      // Step 3: Extract Customer & Product Info
      // ========================================
      
      // Get customer email
      const customerEmail = session.customer_details?.email || session.customer_email;
      
      if (!customerEmail) {
        console.error('[STRIPE] No customer email found in session');
        return res.status(400).json({ error: 'No customer email found' });
      }

      // Retrieve line items to get the product information
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });

      if (!lineItems.data || lineItems.data.length === 0) {
        console.error('[STRIPE] No line items found in session');
        return res.status(400).json({ error: 'No products found in order' });
      }

      // Process each purchased beat
      for (const item of lineItems.data) {
        const product = item.price.product;
        const productId = typeof product === 'string' ? product : product.id;
        const productName = typeof product === 'string' ? 'Your Beat' : product.name;
        const productMetadata = typeof product === 'string' ? {} : product.metadata;

        console.log(`[ORDER] Customer: ${customerEmail}, Product: ${productName} (${productId})`);

        // ========================================
        // Step 4: Generate S3 Presigned URL
        // ========================================
        
        // Get the S3 key for this product
        const s3Key = getS3KeyForProduct(productId, productMetadata);
        
        // Generate presigned URL (expires in 24 hours)
        const expirySeconds = parseInt(process.env.DOWNLOAD_LINK_EXPIRY) || 86400;
        const downloadUrl = await generatePresignedDownloadUrl(s3Key, expirySeconds);

        // ========================================
        // Step 5: Send Email with Download Link
        // ========================================
        await sendDownloadEmail(customerEmail, productName, downloadUrl);

        console.log(`[SUCCESS] Order processed for ${customerEmail} - Beat: ${productName}`);
      }

      // Acknowledge receipt of the webhook
      res.json({ received: true, status: 'processed' });

    } catch (error) {
      console.error('[ERROR] Failed to process checkout:', error);
      
      // Still return 200 to acknowledge receipt
      // Stripe will retry on 4xx/5xx errors, which we don't want for processing errors
      // Log the error for manual investigation
      res.json({ received: true, status: 'error', message: error.message });
    }

  } else {
    // Handle other event types if needed
    console.log(`[STRIPE] Unhandled event type: ${event.type}`);
    res.json({ received: true, status: 'ignored' });
  }
});

/**
 * Manual download link generation (optional)
 * This can be used by admins to regenerate download links
 * Protect this endpoint with authentication in production!
 */
app.post('/api/admin/generate-download', async (req, res) => {
  // TODO: Add authentication middleware for production
  const { email, beatFileKey, beatName } = req.body;

  if (!email || !beatFileKey || !beatName) {
    return res.status(400).json({ 
      error: 'Missing required fields: email, beatFileKey, beatName' 
    });
  }

  try {
    const downloadUrl = await generatePresignedDownloadUrl(beatFileKey);
    await sendDownloadEmail(email, beatName, downloadUrl);
    
    res.json({ 
      success: true, 
      message: `Download link sent to ${email}` 
    });
  } catch (error) {
    console.error('[ADMIN] Error generating download:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Error Handling Middleware
// ============================================

app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
// --- Subscription Checkout Route ---
app.post('/api/subscriptions/checkout', async (req, res) => {
  try {
    const { plan_id, origin_url } = req.body;

    if (!plan_id) {
      return res.status(400).json({ error: 'Missing plan_id' });
    }

    // Tell Stripe to create a secure checkout page
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan_id, // Your frontend is sending the 'price_...' ID here!
          quantity: 1,
        },
      ],
      mode: 'subscription', // Use 'payment' if it's a one-time fee, 'subscription' for monthly
      success_url: `${origin_url}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin_url}?canceled=true`,
    });

    // Send the Stripe URL back to the frontend
    res.json({ checkout_url: session.url });

  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  console.log('============================================');
  console.log('  Heavy Hive Studios - Beat Checkout Service');
  console.log('============================================');
  console.log(`  Server running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('  Endpoints:');
  console.log(`  - Health Check: GET /api/health`);
  console.log(`  - Stripe Webhook: POST /api/webhook/stripe`);
  console.log(`  - Admin Download: POST /api/admin/generate-download`);
  console.log('============================================');
});

module.exports = app;
