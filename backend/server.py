import secrets

from fastapi import FastAPI, APIRouter, Request, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, 
    CheckoutSessionResponse, 
    CheckoutStatusResponse, 
    CheckoutSessionRequest
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe API Key
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

# SECURITY: Origins allowed for CORS and checkout redirect URLs.
# Set ALLOWED_ORIGINS (comma-separated) in the environment for production.
ALLOWED_ORIGINS = [
    origin.strip().rstrip('/')
    for origin in os.environ.get(
        'ALLOWED_ORIGINS',
        os.environ.get('CORS_ORIGINS', 'https://heavy-hive-studios.vercel.app')
    ).split(',')
    if origin.strip() and origin.strip() != '*'
] or ['https://heavy-hive-studios.vercel.app']

# SECURITY: Token required for admin endpoints. If unset, admin endpoints are disabled.
ADMIN_API_TOKEN = os.environ.get('ADMIN_API_TOKEN')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================
# Subscription Plans Configuration
# SECURITY: All prices defined server-side only
# ============================================
SUBSCRIPTION_PLANS = {
    "artist-bundle": {
        "name": "Artist Bundle",
        "description": "3 recording sessions per month + 4 beats every month",
        "price": 300.00,
        "currency": "usd",
        "features": [
            "3 recording sessions per month",
            "4 beats every month",
            "Studio time + beats combo",
            "Best value for artists"
        ]
    },
    "weekly-beats": {
        "name": "Weekly Beats",
        "description": "2 exclusive beats per week from our in-house producers",
        "price": 150.00,
        "currency": "usd",
        "features": [
            "2 exclusive beats per week",
            "Custom to your style",
            "In-house producers",
            "Full ownership rights"
        ]
    },
    "studio-time": {
        "name": "Studio Time",
        "description": "3 recording sessions per month with 4 hours per session",
        "price": 150.00,
        "currency": "usd",
        "features": [
            "3 recording sessions per month",
            "4 hours per session",
            "Engineer included",
            "Priority booking"
        ]
    }
}

# ============================================
# Pydantic Models
# ============================================
class SubscriptionCheckoutRequest(BaseModel):
    plan_id: str = Field(..., description="The subscription plan ID (artist-bundle, weekly-beats, studio-time)")
    origin_url: str = Field(..., description="The frontend origin URL for redirect")
    customer_email: Optional[str] = Field(None, description="Optional customer email")

class SubscriptionCheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str
    plan_name: str
    amount: float

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    plan_id: str
    plan_name: str
    amount: float
    currency: str
    customer_email: Optional[str] = None
    payment_status: str = "pending"
    status: str = "initiated"
    metadata: Optional[Dict] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============================================
# Basic Routes
# ============================================
@api_router.get("/")
async def root():
    return {"message": "Heavy Hive Studios API"}

# SECURITY: The old /status endpoints allowed anyone to write arbitrary records
# to the database without authentication. Replaced with a read-only health check.
@api_router.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

# ============================================
# Subscription Plans Routes
# ============================================
@api_router.get("/subscriptions/plans")
async def get_subscription_plans():
    """Get all available subscription plans"""
    plans = []
    for plan_id, plan_data in SUBSCRIPTION_PLANS.items():
        plans.append({
            "id": plan_id,
            **plan_data
        })
    return {"plans": plans}

@api_router.get("/subscriptions/plans/{plan_id}")
async def get_subscription_plan(plan_id: str):
    """Get a specific subscription plan"""
    if plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    return {"id": plan_id, **SUBSCRIPTION_PLANS[plan_id]}

