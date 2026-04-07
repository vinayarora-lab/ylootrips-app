'use client';

import { CreditCard, Smartphone, Building2, QrCode, CheckCircle, Calendar, Percent, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPriceWithCurrency } from '@/lib/utils';

interface EmiOption {
    tenure: number;
    interestRate: number;
    monthlyAmount: number;
    totalAmount: number;
    interestAmount: number;
    noCost: boolean;
    label: string;
    description: string;
}

interface PaymentMethodsProps {
    selectedMethod: string;
    onMethodChange: (method: string) => void;
    amount: number;
    bookingReference?: string;
    selectedEmi?: EmiOption | null;
    onEmiChange?: (emi: EmiOption | null) => void;
    onHalfPaymentCardTypeChange?: (cardType: 'credit' | 'debit') => void;
    isInternational?: boolean;
}

export default function PaymentMethods({ selectedMethod, onMethodChange, amount, bookingReference, selectedEmi, onEmiChange, onHalfPaymentCardTypeChange, isInternational }: PaymentMethodsProps) {
    const { currency } = useCurrency();
    const fa = (n: number) => formatPriceWithCurrency(n, currency);
    const [showQRCode, setShowQRCode] = useState(false);
    const [emiOptions, setEmiOptions] = useState<EmiOption[]>([]);
    const [showEmi, setShowEmi] = useState(false);
    const [selectedEmiLocal, setSelectedEmiLocal] = useState<EmiOption | null>(null);
    const [halfPaymentCardType, setHalfPaymentCardType] = useState<'credit' | 'debit'>('credit');
    const [cardData, setCardData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
    });

    // Fetch EMI options when amount changes
    useEffect(() => {
        const fetchEmiOptions = async () => {
            if (amount >= 2500) {
                try {
                    // Use API_BASE_URL which already includes /api
                    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trip-backend-65232427280.asia-south1.run.app/api';
                    const response = await fetch(`${API_URL}/emi/options?amount=${amount}`);
                    const data = await response.json();
                    if (data.eligible && data.options) {
                        setEmiOptions(data.options);
                    }
                } catch {
                    // fall through to local calculation
                    // Use fallback local calculation
                    const fallbackOptions: EmiOption[] = [
                        {
                            tenure: 3,
                            interestRate: 0,
                            monthlyAmount: Math.ceil(amount / 3),
                            totalAmount: amount,
                            interestAmount: 0,
                            noCost: true,
                            label: '3 Months No-Cost EMI',
                            description: `Pay ₹${Math.ceil(amount / 3).toLocaleString('en-IN')}/month with 0% interest`
                        },
                        {
                            tenure: 6,
                            interestRate: 16,
                            monthlyAmount: Math.ceil(calculateEmi(amount, 6, 16)),
                            totalAmount: Math.ceil(calculateEmi(amount, 6, 16) * 6),
                            interestAmount: Math.ceil(calculateEmi(amount, 6, 16) * 6 - amount),
                            noCost: false,
                            label: '6 Months EMI @ 16% p.a.',
                            description: `Pay ₹${Math.ceil(calculateEmi(amount, 6, 16)).toLocaleString('en-IN')}/month`
                        }
                    ];
                    setEmiOptions(fallbackOptions);
                }
            } else {
                setEmiOptions([]);
            }
        };

        fetchEmiOptions();
    }, [amount]);

    // EMI calculation helper
    const calculateEmi = (principal: number, months: number, annualRate: number) => {
        const r = annualRate / 12 / 100;
        return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
    };

    const handleEmiSelect = (emi: EmiOption | null) => {
        setSelectedEmiLocal(emi);
        if (onEmiChange) {
            onEmiChange(emi);
        }
    };

    const internationalPaymentMethods = [
        {
            id: 'credit_card',
            name: 'International Credit Card',
            icon: CreditCard,
            discount: 3,
            description: 'Visa, Mastercard, Amex — all international cards accepted',
            badge: 'Recommended',
        },
        {
            id: 'debit_card',
            name: 'International Debit Card',
            icon: CreditCard,
            discount: 3,
            description: 'Visa, Mastercard international debit cards',
        },
        {
            id: 'half_payment',
            name: 'Pay 50% Now',
            icon: CreditCard,
            discount: 0,
            description: 'Reserve your trip with 50% deposit • Pay rest before travel',
            badge: 'Flexible',
        },
    ];

    const domesticPaymentMethods = [
        {
            id: 'upi',
            name: 'UPI',
            icon: Smartphone,
            discount: 5,
            description: 'Pay using UPI apps like PhonePe, Google Pay, Paytm',
        },
        {
            id: 'credit_card',
            name: 'Credit Card',
            icon: CreditCard,
            discount: 3,
            description: 'Visa, Mastercard, Amex • EMI available',
        },
        {
            id: 'debit_card',
            name: 'Debit Card',
            icon: CreditCard,
            discount: 3,
            description: 'Visa, Mastercard, RuPay',
        },
        {
            id: 'half_payment',
            name: 'Pay 50% Now',
            icon: CreditCard,
            discount: 0,
            description: 'Reserve your trip • Pay rest before travel',
            badge: 'Flexible',
        },
    ];

    const paymentMethods = isInternational ? internationalPaymentMethods : domesticPaymentMethods;

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        }
        return v;
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const generateUPIQRCode = () => {
        // Generate UPI payment URL
        const upiId = 'ylootrips@paytm'; // Replace with your actual UPI ID
        const merchantName = 'YlooTrips';
        const transactionNote = bookingReference ? `Booking ${bookingReference}` : 'Trip Booking';
        const amountStr = amount.toFixed(2);

        // UPI Deep Link Format
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amountStr}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

        return upiUrl;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6 flex items-center gap-3">
                <CreditCard size={28} className="text-secondary shrink-0" />
                Payment Method
            </h2>

            {/* International payment banner */}
            {isInternational && (
                <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg flex items-start gap-3">
                    <span className="text-2xl">🌍</span>
                    <div>
                        <p className="font-medium text-primary">International Payments Welcome</p>
                        <p className="text-sm text-primary/60 mt-1">We accept all major international credit and debit cards. Payments processed securely in USD via our payment gateway.</p>
                    </div>
                </div>
            )}


            {/* Payment Method Selection */}
            <div className="space-y-3">
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;

                    return (
                        <label
                            key={method.id}
                            className={`flex items-start gap-3 md:gap-4 p-4 md:p-5 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                ? 'border-secondary bg-secondary/5'
                                : 'border-primary/20 bg-white hover:border-primary/40'
                                }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={isSelected}
                                onChange={(e) => {
                                    onMethodChange(e.target.value);
                                    setShowQRCode(false);
                                }}
                                className="mt-1 text-secondary"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <Icon size={24} className={isSelected ? 'text-secondary' : 'text-primary/60'} />
                                    <span className="text-body-lg font-medium">{method.name}</span>
                                    {method.discount > 0 && (
                                        <span className="text-body-sm text-success font-medium bg-success/10 px-2 py-1 rounded">
                                            {method.discount}% OFF
                                        </span>
                                    )}
                                </div>
                                <p className="text-body-sm text-text-secondary">{method.description}</p>
                            </div>
                            {isSelected && (
                                <CheckCircle size={20} className="text-secondary shrink-0 mt-1" />
                            )}
                        </label>
                    );
                })}
            </div>

            {/* Half Payment Notice */}
            {selectedMethod === 'half_payment' && (
                <div className="mt-4 space-y-4">
                    <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <div className="text-amber-500 text-2xl">⚠️</div>
                            <div>
                                <h4 className="font-semibold text-amber-800">Pay 50% Now, Complete Later</h4>
                                <p className="text-sm text-amber-700 mt-1">
                                    You'll pay <strong>{fa(amount / 2)}</strong> now to reserve your trip.
                                </p>
                                <p className="text-sm text-amber-700 mt-1">
                                    Remaining <strong>{fa(amount / 2)}</strong> must be paid <strong>2 hours before your travel date</strong>.
                                </p>
                                <p className="text-xs text-amber-600 mt-2">
                                    We'll send you a reminder email before the due date.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card Type Selection for Half Payment */}
                    <div className="p-4 bg-white border border-primary/20 rounded-lg">
                        <h4 className="font-medium text-primary mb-3">Select Card Type for Payment</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${halfPaymentCardType === 'credit'
                                ? 'border-secondary bg-secondary/5'
                                : 'border-primary/20 hover:border-primary/40'
                                }`}>
                                <input
                                    type="radio"
                                    name="halfPaymentCardType"
                                    value="credit"
                                    checked={halfPaymentCardType === 'credit'}
                                    onChange={() => { setHalfPaymentCardType('credit'); onHalfPaymentCardTypeChange?.('credit'); }}
                                    className="text-secondary"
                                />
                                <div>
                                    <CreditCard size={20} className={halfPaymentCardType === 'credit' ? 'text-secondary' : 'text-primary/60'} />
                                </div>
                                <span className="font-medium">Credit Card</span>
                            </label>
                            <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${halfPaymentCardType === 'debit'
                                ? 'border-secondary bg-secondary/5'
                                : 'border-primary/20 hover:border-primary/40'
                                }`}>
                                <input
                                    type="radio"
                                    name="halfPaymentCardType"
                                    value="debit"
                                    checked={halfPaymentCardType === 'debit'}
                                    onChange={() => { setHalfPaymentCardType('debit'); onHalfPaymentCardTypeChange?.('debit'); }}
                                    className="text-secondary"
                                />
                                <div>
                                    <CreditCard size={20} className={halfPaymentCardType === 'debit' ? 'text-secondary' : 'text-primary/60'} />
                                </div>
                                <span className="font-medium">Debit Card</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Type Selection - Full Payment vs EMI (Credit Card Only) */}
            {selectedMethod === 'credit_card' && emiOptions.length > 0 && (
                <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium text-primary">How would you like to pay?</h3>

                    {/* Two Choice Toggle */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Full Payment Option */}
                        <label
                            className={`relative p-5 border-2 rounded-lg cursor-pointer transition-all ${!showEmi
                                ? 'border-secondary bg-secondary/5 shadow-md'
                                : 'border-primary/20 bg-white hover:border-primary/40'
                                }`}
                        >
                            <input
                                type="radio"
                                name="paymentType"
                                checked={!showEmi}
                                onChange={() => {
                                    setShowEmi(false);
                                    handleEmiSelect(null);
                                }}
                                className="sr-only"
                            />
                            <div className="text-center">
                                <CreditCard size={32} className={!showEmi ? 'text-secondary mx-auto mb-2' : 'text-primary/40 mx-auto mb-2'} />
                                <p className="font-medium text-body-lg">Pay Full Amount</p>
                                <p className="text-2xl font-bold mt-2">{fa(amount)}</p>
                                <p className="text-body-sm text-success mt-1">3% discount applied</p>
                            </div>
                            {!showEmi && (
                                <CheckCircle size={20} className="absolute top-3 right-3 text-secondary" />
                            )}
                        </label>

                        {/* EMI Option */}
                        <label
                            className={`relative p-5 border-2 rounded-lg cursor-pointer transition-all ${showEmi
                                ? 'border-secondary bg-secondary/5 shadow-md'
                                : 'border-primary/20 bg-white hover:border-primary/40'
                                }`}
                        >
                            <input
                                type="radio"
                                name="paymentType"
                                checked={showEmi}
                                onChange={() => setShowEmi(true)}
                                className="sr-only"
                            />
                            <div className="text-center">
                                <Calendar size={32} className={showEmi ? 'text-secondary mx-auto mb-2' : 'text-primary/40 mx-auto mb-2'} />
                                <p className="font-medium text-body-lg">Pay with EMI</p>
                                <p className="text-2xl font-bold mt-2">{fa(Math.ceil(amount / 3))}<span className="text-sm font-normal">/mo</span></p>
                                <p className="text-body-sm text-text-secondary mt-1">Credit Cards Only</p>
                            </div>
                            {showEmi && (
                                <CheckCircle size={20} className="absolute top-3 right-3 text-secondary" />
                            )}
                        </label>
                    </div>

                    {/* EMI Plans - Show only when EMI is selected */}
                    {showEmi && (
                        <div className="bg-cream-light border border-primary/10 rounded-lg p-5 mt-4">
                            <h4 className="text-body-lg font-medium mb-4">Select EMI Plan</h4>
                            <div className="space-y-3">
                                {emiOptions.map((emi) => {
                                    const isSelected = selectedEmiLocal?.tenure === emi.tenure;
                                    return (
                                        <div
                                            key={emi.tenure}
                                            onClick={() => handleEmiSelect(emi)}
                                            className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                                ? 'border-secondary bg-white shadow-sm'
                                                : 'border-primary/10 bg-white hover:border-primary/30'
                                                }`}
                                        >
                                            {/* Custom Radio Circle */}
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-gray-400'
                                                }`}>
                                                {isSelected && (
                                                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{emi.tenure} Months</span>
                                                    {emi.noCost && (
                                                        <span className="text-xs font-bold bg-success text-white px-2 py-0.5 rounded">
                                                            NO COST
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-body-sm text-text-secondary">
                                                    {emi.noCost
                                                        ? `${fa(emi.monthlyAmount || 0)}/month × ${emi.tenure} = ${fa(emi.totalAmount || 0)}`
                                                        : `${fa(emi.monthlyAmount || 0)}/month × ${emi.tenure} = ${fa(emi.totalAmount || 0)} (incl. ${fa(emi.interestAmount || 0)} interest)`
                                                    }
                                                </p>
                                            </div>
                                            <span className="text-xl font-bold text-secondary">
                                                {fa(emi.monthlyAmount || 0)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {!selectedEmiLocal && (
                                <p className="text-body-sm text-amber-600 mt-3 flex items-center gap-2">
                                    <span className="text-lg">👆</span> Please select an EMI plan to continue
                                </p>
                            )}

                            {selectedEmi?.noCost && (
                                <div className="bg-success/10 border border-success/20 p-3 rounded-lg mt-4">
                                    <p className="text-body-sm text-success">
                                        ✓ No-Cost EMI - You pay exactly {fa(selectedEmi.totalAmount || 0)} with 0% interest
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* UPI QR Code Section */}
            {selectedMethod === 'upi' && (
                <div className="mt-6 p-6 bg-cream-light border border-primary/10 rounded-lg">
                    {/* <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-light flex items-center gap-2">
                            <QrCode size={24} className="text-secondary" />
                            UPI Payment
                        </h3>
                        <button
                            type="button"
                            onClick={() => setShowQRCode(!showQRCode)}
                            className="text-body-sm text-secondary hover:text-primary transition-colors"
                        >
                            {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                        </button>
                    </div> */}

                    {/* {showQRCode ? (
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-primary/20 flex flex-col items-center">
                                <div className="w-64 h-64 bg-white border-2 border-primary/10 rounded-lg flex items-center justify-center mb-4 p-4">
                                    <QRCodeSVG
                                        value={generateUPIQRCode()}
                                        size={240}
                                        level="H"
                                        includeMargin={true}
                                        className="w-full h-full"
                                    />
                                </div>
                                <p className="text-body-sm text-text-secondary text-center mb-4">
                                    Scan this QR code with PhonePe, Google Pay, Paytm, or any UPI app
                                </p>
                                <div className="bg-primary/5 p-4 rounded-lg w-full">
                                    <p className="text-caption text-text-secondary mb-1">UPI ID</p>
                                    <p className="text-body-lg font-mono">ylootrips@paytm</p>
                                </div>
                                <div className="bg-primary/5 p-4 rounded-lg w-full mt-2">
                                    <p className="text-caption text-text-secondary mb-1">Amount</p>
                                    <p className="text-body-lg font-semibold">{fa(amount)}</p>
                                </div>
                            </div>
                            <div className="bg-accent/10 p-4 rounded-lg">
                                <p className="text-body-sm text-text-secondary">
                                    <strong>Note:</strong> After scanning and completing payment, click "Complete Booking" to proceed.
                                    Your payment will be verified automatically.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-4 rounded-lg border border-primary/10">
                            <p className="text-body-sm text-text-secondary">
                                Click "Show QR Code" to display the payment QR code, or proceed to pay via UPI gateway.
                            </p>
                        </div>
                    )} */}
                </div>
            )}

            {/* Card details are collected on Easebuzz payment page - no need to collect here */}

            {/* Net Banking Info */}
            {/* {selectedMethod === 'netbanking' && (
                <div className="mt-6 p-6 bg-cream-light border border-primary/10 rounded-lg">
                    <h3 className="text-xl font-light mb-4 flex items-center gap-2">
                        <Building2 size={24} className="text-secondary" />
                        Net Banking
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-primary/10">
                        <p className="text-body-sm text-text-secondary mb-4">
                            You will be redirected to your bank's secure payment page to complete the transaction.
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                                <div
                                    key={bank}
                                    className="p-3 border border-primary/10 rounded-lg text-center hover:border-secondary transition-colors cursor-pointer"
                                >
                                    <p className="text-body-sm font-medium">{bank}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )} */}

            {/* Security Notice */}
            <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success mt-0.5 shrink-0" />
                    <div>
                        <p className="text-body-sm font-medium text-primary mb-1">Secure Payment</p>
                        <p className="text-body-sm text-text-secondary">
                            Your payment information is encrypted and secure. We never store your card details.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

