# Heavy Hive Studios - Beat Checkout Service

A Node.js/Express backend service for handling beat purchases with Stripe, AWS S3 file delivery, and email notifications.

## Features

- ✅ Secure Stripe webhook verification
- ✅ AWS S3 presigned URL generation (24-hour expiry)
- ✅ Automated email delivery with download links
- ✅ Production-ready error handling

## Setup Instructions

### 1. Install Dependencies

```bash
cd beat-checkout-service
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

### 3. Required Environment Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `STRIPE_SECRET_KEY` | Your Stripe API secret key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | Stripe Dashboard → Developers → Webhooks → Your endpoint → Signing secret |
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key | [AWS IAM Console](https://console.aws.amazon.com/iam/) → Users → Security Credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret key | Same as above |
| `AWS_REGION` | AWS region (e.g., `us-east-1`) | Your S3 bucket's region |
| `S3_BUCKET_NAME` | Your S3 bucket name | [AWS S3 Console](https://s3.console.aws.amazon.com/) |
| `SMTP_USER` | Your Gmail address | Your Gmail account |
| `SMTP_PASS` | Gmail App Password | [Google App Passwords](https://myaccount.google.com/apppasswords) |

### 4. AWS S3 Setup

1. **Create an S3 Bucket** for your beats:
   - Go to AWS S3 Console
   - Create bucket (e.g., `heavyhive-beats`)
   - Keep "Block all public access" enabled (presigned URLs handle access)

2. **Upload your beats** with a consistent naming convention:
   ```
   s3://heavyhive-beats/
   └── beats/
       ├── prod_ABC123.wav
       ├── prod_DEF456.wav
       └── ...
   ```

3. **Create an IAM User** with S3 read access:
   - Create new IAM user
   - Attach policy: `AmazonS3ReadOnlyAccess` (or create custom policy)
   - Generate Access Keys

### 5. Stripe Setup

1. **Create Products** in Stripe Dashboard:
   - Go to Products → Add Product
   - Name: Beat name (e.g., "Midnight Vibes")
   - Price: Your price
   - **Important**: Add metadata field `s3_key` with the S3 path:
     ```
     s3_key: beats/midnight-vibes.wav
     ```

2. **Create a Webhook Endpoint**:
   - Go to Developers → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/webhook/stripe`
   - Events: Select `checkout.session.completed`
   - Copy the Signing secret to your `.env`

### 6. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Other (Custom name)"
4. Enter "Heavy Hive Beat Delivery"
5. Copy the 16-character password to `SMTP_PASS` in `.env`

### 7. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Stripe Webhook (called by Stripe)
```
POST /api/webhook/stripe
```

### Admin: Regenerate Download Link
```
POST /api/admin/generate-download
Content-Type: application/json

{
  "email": "customer@example.com",
  "beatFileKey": "beats/prod_ABC123.wav",
  "beatName": "Midnight Vibes"
}
```

## File Structure

```
beat-checkout-service/
├── server.js           # Main application code
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .env                # Your actual config (don't commit!)
└── README.md           # This file
```

## Testing with Stripe CLI

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks locally:
   ```bash
   stripe listen --forward-to localhost:3001/api/webhook/stripe
   ```
4. Trigger a test event:
   ```bash
   stripe trigger checkout.session.completed
   ```

## Deployment

For production deployment, consider:
- **Heroku**: Add environment variables in Settings → Config Vars
- **Railway**: Add environment variables in your project settings
- **AWS EC2/EB**: Use environment configuration
- **DigitalOcean App Platform**: Add environment variables in App settings

Make sure to:
1. Set `NODE_ENV=production`
2. Use your live Stripe keys (`sk_live_...`)
3. Update the webhook endpoint URL in Stripe Dashboard

## Support

Questions? Contact us at heavystudios@gmail.com

---

© 2025 Heavy Hive Studios. All rights reserved.
