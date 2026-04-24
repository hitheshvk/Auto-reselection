import type { ReactNode } from 'react'

// Common prop types
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

// Button types
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonIntent = 'prime' | 'muted' | 'success' | 'warning' | 'critical' | 'info'
export type ButtonSize = 'sm' | 'lg' | 'xl'

export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant
  intent?: ButtonIntent
  size?: ButtonSize
  iconLeft?: ReactNode
  iconRight?: ReactNode
  iconOnly?: boolean
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

// Modal types
export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: ModalSize
  showCloseButton?: boolean
  footer?: ReactNode
}

// Card types
export interface CardProps extends BaseComponentProps {
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

// Badge types
export type BadgeVariant = 'default' | 'success' | 'warning' | 'critical' | 'info'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant
  size?: BadgeSize
}

// Input types
export interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  type?: 'text' | 'email' | 'password' | 'number' | 'search'
  iconLeft?: ReactNode
  iconRight?: ReactNode
  className?: string
  id?: string
  name?: string
}

// Navigation types
export interface NavSubItem {
  id: string
  label: string
  icon?: ReactNode
}

export interface NavSection {
  id: string
  label: string
  icon?: ReactNode
  isExpandable?: boolean
  items?: NavSubItem[]
}

export interface NavItem {
  id: string
  label: string
  icon: ReactNode
  href?: string
  onClick?: () => void
  badge?: string | number
  children?: NavItem[]
  // Secondary navigation (right panel)
  secondaryNav?: {
    title: string
    sections: NavSection[]
  }
}

// Chart data types
export interface ChartDataPoint {
  name: string
  value: number
}

export interface LineChartData {
  xAxis: string[]
  series: {
    name: string
    data: number[]
  }[]
}

export interface BarChartData {
  xAxis: string[]
  series: {
    name: string
    data: number[]
  }[]
}

export interface PieChartData {
  data: ChartDataPoint[]
}

// Shared content types
export type WhatfixContentType = 'flow' | 'smart_tip' | 'beacon' | 'pop_up' | 'launcher' | 'survey' | 'task_list'
export type ContentState = 'draft' | 'ready' | 'production'

// ═══════════ Experience 1: Element Health (Element Changes) ═══════════

export type ElementStatus = 'misplaced' | 'not_found' | 'removed'
export type ReselectionStatus = 'pending' | 'in_progress' | 'resolved' | 'failed'
export type DetectionSource = 'health_scan' | 'diagnostics'
export type LikelyCause = 'dom_change' | 'unknown'

export interface AffectedContent {
  id: string
  name: string
  contentType: WhatfixContentType
  contentState: ContentState
  elementStatus: ElementStatus
  applicationName: string
  targetSelector: string
  lastWorkingDate: string
  reselectionStatus: ReselectionStatus
  detectedVia: DetectionSource
  likelyCause: LikelyCause
  // Step-level detail — only for flows (each flow step has its own element)
  stepNumber?: number
  stepLabel?: string
  totalSteps?: number
}

export interface ContentHealthScan {
  id: string
  applicationName: string
  scanDate: string
  triggerType: 'scheduled' | 'manual'
  totalAffected: number
  misplacedCount: number
  notFoundCount: number
  removedCount: number
  resolvedCount: number
}

// ═══════════ Experience 2: Content Errors (Non-DOM, catch-all) ═══════════

export type ContentErrorStatus = 'new' | 'investigating' | 'fixed' | 'ignored'
export type ContentErrorSeverity = 'critical' | 'warning' | 'info'

export interface ContentError {
  id: string
  name: string
  contentType: WhatfixContentType
  contentState: ContentState
  applicationName: string
  errorSummary: string
  errorDetail: string
  severity: ContentErrorSeverity
  firstDetected: string
  lastOccurred: string
  occurrenceCount: number
  affectedUsers?: number
  status: ContentErrorStatus
}

// ═══════════ Content List (authoring view) ═══════════

export type HealthIndicator = 'healthy' | 'warning' | 'critical'

export interface ContentItem {
  id: string
  name: string
  contentType: WhatfixContentType
  contentState: ContentState
  createdBy: string
  lastModified: string
}

// ═══════════ Content Health View Mode ═══════════

export type ContentHealthViewMode = 'element_health' | 'content_errors'

// ═══════════ Unified Health Issue (DOM + Content Errors) ═══════════

export type HealthIssue =
  | { kind: 'dom'; data: AffectedContent }
  | { kind: 'error'; data: ContentError }
