import { useState } from 'react'
import {
  IconChevronDown,
  IconChevronUp,
  IconChevronLeft,
  IconChevronRight,
  IconAlertTriangle,
  IconAlertCircle,
  IconInfoCircle,
  IconExternalLink,
  IconEyeOff,
  IconRoute,
  IconMessage2,
  IconBulb,
  IconClick,
  IconRocket,
  IconClipboardList,
  IconListDetails,
} from '@tabler/icons-react'
import { cn } from '../../../lib/utils'
import type { ContentError, ContentErrorStatus, ContentErrorSeverity, WhatfixContentType, ContentState } from '../../../types'

interface ContentErrorsTableProps {
  items: ContentError[]
  onOpenInStudio?: (item: ContentError) => void
  onIgnore?: (item: ContentError) => void
  onInvestigate?: (item: ContentError) => void
}

type SortField = 'name' | 'severity' | 'lastOccurred' | 'occurrenceCount' | 'status'
type SortDirection = 'asc' | 'desc'

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

const severityConfig: Record<ContentErrorSeverity, { icon: typeof IconAlertCircle; label: string; className: string }> = {
  critical: { icon: IconAlertCircle, label: 'Critical', className: 'error-severity-critical' },
  warning: { icon: IconAlertTriangle, label: 'Warning', className: 'error-severity-warning' },
  info: { icon: IconInfoCircle, label: 'Info', className: 'error-severity-info' },
}

const statusConfig: Record<ContentErrorStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'error-status-new' },
  investigating: { label: 'Investigating', className: 'error-status-investigating' },
  fixed: { label: 'Fixed', className: 'error-status-fixed' },
  ignored: { label: 'Ignored', className: 'error-status-ignored' },
}

const contentStateLabels: Record<ContentState, string> = {
  production: 'Production',
  ready: 'Ready',
  draft: 'Draft',
}

