import { useState, useMemo } from 'react'
import {
  IconChevronDown,
  IconChevronUp,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconLoader2,
  IconRoute,
  IconMessage2,
  IconBulb,
  IconClick,
  IconRocket,
  IconClipboardList,
  IconListDetails,
  IconWand,
  IconExternalLink,
  IconEyeOff,
  IconUpload,
  IconAlertTriangle,
} from '@tabler/icons-react'
import { cn } from '../../../lib/utils'
import type { HealthIssue, AffectedContent, ContentError, ElementStatus, WhatfixContentType, ContentState } from '../../../types'

interface ContentHealthTableProps {
  issues: HealthIssue[]
  onAutoReselect?: (item: AffectedContent) => void
  onReselect?: (item: AffectedContent) => void
  onReAuthor?: (item: AffectedContent) => void
  onOpenInStudio?: (item: ContentError) => void
  onIgnore?: (item: ContentError) => void
  onInvestigate?: (item: ContentError) => void
}

type SortField = 'name' | 'issue' | 'contentType' | 'contentState' | 'priority' | 'frequency'
type SortDirection = 'asc' | 'desc'
type Urgency = 'critical' | 'high' | 'medium' | 'low'

const contentTypeLabels: Record<WhatfixContentType, string> = {
  flow: 'Flow',
  smart_tip: 'Smart-tip',
  beacon: 'Beacon',
  pop_up: 'Pop-up',
  launcher: 'Launcher',
  survey: 'Survey',
  task_list: 'Task list',
}

const contentTypeIcons: Record<WhatfixContentType, typeof IconRoute> = {
  flow: IconRoute,
  smart_tip: IconBulb,
  beacon: IconMessage2,
  pop_up: IconClick,
  launcher: IconRocket,
  survey: IconClipboardList,
  task_list: IconListDetails,
}

const stateLabels: Record<ContentState, { label: string; className: string }> = {
  production: { label: 'Production', className: 'stage-badge-production' },
  ready: { label: 'Ready', className: 'stage-badge-ready' },
  draft: { label: 'Draft', className: 'stage-badge-draft' },
}

const issueLabel: Record<ElementStatus, string> = {
  misplaced: 'Target element moved to a different position',
  not_found: 'Target element no longer exists on the page',
  removed: 'Target element was removed from the app',
}

function getIssueName(issue: HealthIssue): string {
  return issue.data.name
}

function getIssueType(issue: HealthIssue): WhatfixContentType {
  return issue.data.contentType
}

function getIssueState(issue: HealthIssue): ContentState {
  return issue.data.contentState
}

function getIssueText(issue: HealthIssue): string {
  if (issue.kind === 'dom') return issueLabel[issue.data.elementStatus]
  return issue.data.errorSummary
}

function getDetectedDate(issue: HealthIssue): string {
  if (issue.kind === 'dom') return issue.data.lastWorkingDate
  return issue.data.firstDetected
}

function isResolved(issue: HealthIssue): boolean {
  if (issue.kind === 'dom') return issue.data.reselectionStatus === 'resolved'
  return issue.data.status === 'fixed' || issue.data.status === 'ignored'
}

function getIssueId(issue: HealthIssue): string {
  return issue.data.id
}

function getUrgency(issue: HealthIssue): Urgency {
  if (isResolved(issue)) return 'low'
  const state = getIssueState(issue)
  const detected = getDetectedDate(issue)
  const days = Math.floor((Date.now() - new Date(detected).getTime()) / (1000 * 60 * 60 * 24))

  if (state === 'production') {
    return days > 7 ? 'critical' : 'high'
  }
  if (state === 'ready') {
    return days > 14 ? 'high' : 'medium'
  }
  return 'low'
}

const urgencyOrder: Record<Urgency, number> = { critical: 0, high: 1, medium: 2, low: 3 }

function getIssueSortPriority(issue: HealthIssue): number {
  return urgencyOrder[getUrgency(issue)]
}

