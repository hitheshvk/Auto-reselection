import { useState } from 'react'
import { IconAlertTriangle, IconX, IconInfoCircle, IconCircleCheck } from '@tabler/icons-react'

type BannerSeverity = 'warning' | 'info' | 'success'

interface NotificationBannerProps {
  message: string
  severity?: BannerSeverity
  ctaLabel?: string
  onCtaClick?: () => void
  dismissible?: boolean
  onDismiss?: () => void
}

const severityConfig: Record<BannerSeverity, {
  icon: typeof IconAlertTriangle
  bg: string
  border: string
  text: string
  iconColor: string
}> = {
  warning: {
    icon: IconAlertTriangle,
    bg: '#FEF7D6',
    border: '#F6D860',
    text: '#724F04',
    iconColor: '#E0A400',
  },
  info: {
    icon: IconInfoCircle,
    bg: '#F0F9FF',
    border: '#7EC7FC',
    text: '#033D84',
    iconColor: '#0975D7',
  },
  success: {
    icon: IconCircleCheck,
    bg: '#F1FEF9',
    border: '#6CEABA',
    text: '#0C5532',
    iconColor: '#21AD73',
  },
}

export function NotificationBanner({
  message,
  severity = 'warning',
  ctaLabel,
  onCtaClick,
  dismissible = true,
  onDismiss,
}: NotificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const config = severityConfig[severity]
  const Icon = config.icon

  if (isDismissed) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  return (
    <div className="notification-banner" style={{ backgroundColor: config.bg, borderColor: config.border }}>
      <div className="notification-banner-content">
        <Icon size={18} stroke={2} style={{ color: config.iconColor, flexShrink: 0 }} />
        <span className="notification-banner-message" style={{ color: config.text }}>
          {message}
        </span>
        {ctaLabel && (
          <button className="notification-banner-cta" onClick={onCtaClick}>
            {ctaLabel}
          </button>
        )}
      </div>
      {dismissible && (
        <button className="notification-banner-dismiss" onClick={handleDismiss}>
          <IconX size={16} stroke={2} />
        </button>
      )}
    </div>
  )
}
