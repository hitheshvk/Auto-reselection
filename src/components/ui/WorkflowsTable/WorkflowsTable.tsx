import { useState } from 'react'
import {
  IconFolder,
  IconChevronDown,
  IconChevronUp,
  IconPencil,
  IconDotsVertical,
  IconChevronLeft,
  IconChevronRight,
  IconStack2,
} from '@tabler/icons-react'
import { cn } from '../../../lib/utils'

export type WorkflowItemType = 'folder' | 'simulation' | 'workflow'

export interface WorkflowItem {
  id: string
  name: string
  type: WorkflowItemType
  itemCount?: number
  badge?: {
    label: string
    variant: 'success' | 'info' | 'warning'
  }
  createdBy: string
  lastUpdatedOn: string
}

interface WorkflowsTableProps {
  items: WorkflowItem[]
  totalItems: number
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemClick?: (item: WorkflowItem) => void
  onItemEdit?: (item: WorkflowItem) => void
  onItemMenu?: (item: WorkflowItem) => void
  selectedItems?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
}

type SortField = 'name' | 'type' | 'createdBy' | 'lastUpdatedOn'
type SortDirection = 'asc' | 'desc'

export function WorkflowsTable({
  items,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemClick,
  onItemEdit,
  onItemMenu,
  selectedItems = [],
  onSelectionChange,
}: WorkflowsTableProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startRow = (currentPage - 1) * itemsPerPage + 1
  const endRow = Math.min(currentPage * itemsPerPage, totalItems)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = () => {
    if (!onSelectionChange) return
    if (selectedItems.length === items.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(items.map((item) => item.id))
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

  const getTypeIcon = (type: WorkflowItemType) => {
    switch (type) {
      case 'folder':
        return <IconFolder size={20} stroke={1.5} className="text-secondary-600" />
      case 'simulation':
      case 'workflow':
        return <IconStack2 size={20} stroke={1.5} className="text-secondary-600" />
    }
  }

  const getTypeLabel = (type: WorkflowItemType) => {
    switch (type) {
      case 'folder':
        return ''
      case 'simulation':
        return 'Simulation'
      case 'workflow':
        return 'Workflow'
    }
  }

  const getBadgeClasses = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-success-100 text-success-600'
      case 'info':
        return 'bg-info-50 text-info-500'
      case 'warning':
        return 'bg-warning-100 text-warning-600'
      default:
        return 'bg-secondary-100 text-secondary-700'
    }
  }

  const renderPaginationPages = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) {
        pages.push('...')
      }
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="workflows-table-container">
      <div className="workflows-table">
        {/* Table Header */}
        <div className="workflows-table-header">
          <div className="workflows-table-cell workflows-table-cell-checkbox">
            <input
              type="checkbox"
              checked={selectedItems.length === items.length && items.length > 0}
              onChange={handleSelectAll}
              className="workflows-checkbox"
            />
          </div>
          <div
            className="workflows-table-cell workflows-table-cell-name workflows-table-header-cell"
            onClick={() => handleSort('name')}
          >
            <span>Name</span>
            {sortField === 'name' ? (
              sortDirection === 'asc' ? (
                <IconChevronUp size={16} stroke={2} />
              ) : (
                <IconChevronDown size={16} stroke={2} />
              )
            ) : (
              <IconChevronDown size={16} stroke={2} className="opacity-50" />
            )}
          </div>
          <div
            className="workflows-table-cell workflows-table-cell-type workflows-table-header-cell"
            onClick={() => handleSort('type')}
          >
            <span>Type</span>
            {sortField === 'type' ? (
              sortDirection === 'asc' ? (
                <IconChevronUp size={16} stroke={2} />
              ) : (
                <IconChevronDown size={16} stroke={2} />
              )
            ) : (
              <IconChevronDown size={16} stroke={2} className="opacity-50" />
            )}
          </div>
          <div
            className="workflows-table-cell workflows-table-cell-created workflows-table-header-cell"
            onClick={() => handleSort('createdBy')}
          >
            <span>Created by</span>
            {sortField === 'createdBy' ? (
              sortDirection === 'asc' ? (
                <IconChevronUp size={16} stroke={2} />
              ) : (
                <IconChevronDown size={16} stroke={2} />
              )
            ) : (
              <IconChevronDown size={16} stroke={2} className="opacity-50" />
            )}
          </div>
          <div
            className="workflows-table-cell workflows-table-cell-updated workflows-table-header-cell"
            onClick={() => handleSort('lastUpdatedOn')}
          >
            <span>Last updated on</span>
            {sortField === 'lastUpdatedOn' ? (
              sortDirection === 'asc' ? (
                <IconChevronUp size={16} stroke={2} />
              ) : (
                <IconChevronDown size={16} stroke={2} />
              )
            ) : (
              <IconChevronDown size={16} stroke={2} className="opacity-50" />
            )}
          </div>
        </div>

        {/* Table Body */}
        <div className="workflows-table-body">
          {items.map((item) => {
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
                    {getTypeIcon(item.type)}
                    <span className="workflows-table-name-text">{item.name}</span>
                    {item.itemCount !== undefined && (
                      <span className="workflows-table-count-badge">
                        <IconStack2 size={16} stroke={1.5} />
                        <span>{item.itemCount}</span>
                      </span>
                    )}
                    {item.badge && (
                      <span className={cn('workflows-table-badge', getBadgeClasses(item.badge.variant))}>
                        {item.badge.label}
                      </span>
                    )}
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
                <div className="workflows-table-cell workflows-table-cell-type">
                  <span>{getTypeLabel(item.type)}</span>
                </div>
                <div className="workflows-table-cell workflows-table-cell-created">
                  <span>{item.createdBy}</span>
                </div>
                <div className="workflows-table-cell workflows-table-cell-updated">
                  <span>{item.lastUpdatedOn}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pagination */}
      <div className="workflows-pagination">
        <div className="workflows-pagination-info">
          Rows <strong>{startRow}-{endRow}</strong> of <strong>{totalItems}</strong>
        </div>
        <div className="workflows-pagination-controls">
          <button
            className="workflows-pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <IconChevronLeft size={16} stroke={2} />
          </button>
          <div className="workflows-pagination-pages">
            {renderPaginationPages().map((page, index) => (
              <button
                key={index}
                className={cn(
                  'workflows-pagination-page',
                  typeof page === 'number' && page === currentPage && 'workflows-pagination-page-active'
                )}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={typeof page !== 'number'}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="workflows-pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <IconChevronRight size={16} stroke={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
