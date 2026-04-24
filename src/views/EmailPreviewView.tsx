/**
 * EmailPreviewView
 *
 * Design spec preview of the email notification sent to content authors
 * when a Content Health Scan detects element issues.
 */
export function EmailPreviewView() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', backgroundColor: '#F6F6F9', overflow: 'auto' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#3D3C52', marginBottom: '8px' }}>
        Email notification preview
      </h2>
      <p style={{ fontSize: '14px', color: '#6B697B', marginBottom: '32px' }}>
        Sent to content authors when element health issues are detected
      </p>

      {/* Email Container */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        {/* Email Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1F1F32 0%, #2B2B40 100%)',
          padding: '32px 40px',
          textAlign: 'center' as const,
        }}>
          <img src="/brand/whatfix-logo.png" alt="Whatfix" style={{ height: '28px', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
            Content health alert
          </h1>
        </div>

        {/* Email Body */}
        <div style={{ padding: '32px 40px' }}>
          <p style={{ fontSize: '15px', color: '#3D3C52', lineHeight: 1.6, marginBottom: '24px' }}>
            Hi there,
          </p>
          <p style={{ fontSize: '15px', color: '#3D3C52', lineHeight: 1.6, marginBottom: '24px' }}>
            A recent element health scan found issues with content in your workspace.
            <strong> 10 content items</strong> need your attention in <strong>Salesforce CRM</strong>.
          </p>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '24px',
          }}>
            <div style={{ padding: '16px', backgroundColor: '#FEFBEB', borderRadius: '8px', textAlign: 'center' as const }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#724F04' }}>5</div>
              <div style={{ fontSize: '13px', color: '#AD7900', fontWeight: 500 }}>Misplaced</div>
              <div style={{ fontSize: '11px', color: '#AD7900', marginTop: '4px' }}>Auto-resolvable</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#F0F9FF', borderRadius: '8px', textAlign: 'center' as const }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#033D84' }}>3</div>
              <div style={{ fontSize: '13px', color: '#0D59AB', fontWeight: 500 }}>Not found</div>
              <div style={{ fontSize: '11px', color: '#0D59AB', marginTop: '4px' }}>Needs reselection</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#FFF0F3', borderRadius: '8px', textAlign: 'center' as const }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#750A0A' }}>2</div>
              <div style={{ fontSize: '13px', color: '#B3141D', fontWeight: 500 }}>Removed</div>
              <div style={{ fontSize: '11px', color: '#B3141D', marginTop: '4px' }}>Needs re-authoring</div>
            </div>
          </div>

          {/* Breakdown by state */}
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#F6F6F9',
            borderRadius: '8px',
            marginBottom: '28px',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#3D3C52', marginBottom: '12px' }}>
              Breakdown by content state
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
              {[
                { label: 'Production', count: 5, color: '#B3141D' },
                { label: 'Ready', count: 3, color: '#E0A400' },
                { label: 'Draft', count: 2, color: '#6B697B' },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#3D3C52' }}>{row.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: row.color }}>{row.count} items</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#C74900',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              Review in dashboard
            </a>
          </div>

          <p style={{ fontSize: '13px', color: '#8C899F', lineHeight: 1.6, textAlign: 'center' as const }}>
            You're receiving this because you're a content author in the Whatfix workspace.
          </p>
        </div>

        {/* Email Footer */}
        <div style={{
          padding: '20px 40px',
          borderTop: '1px solid #ECECF3',
          textAlign: 'center' as const,
        }}>
          <p style={{ fontSize: '12px', color: '#8C899F', margin: 0 }}>
            Whatfix Inc. &middot; San Jose, CA
          </p>
        </div>
      </div>
    </div>
  )
}
