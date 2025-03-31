import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const [price, setPrice] = useState(0);
    const [providerData, setProviderData] = useState(null);

    const { selectedSlot, Id, service } = location.state;

    const [loading, setLoading] = useState(false);
    const [cardName, setCardName] = useState("");
    const [message, setMessage] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!selectedSlot) {
            console.error("No booking information available.");
            navigate("/");
            return;
        }

        console.log("Payment page loaded with data:", {
            user: {
                id: localStorage.getItem('userId'),
                service: service,
                providerId: Id,
                slot: {
                    id: selectedSlot._id,
                    date: selectedSlot.date,
                    startTime: selectedSlot.startTime,
                    endTime: selectedSlot.endTime,
                    originalEndTime: selectedSlot.originalEndTime,
                    originalStartTime: selectedSlot.originalStartTime
                }
            }
        });

        const fetchProviderPrice = async () => {
            try {
                const response = await axios.get(
                    `/api/provider/profile/${Id}?service=${service}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                console.log("Provider API Response:", response.data);

                setPrice(response.data.price);
                setProviderData(response.data);
            } catch (error) {
                console.error("Error fetching provider price:", error);
            }
        };

        fetchProviderPrice();
    }, [selectedSlot]);

    const handleNameChange = (e) => setCardName(e.target.value);

    const handleCardNumberChange = (event) => {
        const rawValue = event.value || "";
        const digits = rawValue.replace(/\D/g, "");
        const formatted = digits.replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
    };

    const handleExpiryChange = (event) => {
        const rawValue = event.value || "";
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        console.log("Payment attempt started");

        if (!stripe || !elements) {
            setMessage("Stripe not loaded.");
            setLoading(false);
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: "card",
            card: cardNumberElement,
            billing_details: { name: cardName },
        });

        if (error) {
            setMessage(error.message);
            setLoading(false);
            return;
        }

        try {
            console.log("Sending payment request to:", `/payments/card-pay`);
            const response = await fetch(`/payments/card-pay`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    user: {
                        id: localStorage.getItem('userId'),
                        service: service,
                        providerId: Id,
                        provider: providerData,
                        slot: {
                            id: selectedSlot._id,
                            date: selectedSlot.date,
                            startTime: selectedSlot.startTime,
                            endTime: selectedSlot.endTime,
                            originalEndTime: selectedSlot.originalEndTime,
                            originalStartTime:selectedSlot.originalStartTime
                        }
                    },
                    card: {
                        amount: price,
                        currency: "usd",
                        paymentMethodId: paymentMethod.id,
                        cardholderName: cardName
                    }
                }),
            });

            console.log("Response received:", response);
            const data = await response.json();
            console.log("Response data:", data);
            
            setLoading(false);
            if (response.status >= 200 && response.status < 300) {
                setMessage("Payment successful!");
                setPaymentSuccess(true);
            } else {
                setMessage(`Payment failed: ${data.error}`);
            }
        } catch (error) {
            console.error("Payment request error:", error);
            setMessage(`Payment request failed: ${error.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 text-white boarder rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                            </svg>
                            <span className="font-bold text-lg">Payment</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <span>Secure Checkout</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mb-4">Complete Your booking</h1>
                    <p className="text-sm opacity-90">Total amount: ${price}</p>
                </div>

                {!paymentSuccess && (
                    <form onSubmit={handlePayment} className="space-y-6 mt-6" aria-label="Payment form">
                        <div>
                            <label htmlFor="cardholder-name" className="block mb-2 text-sm font-medium text-gray-700">Cardholder Name</label>
                            <input
                                id="cardholder-name"
                                type="text"
                                value={cardName}
                                onChange={handleNameChange}
                                placeholder="John Doe"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                aria-required="true"
                                aria-describedby="cardholder-name-help"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Card Number</label>
                            <div aria-label="Card number input">
                                <CardNumberElement
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    onChange={handleCardNumberChange}
                                    options={{ placeholder: "4242 4242 4242 4242" }}
                                    aria-label="Credit card number"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Expiry Date</label>
                                <div aria-label="Expiry date input">
                                    <CardExpiryElement
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        onChange={handleExpiryChange}
                                        aria-label="Expiration date"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">CVC</label>
                                <div aria-label="CVC input">
                                    <CardCvcElement 
                                        className="w-full p-3 border border-gray-300 rounded-lg" 
                                        aria-label="CVC code"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                            disabled={loading}
                            aria-busy={loading}
                            aria-live="polite"
                        >
                            {loading ? "Processing..." : `Pay $${price}`}
                        </button>
                        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                <span>SSL Encrypted</span>
                            </div>
                            <div>PCI Compliant</div>
                            <div>100% Secure</div>
                        </div>
                    </form>
                )}
                {message && <p className="text-center mt-4 text-red-600" role="alert" aria-live="assertive">{message}</p>}
                {paymentSuccess && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="confirmation-heading">
                        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                            <h2 id="confirmation-heading" className="text-xl font-bold mb-4">Booking Confirmed</h2>
                            <p>
                                Your booking for{" "}
                                {moment(selectedSlot.date).format("LL")} -{" "}
                                {moment.utc(selectedSlot.originalStartTime).local().format("h:mm A")} to{" "}
                                {moment.utc(selectedSlot.originalEndTime).local().format("h:mm A")} has been confirmed!
                            </p>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => navigate("/")}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600"
                                    aria-label="Close confirmation dialog"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;