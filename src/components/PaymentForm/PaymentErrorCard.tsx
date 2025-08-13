import React from 'react';

type PaymentErrorCardProps = {
  title?: string;
  message?: string;
  code?: string;
  paymentId?: string;
  orderId?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
};

const Row = ({
  label,
  value,
  strong,
}: {
  label: string;
  value?: string;
  strong?: boolean;
}) => {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
      <span style={{ color: '#6b7280' }}>{label}</span>
      {strong ? <strong>{value}</strong> : <span>{value}</span>}
    </div>
  );
};

const PaymentErrorCard: React.FC<PaymentErrorCardProps> = ({
  title = 'Payment failed',
  message = 'The payment could not be completed.',
  code,
  paymentId,
  orderId,
  primaryActionLabel = 'Try again',
  onPrimaryAction,
  secondaryActionLabel = 'Donate Again',
  onSecondaryAction,
  className,
}) => {
  return (
    <div role="alertdialog" aria-labelledby="payment-error-title" className={className}>
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
            background: '#fee2e2',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>

        <h2 id="payment-error-title" style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
          {title}
        </h2>
        {message && <p style={{ color: '#6b7280', marginTop: 8 }}>{message}</p>}

        <div style={{ textAlign: 'left', marginTop: 16 }}>
          <Row label="Code" value={code} />
          <Row label="Payment ID" value={paymentId} />
          <Row label="Order ID" value={orderId} />
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
                  background: '#ef4444',
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

export default PaymentErrorCard;