export function ContentErrorsTable({
  items,
  onOpenInStudio,
  onIgnore,
  onInvestigate,
}: ContentErrorsTableProps) {
  const [sortField, setSortField] = useState<SortField>('lastOccurred')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const itemsPerPage = 10

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedItems = [...items].sort((a, b) => {
    const dir = sortDirection === 'asc' ? 1 : -1
    switch (sortField) {
      case 'name': return dir * a.name.localeCompare(b.name)
      case 'severity': {
        const order = { critical: 0, warning: 1, info: 2 }
        return dir * (order[a.severity] - order[b.severity])
      }
      case 'occurrenceCount': return dir * (a.occurrenceCount - b.occurrenceCount)
      case 'status': return dir * a.status.localeCompare(b.status)
      case 'lastOccurred': return dir * a.lastOccurred.localeCompare(b.lastOccurred)
      default: return 0
    }
  })

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedItems = sortedItems.slice(startIdx, startIdx + itemsPerPage)
  const startRow = startIdx + 1
  const endRow = Math.min(startIdx + itemsPerPage, sortedItems.length)

  const renderSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === 'asc'
        ? <IconChevronUp size={16} stroke={2} />
        : <IconChevronDown size={16} stroke={2} />
    }
    return <IconChevronDown size={16} stroke={2} className="opacity-50" />
  }

  return (
    <div className="errors-table-container">
      <div className="errors-table">
        {/* Header */}
        <div className="errors-table-header">
          <div
            className="errors-table-cell errors-table-cell-name errors-table-header-cell"
            onClick={() => handleSort('name')}
          >
            <span>Content name</span>
            {renderSortIcon('name')}
          </div>
          <div className="errors-table-cell errors-table-cell-error">
            <span>Error</span>
          </div>
          <div
            className="errors-table-cell errors-table-cell-severity errors-table-header-cell"
            onClick={() => handleSort('severity')}
          >
            <span>Severity</span>
            {renderSortIcon('severity')}
          </div>
          <div
            className="errors-table-cell errors-table-cell-frequency errors-table-header-cell"
            onClick={() => handleSort('occurrenceCount')}
          >
            <span>Frequency</span>
            {renderSortIcon('occurrenceCount')}
          </div>
          <div
            className="errors-table-cell errors-table-cell-last-occurred errors-table-header-cell"
            onClick={() => handleSort('lastOccurred')}
          >
            <span>Last occurred</span>
            {renderSortIcon('lastOccurred')}
          </div>
          <div
            className="errors-table-cell errors-table-cell-error-status errors-table-header-cell"
            onClick={() => handleSort('status')}
          >
            <span>Status</span>
            {renderSortIcon('status')}
          </div>
          <div className="errors-table-cell errors-table-cell-actions">
            <span></span>
          </div>
        </div>

        {/* Body */}
        <div className="errors-table-body">
          {paginatedItems.map((item) => {
            const TypeIcon = contentTypeIcons[item.contentType]
            const sevConfig = severityConfig[item.severity]
            const SeverityIcon = sevConfig.icon
            const stConfig = statusConfig[item.status]
            const isExpanded = expandedRow === item.id

            return (
              <div key={item.id}>
                <div
                  className={cn('errors-table-row', isExpanded && 'errors-table-row-expanded')}
                  onClick={() => setExpandedRow(isExpanded ? null : item.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="errors-table-cell errors-table-cell-name">
                    <div className="errors-table-name-content">
                      <TypeIcon size={18} stroke={1.5} style={{ color: '#6B697B', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <span className="errors-table-name-text">{item.name}</span>
                        <span className="errors-table-name-meta">
                          {contentTypeLabels[item.contentType]} · {contentStateLabels[item.contentState]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="errors-table-cell errors-table-cell-error">
                    <span className="errors-table-error-summary">{item.errorSummary}</span>
                  </div>
                  <div className="errors-table-cell errors-table-cell-severity">
                    <span className={cn('error-severity-badge', sevConfig.className)}>
                      <SeverityIcon size={13} stroke={2} />
                      {sevConfig.label}
                    </span>
                  </div>
                  <div className="errors-table-cell errors-table-cell-frequency">
                    <span className="errors-table-frequency">
                      {item.occurrenceCount === 1 ? 'Once' : `${item.occurrenceCount}×`}
                    </span>
                  </div>
                  <div className="errors-table-cell errors-table-cell-last-occurred">
                    <span>{item.lastOccurred}</span>
                  </div>
                  <div className="errors-table-cell errors-table-cell-error-status">
                    <span className={cn('error-status-badge', stConfig.className)}>
                      {stConfig.label}
                    </span>
                  </div>
                  <div className="errors-table-cell errors-table-cell-actions">
                    <div className="errors-table-row-actions">
                      {item.status !== 'ignored' && onIgnore && (
                        <button
                          className="errors-action-icon-btn"
                          title="Ignore"
                          onClick={(e) => { e.stopPropagation(); onIgnore(item) }}
                        >
                          <IconEyeOff size={15} stroke={1.5} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable detail panel */}
                {isExpanded && (
                  <div className="errors-detail-panel">
                    <div className="errors-detail-grid">
                      <div className="errors-detail-section">
                        <div className="errors-detail-label">Error detail</div>
                        <div className="errors-detail-value errors-detail-mono">{item.errorDetail}</div>
                      </div>
                      <div className="errors-detail-row">
                        <div className="errors-detail-section">
                          <div className="errors-detail-label">First detected</div>
                          <div className="errors-detail-value">{item.firstDetected}</div>
                        </div>
                        <div className="errors-detail-section">
                          <div className="errors-detail-label">Application</div>
                          <div className="errors-detail-value">{item.applicationName}</div>
                        </div>
                        {item.affectedUsers !== undefined && (
                          <div className="errors-detail-section">
                            <div className="errors-detail-label">Affected users</div>
                            <div className="errors-detail-value">{item.affectedUsers.toLocaleString()}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="errors-detail-actions">
                      {item.status === 'new' && onInvestigate && (
                        <button
                          className="health-action-btn health-action-secondary"
                          onClick={(e) => { e.stopPropagation(); onInvestigate(item) }}
                        >
                          Mark investigating
                        </button>
                      )}
                      {onOpenInStudio && (
                        <button
                          className="health-action-btn health-action-primary"
                          onClick={(e) => { e.stopPropagation(); onOpenInStudio(item) }}
                        >
                          <IconExternalLink size={14} stroke={2} />
                          Open in Studio
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Pagination */}
      {sortedItems.length > itemsPerPage && (
        <div className="workflows-pagination">
          <div className="workflows-pagination-info">
            Rows <strong>{startRow}-{endRow}</strong> of <strong>{sortedItems.length}</strong>
          </div>
          <div className="workflows-pagination-controls">
            <button
              className="workflows-pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <IconChevronLeft size={16} stroke={2} />
            </button>
            <div className="workflows-pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={cn(
                    'workflows-pagination-page',
                    page === currentPage && 'workflows-pagination-page-active'
                  )}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="workflows-pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <IconChevronRight size={16} stroke={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
