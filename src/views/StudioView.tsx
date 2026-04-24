/**
 * StudioView
 *
 * Mock Whatfix Studio Chrome extension opened in a new tab when the user
 * triggers Auto-reselect / Reselect / Re-author / Open in Studio from the
 * dashboard.
 *
 * Reuses the original `Sidebar` and `AutoReselectionPanel` components copied
 * verbatim from the Diagnostics-in-studio repo (under `./studio/`). This file
 * is a thin host: it reads URL params, drives the phase timeline, mounts the
 * Studio panel docked on the right (431px) over a mock browser background,
 * and postMessages back to the opener on completion.
 */
import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft, ChevronRight, RotateCw, Star, Lock, MoreVertical,
  AlertTriangle,
} from 'lucide-react'
import Sidebar from './studio/Sidebar'
import AutoReselectionPanel, {
  type AutoReselectionPhase,
  type FlowStepDef,
} from './studio/AutoReselectionPanel'

const FONT = "'Inter', sans-serif"
const PANEL_WIDTH = 431

type StudioMode = 'auto-reselect' | 'reselect' | 're-author' | 'debug'

interface StudioContext {
  mode: StudioMode
  contentId: string
  name: string
  type: string
  selector: string
  app: string
  step?: number
  stepLabel?: string
  totalSteps?: number
}

function readContext(): StudioContext | null {
  const params = new URLSearchParams(window.location.search)
  const mode = params.get('mode') as StudioMode | null
  const contentId = params.get('contentId')
  if (!mode || !contentId) return null
  return {
    mode,
    contentId,
    name: params.get('name') || 'Untitled content',
    type: params.get('type') || 'Content',
    selector: params.get('selector') || '#element',
    app: params.get('app') || 'Application',
    step: params.get('step') ? Number(params.get('step')) : undefined,
    stepLabel: params.get('stepLabel') || undefined,
    totalSteps: params.get('totalSteps') ? Number(params.get('totalSteps')) : undefined,
  }
}

function notifyOpener(contentId: string, status: 'resolved' | 'partial' | 'cancelled') {
  if (window.opener && !window.opener.closed) {
    try {
      window.opener.postMessage({ type: 'WHATFIX_RESELECT_DONE', contentId, status }, '*')
    } catch {
      /* opener gone, ignore */
    }
  }
}

export function StudioView() {
  const ctx = useMemo(readContext, [])

  if (!ctx) {
    return (
      <div style={emptyShellStyle}>
        <div style={emptyCardStyle}>
          <AlertTriangle size={28} strokeWidth={2} color="#DC2626" />
          <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: '#3D3C52', margin: '12px 0 4px' }}>
            No content context
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 13, color: '#6B697B', margin: 0, lineHeight: 1.5 }}>
            This Studio tab was opened without a content reference. Open it from the dashboard's
            Auto-reselect or Reselect action.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={shellStyle}>
      <MockBrowserBackground app={ctx.app} />
      <ExtensionPanel ctx={ctx} />
    </div>
  )
}

/* ─── Studio extension panel (Sidebar + AutoReselectionPanel) ────────────── */

