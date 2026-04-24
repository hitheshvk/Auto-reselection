import { useState } from 'react'
import {
  IconChevronDown,
  IconChevronUp,
  IconChevronLeft,
  IconChevronRight,
  IconPencil,
  IconDotsVertical,
  IconRoute,
  IconMessage2,
  IconBulb,
  IconClick,
  IconRocket,
  IconClipboardList,
  IconListDetails,
  IconAlertTriangle,
  IconAlertCircle,
} from '@tabler/icons-react'
import { cn } from '../../../lib/utils'
import type { ContentItem, WhatfixContentType, HealthIndicator, ContentState } from '../../../types'

interface ContentListTableProps {
  items: ContentItem[]
  healthMap?: Record<string, HealthIndicator>
  showStageColumn?: boolean
  onItemClick?: (item: ContentItem) => void
  onItemEdit?: (item: ContentItem) => void
  onItemMenu?: (item: ContentItem) => void
  selectedItems?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
}

type SortField = 'name' | 'contentType' | 'lastModified' | 'createdBy' | 'contentState'

const contentStateLabels: Record<ContentState, { label: string; className: string }> = {
  production: { label: 'Production', className: 'stage-badge-production' },
  ready: { label: 'Ready', className: 'stage-badge-ready' },
  draft: { label: 'Draft', className: 'stage-badge-draft' },
}
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

export function ContentListTable({
  items,
  healthMap,
  showStageColumn = false,
  onItemClick,
  onItemEdit,
  onItemMenu,
  selectedItems = [],
  onSelectionChange,
}: ContentListTableProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedItems = [...items].sort((a, b) => {
    const dir = sortDirection === 'asc' ? 1 : -1
    switch (sortField) {
      case 'name': return dir * a.name.localeCompare(b.name)
      case 'contentType': return dir * a.contentType.localeCompare(b.contentType)
      case 'lastModified': return dir * a.lastModified.localeCompare(b.lastModified)
      case 'createdBy': return dir * a.createdBy.localeCompare(b.createdBy)
      case 'contentState': return dir * a.contentState.localeCompare(b.contentState)
      default: return 0
    }
  })

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedItems = sortedItems.slice(startIdx, startIdx + itemsPerPage)
  const startRow = startIdx + 1
  const endRow = Math.min(startIdx + itemsPerPage, sortedItems.length)

  const handleSelectAll = () => {
    if (!onSelectionChange) return
    if (selectedItems.length === paginatedItems.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(paginatedItems.map((item) => item.id))
    }
  }

  const handleSelectItem = (itemId: string) => {
    if (!onSelectionChange) return
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter((id) => id !== itemId))
    } else {
      onSelectionChange([...selectedItems, itemId])
    }
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === 'asc'
        ? <IconChevronUp size={16} stroke={2} />
        : <IconChevronDown size={16} stroke={2} />
    }
    return <IconChevronDown size={16} stroke={2} className="opacity-50" />
  }

  const renderHealthIndicator = (item: ContentItem) => {
    const indicator = healthMap?.[item.name]
    if (!indicator || indicator === 'healthy') return null

    if (indicator === 'critical') {
      return (
        <span className="content-list-health-dot critical" title="Has critical issues">
          <IconAlertCircle size={14} stroke={2} />
        </span>
      )
    }
    return (
      <span className="content-list-health-dot warning" title="Has health issues">
        <IconAlertTriangle size={14} stroke={2} />
      </span>
    )
  }

  return (
    <div className="workflows-table-container">
      <div className="workflows-table">
        {/* Header */}
        <div className="workflows-table-header">
          <div className="workflows-table-cell workflows-table-cell-checkbox">
            <input
              type="checkbox"
              checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
              onChange={handleSelectAll}
              className="workflows-checkbox"
            />
          </div>
          <div
            className="workflows-table-cell workflows-table-cell-name workflows-table-header-cell"
            onClick={() => handleSort('name')}
          >
            <span>Name</span>
            {renderSortIcon('name')}
          </div>
          <div
            className="workflows-table-cell content-list-cell-type workflows-table-header-cell"
            onClick={() => handleSort('contentType')}
          >
            <span>Type</span>
            {renderSortIcon('contentType')}
          </div>
          <div className="workflows-table-cell content-list-cell-health">
            <span></span>
          </div>
          {showStageColumn && (
            <div
              className="workflows-table-cell content-list-cell-stage workflows-table-header-cell"
              onClick={() => handleSort('contentState')}
            >
              <span>Stage</span>
              {renderSortIcon('contentState')}
            </div>
          )}
          <div
            className="workflows-table-cell content-list-cell-created workflows-table-header-cell"
            onClick={() => handleSort('createdBy')}
          >
            <span>Created by</span>
            {renderSortIcon('createdBy')}
          </div>
          <div
            className="workflows-table-cell content-list-cell-modified workflows-table-header-cell"
            onClick={() => handleSort('lastModified')}
          >
            <span>Last modified</span>
            {renderSortIcon('lastModified')}
          </div>
        </div>

        {/* Body */}
        <div className="workflows-table-body">
          {paginatedItems.map((item) => {
            const TypeIcon = contentTypeIcons[item.contentType]
            const isSelected = selectedItems.includes(item.id)
            const isHovered = hoveredRow === item.id

            return (
              <div
                key={item.id}
                className={cn(
                  'workflows-table-row',
                  isSelected && 'workflows-table-row-selected',
                  isHovered && 'workflows-table-row-hovered'
                )}
                onMouseEnter={() => setHoveredRow(item.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onItemClick?.(item)}
              >
                <div className="workflows-table-cell workflows-table-cell-checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleSelectItem(item.id)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="workflows-checkbox"
                  />
                </div>
                <div className="workflows-table-cell workflows-table-cell-name">
                  <div className="workflows-table-name-content">
                    <TypeIcon size={20} stroke={1.5} className="text-secondary-600" />
                    <span className="workflows-table-name-text">{item.name}</span>
                  </div>
                  {(isHovered || isSelected) && (
                    <div className="workflows-table-row-actions">
                      <button
                        className="workflows-table-action-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onItemEdit?.(item)
                        }}
                      >
                        <IconPencil size={18} stroke={1.5} />
                      </button>
                      <button
                        className="workflows-table-action-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onItemMenu?.(item)
                        }}
                      >
                        <IconDotsVertical size={18} stroke={1.5} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="workflows-table-cell content-list-cell-type">
                  <span>{contentTypeLabels[item.contentType]}</span>
                </div>
                <div className="workflows-table-cell content-list-cell-health">
                  {renderHealthIndicator(item)}
                </div>
                {showStageColumn && (
                  <div className="workflows-table-cell content-list-cell-stage">
                    <span className={cn('stage-badge', contentStateLabels[item.contentState].className)}>
                      {contentStateLabels[item.contentState].label}
                    </span>
                  </div>
                )}
                <div className="workflows-table-cell content-list-cell-created">
                  <span>{item.createdBy}</span>
                </div>
                <div className="workflows-table-cell content-list-cell-modified">
                  <span>{item.lastModified}</span>
                </div>
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
