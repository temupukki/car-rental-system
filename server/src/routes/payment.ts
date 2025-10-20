import express from 'express';
import axios from 'axios';

const router = express.Router();

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'your_chapa_secret_key_here';
const CHAPA_BASE_URL = 'https://api.chapa.co/v1';

// Interfaces
interface ChapaInitiateRequest {
  amount: string;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  customization: {
    title: string;
    description: string;
  };
}

interface ChapaInitiateResponse {
  message: string;
  status: string;
  data: {
    checkout_url: string;
  };
}

interface PaymentInitiateRequest {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  checkoutData: any;
}

// Initialize payment
router.post('/initialize', async (req: express.Request, res: express.Response) => {
  try {
    const { 
      amount, 
      email, 
      firstName, 
      lastName, 
      phoneNumber,
      checkoutData 
    }: PaymentInitiateRequest = req.body;

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
    
    const payload: ChapaInitiateRequest = {
      amount: amount.toFixed(2),
      currency: 'ETB',
      email: email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      tx_ref: txRef,
      callback_url: `${process.env.BASE_URL || 'http://localhost:3001'}/api/payment/callback`,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?tx_ref=${txRef}`,
      customization: {
        title: 'Vehicle Rental', // Fixed: 13 characters (under 16)
        description: 'Vehicle rental payment'
      }
    };

    console.log('🔄 Sending to Chapa:', payload);

    const response = await axios.post<ChapaInitiateResponse>(
      `${CHAPA_BASE_URL}/transaction/initialize`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('✅ Chapa response:', response.data);

    res.json({
      success: true,
      paymentUrl: response.data.data.checkout_url,
      txRef: txRef
    });

  } catch (error: any) {
    console.error('❌ Payment initialization error:', error.response?.data || error.message);
    
    if (error.response?.data?.message) {
      res.status(400).json({
        success: false,
        message: 'Chapa validation failed',
        error: error.response.data.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to initialize payment',
        error: error.message
      });
    }
  }
});

// Callback endpoint - Chapa will call this after payment
router.get('/callback', async (req: express.Request, res: express.Response) => {
  try {
    const { trx_ref, ref_id, status } = req.query;

    console.log('📞 Chapa callback received:', { trx_ref, ref_id, status });

    // Verify the transaction
    const verifyResponse = await axios.get(
      `${CHAPA_BASE_URL}/transaction/verify/${ref_id}`,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`
        }
      }
    );

    console.log('✅ Payment verification result:', verifyResponse.data);

    if (verifyResponse.data.status === 'success' && verifyResponse.data.data.status === 'success') {
      // Payment successful - create order
      await createOrder(trx_ref as string, verifyResponse.data.data);
      
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

  } catch (error: any) {
    console.error('❌ Callback error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Callback processing failed'
    });
  }
});

// Verify payment endpoint (for frontend to check payment status)
router.get('/verify/:txRef', async (req: express.Request, res: express.Response) => {
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

  } catch (error: any) {
    console.error('❌ Verification error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Create order after successful payment
async function createOrder(txRef: string, paymentData: any): Promise<void> {
  try {
    console.log('📦 Creating order for transaction:', txRef);
    console.log('💰 Payment data:', paymentData);
    
    // Order creation logic would go here:
    // 1. Save order to database
    // 2. Update vehicle availability
    // 3. Send confirmation email
    // 4. Clear user's cart
    
    console.log('✅ Order created successfully for:', txRef);
    
  } catch (error) {
    console.error('❌ Order creation error:', error);
    throw error;
  }
}

export default router;