# ============================================
# Stripe Checkout Routes
# ============================================
@api_router.post("/subscriptions/checkout", response_model=SubscriptionCheckoutResponse)
async def create_subscription_checkout(request: Request, checkout_request: SubscriptionCheckoutRequest):
    """
    Create a Stripe Checkout session for a subscription plan.
    
    SECURITY: Amount is determined server-side based on plan_id.
    Frontend only provides plan selection and origin URL.
    """
    # Validate the plan exists
    if checkout_request.plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Invalid subscription plan")
    
    plan = SUBSCRIPTION_PLANS[checkout_request.plan_id]

    # SECURITY: Only allow redirects back to origins we trust.
    # Prevents attackers from crafting checkout sessions that redirect
    # customers to a malicious site after payment.
    origin = checkout_request.origin_url.rstrip('/')
    if origin not in ALLOWED_ORIGINS:
        raise HTTPException(status_code=400, detail="Origin not allowed")
    success_url = f"{origin}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/subscription/cancel"
    
    # Initialize Stripe Checkout
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    # Create checkout session request
    # SECURITY: Amount comes from server-side SUBSCRIPTION_PLANS, not from frontend
    checkout_session_request = CheckoutSessionRequest(
        amount=plan["price"],
        currency=plan["currency"],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "plan_id": checkout_request.plan_id,
            "plan_name": plan["name"],
            "customer_email": checkout_request.customer_email or "",
            "source": "heavyhive_website"
        }
    )
    
    try:
        # Create the Stripe checkout session
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_session_request)
        
        # Create payment transaction record BEFORE redirecting to Stripe
        transaction = PaymentTransaction(
            session_id=session.session_id,
            plan_id=checkout_request.plan_id,
            plan_name=plan["name"],
            amount=plan["price"],
            currency=plan["currency"],
            customer_email=checkout_request.customer_email,
            payment_status="pending",
            status="initiated",
            metadata={
                "plan_id": checkout_request.plan_id,
                "source": "heavyhive_website"
            }
        )
        
        # Save transaction to database
        transaction_doc = transaction.model_dump()
        transaction_doc['created_at'] = transaction_doc['created_at'].isoformat()
        transaction_doc['updated_at'] = transaction_doc['updated_at'].isoformat()
        await db.payment_transactions.insert_one(transaction_doc)
        
        logger.info(f"Created checkout session {session.session_id} for plan {checkout_request.plan_id}")
        
        return SubscriptionCheckoutResponse(
            checkout_url=session.url,
            session_id=session.session_id,
            plan_name=plan["name"],
            amount=plan["price"]
        )
        
    except Exception as e:
        logger.error(f"Error creating checkout session: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")

@api_router.get("/subscriptions/checkout/status/{session_id}")
async def get_checkout_status(request: Request, session_id: str):
    """
    Get the status of a checkout session.
    Used by frontend to poll for payment completion.
    """
    # Initialize Stripe Checkout
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        # Get checkout status from Stripe
        status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Update transaction in database if payment completed
        if status.payment_status == "paid":
            # Check if already processed to prevent duplicate processing
            existing = await db.payment_transactions.find_one({
                "session_id": session_id,
                "payment_status": "paid"
            }, {"_id": 0})
            
            if not existing:
                # Update transaction status
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {
                        "$set": {
                            "payment_status": "paid",
                            "status": "completed",
                            "updated_at": datetime.now(timezone.utc).isoformat()
                        }
                    }
                )
                logger.info(f"Payment completed for session {session_id}")
        
        elif status.status == "expired":
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {
                    "$set": {
                        "payment_status": "expired",
                        "status": "expired",
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
        
        return {
            "session_id": session_id,
            "status": status.status,
            "payment_status": status.payment_status,
            "amount_total": status.amount_total,
            "currency": status.currency,
            "metadata": status.metadata
        }
        
    except Exception as e:
        logger.error(f"Error getting checkout status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get checkout status")

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhook events.
    Called by Stripe when payment events occur.
    """
    try:
        # Get the raw body for signature verification
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        # Initialize Stripe Checkout
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        # Handle the webhook
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        logger.info(f"Received webhook event: {webhook_response.event_type} for session {webhook_response.session_id}")
        
        # Update transaction based on webhook event
        if webhook_response.payment_status == "paid":
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {
                    "$set": {
                        "payment_status": "paid",
                        "status": "completed",
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
            logger.info(f"Payment completed via webhook for session {webhook_response.session_id}")
        
        return {"received": True}
        
    except Exception as e:
        # SECURITY: Log the details server-side but never echo internal error
        # messages back to the caller.
        logger.error(f"Webhook error: {str(e)}")
        return {"received": True}

@api_router.get("/subscriptions/transactions")
async def get_transactions(x_admin_token: Optional[str] = Header(None)):
    """
    Get all payment transactions (admin endpoint).

    SECURITY: Requires the X-Admin-Token header to match ADMIN_API_TOKEN.
    If ADMIN_API_TOKEN is not configured, this endpoint is disabled.
    """
    if not ADMIN_API_TOKEN or not x_admin_token or not secrets.compare_digest(x_admin_token, ADMIN_API_TOKEN):
        raise HTTPException(status_code=403, detail="Forbidden")
    transactions = await db.payment_transactions.find({}, {"_id": 0}).to_list(1000)
    return {"transactions": transactions}

# Include the router in the main app
app.include_router(api_router)

# SECURITY: Explicit origin allowlist instead of a wildcard, and only the
# methods/headers the API actually uses. Never combine allow_credentials=True
# with a "*" origin.
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-Admin-Token"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
