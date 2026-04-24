import React from 'react'

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  issueCount?: number
  hasVisitedDiagnostics?: boolean
}

/* Whatfix brand mark — orange geometric shapes matching Figma */
const WhatfixMarkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* Top-right triangular shape */}
    <path d="M13 3L20 10H13V3Z" fill="#E45913" />
    <path d="M13 3L20 3L20 10" fill="#F58857" />
    {/* Bottom-left triangular shape */}
    <path d="M4 14L11 14V21L4 14Z" fill="#E45913" />
    <path d="M4 14L4 21L11 21" fill="#C44410" />
  </svg>
)

/* Salesforce/cloud icon — blue cloud matching Figma */
const CloudIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M6.5 20C4.01 20 2 17.99 2 15.5c0-2.17 1.56-3.98 3.62-4.38C6.08 8.2 8.86 6 12.13 6c2.67 0 5.02 1.52 6.22 3.74.38-.16.79-.24 1.22-.24C21.46 9.5 23 11.04 23 12.93c0 .45-.09.88-.24 1.27A3.5 3.5 0 0 1 20.5 20h-14z"
      fill="#00A1E0"
    />
  </svg>
)

/* Plus icon for create button */
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
    <path d="M7 1v12" />
    <path d="M1 7h12" />
  </svg>
)

/* Diagnostics icon — magnifying glass with crosshair inside (matches Figma) */
const TroubleshootIcon = ({ active = false }: { active?: boolean }) => {
  const color = active ? '#E45913' : '#9998A7'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Magnifying glass lens */}
      <circle cx="9.5" cy="9.5" r="6.5" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Crosshair inside lens — vertical */}
      <line x1="9.5" y1="5.5" x2="9.5" y2="13.5" stroke={color} strokeWidth="1.3" />
      {/* Crosshair inside lens — horizontal */}
      <line x1="5.5" y1="9.5" x2="13.5" y2="9.5" stroke={color} strokeWidth="1.3" />
      {/* Handle */}
      <line x1="14.5" y1="14.5" x2="19" y2="19" stroke={color} strokeWidth="1.8" />
  </svg>
)
}

/* Logout icon */
const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9998A7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, issueCount = 0, hasVisitedDiagnostics = false }) => {
  return (
    <div
      className="flex flex-col items-center h-full flex-shrink-0"
      style={{
        width: '48px',
        backgroundColor: '#1F1F32',
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
      }}
    >
      {/* Pulsing animation keyframe */}
      <style>{`
        @keyframes diagnostics-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>
      {/* Navigation Items */}
      <div className="flex flex-col items-center" style={{ gap: '4px', paddingTop: '8px', paddingLeft: '4px', paddingRight: '4px' }}>
        {/* Whatfix product icon */}
        <button
          onClick={() => onViewChange('home')}
          className="relative flex items-center justify-center cursor-pointer"
          style={{ width: '40px', height: '40px', borderRadius: '8px' }}
        >
          <WhatfixMarkIcon />
          {/* Active indicator dot */}
          <div
            className="absolute rounded-full"
            style={{ width: '6px', height: '6px', backgroundColor: '#E45913', right: '2px', bottom: '2px' }}
          />
        </button>

        {/* Salesforce / cloud product icon */}
        <button
          onClick={() => onViewChange('salesforce')}
          className="relative flex items-center justify-center cursor-pointer"
          style={{ width: '40px', height: '40px', borderRadius: '8px' }}
        >
          <CloudIcon />
          <div
            className="absolute rounded-full"
            style={{ width: '6px', height: '6px', backgroundColor: '#E45913', right: '2px', bottom: '2px' }}
          />
        </button>

        {/* Add / Create new — dark bg with border */}
        <button
          onClick={() => onViewChange('add')}
          className="flex items-center justify-center cursor-pointer"
          style={{ width: '40px', height: '40px', padding: '4px' }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#3D3C52',
              border: '1px solid #525066',
            }}
          >
            <PlusIcon />
          </div>
        </button>

        {/* Troubleshoot / Diagnostics */}
        <button
          onClick={() => onViewChange('troubleshoot')}
          className="flex items-center justify-center cursor-pointer"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: activeView === 'troubleshoot' ? '#3D3C52' : 'transparent',
            transition: 'background-color 150ms ease',
            position: 'relative',
          }}
        >
          <TroubleshootIcon active={activeView === 'troubleshoot'} />

          {/* Amber dot — signals "worth checking", no misleading count */}
          {issueCount > 0 && activeView !== 'troubleshoot' && (
            <div style={{
              position: 'absolute', top: '4px', right: '2px',
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: '#F59E0B',
              border: '1.5px solid #1F1F32',
              boxSizing: 'border-box',
            }} />
          )}

          {/* Pulsing ring — first-time discovery nudge */}
          {issueCount > 0 && !hasVisitedDiagnostics && activeView !== 'troubleshoot' && (
            <div style={{
              position: 'absolute', inset: '-2px',
              borderRadius: '10px',
              border: '2px solid #F59E0B',
              animation: 'diagnostics-pulse 2s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
          )}
        </button>

        {/* Element Precision — crosshair / target icon */}
        <button
          onClick={() => onViewChange('element_precision')}
          className="flex items-center justify-center cursor-pointer"
          title="Element Precision"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: activeView === 'element_precision' ? '#3D3C52' : 'transparent',
            transition: 'background-color 150ms ease',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Outer crosshair circle */}
            <circle cx="11" cy="11" r="8" stroke={activeView === 'element_precision' ? '#E45913' : '#9998A7'} strokeWidth="1.5" fill="none" />
            {/* Inner dot */}
            <circle cx="11" cy="11" r="2" fill={activeView === 'element_precision' ? '#E45913' : '#9998A7'} />
            {/* Crosshair lines */}
            <line x1="11" y1="1" x2="11" y2="5" stroke={activeView === 'element_precision' ? '#E45913' : '#9998A7'} strokeWidth="1.5" />
            <line x1="11" y1="17" x2="11" y2="21" stroke={activeView === 'element_precision' ? '#E45913' : '#9998A7'} strokeWidth="1.5" />
            <line x1="1" y1="11" x2="5" y2="11" stroke={activeView === 'element_precision' ? '#E45913' : '#9998A7'} strokeWidth="1.5" />
            <line x1="17" y1="11" x2="21" y2="11" stroke={activeView === 'element_precision' ? '#E45913' : '#9998A7'} strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer Items — separator + logout */}
      <div className="flex flex-col items-center" style={{ paddingLeft: '4px', paddingRight: '4px', paddingBottom: '8px' }}>
        {/* Separator line */}
        <div style={{ width: '40px', height: '1px', backgroundColor: '#525066', marginBottom: '8px' }} />

        {/* Logout */}
        <button
          className="flex items-center justify-center cursor-pointer"
          style={{ width: '40px', height: '40px', borderRadius: '8px' }}
        >
          <LogoutIcon />
        </button>
      </div>
    </div>
  )
}

export default Sidebar