function ExtensionPanel({ ctx }: { ctx: StudioContext }) {
  const totalSteps = ctx.totalSteps ?? 5
  const failingStepIdx = Math.max(0, Math.min((ctx.step ? ctx.step - 1 : 2), totalSteps - 1))
  const flowSteps: FlowStepDef[] = useMemo(() => buildFlowSteps(ctx, totalSteps), [ctx, totalSteps])

  const [phase, setPhase] = useState<AutoReselectionPhase>('loading_app')
  const [currentStep, setCurrentStep] = useState(0)

  // Drive the phase timeline. For 'debug' we stop at scanning so the user can decide.
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []
    const schedule = (ms: number, fn: () => void) => timeouts.push(setTimeout(fn, ms))

    schedule(900, () => setPhase('running_flow'))

    for (let i = 0; i <= failingStepIdx; i++) {
      schedule(900 + i * 600, () => setCurrentStep(i))
    }

    const failAt = 900 + failingStepIdx * 600 + 800
    schedule(failAt, () => setPhase('step_failed'))

    if (ctx.mode === 'debug') return () => timeouts.forEach(clearTimeout)

    schedule(failAt + 1000, () => setPhase('scanning_dom'))
    schedule(failAt + 2400, () => setPhase('element_found'))

    if (ctx.mode === 're-author') {
      return () => timeouts.forEach(clearTimeout)
    }

    schedule(failAt + 3400, () => setPhase('reselecting'))
    schedule(failAt + 4400, () => setPhase('saving'))
    schedule(failAt + 5300, () => setPhase('complete'))

    return () => timeouts.forEach(clearTimeout)
  }, [ctx.mode, failingStepIdx])

  useEffect(() => {
    if (phase === 'complete') notifyOpener(ctx.contentId, 'resolved')
    if (phase === 'failed') notifyOpener(ctx.contentId, 'partial')
  }, [phase, ctx.contentId])

  const handleClose = () => {
    notifyOpener(ctx.contentId, phase === 'complete' ? 'resolved' : 'cancelled')
    window.close()
  }

  return (
    <div style={panelDockStyle}>
      <div style={panelInnerStyle}>
        <Sidebar
          activeView="troubleshoot"
          onViewChange={() => { /* no-op in mock */ }}
          issueCount={1}
          hasVisitedDiagnostics
        />
        <AutoReselectionPanel
          contentName={ctx.name}
          contentType={ctx.type}
          targetSelector={ctx.selector}
          applicationName={ctx.app}
          phase={phase}
          currentStep={currentStep}
          failingStep={failingStepIdx}
          totalSteps={totalSteps}
          steps={flowSteps}
          onClose={handleClose}
          onReturnToDashboard={handleClose}
        />
      </div>
    </div>
  )
}

/* ─── Mock browser background (target application) ──────────────────────── */

function MockBrowserBackground({ app }: { app: string }) {
  const url = `https://app.${slug(app)}.com/dashboard`
  return (
    <div style={browserShellStyle}>
      <div style={browserChromeStyle}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={dotStyle('#FF5F56')} />
          <span style={dotStyle('#FFBD2E')} />
          <span style={dotStyle('#27C93F')} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9998A7' }}>
          <ChevronLeft size={16} strokeWidth={2} />
          <ChevronRight size={16} strokeWidth={2} />
          <RotateCw size={14} strokeWidth={2} />
        </div>
        <div style={addressBarStyle}>
          <Lock size={12} strokeWidth={2} color="#16A34A" />
          <span>{url}</span>
          <Star size={12} strokeWidth={2} color="#9998A7" style={{ marginLeft: 'auto' }} />
        </div>
        <MoreVertical size={16} strokeWidth={2} color="#9998A7" />
      </div>
      <div style={mockAppStyle}>
        <div style={mockAppNavStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#0D59AB' }} />
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: '#1F1F32' }}>{app}</div>
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            {['Dashboard', 'Reports', 'Customers', 'Settings'].map(label => (
              <div key={label} style={{ fontFamily: FONT, fontSize: 13, color: '#3D3C52' }}>{label}</div>
            ))}
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E5E3EE' }} />
        </div>
        <div style={mockAppBodyStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, height: '100%' }}>
            <aside style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #ECECF3', padding: 16 }}>
              {['Overview', 'Activity', 'Pipelines', 'Reports', 'Team', 'Integrations'].map(item => (
                <div key={item} style={{
                  fontFamily: FONT, fontSize: 13, color: '#3D3C52',
                  padding: '8px 10px', borderRadius: 4, marginBottom: 4,
                  background: item === 'Overview' ? '#F0F4FA' : 'transparent',
                  fontWeight: item === 'Overview' ? 600 : 400,
                }}>{item}</div>
              ))}
            </aside>
            <main style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: '#1F1F32', margin: 0 }}>
                  Overview
                </h1>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 110, height: 32, borderRadius: 6, background: '#FFFFFF', border: '1px solid #ECECF3' }} />
                  <div style={{ width: 110, height: 32, borderRadius: 6, background: '#0D59AB' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{
                    background: '#FFFFFF', borderRadius: 8, border: '1px solid #ECECF3', padding: 14, height: 88,
                  }}>
                    <div style={{ width: '50%', height: 10, background: '#E5E3EE', borderRadius: 3 }} />
                    <div style={{ width: '70%', height: 18, background: '#ECECF3', borderRadius: 3, marginTop: 12 }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, flex: 1 }}>
                <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #ECECF3', padding: 16 }}>
                  <div style={{ width: 140, height: 14, background: '#E5E3EE', borderRadius: 3, marginBottom: 18 }} />
                  <div style={{ height: 'calc(100% - 32px)', background: 'linear-gradient(180deg,#F6F6F9 0%,#FAFAFC 100%)', borderRadius: 6 }} />
                </div>
                <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #ECECF3', padding: 16 }}>
                  <div style={{ width: 100, height: 14, background: '#E5E3EE', borderRadius: 3, marginBottom: 14 }} />
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#ECECF3' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ width: '80%', height: 8, background: '#ECECF3', borderRadius: 3, marginBottom: 4 }} />
                        <div style={{ width: '50%', height: 6, background: '#F2F2F8', borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const DEFAULT_FLOW_TITLES = [
  'Open application',
  'Navigate to section',
  'Locate target element',
  'Trigger action',
  'Confirm completion',
  'Review summary',
  'Exit walkthrough',
]

function buildFlowSteps(ctx: StudioContext, total: number): FlowStepDef[] {
  return Array.from({ length: total }, (_, i) => {
    const title =
      ctx.step && i === ctx.step - 1 && ctx.stepLabel
        ? ctx.stepLabel
        : DEFAULT_FLOW_TITLES[i] ?? `Step ${i + 1}`
    return { title, description: '', targetId: stripSelector(ctx.selector) }
  })
}

function stripSelector(s: string): string {
  return s.replace(/^[#.]/, '') || 'element'
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */

const shellStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: '#1F1F32',
  fontFamily: FONT, overflow: 'hidden',
}
const emptyShellStyle: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#F2F2F8', padding: 24, fontFamily: FONT,
}
const emptyCardStyle: React.CSSProperties = {
  background: '#FFFFFF', borderRadius: 12, padding: 32, maxWidth: 420, textAlign: 'center',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
}

const browserShellStyle: React.CSSProperties = {
  position: 'absolute', inset: 0, padding: 12,
  background: '#1F1F32', display: 'flex', flexDirection: 'column',
  paddingRight: PANEL_WIDTH + 12,
}
const browserChromeStyle: React.CSSProperties = {
  background: '#E8E8EE', padding: '8px 12px', borderTopLeftRadius: 8, borderTopRightRadius: 8,
  display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, borderBottom: '1px solid #DFDDE7',
}
const addressBarStyle: React.CSSProperties = {
  flex: 1, background: '#FFFFFF', borderRadius: 6, padding: '4px 10px',
  fontSize: 12, color: '#3D3C52', display: 'flex', alignItems: 'center', gap: 6,
  fontFamily: FONT,
}
const mockAppStyle: React.CSSProperties = {
  flex: 1, background: '#F6F6F9', borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
  display: 'flex', flexDirection: 'column', overflow: 'hidden',
}
const mockAppNavStyle: React.CSSProperties = {
  background: '#FFFFFF', borderBottom: '1px solid #ECECF3', padding: '12px 24px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
}
const mockAppBodyStyle: React.CSSProperties = {
  flex: 1, padding: 24, overflow: 'hidden',
}

const panelDockStyle: React.CSSProperties = {
  position: 'absolute', top: 0, right: 0, bottom: 0, width: PANEL_WIDTH,
  display: 'flex',
}
const panelInnerStyle: React.CSSProperties = {
  display: 'flex', height: '100%', width: '100%', overflow: 'hidden',
  borderTopLeftRadius: 8, borderBottomLeftRadius: 8,
  boxShadow: '0px 4px 30px 10px rgba(0,0,0,0.08), 0px 8px 28px 4px rgba(0,0,0,0.1), 0px 6px 22px 4px rgba(0,0,0,0.12)',
  background: '#1F1F32',
}

function dotStyle(c: string): React.CSSProperties {
  return { width: 12, height: 12, borderRadius: '50%', background: c, display: 'inline-block' }
}
