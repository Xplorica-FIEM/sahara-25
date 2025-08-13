import React from 'react';

type PaymentSuccessCardProps = {
  title?: string;
  amount?: number;
  currency?: string; // e.g., 'USD', 'NGN'
  reference?: string;
  date?: string | Date;
  status?: string;
  method?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
};

const formatAmount = (amount?: number, currency?: string) => {
  if (amount == null) return undefined;
  try {
    return currency
      ? new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
      : amount.toLocaleString();
  } catch {
    return amount.toLocaleString();
  }
};

const PaymentSuccessCard: React.FC<PaymentSuccessCardProps> = ({
  title = 'Payment Successful',
  amount,
  currency,
  reference,
  date,
  status,
  method,
  primaryActionLabel = 'Continue',
  onPrimaryAction,
  secondaryActionLabel = 'View receipt',
  onSecondaryAction,
  className,
}) => {
  const formattedAmount = formatAmount(amount, currency);
  const formattedDate =
    date ? new Date(date).toLocaleString() : undefined;

  return (
    <div role="dialog" aria-labelledby="payment-success-title" className={className}>
      <div
        style={{
          maxWidth: 480,
          margin: '0 auto',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 24,
          textAlign: 'center',
          background: '#fff',
        }}
      >
        <div
          aria-hidden
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#ecfdf5',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h2 id="payment-success-title" style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
          {title}
        </h2>

        <div style={{ textAlign: 'left', marginTop: 16 }}>
          {formattedAmount && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#6b7280' }}>Amount</span>
              <strong>{formattedAmount}</strong>
            </div>
          )}
          {reference && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#6b7280' }}>Reference</span>
              <span>{reference}</span>
            </div>
          )}
          {formattedDate && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#6b7280' }}>Date</span>
              <span>{formattedDate}</span>
            </div>
          )}
          {status && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#6b7280' }}>Status</span>
              <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
          )}
          {method && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#6b7280' }}>Method</span>
              <span className="uppercase">{method.toUpperCase()}</span>
            </div>
          )}
        </div>

        {(onPrimaryAction || onSecondaryAction) && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
            {onSecondaryAction && (
              <button
                type="button"
                onClick={onSecondaryAction}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                {secondaryActionLabel}
              </button>
            )}
            {onPrimaryAction && (
              <button
                type="button"
                onClick={onPrimaryAction}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#10b981',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                {primaryActionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessCard;