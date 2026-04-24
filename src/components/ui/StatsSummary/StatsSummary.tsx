import {
  IconAlertTriangle,
  IconQuestionMark,
  IconTrash,
  IconStack2,
  IconWand,
  IconHandClick,
  IconPencil,
} from '@tabler/icons-react'

interface StatItem {
  label: string
  count: number
  variant: 'neutral' | 'warning' | 'info' | 'critical' | 'success'
}

interface StatsSummaryProps {
  totalAffected: number
  misplacedCount: number
  notFoundCount: number
  removedCount: number
  mode?: 'status' | 'action'
}

const variantStyles: Record<string, { bg: string; iconBg: string; iconColor: string; countColor: string }> = {
  neutral: {
    bg: '#F6F6F9',
    iconBg: '#ECECF3',
    iconColor: '#6B697B',
    countColor: '#3D3C52',
  },
  warning: {
    bg: '#FEFBEB',
    iconBg: '#FEF7D6',
    iconColor: '#E0A400',
    countColor: '#724F04',
  },
  info: {
    bg: '#F0F9FF',
    iconBg: '#D7EFFE',
    iconColor: '#0975D7',
    countColor: '#033D84',
  },
  critical: {
    bg: '#FFF0F3',
    iconBg: '#FED6DD',
    iconColor: '#E31429',
    countColor: '#750A0A',
  },
  success: {
    bg: '#F1FEF9',
    iconBg: '#D9FBEE',
    iconColor: '#21AD73',
    countColor: '#0C5532',
  },
}

const statusIcons = {
  neutral: IconStack2,
  warning: IconAlertTriangle,
  info: IconQuestionMark,
  critical: IconTrash,
  success: IconStack2,
}

const actionIcons = {
  neutral: IconStack2,
  warning: IconWand,
  info: IconHandClick,
  critical: IconPencil,
  success: IconStack2,
}

function StatCard({ label, count, variant, iconSet }: StatItem & { iconSet: 'status' | 'action' }) {
  const style = variantStyles[variant]
  const icons = iconSet === 'action' ? actionIcons : statusIcons
  const Icon = icons[variant]

  return (
    <div className="stats-card" style={{ backgroundColor: style.bg }}>
      <div className="stats-card-icon" style={{ backgroundColor: style.iconBg }}>
        <Icon size={16} stroke={2} style={{ color: style.iconColor }} />
      </div>
      <div className="stats-card-info">
        <span className="stats-card-count" style={{ color: style.countColor }}>{count}</span>
        <span className="stats-card-label">{label}</span>
      </div>
    </div>
  )
}

export function StatsSummary({ totalAffected, misplacedCount, notFoundCount, removedCount, mode = 'action' }: StatsSummaryProps) {
  const stats: StatItem[] = mode === 'action'
    ? [
        { label: 'Total affected', count: totalAffected, variant: 'neutral' },
        { label: 'Auto-reselectable', count: misplacedCount, variant: 'warning' },
        { label: 'Choose element', count: notFoundCount, variant: 'info' },
        { label: 'Needs re-authoring', count: removedCount, variant: 'critical' },
      ]
    : [
        { label: 'Total affected', count: totalAffected, variant: 'neutral' },
        { label: 'Misplaced', count: misplacedCount, variant: 'warning' },
        { label: 'Not found', count: notFoundCount, variant: 'info' },
        { label: 'Removed', count: removedCount, variant: 'critical' },
      ]

  return (
    <div className="stats-summary">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} iconSet={mode} />
      ))}
    </div>
  )
}
