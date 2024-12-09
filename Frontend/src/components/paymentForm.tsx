import React, { forwardRef, useImperativeHandle, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Alert } from "@mui/material";

const PaymentForm = forwardRef((props, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    async submit() {
      if (!stripe || !elements) return;

      const cardElement = elements.getElement(CardElement);

      setIsProcessing(true);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement!,
      });

      setIsProcessing(false);

      if (error) {
        console.error("Payment error:", error.message);
        setError(error.message || "An unknown error occurred");
        return { success: false, error: error.message };
      }

      console.log("Payment successful:", paymentMethod);
      return { success: true, paymentMethod };
    },
  }));

  // Custom styling for the CardElement
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
      },
    },
  };

  return (
    <div>
      <label className="fw-bold mb-2">
        Card details
      </label>
      {error && (
        <Alert key={"danger"} severity="error" color="error" className="mb-2">
          {error}
        </Alert>
      )}
      <div className="mb-2 border p-3 rounded-3" style={{ borderColor: "var(--main-color) !important" }}>
        <CardElement options={cardStyle} />
      </div>
      {isProcessing && <p>Processing...</p>}
    </div>
  );
});

export default PaymentForm;
