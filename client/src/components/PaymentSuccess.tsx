import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { PaymentService } from '../services/paymentService';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const txRef = searchParams.get('tx_ref');
        
        if (!txRef) {
          setPaymentStatus('failed');
          setMessage('No transaction reference found');
          return;
        }

        // Verify payment with backend
        const verification = await PaymentService.verifyPayment(txRef);
        
        if (verification.success) {
          setPaymentStatus('success');
          setMessage('Payment verified successfully! Your booking is confirmed.');
          
          // Clear cart from localStorage
          localStorage.removeItem('vehicleRentalCart');
          
          // Redirect to home after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setPaymentStatus('failed');
          setMessage('Payment verification failed. Please contact support.');
        }

      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('failed');
        setMessage('Error verifying payment. Please check your email for confirmation.');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {paymentStatus === 'loading' && (
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Return to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;