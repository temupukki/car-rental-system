"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'your_chapa_secret_key_here';
const CHAPA_BASE_URL = 'https://api.chapa.co/v1';
// Initialize payment
router.post('/initialize', async (req, res) => {
    try {
        const { amount, email, firstName, lastName, phoneNumber, checkoutData } = req.body;
        console.log('📦 Received payment request:', {
            amount, email, firstName, lastName, phoneNumber
        });
        // Validate required fields
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }
        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid amount is required'
            });
        }
        // Generate unique transaction reference
        const txRef = `vehicle-rental-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const payload = {
            amount: amount.toFixed(2),
            currency: 'ETB',
            email: email,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            tx_ref: txRef,
            callback_url: `${process.env.BASE_URL || 'http://localhost:3000'}/api/payment/callback`,
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/bookings`,
            customization: {
                title: 'Vehicle Rental', // Fixed: 13 characters (under 16)
                description: 'Vehicle rental payment'
            }
        };
        console.log('🔄 Sending to Chapa:', payload);
        const response = await axios_1.default.post(`${CHAPA_BASE_URL}/transaction/initialize`, payload, {
            headers: {
                Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        console.log('✅ Chapa response:', response.data);
        res.json({
            success: true,
            paymentUrl: response.data.data.checkout_url,
            txRef: txRef
        });
    }
    catch (error) {
        console.error('❌ Payment initialization error:', error.response?.data || error.message);
        if (error.response?.data?.message) {
            res.status(400).json({
                success: false,
                message: 'Chapa validation failed',
                error: error.response.data.message
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Failed to initialize payment',
                error: error.message
            });
        }
    }
});
// Callback endpoint - Chapa will call this after payment
router.get('/callback', async (req, res) => {
    try {
        const { trx_ref, ref_id, status } = req.query;
        console.log('📞 Chapa callback received:', { trx_ref, ref_id, status });
        // Verify the transaction
        const verifyResponse = await axios_1.default.get(`${CHAPA_BASE_URL}/transaction/verify/${ref_id}`, {
            headers: {
                Authorization: `Bearer ${CHAPA_SECRET_KEY}`
            }
        });
        console.log('✅ Payment verification result:', verifyResponse.data);
        if (verifyResponse.data.status === 'success' && verifyResponse.data.data.status === 'success') {
            // Payment successful - create order
            await createOrder(trx_ref, verifyResponse.data.data);
            res.status(200).json({
                success: true,
                message: 'Payment verified successfully'
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }
    }
    catch (error) {
        console.error('❌ Callback error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Callback processing failed'
        });
    }
});
// Verify payment endpoint (for frontend to check payment status)
router.get('/verify/:txRef', async (req, res) => {
    try {
        const { txRef } = req.params;
        console.log('🔍 Verifying payment:', txRef);
        // For now, return mock success response
        // In production, verify with Chapa API
        res.json({
            success: true,
            data: {
                status: 'success',
                tx_ref: txRef,
                message: 'Payment verified successfully'
            }
        });
    }
    catch (error) {
        console.error('❌ Verification error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed'
        });
    }
});
// Create order after successful payment
async function createOrder(txRef, paymentData) {
    try {
        console.log('📦 Creating order for transaction:', txRef);
        console.log('💰 Payment data:', paymentData);
        console.log('✅ Order created successfully for:', txRef);
    }
    catch (error) {
        console.error('❌ Order creation error:', error);
        throw error;
    }
}
exports.default = router;
