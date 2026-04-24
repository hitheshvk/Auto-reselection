import React, { useEffect, useState, useRef } from 'react'
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Play,
  Search,
  Crosshair,
  Save,
  ArrowLeft,
  X,
  ExternalLink,
} from 'lucide-react'
export interface FlowStepDef {
  title: string
  description: string
  targetId: string
}

export type AutoReselectionPhase =
  | 'loading_app'
  | 'running_flow'
  | 'step_failed'
  | 'scanning_dom'
  | 'element_found'
  | 'reselecting'
  | 'saving'
  | 'complete'
  | 'failed'

interface AutoReselectionPanelProps {
  contentName: string
  contentType: string
  targetSelector: string
  applicationName: string
  phase: AutoReselectionPhase
  currentStep: number
  failingStep: number
  totalSteps: number
  steps: FlowStepDef[]
  onClose?: () => void
  onReturnToDashboard?: () => void
}

const FONT = "'Inter', sans-serif"

interface PhaseItem {
  id: AutoReselectionPhase
  label: string
  icon: React.ReactNode
}

const Spinner = () => <Loader2 size={16} strokeWidth={2.5} style={{ animation: 'spin 1s linear infinite' }} />

export const AutoReselectionPanel: React.FC<AutoReselectionPanelProps> = ({
  contentName,
  contentType,
  targetSelector,
  applicationName,
  phase,
  currentStep,
  failingStep,
  totalSteps,
  steps,
  onClose,
  onReturnToDashboard,
}) => {
  const [elapsedMs, setElapsedMs] = useState(0)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setElapsedMs(Date.now() - startRef.current), 100)
    return () => clearInterval(timer)
  }, [])

  const elapsed = Math.floor(elapsedMs / 1000)
  const elapsedStr = `${elapsed}s`

  const phases: PhaseItem[] = [
    { id: 'loading_app', label: 'Loading application', icon: <Play size={14} strokeWidth={2.5} /> },
    { id: 'running_flow', label: `Running flow (step ${currentStep + 1}/${totalSteps})`, icon: <Play size={14} strokeWidth={2.5} /> },
    { id: 'step_failed', label: `Step ${failingStep + 1} — element not found`, icon: <XCircle size={14} strokeWidth={2.5} /> },
    { id: 'scanning_dom', label: 'Scanning DOM for element', icon: <Search size={14} strokeWidth={2.5} /> },
    { id: 'element_found', label: 'Element located at new position', icon: <Crosshair size={14} strokeWidth={2.5} /> },
    { id: 'reselecting', label: 'Reselecting element', icon: <Crosshair size={14} strokeWidth={2.5} /> },
    { id: 'saving', label: 'Saving changes', icon: <Save size={14} strokeWidth={2.5} /> },
    { id: 'complete', label: 'Auto-reselection complete', icon: <CheckCircle2 size={14} strokeWidth={2.5} /> },
  ]

  const phaseOrder = phases.map(p => p.id)
  const currentPhaseIdx = phaseOrder.indexOf(phase)
  const isComplete = phase === 'complete'
  const isFailed = phase === 'failed'

  const getPhaseStatus = (idx: number): 'done' | 'active' | 'pending' => {
    if (isFailed && idx === currentPhaseIdx) return 'active'
    if (idx < currentPhaseIdx) return 'done'
    if (idx === currentPhaseIdx) return 'active'
    return 'pending'
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#F2F2F8', minWidth: 0 }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', backgroundColor: '#fff',
        borderBottom: '1px solid #ECECF0', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '6px',
              backgroundColor: isComplete ? '#DCFCE7' : isFailed ? '#FEE2E2' : '#FEF3C7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isComplete ? (
                <CheckCircle2 size={16} color="#16a34a" strokeWidth={2.5} />
              ) : isFailed ? (
                <XCircle size={16} color="#DC2626" strokeWidth={2.5} />
              ) : (
                <Spinner />
              )}
            </div>
            <div>
              <h3 style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 700, color: '#3D3C52', margin: 0, lineHeight: '18px' }}>
                Auto-reselection
              </h3>
              <span style={{ fontFamily: FONT, fontSize: '11px', color: '#9998A7', lineHeight: '14px' }}>
                {isComplete ? 'Completed' : isFailed ? 'Failed' : `In progress · ${elapsedStr}`}
              </span>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px', borderRadius: '4px', color: '#9998A7',
            }}>
              <X size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Content info */}
      <div style={{ padding: '14px 16px', backgroundColor: '#fff', borderBottom: '1px solid #ECECF0', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <span style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 500, color: '#9998A7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Content</span>
            <div style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#3D3C52', marginTop: '2px' }}>{contentName}</div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div>
              <span style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 500, color: '#9998A7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</span>
              <div style={{ fontFamily: FONT, fontSize: '12px', color: '#6B697B', marginTop: '2px' }}>{contentType}</div>
            </div>
            <div>
              <span style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 500, color: '#9998A7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Application</span>
              <div style={{ fontFamily: FONT, fontSize: '12px', color: '#6B697B', marginTop: '2px' }}>{applicationName}</div>
            </div>
          </div>
          <div>
            <span style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 500, color: '#9998A7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Target selector</span>
            <div style={{
              fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: '11px',
              color: '#6B697B', marginTop: '4px', padding: '6px 8px',
              backgroundColor: '#F6F6F9', borderRadius: '4px', border: '1px solid #ECECF3',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {targetSelector}
            </div>
          </div>
        </div>
      </div>

      {/* Progress phases */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {phases.map((p, idx) => {
            const status = getPhaseStatus(idx)
            if (isFailed && idx > currentPhaseIdx) return null

            return (
              <div key={p.id} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                {/* Vertical connector line */}
                {idx < phases.length - 1 && status !== 'pending' && !(isFailed && idx === currentPhaseIdx) && (
                  <div style={{
                    position: 'absolute', left: '11px', top: '24px',
                    width: '2px', height: 'calc(100% - 8px)',
                    backgroundColor: status === 'done' ? '#BBF7D0' : '#ECECF3',
                  }} />
                )}

                {/* Step icon */}
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: status === 'done' ? '#DCFCE7'
                    : status === 'active' ? (isFailed ? '#FEE2E2' : '#FEF3C7')
                    : '#F2F2F8',
                  color: status === 'done' ? '#16a34a'
                    : status === 'active' ? (isFailed ? '#DC2626' : '#D97706')
                    : '#C5C3D1',
                  zIndex: 1,
                }}>
                  {status === 'done' ? (
                    <CheckCircle2 size={14} strokeWidth={2.5} />
                  ) : status === 'active' ? (
                    isFailed ? <XCircle size={14} strokeWidth={2.5} /> : <Spinner />
                  ) : (
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C5C3D1' }} />
                  )}
                </div>

                {/* Label */}
                <div style={{ paddingBottom: '16px', flex: 1 }}>
                  <span style={{
                    fontFamily: FONT, fontSize: '13px', fontWeight: status === 'active' ? 600 : 400,
                    color: status === 'done' ? '#16a34a'
                      : status === 'active' ? (isFailed ? '#DC2626' : '#3D3C52')
                      : '#9998A7',
                    lineHeight: '24px',
                  }}>
                    {p.label}
                  </span>

                  {/* Show flow steps progress when running */}
                  {p.id === 'running_flow' && status === 'active' && (
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {steps.map((step, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '6px 10px', borderRadius: '6px',
                          backgroundColor: i === currentStep ? '#FFF8F5' : i < currentStep ? '#F0FDF4' : '#FCFCFD',
                          border: `1px solid ${i === currentStep ? '#FDE7D8' : i < currentStep ? '#BBF7D0' : '#ECECF3'}`,
                        }}>
                          <div style={{
                            width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', fontWeight: 700, fontFamily: FONT,
                            backgroundColor: i < currentStep ? '#DCFCE7' : i === currentStep ? '#FEE2D6' : '#F2F2F8',
                            color: i < currentStep ? '#16a34a' : i === currentStep ? '#E45913' : '#9998A7',
                          }}>
                            {i < currentStep ? <CheckCircle2 size={12} strokeWidth={3} /> : i + 1}
                          </div>
                          <span style={{
                            fontFamily: FONT, fontSize: '12px',
                            color: i === currentStep ? '#3D3C52' : i < currentStep ? '#6B697B' : '#9998A7',
                            fontWeight: i === currentStep ? 600 : 400,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {step.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Step failed detail */}
                  {p.id === 'step_failed' && (status === 'done' || status === 'active') && (
                    <div style={{
                      marginTop: '6px', padding: '8px 10px', borderRadius: '6px',
                      backgroundColor: '#FEF7D6', border: '1px solid #F6D860',
                    }}>
                      <span style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: '11px', color: '#724F04' }}>
                        {targetSelector}
                      </span>
                      <div style={{ fontFamily: FONT, fontSize: '11px', color: '#AD7900', marginTop: '4px' }}>
                        Selector doesn't match — element may have moved
                      </div>
                    </div>
                  )}

                  {/* Element found detail */}
                  {p.id === 'element_found' && (status === 'done' || status === 'active') && (
                    <div style={{
                      marginTop: '6px', padding: '8px 10px', borderRadius: '6px',
                      backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0',
                    }}>
                      <span style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 600, color: '#166534' }}>
                        Similar element found via DOM analysis
                      </span>
                      <div style={{
                        fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: '11px',
                        color: '#15803D', marginTop: '4px', padding: '4px 6px',
                        backgroundColor: '#DCFCE7', borderRadius: '4px',
                      }}>
                        #{steps[failingStep]?.targetId ?? 'element'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Failed state */}
          {isFailed && (
            <div style={{
              display: 'flex', gap: '12px', marginTop: '4px',
              padding: '12px 14px', borderRadius: '8px',
              backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
            }}>
              <XCircle size={18} color="#DC2626" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <p style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#991B1B', margin: '0 0 4px' }}>
                  Auto-reselection failed
                </p>
                <p style={{ fontFamily: FONT, fontSize: '12px', color: '#B91C1C', margin: 0, lineHeight: '17px' }}>
                  No similar element found. Manual reselection is required.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success result */}
      {isComplete && (
        <div style={{
          margin: '0 16px 12px', padding: '14px 16px', borderRadius: '10px',
          backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <CheckCircle2 size={20} color="#16a34a" strokeWidth={2.5} />
            <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 700, color: '#166534' }}>
              Element reselected & saved
            </span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: '12px', color: '#15803D', lineHeight: '17px', margin: 0 }}>
            The selector has been updated. This content will now display correctly.
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', backgroundColor: '#fff', borderTop: '1px solid #ECECF0',
        flexShrink: 0,
      }}>
        {onReturnToDashboard && (isComplete || isFailed) ? (
          <button
            onClick={onReturnToDashboard}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: FONT, fontWeight: 600, fontSize: '13px',
              color: '#0975D7', backgroundColor: 'transparent',
              border: '1px solid #0975D7', borderRadius: '6px',
              padding: '8px 16px', cursor: 'pointer',
            }}
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Return to dashboard
          </button>
        ) : (
          <div />
        )}
        {isComplete && (
          <button
            onClick={onReturnToDashboard}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: FONT, fontWeight: 600, fontSize: '13px',
              color: '#fff', backgroundColor: '#C74900',
              border: 'none', borderRadius: '6px',
              padding: '8px 16px', cursor: 'pointer',
            }}
          >
            <ExternalLink size={14} strokeWidth={2} />
            Next item
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default AutoReselectionPanel