export function ContentHealthTable({
  issues,
  onAutoReselect,
  onReselect,
  onReAuthor,
  onOpenInStudio,
  onIgnore,
  onInvestigate,
}: ContentHealthTableProps) {
  const [sortField, setSortField] = useState<SortField>('priority')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const itemsPerPage = 15

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const isErrorsView = issues.length > 0 && issues.every(i => i.kind === 'error')

  const sorted = useMemo(() => {
    const arr = [...issues]
    const dir = sortDirection === 'asc' ? 1 : -1
    arr.sort((a, b) => {
      switch (sortField) {
        case 'name': return dir * getIssueName(a).localeCompare(getIssueName(b))
        case 'contentType': return dir * getIssueType(a).localeCompare(getIssueType(b))
        case 'contentState': return dir * getIssueState(a).localeCompare(getIssueState(b))
        case 'priority': return dir * (getIssueSortPriority(a) - getIssueSortPriority(b))
        case 'issue': return dir * getIssueText(a).localeCompare(getIssueText(b))
        case 'frequency': {
          const aCount = a.kind === 'error' ? a.data.occurrenceCount : 0
          const bCount = b.kind === 'error' ? b.data.occurrenceCount : 0
          return dir * (aCount - bCount)
        }
        default: return 0
      }
    })
    return arr
  }, [issues, sortField, sortDirection])

  const totalPages = Math.ceil(sorted.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const page = sorted.slice(startIdx, startIdx + itemsPerPage)
  const resolvedCount = issues.filter(isResolved).length

  const renderSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === 'asc'
        ? <IconChevronUp size={14} stroke={2} />
        : <IconChevronDown size={14} stroke={2} />
    }
    return <IconChevronDown size={14} stroke={2} className="sort-icon-muted" />
  }

  const renderDomAction = (item: AffectedContent) => {
    if (item.reselectionStatus === 'resolved') {
      return (
        <div className="ht-post-fix">
          <span className="ht-resolved"><IconCircleCheck size={14} stroke={2} /> Fixed</span>
          <span className="ht-deploy-hint"><IconUpload size={11} stroke={1.5} /> Ready to publish</span>
        </div>
      )
    }
    if (item.reselectionStatus === 'failed') {
      return (
        <div className="ht-post-fix-fail">
          <span className="ht-failed-label"><IconAlertTriangle size={13} stroke={2} /> Could not auto-fix</span>
          <button className="ht-action-btn ht-action-primary" onClick={(e) => { e.stopPropagation(); onReselect?.(item) }}>
            <IconExternalLink size={13} stroke={2} />
            Fix manually
          </button>
        </div>
      )
    }
    if (item.reselectionStatus === 'in_progress') {
      return <span className="ht-loading"><IconLoader2 size={14} stroke={2} className="animate-spin" /> Fixing…</span>
    }
    const cfg: Record<ElementStatus, { label: string; style: string; handler: () => void }> = {
      misplaced: { label: 'Auto-reselect', style: 'ht-action-primary', handler: () => onAutoReselect?.(item) },
      not_found: { label: 'Re-author in Studio', style: 'ht-action-outlined', handler: () => onReAuthor?.(item) },
      removed: { label: 'Re-author in Studio', style: 'ht-action-outlined', handler: () => onReAuthor?.(item) },
    }
    const c = cfg[item.elementStatus]
    return (
      <button className={`ht-action-btn ${c.style}`} onClick={(e) => { e.stopPropagation(); c.handler() }}>
        {item.elementStatus === 'misplaced' ? <IconWand size={13} stroke={2} /> : <IconExternalLink size={13} stroke={2} />}
        {c.label}
      </button>
    )
  }

  const renderErrorAction = (item: ContentError) => {
    if (item.status === 'fixed') {
      return (
        <div className="ht-post-fix">
          <span className="ht-resolved"><IconCircleCheck size={14} stroke={2} /> Fixed</span>
          <span className="ht-deploy-hint"><IconUpload size={11} stroke={1.5} /> Ready to publish</span>
        </div>
      )
    }
    if (item.status === 'ignored') return <span className="ht-resolved ht-muted">Dismissed</span>
    return (
      <button className="ht-action-btn ht-action-primary" onClick={(e) => { e.stopPropagation(); onOpenInStudio?.(item) }}>
        <IconExternalLink size={13} stroke={2} />
        View in Studio
      </button>
    )
  }

  const errorStatusLabels: Record<string, { label: string; cls: string }> = {
    new: { label: 'New', cls: 'error-status-new' },
    investigating: { label: 'Looking into it', cls: 'error-status-investigating' },
    fixed: { label: 'Fixed', cls: 'error-status-fixed' },
    ignored: { label: 'Dismissed', cls: 'error-status-ignored' },
  }

  return (
    <div className="ht-container">
      {resolvedCount > 0 && (
        <div className="ht-progress-strip">
          <div className="ht-progress-bar"><div className="ht-progress-fill" style={{ width: `${(resolvedCount / issues.length) * 100}%` }} /></div>
          <span className="ht-progress-text">{resolvedCount} of {issues.length} fixed</span>
        </div>
      )}

      <div className="ht-table">
        <div className="ht-header">
          <div className="ht-cell ht-cell-name ht-header-cell" onClick={() => handleSort('name')}>
            <span>Content</span>{renderSortIcon('name')}
          </div>
          <div className="ht-cell ht-cell-issue ht-header-cell" onClick={() => handleSort('issue')}>
            <span>{isErrorsView ? 'What happened' : 'What changed'}</span>{renderSortIcon('issue')}
          </div>
          <div className="ht-cell ht-cell-type ht-header-cell" onClick={() => handleSort('contentType')}>
            <span>Type</span>{renderSortIcon('contentType')}
          </div>
          <div className="ht-cell ht-cell-stage ht-header-cell" onClick={() => handleSort('contentState')}>
            <span>Stage</span>{renderSortIcon('contentState')}
          </div>
          {isErrorsView && (
            <div className="ht-cell ht-cell-frequency ht-header-cell" onClick={() => handleSort('frequency')}>
              <span>Frequency</span>{renderSortIcon('frequency')}
            </div>
          )}
          <div className="ht-cell ht-cell-action"><span></span></div>
        </div>

        <div className="ht-body">
          {page.map((issue) => {
            const id = getIssueId(issue)
            const name = getIssueName(issue)
            const type = getIssueType(issue)
            const state = getIssueState(issue)
            const resolved = isResolved(issue)
            const urgency = getUrgency(issue)
            const detectedDate = getDetectedDate(issue)
            const TypeIcon = contentTypeIcons[type]
            const isError = issue.kind === 'error'
            const isExpanded = expandedId === id && isError

            return (
              <div key={id} className={cn(resolved && 'ht-row-resolved')}>
                <div
                  className={cn('ht-row', isError && 'ht-row-clickable', isExpanded && 'ht-row-expanded', !resolved && `ht-urgency-${urgency}`)}
                  onClick={isError ? () => setExpandedId(isExpanded ? null : id) : undefined}
                >
                  <div className="ht-cell ht-cell-name">
                    <TypeIcon size={15} stroke={1.5} className="ht-type-icon" />
                    <div className="ht-name-wrap">
                      <span className="ht-name">{name}</span>
                      {issue.kind === 'dom' && issue.data.stepNumber !== undefined && (
                        <span className="ht-step">Step {issue.data.stepNumber}/{issue.data.totalSteps}: {issue.data.stepLabel}</span>
                      )}
                    </div>
                  </div>

                  <div className="ht-cell ht-cell-issue">
                    <div className="ht-issue-wrap">
                      {issue.kind === 'dom' ? (
                        <span className={`ht-issue-label ht-issue-${issue.data.elementStatus}`}>
                          {issueLabel[issue.data.elementStatus]}
                        </span>
                      ) : (
                        <span className="ht-issue-label">
                          <span className="ht-error-summary">{issue.data.errorSummary}</span>
                        </span>
                      )}
                      <span className="ht-detected-date">Since {detectedDate}</span>
                    </div>
                  </div>

                  <div className="ht-cell ht-cell-type">
                    <span>{contentTypeLabels[type]}</span>
                  </div>

                  <div className="ht-cell ht-cell-stage">
                    <span className={cn('stage-badge', stateLabels[state].className)}>{stateLabels[state].label}</span>
                  </div>

                  {isErrorsView && (
                    <div className="ht-cell ht-cell-frequency">
                      {issue.kind === 'error' && (
                        <span className={cn('ht-freq', issue.data.occurrenceCount >= 50 && 'ht-freq-high', issue.data.occurrenceCount >= 20 && issue.data.occurrenceCount < 50 && 'ht-freq-med')}>
                          {issue.data.occurrenceCount}×
                        </span>
                      )}
                    </div>
                  )}

                  <div className="ht-cell ht-cell-action">
                    {issue.kind === 'dom' ? renderDomAction(issue.data) : renderErrorAction(issue.data)}
                  </div>
                </div>

                {isExpanded && issue.kind === 'error' && (
                  <div className="ht-expand-panel">
                    <div className="ht-expand-body">
                      <p className="ht-expand-detail">{issue.data.errorDetail}</p>
                      <div className="ht-expand-meta">
                        <span>{issue.data.occurrenceCount} occurrences</span>
                        {issue.data.affectedUsers !== undefined && <span>{issue.data.affectedUsers.toLocaleString()} users affected</span>}
                        <span>Since {issue.data.firstDetected}</span>
                        <span>Latest {issue.data.lastOccurred}</span>
                        <span className={cn('error-status-badge', errorStatusLabels[issue.data.status].cls)}>
                          {errorStatusLabels[issue.data.status].label}
                        </span>
                      </div>
                    </div>
                    <div className="ht-expand-actions">
                      {issue.data.status !== 'ignored' && onIgnore && (
                        <button className="ht-action-link" onClick={(e) => { e.stopPropagation(); onIgnore(issue.data) }}>
                          <IconEyeOff size={13} stroke={1.5} /> Ignore
                        </button>
                      )}
                      {issue.data.status === 'new' && onInvestigate && (
                        <button className="ht-action-link" onClick={(e) => { e.stopPropagation(); onInvestigate(issue.data) }}>
                          Investigate
                        </button>
                      )}
                      <button className="ht-action-btn ht-action-primary" onClick={(e) => { e.stopPropagation(); onOpenInStudio?.(issue.data) }}>
                        <IconExternalLink size={13} stroke={2} /> Fix in Studio
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {sorted.length > itemsPerPage && (
        <div className="ht-pagination">
          <span className="ht-pagination-info">
            {startIdx + 1}–{Math.min(startIdx + itemsPerPage, sorted.length)} of {sorted.length}
          </span>
          <div className="ht-pagination-controls">
            <button className="ht-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <IconChevronLeft size={14} stroke={2} />
            </button>
            {(() => {
              const pages: (number | 'ellipsis')[] = []
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i)
              } else {
                pages.push(1)
                if (currentPage > 3) pages.push('ellipsis')
                const start = Math.max(2, currentPage - 1)
                const end = Math.min(totalPages - 1, currentPage + 1)
                for (let i = start; i <= end; i++) pages.push(i)
                if (currentPage < totalPages - 2) pages.push('ellipsis')
                pages.push(totalPages)
              }
              return pages.map((p, idx) =>
                p === 'ellipsis'
                  ? <span key={`e${idx}`} className="ht-page-ellipsis">...</span>
                  : <button key={p} className={cn('ht-page-num', p === currentPage && 'ht-page-active')} onClick={() => setCurrentPage(p)}>{p}</button>
              )
            })()}
            <button className="ht-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <IconChevronRight size={14} stroke={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
