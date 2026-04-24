import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  IconLayoutDashboard,
  IconChartBar,
  IconFileText,
  IconSettings,
  IconApps,
  IconPalette,
  IconTags,
  IconUsers,
  IconBulb,
  IconTarget,
  IconCategory,
  IconRoute,
  IconHelpCircle,
  IconListDetails,
  IconClipboardList,
  IconPlugConnected,
  IconSettingsAutomation,
  IconFolderPlus,
  IconMail,
  IconAlertCircle,
  IconChevronDown,
  IconChevronUp,
  IconCircleCheck,
  IconArrowLeft,
  IconArrowRight,
  IconAlertTriangle,
  IconRefresh,
} from '@tabler/icons-react'
import { PageLayout, Sidebar, SecondaryNav, ContentPageHeader } from './components/layout'
import { WorkflowsTable, NotificationBanner, StatsSummary, ContentHealthTable, ContentErrorsTable, ContentListTable } from './components/ui'
import type { NavItem, AffectedContent, ContentState, ContentHealthViewMode, ContentError, ContentItem, HealthIndicator, HealthIssue } from './types'
import type { WorkflowItem } from './components/ui/WorkflowsTable'
import { EmailPreviewView } from './views'

// Products for switcher - using brand images
const products = [
  {
    id: 'guidance',
    name: 'Whatfix Guidance',
    shortName: 'Guidance',
    description: 'Drive digital adoption',
    icon: '/brand/DAP.png',
    badge: 'Trial',
  },
  {
    id: 'analytics',
    name: 'Whatfix Analytics',
    shortName: 'Analytics',
    description: 'Measure product usage',
    icon: '/brand/PA.png',
    badge: 'Trial',
  },
  {
    id: 'mirror',
    name: 'Whatfix Mirror',
    shortName: 'Mirror',
    description: 'Create interactive application replicas',
    icon: '/brand/Mirror.png',
    badge: 'Trial',
  },
  {
    id: 'studio',
    name: 'Whatfix Studio',
    shortName: 'Studio',
    description: 'Content creation platform',
    icon: '/brand/Studio.png',
    badge: 'Trial',
  },
]

// Navigation configurations per product
const productNavConfigs: Record<string, NavItem[]> = {
  guidance: [
    { 
      id: 'content', 
      label: 'Content', 
      icon: <IconCategory size={22} stroke={2} />,
    },
    {
      id: 'content-health',
      label: 'Content health',
      icon: <IconAlertTriangle size={22} stroke={2} />,
    },
    { 
      id: 'widgets', 
      label: 'Widgets', 
      icon: <IconApps size={22} stroke={2} />,
      secondaryNav: {
        title: 'Widgets',
        sections: [
          { id: 'all-widgets', label: 'All widgets' },
          { 
            id: 'guides', 
            label: 'Guides', 
            icon: <IconRoute size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'pop-ups', label: 'Pop-ups' },
              { id: 'smart-tips', label: 'Smart-tips' },
              { id: 'beacons', label: 'Beacons' },
              { id: 'launchers', label: 'Launchers' },
            ]
          },
          { id: 'self-help', label: 'Self help', icon: <IconHelpCircle size={18} stroke={1.5} /> },
          { id: 'task-lists', label: 'Task lists', icon: <IconListDetails size={18} stroke={1.5} /> },
          { id: 'surveys', label: 'Surveys', icon: <IconClipboardList size={18} stroke={1.5} /> },
        ]
      }
    },
    { 
      id: 'guidance-analytics', 
      label: 'Guidance analytics', 
      icon: <IconChartBar size={22} stroke={2} />,
      secondaryNav: {
        title: 'Guidance analytics',
        sections: [
          { id: 'summary', label: 'Summary' },
          { 
            id: 'guides', 
            label: 'Guides', 
            icon: <IconRoute size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'flows', label: 'Flows' },
              { id: 'pop-ups', label: 'Pop-ups' },
              { id: 'smart-tips', label: 'Smart-tips' },
              { id: 'beacons', label: 'Beacons' },
            ]
          },
          { id: 'self-help', label: 'Self help', icon: <IconHelpCircle size={18} stroke={1.5} /> },
          { id: 'task-lists', label: 'Task lists', icon: <IconListDetails size={18} stroke={1.5} /> },
          { id: 'surveys', label: 'Surveys', icon: <IconClipboardList size={18} stroke={1.5} /> },
        ]
      }
    },
    { 
      id: 'style', 
      label: 'Style', 
      icon: <IconPalette size={22} stroke={2} />,
      secondaryNav: {
        title: 'Style',
        sections: [
          { id: 'font', label: 'Font' },
          { id: 'icon', label: 'Icon' },
          { 
            id: 'guides', 
            label: 'Guides', 
            icon: <IconRoute size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'flows', label: 'Flows' },
              { id: 'smart-tips', label: 'Smart-tips' },
              { id: 'beacons', label: 'Beacons' },
              { id: 'launchers', label: 'Launchers' },
            ]
          },
          { id: 'self-help', label: 'Self help', icon: <IconHelpCircle size={18} stroke={1.5} /> },
          { id: 'task-lists', label: 'Task lists', icon: <IconListDetails size={18} stroke={1.5} /> },
          { id: 'custom-labels', label: 'Custom labels' },
        ]
      }
    },
    { 
      id: 'tags', 
      label: 'Tags', 
      icon: <IconTags size={22} stroke={2} />,
      secondaryNav: {
        title: 'Tags',
        sections: [
          { id: 'all-tags', label: 'All tags' },
          { id: 'roles', label: 'Roles' },
          { id: 'pages', label: 'Pages' },
          { id: 'other', label: 'Other' },
        ]
      }
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <IconSettings size={22} stroke={2} />,
      secondaryNav: {
        title: 'Settings',
        sections: [
          { 
            id: 'content', 
            label: 'Content', 
            icon: <IconFileText size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'translations', label: 'Translations' },
              { id: 'video', label: 'Video' },
            ]
          },
          { 
            id: 'integrations', 
            label: 'Integrations', 
            icon: <IconPlugConnected size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'repositories', label: 'Repositories' },
              { id: 'video-channels', label: 'Video channels' },
              { id: 'app-integrations', label: 'App integrations' },
            ]
          },
          { 
            id: 'team', 
            label: 'Team', 
            icon: <IconUsers size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'teammates', label: 'Teammates' },
              { id: 'team-audit-logs', label: 'Team audit logs' },
            ]
          },
          { 
            id: 'setup', 
            label: 'Setup', 
            icon: <IconSettingsAutomation size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'api-token', label: 'API token' },
              { id: 'advanced-customisation', label: 'Advanced customisation' },
              { id: 'content-deployment', label: 'Content deployment' },
              { id: 'sso-authentication', label: 'SSO and authentication' },
            ]
          },
        ]
      }
    },
  ],
  analytics: [
    { id: 'dashboards', label: 'Dashboards', icon: <IconLayoutDashboard size={22} stroke={2} /> },
    { id: 'insights', label: 'Insights', icon: <IconBulb size={22} stroke={2} /> },
    { id: 'tracking', label: 'Tracking', icon: <IconTarget size={22} stroke={2} /> },
    { id: 'audience', label: 'Audience', icon: <IconUsers size={22} stroke={2} /> },
    { id: 'settings', label: 'Settings', icon: <IconSettings size={22} stroke={2} /> },
  ],
  mirror: [
    { 
      id: 'workflows', 
      label: 'Workflows', 
      icon: <IconCategory size={22} stroke={2} />,
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <IconChartBar size={22} stroke={2} />,
      secondaryNav: {
        title: 'Analytics',
        sections: [
          { id: 'workflows', label: 'Workflows', icon: <IconFileText size={18} stroke={1.5} /> },
          { id: 'assessments', label: 'Assessments', icon: <IconFileText size={18} stroke={1.5} /> },
        ]
      }
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <IconSettings size={22} stroke={2} />,
      secondaryNav: {
        title: 'Settings',
        sections: [
          { 
            id: 'team', 
            label: 'Team', 
            icon: <IconUsers size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'teammates', label: 'Teammates' },
              { id: 'team-audit-logs', label: 'Team audit logs' },
            ]
          },
          { 
            id: 'setup', 
            label: 'Setup', 
            icon: <IconSettingsAutomation size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'api-token', label: 'API token' },
            ]
          },
          { id: 'analytics', label: 'Analytics', icon: <IconChartBar size={18} stroke={1.5} /> },
        ]
      }
    },
  ],
  studio: [
    { id: 'projects', label: 'Projects', icon: <IconFileText size={22} stroke={2} /> },
    { id: 'templates', label: 'Templates', icon: <IconApps size={22} stroke={2} /> },
    { id: 'settings', label: 'Settings', icon: <IconSettings size={22} stroke={2} /> },
  ],
}

// Workspaces
const workspaces = [
  { id: 'diya_mirror_1', name: 'diya_mirror_1' },
  { id: 'shubhambhatt_demo', name: 'shubhambhatt_demo' },
]

// Sample workflow data for Production tab
const sampleWorkflowItems: WorkflowItem[] = [
  {
    id: '1',
    name: 'H1 2025 Learning',
    type: 'folder',
    itemCount: 7,
    createdBy: 'Mark S',
    lastUpdatedOn: 'Simulation',
  },
  {
    id: '2',
    name: 'Guidewire environment',
    type: 'folder',
    itemCount: 5,
    badge: { label: 'Roleplay attached', variant: 'success' },
    createdBy: 'Ann Perkins',
    lastUpdatedOn: 'Sep 15, 2025',
  },
  {
    id: '3',
    name: 'Guidewire workflow list archive',
    type: 'folder',
    itemCount: 9,
    createdBy: 'Ann Perkins',
    lastUpdatedOn: 'Simulation',
  },
  {
    id: '4',
    name: 'New claim | Guidewire',
    type: 'workflow',
    itemCount: 5,
    createdBy: 'Juliette Nichols',
    lastUpdatedOn: 'Simulation',
  },
  {
    id: '5',
    name: 'New claim | Guidewire',
    type: 'workflow',
    itemCount: 10,
    createdBy: 'Boyd Stevens',
    lastUpdatedOn: 'Simulation',
  },
  {
    id: '6',
    name: 'Claims processing workflow',
    type: 'simulation',
    createdBy: 'Sarah Johnson',
    lastUpdatedOn: 'Oct 20, 2025',
  },
  {
    id: '7',
    name: 'Policy renewal training',
    type: 'folder',
    itemCount: 12,
    badge: { label: 'Assessment added', variant: 'success' },
    createdBy: 'Mike Chen',
    lastUpdatedOn: 'Nov 5, 2025',
  },
  {
    id: '8',
    name: 'Customer onboarding',
    type: 'simulation',
    createdBy: 'Emily Davis',
    lastUpdatedOn: 'Dec 1, 2025',
  },
]

// Last health scan date (simulates a periodic scan tied to an app release)
const LAST_SCAN_DATE = 'Mar 28, 2026'
const NEXT_SCAN_DATE = 'Apr 11, 2026'
const SCAN_APP_VERSION = 'Salesforce CRM v25.1'

// Mock affected content data for element health
// Flows are broken into per-step rows — each step has its own element and may be independently affected.
// Non-flow content (smart_tip, beacon, etc.) only targets one element, so no step info.
const mockAffectedContent: AffectedContent[] = [
  // ── Production: "Submit new claim form" flow (8 steps, 3 affected) ──
  { id: 'ac-1a', name: 'Submit new claim form', contentType: 'flow', contentState: 'production', elementStatus: 'misplaced', applicationName: 'Salesforce CRM', targetSelector: '#btn-new-claim', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change', stepNumber: 2, stepLabel: 'Click "New Claim" button', totalSteps: 8 },
  { id: 'ac-1b', name: 'Submit new claim form', contentType: 'flow', contentState: 'production', elementStatus: 'misplaced', applicationName: 'Salesforce CRM', targetSelector: '.claim-type-dropdown', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change', stepNumber: 4, stepLabel: 'Select claim type dropdown', totalSteps: 8 },
  { id: 'ac-1c', name: 'Submit new claim form', contentType: 'flow', contentState: 'production', elementStatus: 'removed', applicationName: 'Salesforce CRM', targetSelector: '#btn-submit-claim', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change', stepNumber: 8, stepLabel: 'Click "Submit" button', totalSteps: 8 },

  // ── Production: "Navigate to reports dashboard" flow (5 steps, 1 affected) ──
  { id: 'ac-2', name: 'Navigate to reports dashboard', contentType: 'flow', contentState: 'production', elementStatus: 'misplaced', applicationName: 'Salesforce CRM', targetSelector: '.nav-reports-link', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change', stepNumber: 1, stepLabel: 'Click "Reports" in navigation', totalSteps: 5 },

  // ── Production: Non-flow content (single element each) ──
  { id: 'ac-3', name: 'Policy renewal reminder', contentType: 'smart_tip', contentState: 'production', elementStatus: 'not_found', applicationName: 'Salesforce CRM', targetSelector: '[data-id="renewal-btn"]', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change' },
  { id: 'ac-4', name: 'Help icon on sidebar', contentType: 'beacon', contentState: 'production', elementStatus: 'misplaced', applicationName: 'Salesforce CRM', targetSelector: '.sidebar-help-icon', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change' },
  { id: 'ac-5', name: 'Legacy export button tooltip', contentType: 'pop_up', contentState: 'production', elementStatus: 'removed', applicationName: 'Salesforce CRM', targetSelector: '#export-legacy-btn', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change' },

  // ── Ready: "Create new contact walkthrough" flow (6 steps, 2 affected) ──
  { id: 'ac-6a', name: 'Create new contact walkthrough', contentType: 'flow', contentState: 'ready', elementStatus: 'misplaced', applicationName: 'Salesforce CRM', targetSelector: '.btn-new-contact', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change', stepNumber: 1, stepLabel: 'Click "New Contact"', totalSteps: 6 },
  { id: 'ac-6b', name: 'Create new contact walkthrough', contentType: 'flow', contentState: 'ready', elementStatus: 'not_found', applicationName: 'Salesforce CRM', targetSelector: '#contact-email-field', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change', stepNumber: 3, stepLabel: 'Enter email address', totalSteps: 6 },

  // ── Ready: Non-flow content ──
  { id: 'ac-7', name: 'Dashboard filter guidance', contentType: 'smart_tip', contentState: 'ready', elementStatus: 'not_found', applicationName: 'Salesforce CRM', targetSelector: '#filter-panel-toggle', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change' },
  { id: 'ac-8', name: 'Quick actions launcher', contentType: 'launcher', contentState: 'ready', elementStatus: 'misplaced', applicationName: 'Salesforce CRM', targetSelector: '.quick-actions-bar', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change' },

  // ── Draft ──
  { id: 'ac-9', name: 'Onboarding survey trigger', contentType: 'survey', contentState: 'draft', elementStatus: 'not_found', applicationName: 'Salesforce CRM', targetSelector: '[data-survey-trigger]', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change' },
  { id: 'ac-10', name: 'Task list for new hires', contentType: 'task_list', contentState: 'draft', elementStatus: 'removed', applicationName: 'Salesforce CRM', targetSelector: '#onboarding-task-panel', lastWorkingDate: 'Mar 15, 2026', reselectionStatus: 'pending', detectedVia: 'health_scan', likelyCause: 'dom_change' },
]

// Mock content errors (non-DOM, catch-all failures)
const mockContentErrors: ContentError[] = [
  {
    id: 'ce-1', name: 'Submit new claim form', contentType: 'flow', contentState: 'production',
    applicationName: 'Salesforce CRM', errorSummary: 'Step 3 condition never evaluates to true',
    errorDetail: 'Display condition "user.role === \'admin\'" fails for all users in the "Claims Processor" segment. The role field returns "claims_admin" instead of "admin" after the SSO migration.',
    severity: 'critical', firstDetected: 'Mar 20, 2026', lastOccurred: 'Apr 4, 2026',
    occurrenceCount: 47, affectedUsers: 230, status: 'new',
  },
  {
    id: 'ce-2', name: 'Policy renewal reminder', contentType: 'smart_tip', contentState: 'production',
    applicationName: 'Salesforce CRM', errorSummary: 'Content not rendering — JavaScript error',
    errorDetail: 'TypeError: Cannot read properties of undefined (reading \'renewalDate\'). The smart tip references a variable {{policy.renewalDate}} which is undefined when the policy object is loaded asynchronously.',
    severity: 'critical', firstDetected: 'Mar 25, 2026', lastOccurred: 'Apr 5, 2026',
    occurrenceCount: 112, affectedUsers: 89, status: 'investigating',
  },
  {
    id: 'ce-3', name: 'Dashboard filter guidance', contentType: 'smart_tip', contentState: 'ready',
    applicationName: 'Salesforce CRM', errorSummary: 'Conflicting display rules with another smart tip',
    errorDetail: 'This smart tip conflicts with "Dashboard overview tip" (id: st-42). Both have identical page targeting rules and overlapping display conditions. Only one renders, chosen non-deterministically.',
    severity: 'warning', firstDetected: 'Feb 10, 2026', lastOccurred: 'Apr 1, 2026',
    occurrenceCount: 8, status: 'new',
  },
  {
    id: 'ce-4', name: 'Customer onboarding flow', contentType: 'flow', contentState: 'production',
    applicationName: 'Salesforce CRM', errorSummary: 'API call in step 5 returns 403 Forbidden',
    errorDetail: 'The flow makes a fetch request to /api/v2/contacts/create which now requires an updated API token. The token embedded in the flow configuration expired on Mar 30, 2026.',
    severity: 'critical', firstDetected: 'Mar 31, 2026', lastOccurred: 'Apr 6, 2026',
    occurrenceCount: 34, affectedUsers: 156, status: 'new',
  },
  {
    id: 'ce-5', name: 'Quick actions launcher', contentType: 'launcher', contentState: 'ready',
    applicationName: 'Salesforce CRM', errorSummary: 'Launcher opens behind modal overlay',
    errorDetail: 'When the Salesforce modal dialog is open, the launcher z-index (9999) is lower than the modal backdrop (10000). The launcher appears to not respond to clicks.',
    severity: 'warning', firstDetected: 'Mar 5, 2026', lastOccurred: 'Mar 28, 2026',
    occurrenceCount: 3, status: 'ignored',
  },
  {
    id: 'ce-6', name: 'NPS survey after case close', contentType: 'survey', contentState: 'production',
    applicationName: 'Salesforce CRM', errorSummary: 'Survey submission silently fails',
    errorDetail: 'The survey POST to /api/surveys/submit returns 200 but the response body contains { "saved": false }. Survey responses are not being recorded. Likely a backend quota issue.',
    severity: 'warning', firstDetected: 'Apr 2, 2026', lastOccurred: 'Apr 5, 2026',
    occurrenceCount: 19, affectedUsers: 45, status: 'new',
  },
]

// Full content list — the authoring view shows all content, not just affected items.
// Some names intentionally overlap with mockAffectedContent / mockContentErrors so the health indicator lights up.
const mockContentItems: ContentItem[] = [
  // ── Production ──
  { id: 'ci-1', name: 'Submit new claim form', contentType: 'flow', contentState: 'production', createdBy: 'Ann Perkins', lastModified: 'Mar 25, 2026' },
  { id: 'ci-2', name: 'Navigate to reports dashboard', contentType: 'flow', contentState: 'production', createdBy: 'John Doe', lastModified: 'Mar 20, 2026' },
  { id: 'ci-3', name: 'Policy renewal reminder', contentType: 'smart_tip', contentState: 'production', createdBy: 'Sarah Johnson', lastModified: 'Feb 14, 2026' },
  { id: 'ci-4', name: 'Help icon on sidebar', contentType: 'beacon', contentState: 'production', createdBy: 'Mike Chen', lastModified: 'Jan 10, 2026' },
  { id: 'ci-5', name: 'Legacy export button tooltip', contentType: 'pop_up', contentState: 'production', createdBy: 'Emily Davis', lastModified: 'Dec 5, 2025' },
  { id: 'ci-6', name: 'Customer onboarding flow', contentType: 'flow', contentState: 'production', createdBy: 'Ann Perkins', lastModified: 'Mar 18, 2026' },
  { id: 'ci-7', name: 'NPS survey after case close', contentType: 'survey', contentState: 'production', createdBy: 'Boyd Stevens', lastModified: 'Apr 1, 2026' },
  { id: 'ci-8', name: 'Account setup walkthrough', contentType: 'flow', contentState: 'production', createdBy: 'Juliette Nichols', lastModified: 'Feb 28, 2026' },
  { id: 'ci-9', name: 'Data export helper', contentType: 'smart_tip', contentState: 'production', createdBy: 'John Doe', lastModified: 'Mar 10, 2026' },
  // ── Ready ──
  { id: 'ci-10', name: 'Create new contact walkthrough', contentType: 'flow', contentState: 'ready', createdBy: 'Sarah Johnson', lastModified: 'Mar 22, 2026' },
  { id: 'ci-11', name: 'Dashboard filter guidance', contentType: 'smart_tip', contentState: 'ready', createdBy: 'Mike Chen', lastModified: 'Mar 15, 2026' },
  { id: 'ci-12', name: 'Quick actions launcher', contentType: 'launcher', contentState: 'ready', createdBy: 'Emily Davis', lastModified: 'Mar 8, 2026' },
  { id: 'ci-13', name: 'Pipeline stage overview', contentType: 'pop_up', contentState: 'ready', createdBy: 'Ann Perkins', lastModified: 'Feb 20, 2026' },
  { id: 'ci-14', name: 'Weekly digest opt-in', contentType: 'survey', contentState: 'ready', createdBy: 'Boyd Stevens', lastModified: 'Mar 5, 2026' },
  // ── Draft ──
  { id: 'ci-15', name: 'Onboarding survey trigger', contentType: 'survey', contentState: 'draft', createdBy: 'Juliette Nichols', lastModified: 'Mar 28, 2026' },
  { id: 'ci-16', name: 'Task list for new hires', contentType: 'task_list', contentState: 'draft', createdBy: 'Sarah Johnson', lastModified: 'Mar 30, 2026' },
  { id: 'ci-17', name: 'Advanced search tutorial', contentType: 'flow', contentState: 'draft', createdBy: 'John Doe', lastModified: 'Apr 2, 2026' },
  { id: 'ci-18', name: 'Keyboard shortcuts beacon', contentType: 'beacon', contentState: 'draft', createdBy: 'Emily Davis', lastModified: 'Apr 4, 2026' },
]

/**
 * Main App Component
 */
function App() {
  const [currentProduct, setCurrentProduct] = useState('guidance')
  const [activeNavItem, setActiveNavItem] = useState('content')
  const [currentWorkspace, setCurrentWorkspace] = useState('diya_mirror_1')
  const [activeSecondaryItem, setActiveSecondaryItem] = useState<string | null>(null)
  const [openSecondaryNavId, setOpenSecondaryNavId] = useState<string | null>(null)
  const [workflowsTab, setWorkflowsTab] = useState('production')
  const [workflowsPage, setWorkflowsPage] = useState(2)
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>(['2'])

  // Content list state
  const [contentTab, setContentTab] = useState<ContentState>('production')
  const [contentFilterMode, setContentFilterMode] = useState<'all' | 'needs_attention'>('all')
  const [selectedContentItems, setSelectedContentItems] = useState<string[]>([])
  const [affectedItems, setAffectedItems] = useState<AffectedContent[]>(mockAffectedContent)
  const [contentErrors, setContentErrors] = useState<ContentError[]>(mockContentErrors)
  const [showEmailPreview, setShowEmailPreview] = useState(false)

  // v1: full view-swap, v3: drill-down
  const [contentViewMode, setContentViewModeRaw] = useState<'list' | 'health' | 'health_detail'>('list')
  const [healthLoading, setHealthLoading] = useState(false)
  // v2: inline collapsible health bar
  const [healthExpanded, setHealthExpanded] = useState(false)

  const setContentViewMode = useCallback((mode: 'list' | 'health' | 'health_detail') => {
    if (mode === 'health_detail' && contentViewMode !== 'health_detail') {
      setHealthLoading(true)
      setContentViewModeRaw(mode)
      setTimeout(() => setHealthLoading(false), 600)
    } else {
      setHealthLoading(false)
      setContentViewModeRaw(mode)
    }
  }, [contentViewMode])
  // Shared
  const [healthViewMode, setHealthViewMode] = useState<ContentHealthViewMode>('element_health')
  // Design version switcher
  const [designVersion, setDesignVersion] = useState<'v1' | 'v2' | 'v3'>('v3')
  // Resolved items visibility
  const [showResolvedDom, setShowResolvedDom] = useState(false)
  const [showResolvedErrors, setShowResolvedErrors] = useState(false)

  const currentProductData = products.find((p) => p.id === currentProduct)
  const baseNavItems = productNavConfigs[currentProduct] || []

  // Element Health helpers (computed early so navItems can use them)
  const allUnresolved = affectedItems.filter(i => i.reselectionStatus !== 'resolved')
  const activeErrors = contentErrors.filter(e => e.status !== 'fixed' && e.status !== 'ignored')

  const widgetTypes = new Set(['smart_tip', 'beacon', 'pop_up', 'launcher', 'survey', 'task_list'])

  const navItems = useMemo(() => {
    if (currentProduct !== 'guidance') return baseNavItems

    const totalIssues = allUnresolved.length + activeErrors.length
    const widgetIssues =
      allUnresolved.filter(i => widgetTypes.has(i.contentType)).length +
      activeErrors.filter(e => widgetTypes.has(e.contentType)).length

    return baseNavItems.map(item => {
      if (item.id === 'content-health' && totalIssues > 0) {
        return { ...item, badge: totalIssues }
      }
      if (item.id === 'widgets' && widgetIssues > 0) {
        return { ...item, badge: widgetIssues }
      }
      return item
    })
  }, [currentProduct, baseNavItems, allUnresolved, activeErrors])

  // Find the nav item whose secondary nav is currently open
  const openNavItem = navItems.find(item => item.id === openSecondaryNavId)
  const secondaryNav = openNavItem?.secondaryNav

  const handleProductSelect = (productId: string) => {
    setCurrentProduct(productId)
    const firstItem = productNavConfigs[productId]?.[0]
    if (firstItem) {
      setActiveNavItem(firstItem.id)
      setActiveSecondaryItem(null)
      setOpenSecondaryNavId(null)
    }
  }

  const handleNavItemClick = (item: NavItem) => {
    if (item.secondaryNav) {
      if (openSecondaryNavId === item.id) {
        setOpenSecondaryNavId(null)
      } else {
        setOpenSecondaryNavId(item.id)
      }
    } else {
      setActiveNavItem(item.id)
      setActiveSecondaryItem(null)
      setOpenSecondaryNavId(null)
    }
  }

  const handleSecondaryItemClick = (_sectionId: string, itemId: string) => {
    if (openSecondaryNavId) {
      setActiveNavItem(openSecondaryNavId)
    }
    setActiveSecondaryItem(itemId)
    setOpenSecondaryNavId(null)
  }

  const handleCloseSecondaryNav = () => {
    setOpenSecondaryNavId(null)
  }

  const contentItemsByTab = mockContentItems.filter(i => i.contentState === contentTab)

  // Build a health indicator map: content name → worst status
  const healthMap = useMemo<Record<string, HealthIndicator>>(() => {
    const map: Record<string, HealthIndicator> = {}
    for (const item of allUnresolved) {
      const existing = map[item.name]
      if (item.elementStatus === 'removed' || item.elementStatus === 'not_found') {
        map[item.name] = 'critical'
      } else if (!existing || existing === 'healthy') {
        map[item.name] = 'warning'
      }
    }
    for (const err of activeErrors) {
      if (err.severity === 'critical') {
        map[err.name] = 'critical'
      } else if (!map[err.name]) {
        map[err.name] = 'warning'
      }
    }
    return map
  }, [allUnresolved, activeErrors])

  // Apply "needs attention" filter
  const contentItemsForTab = contentFilterMode === 'needs_attention'
    ? contentItemsByTab.filter(i => healthMap[i.name] && healthMap[i.name] !== 'healthy')
    : contentItemsByTab

  const needsAttentionCount = contentItemsByTab.filter(
    i => healthMap[i.name] && healthMap[i.name] !== 'healthy'
  ).length

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'WHATFIX_RESELECT_DONE') {
        const { contentId, status } = event.data
        setAffectedItems(prev => prev.map(i => {
          if (i.id !== contentId) return i
          if (status === 'resolved') return { ...i, reselectionStatus: 'resolved' as const }
          if (status === 'partial') return { ...i, reselectionStatus: 'failed' as const }
          return i
        }))
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const markInProgress = useCallback((itemId: string) => {
    setAffectedItems(prev => prev.map(i =>
      i.id === itemId ? { ...i, reselectionStatus: 'in_progress' as const } : i
    ))
  }, [])

  const resolveItem = useCallback((itemId: string) => {
    setAffectedItems(prev => prev.map(i =>
      i.id === itemId && i.reselectionStatus === 'in_progress'
        ? { ...i, reselectionStatus: 'resolved' as const }
        : i
    ))
  }, [])

  const openStudioAndWatch = useCallback((item: AffectedContent, mode: string) => {
    const contentTypeLabels: Record<string, string> = {
      flow: 'Flow', smart_tip: 'Smart-tip', beacon: 'Beacon',
      pop_up: 'Pop-up', launcher: 'Launcher', survey: 'Survey', task_list: 'Task list',
    }
    const params = new URLSearchParams({
      mode,
      name: item.name,
      type: contentTypeLabels[item.contentType] || item.contentType,
      selector: item.targetSelector,
      app: item.applicationName,
      contentId: item.id,
    })
    if (item.stepNumber !== undefined) {
      params.set('step', String(item.stepNumber))
      if (item.stepLabel) params.set('stepLabel', item.stepLabel)
      if (item.totalSteps) params.set('totalSteps', String(item.totalSteps))
    }
    const url = `${window.location.origin}/?${params.toString()}`
    const win = window.open(url, '_blank')
    markInProgress(item.id)

    let resolved = false
    const done = () => { if (!resolved) { resolved = true; resolveItem(item.id) } }

    if (win) {
      const poll = setInterval(() => {
        if (win.closed) { clearInterval(poll); done() }
      }, 500)
      setTimeout(() => { clearInterval(poll); done() }, 30000)
    } else {
      setTimeout(done, 25000)
    }
  }, [markInProgress, resolveItem])

  const handleAutoReselect = useCallback((item: AffectedContent) => {
    openStudioAndWatch(item, 'auto-reselect')
  }, [openStudioAndWatch])

  const handleReselect = useCallback((item: AffectedContent) => {
    openStudioAndWatch(item, 'reselect')
  }, [openStudioAndWatch])

  const handleReAuthor = useCallback((item: AffectedContent) => {
    openStudioAndWatch(item, 're-author')
  }, [openStudioAndWatch])

  const handleBannerReview = useCallback(() => {
    if (designVersion === 'v1') {
      setActiveNavItem('content-health')
    } else if (designVersion === 'v3') {
      setActiveNavItem('content')
      setContentViewMode('health_detail')
    } else {
      setActiveNavItem('content')
      setContentViewMode('health')
      setHealthExpanded(true)
    }
  }, [designVersion])

  const hasHealthIssues = allUnresolved.length > 0
  const hasContentErrors = activeErrors.length > 0
  const isGuidanceContent = currentProduct === 'guidance' && activeNavItem === 'content'
  const isGuidanceContentHealth = currentProduct === 'guidance' && activeNavItem === 'content-health'
  const isGuidanceWidgets = currentProduct === 'guidance' && activeNavItem === 'widgets'

  const widgetUnresolved = allUnresolved.filter(i => widgetTypes.has(i.contentType))
  const widgetErrors = activeErrors.filter(e => widgetTypes.has(e.contentType))
  const hasWidgetIssues = widgetUnresolved.length > 0 || widgetErrors.length > 0

  const handleRunHealthCheck = useCallback(() => {
    setAffectedItems(mockAffectedContent)
    if (designVersion === 'v1') {
      setActiveNavItem('content-health')
    } else if (designVersion === 'v3') {
      setContentViewMode('health_detail')
    } else {
      setContentViewMode('health')
      setHealthExpanded(true)
    }
    setHealthViewMode('element_health')
  }, [designVersion])

  const handleIgnoreError = useCallback((item: ContentError) => {
    setContentErrors(prev => prev.map(e =>
      e.id === item.id ? { ...e, status: 'ignored' as const } : e
    ))
  }, [])

  const handleInvestigateError = useCallback((item: ContentError) => {
    setContentErrors(prev => prev.map(e =>
      e.id === item.id ? { ...e, status: 'investigating' as const } : e
    ))
  }, [])

  const handleOpenErrorInStudio = useCallback((item: ContentError) => {
    const params = new URLSearchParams({
      mode: 'debug',
      name: item.name,
      type: item.contentType,
      app: item.applicationName,
      contentId: item.id,
    })
    window.open(`${window.location.origin}/?${params.toString()}`, '_blank')
  }, [])

  // Email preview toggle
  if (showEmailPreview) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 24px', borderBottom: '1px solid #ECECF3', backgroundColor: '#FFFFFF',
        }}>
          <button
            onClick={() => setShowEmailPreview(false)}
            style={{
              padding: '6px 16px', fontSize: '13px', fontWeight: 500, color: '#3D3C52',
              background: 'transparent', border: '1px solid #DFDDE7', borderRadius: '6px', cursor: 'pointer',
            }}
          >
            Back to dashboard
          </button>
          <span style={{ fontSize: '13px', color: '#8C899F' }}>Email notification design spec</span>
        </div>
        <EmailPreviewView />
      </div>
    )
  }

  return (
    <PageLayout
      sidebar={
        <Sidebar
          items={navItems}
          activeItemId={activeNavItem}
          onItemClick={handleNavItemClick}
          products={products}
          currentProductId={currentProduct}
          currentProductName={currentProductData?.shortName || 'Whatfix'}
          currentProductIcon={currentProductData?.icon}
          onProductSelect={handleProductSelect}
          workspaces={workspaces}
          currentWorkspaceId={currentWorkspace}
          onWorkspaceSelect={setCurrentWorkspace}
          userName="Shubham Bhatt"
          showExploreDemo={currentProduct === 'analytics'}
        />
      }
    >
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Secondary Navigation Panel with backdrop */}
        {secondaryNav && (
          <>
            {/* Backdrop to close on click outside */}
            <div 
              className="secondary-nav-backdrop"
              onClick={handleCloseSecondaryNav}
            />
            <SecondaryNav
              title={secondaryNav.title}
              sections={secondaryNav.sections}
              onItemClick={handleSecondaryItemClick}
              activeItemId={activeSecondaryItem || undefined}
            />
          </>
        )}

        {/* Main Content Area */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          backgroundColor: '#FCFCFD'
        }}>
          {/* ═══════════ PAGE: Content ═══════════ */}
          {isGuidanceContent && (
            <>
              {/* ╌╌╌╌╌ v1: Full view-swap (List | Health) ╌╌╌╌╌ */}
              {designVersion === 'v1' && (
                <>
                  {(hasHealthIssues || hasContentErrors) && (
                    <NotificationBanner
                      message={
                        hasHealthIssues && hasContentErrors
                          ? `${SCAN_APP_VERSION} was updated — ${allUnresolved.length} content items were affected. ${activeErrors.length} ${activeErrors.length === 1 ? 'failure is' : 'failures are'} also happening in production.`
                          : hasHealthIssues
                            ? `${SCAN_APP_VERSION} was updated — ${allUnresolved.length} content ${allUnresolved.length === 1 ? 'item was' : 'items were'} affected and may not display correctly.`
                            : `${activeErrors.length} ${activeErrors.length === 1 ? 'piece of content is' : 'pieces of content are'} failing in production and affecting users.`
                      }
                      severity="warning"
                      ctaLabel="Review and fix"
                      onCtaClick={() => setActiveNavItem('content-health')}
                    />
                  )}

                      <ContentPageHeader
                        title="Content"
                        createButtonLabel="Create content"
                        tabs={[
                          { id: 'draft', label: 'Draft' },
                          { id: 'ready', label: 'Ready' },
                          { id: 'production', label: 'Production' },
                        ]}
                        defaultTabId={contentTab}
                        onTabChange={(tabId) => { setContentTab(tabId as ContentState); setContentFilterMode('all') }}
                        showSearch={true}
                        searchPlaceholder="Search content"
                        showFilter={false}
                        showViewToggle={false}
                        showCreateFolder={false}
                      />

                      {needsAttentionCount > 0 && (
                        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center' }}>
                          <div className="content-health-toggle">
                            <button
                              className={`content-health-toggle-btn ${contentFilterMode === 'all' ? 'active' : ''}`}
                              onClick={() => setContentFilterMode('all')}
                            >
                              All
                            </button>
                            <button
                              className={`content-health-toggle-btn ${contentFilterMode === 'needs_attention' ? 'active' : ''}`}
                              onClick={() => setContentFilterMode('needs_attention')}
                            >
                              Needs attention
                              <span className={`content-health-badge ${contentFilterMode === 'needs_attention' ? 'warning' : 'warning'}`}>{needsAttentionCount}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div style={{ flex: 1, padding: '16px 24px', overflow: 'auto' }}>
                        <ContentListTable
                          items={contentItemsForTab}
                          showStageColumn={false}
                          healthMap={healthMap}
                          selectedItems={selectedContentItems}
                          onSelectionChange={setSelectedContentItems}
                          onItemClick={(item) => console.log('Open:', item.name)}
                          onItemEdit={(item) => console.log('Edit:', item.name)}
                          onItemMenu={(item) => console.log('Menu:', item.name)}
                        />
                      </div>
                </>
              )}

              {/* ╌╌╌╌╌ v2: Inline collapsible health bar ╌╌╌╌╌ */}
              {designVersion === 'v2' && (
                <>
                  {(hasHealthIssues || hasContentErrors) && !healthExpanded && (
                    <NotificationBanner
                      message={
                        hasHealthIssues && hasContentErrors
                          ? `${SCAN_APP_VERSION} was updated — ${allUnresolved.length} content items were affected. ${activeErrors.length} ${activeErrors.length === 1 ? 'failure is' : 'failures are'} also happening in production.`
                          : hasHealthIssues
                            ? `${SCAN_APP_VERSION} was updated — ${allUnresolved.length} content ${allUnresolved.length === 1 ? 'item was' : 'items were'} affected and may not display correctly.`
                            : `${activeErrors.length} ${activeErrors.length === 1 ? 'piece of content is' : 'pieces of content are'} failing in production and affecting users.`
                      }
                      severity="warning"
                      ctaLabel="Review and fix"
                      onCtaClick={handleBannerReview}
                    />
                  )}

                  <ContentPageHeader
                    title="Content"
                    createButtonLabel="Create content"
                    tabs={[
                      { id: 'draft', label: 'Draft' },
                      { id: 'ready', label: 'Ready' },
                      { id: 'production', label: 'Production' },
                    ]}
                    defaultTabId={contentTab}
                    onTabChange={(tabId) => { setContentTab(tabId as ContentState); setContentFilterMode('all') }}
                    showSearch={true}
                    searchPlaceholder="Search content"
                    showFilter={false}
                    showViewToggle={false}
                    showCreateFolder={false}
                  />

                  {/* Health summary bar (always visible) */}
                  <div className={`health-summary-bar ${healthExpanded ? 'expanded' : ''}`}>
                    <div
                      className="health-summary-bar-header"
                      onClick={() => setHealthExpanded(!healthExpanded)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setHealthExpanded(!healthExpanded) }}
                    >
                      <div className="health-summary-bar-left">
                        {(hasHealthIssues || hasContentErrors) ? (
                          <>
                            <IconAlertTriangle size={16} stroke={1.5} className="health-summary-bar-icon warning" />
                            <span className="health-summary-bar-text">
                              {hasHealthIssues && hasContentErrors
                                ? <>{allUnresolved.length} affected by app update <span className="health-summary-bar-sep">&middot;</span> {activeErrors.length} failing in production</>
                                : hasHealthIssues
                                  ? <>{allUnresolved.length} content {allUnresolved.length === 1 ? 'item' : 'items'} affected by app update</>
                                  : <>{activeErrors.length} {activeErrors.length === 1 ? 'failure' : 'failures'} in production</>
                              }
                            </span>
                          </>
                        ) : (
                          <>
                            <IconCircleCheck size={16} stroke={1.5} className="health-summary-bar-icon healthy" />
                            <span className="health-summary-bar-text">
                              All content healthy <span className="health-summary-bar-sep">&middot;</span> Last check: {LAST_SCAN_DATE}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="health-summary-bar-right">
                        <button
                          className="health-check-btn"
                          onClick={(e) => { e.stopPropagation(); handleRunHealthCheck() }}
                        >
                          <IconRefresh size={14} stroke={1.5} />
                          Check for issues
                        </button>
                        {healthExpanded ? (
                          <IconChevronUp size={16} stroke={1.5} className="health-summary-bar-chevron" />
                        ) : (
                          <IconChevronDown size={16} stroke={1.5} className="health-summary-bar-chevron" />
                        )}
                      </div>
                    </div>

                    {/* Expanded diagnostics */}
                    {healthExpanded && (
                      <div className="health-summary-bar-body">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0 8px' }}>
                          <div className="content-health-toggle">
                            <button
                              className={`content-health-toggle-btn ${healthViewMode === 'element_health' ? 'active' : ''}`}
                              onClick={() => setHealthViewMode('element_health')}
                            >
                              <IconAlertTriangle size={14} stroke={1.5} />
                              Element health
                              {hasHealthIssues && (
                                <span className="content-health-badge warning">{allUnresolved.length}</span>
                              )}
                            </button>
                            <button
                              className={`content-health-toggle-btn ${healthViewMode === 'content_errors' ? 'active' : ''}`}
                              onClick={() => setHealthViewMode('content_errors')}
                            >
                              <IconAlertCircle size={14} stroke={1.5} />
                              Content errors
                              {hasContentErrors && (
                                <span className="content-health-badge critical">{activeErrors.length}</span>
                              )}
                            </button>
                          </div>

                          {hasHealthIssues && (
                            <button onClick={() => setShowEmailPreview(true)} className="health-check-btn">
                              <IconMail size={16} stroke={1.5} />
                              Email preview
                            </button>
                          )}
                        </div>

                        {healthViewMode === 'element_health' && (
                          <>
                            {hasHealthIssues && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0' }}>
                                <span className="cause-label cause-label-dom">Platform change</span>
                                <span style={{ fontSize: '12px', color: '#8C899F' }}>
                                  Detected via health scan on {LAST_SCAN_DATE} · {SCAN_APP_VERSION}
                                </span>
                              </div>
                            )}
                            {hasHealthIssues && (
                              <div style={{ paddingTop: '8px' }}>
                                <StatsSummary
                                  totalAffected={allUnresolved.length}
                                  misplacedCount={allUnresolved.filter(i => i.elementStatus === 'misplaced').length}
                                  notFoundCount={allUnresolved.filter(i => i.elementStatus === 'not_found').length}
                                  removedCount={allUnresolved.filter(i => i.elementStatus === 'removed').length}
                                  mode="action"
                                />
                              </div>
                            )}
                            <div style={{ padding: '12px 0', maxHeight: '320px', overflow: 'auto' }}>
                              {hasHealthIssues ? (
                                <ContentHealthTable
                                  issues={affectedItems.map((d): HealthIssue => ({ kind: 'dom', data: d }))}
                                  onAutoReselect={handleAutoReselect}
                                  onReselect={handleReselect}
                                  onReAuthor={handleReAuthor}
                                />
                              ) : (
                                <div style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  padding: '32px 0', color: '#198558', fontSize: '14px', fontWeight: 500,
                                }}>
                                  <IconCircleCheck size={18} stroke={1.5} style={{ marginRight: '6px' }} />
                                  All elements are healthy
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {healthViewMode === 'content_errors' && (
                          <>
                            {hasContentErrors && (
                              <div style={{ padding: '4px 0 0' }}>
                                <div className="content-errors-summary">
                                  <div className="content-errors-summary-stat">
                                    <span className="content-errors-summary-count">{activeErrors.length}</span>
                                    <span className="content-errors-summary-label">active errors</span>
                                  </div>
                                  <div className="content-errors-summary-divider" />
                                  <div className="content-errors-summary-stat">
                                    <span className="content-errors-summary-count critical">
                                      {activeErrors.filter(e => e.severity === 'critical').length}
                                    </span>
                                    <span className="content-errors-summary-label">critical</span>
                                  </div>
                                  <div className="content-errors-summary-stat">
                                    <span className="content-errors-summary-count warning">
                                      {activeErrors.filter(e => e.severity === 'warning').length}
                                    </span>
                                    <span className="content-errors-summary-label">warnings</span>
                                  </div>
                                  <div className="content-errors-summary-divider" />
                                  <div className="content-errors-summary-stat">
                                    <span className="content-errors-summary-count muted">
                                      {contentErrors.filter(e => e.status === 'ignored').length}
                                    </span>
                                    <span className="content-errors-summary-label">ignored</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div style={{ padding: '12px 0', maxHeight: '320px', overflow: 'auto' }}>
                              {contentErrors.length > 0 ? (
                                <ContentErrorsTable
                                  items={contentErrors}
                                  onOpenInStudio={handleOpenErrorInStudio}
                                  onIgnore={handleIgnoreError}
                                  onInvestigate={handleInvestigateError}
                                />
                              ) : (
                                <div style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  padding: '32px 0', color: '#198558', fontSize: '14px', fontWeight: 500,
                                }}>
                                  <IconCircleCheck size={18} stroke={1.5} style={{ marginRight: '6px' }} />
                                  No content errors
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Needs attention filter + content list (always visible in v2) */}
                  {needsAttentionCount > 0 && (
                    <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center' }}>
                      <div className="content-health-toggle">
                        <button
                          className={`content-health-toggle-btn ${contentFilterMode === 'all' ? 'active' : ''}`}
                          onClick={() => setContentFilterMode('all')}
                        >
                          All
                        </button>
                        <button
                          className={`content-health-toggle-btn ${contentFilterMode === 'needs_attention' ? 'active' : ''}`}
                          onClick={() => setContentFilterMode('needs_attention')}
                        >
                          Needs attention
                          <span className={`content-health-badge ${contentFilterMode === 'needs_attention' ? 'warning' : 'warning'}`}>{needsAttentionCount}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div style={{ flex: 1, padding: '16px 24px', overflow: 'auto' }}>
                    <ContentListTable
                      items={contentItemsForTab}
                      showStageColumn={false}
                      healthMap={healthMap}
                      selectedItems={selectedContentItems}
                      onSelectionChange={setSelectedContentItems}
                      onItemClick={(item) => console.log('Open:', item.name)}
                      onItemEdit={(item) => console.log('Edit:', item.name)}
                      onItemMenu={(item) => console.log('Menu:', item.name)}
                    />
                  </div>
                </>
              )}

              {/* ╌╌╌╌╌ v3: Drill-down health ╌╌╌╌╌ */}
              {designVersion === 'v3' && (
                <>
                  {/* ── List view (home base) ── */}
                  {contentViewMode !== 'health_detail' && (
                    <>
                      <ContentPageHeader
                        title="Content"
                        createButtonLabel="Create content"
                        tabs={[
                          { id: 'draft', label: 'Draft' },
                          { id: 'ready', label: 'Ready' },
                          { id: 'production', label: 'Production' },
                        ]}
                        defaultTabId={contentTab}
                        onTabChange={(tabId) => { setContentTab(tabId as ContentState); setContentFilterMode('all') }}
                        showSearch={true}
                        searchPlaceholder="Search content"
                        showFilter={false}
                        showViewToggle={false}
                        showCreateFolder={false}
                      />

                      {/* Health status card */}
                      <div
                        className={`health-status-card ${(hasHealthIssues || hasContentErrors) ? 'has-issues' : 'healthy'}`}
                        onClick={() => setContentViewMode('health_detail')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setContentViewMode('health_detail') }}
                      >
                        <div className="health-status-card-left">
                          {(hasHealthIssues || hasContentErrors) ? (
                            <>
                              <span
                                className="health-status-card-icon-wrap"
                                title={`${allUnresolved.length} content ${allUnresolved.length !== 1 ? 'items' : 'item'} affected by app update · ${activeErrors.length} failing in production · Last checked: ${LAST_SCAN_DATE}`}
                              >
                                <IconAlertTriangle size={16} stroke={1.5} className="health-status-card-icon warning" />
                              </span>
                              <span className="health-status-card-text">
                                {hasHealthIssues && hasContentErrors
                                  ? <>{allUnresolved.length} content {allUnresolved.length === 1 ? 'item' : 'items'} affected by app update<span className="health-status-card-sep">&middot;</span>{activeErrors.length} {activeErrors.length === 1 ? 'failure' : 'failures'} in production</>
                                  : hasHealthIssues
                                    ? <>{allUnresolved.length} content {allUnresolved.length === 1 ? 'item' : 'items'} affected by app update</>
                                    : <>{activeErrors.length} content {activeErrors.length === 1 ? 'failure' : 'failures'} in production</>
                                }
                              </span>
                            </>
                          ) : (
                            <>
                              <span
                                className="health-status-card-icon-wrap"
                                title={`Everything looks good · Last checked: ${LAST_SCAN_DATE} · Next check: ${NEXT_SCAN_DATE}`}
                              >
                                <IconCircleCheck size={16} stroke={1.5} className="health-status-card-icon healthy" />
                              </span>
                              <span className="health-status-card-text">All content running correctly <span className="health-status-card-sep">&middot;</span> Checked {LAST_SCAN_DATE}</span>
                            </>
                          )}
                        </div>
                        <div className="health-status-card-right">
                          <span className="health-status-card-link">View details</span>
                          <IconArrowRight size={14} stroke={1.5} />
                        </div>
                      </div>

                      <div style={{ flex: 1, padding: '16px 24px', overflow: 'auto' }}>
                        <ContentListTable
                          items={contentItemsByTab}
                          showStageColumn={false}
                          healthMap={healthMap}
                          selectedItems={selectedContentItems}
                          onSelectionChange={setSelectedContentItems}
                          onItemClick={(item) => console.log('Open:', item.name)}
                          onItemEdit={(item) => console.log('Edit:', item.name)}
                          onItemMenu={(item) => console.log('Menu:', item.name)}
                        />
                      </div>
                    </>
                  )}

                  {/* ── Health detail view (drill-down) ── */}
                  {contentViewMode === 'health_detail' && (
                    <>
                      <div className="content-page-header">
                        <div className="content-page-header-top">
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div
                              className="health-detail-breadcrumb"
                              onClick={() => setContentViewMode('list')}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setContentViewMode('list') }}
                            >
                              <IconArrowLeft size={14} stroke={2} />
                              <span>Content</span>
                            </div>
                            <h1 className="content-page-header-title">Content health</h1>
                          </div>
                          <div className="health-detail-actions">
                            <button onClick={handleRunHealthCheck} className="health-check-btn">
                              <IconRefresh size={16} stroke={1.5} />
                              Check for issues
                            </button>
                            {hasHealthIssues && (
                              <button onClick={() => setShowEmailPreview(true)} className="health-check-btn">
                                <IconMail size={16} stroke={1.5} />
                                Email preview
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="content-page-header-bottom" style={{ padding: '0 24px' }}>
                          <div className="health-detail-tabs">
                            <button
                              className={`health-detail-tab ${healthViewMode === 'element_health' ? 'active' : ''}`}
                              onClick={() => setHealthViewMode('element_health')}
                            >
                              Platform changes
                              {allUnresolved.length > 0 && <span className="health-tab-count">{allUnresolved.length}</span>}
                            </button>
                            <button
                              className={`health-detail-tab ${healthViewMode === 'content_errors' ? 'active' : ''}`}
                              onClick={() => setHealthViewMode('content_errors')}
                            >
                              Production failures
                              {activeErrors.length > 0 && <span className="health-tab-count health-tab-count-critical">{activeErrors.length}</span>}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ flex: 1, padding: '16px 24px 24px', overflow: 'auto' }}>
                        {healthLoading ? (
                          <div className="health-loading-skeleton">
                            <div className="health-skeleton-banner" />
                            <div className="health-skeleton-table">
                              <div className="health-skeleton-row" />
                              <div className="health-skeleton-row" />
                              <div className="health-skeleton-row" />
                              <div className="health-skeleton-row" />
                              <div className="health-skeleton-row" />
                            </div>
                          </div>
                        ) : null}
                        {!healthLoading && healthViewMode === 'element_health' && (() => {
                          const allDomResolved = !hasHealthIssues && affectedItems.length > 0
                          const noDomIssues = affectedItems.length === 0
                          const uniqueContent = new Set(allUnresolved.map(i => i.name)).size

                          if (noDomIssues) {
                            return (
                              <div className="health-proactive">
                                <div className="health-proactive-header">
                                  <IconCircleCheck size={28} stroke={1.5} className="health-proactive-icon" />
                                  <div>
                                    <p className="health-proactive-title">No issues found</p>
                                    <p className="health-proactive-desc">Your content is running correctly on the latest version of the app.</p>
                                  </div>
                                </div>
                                <div className="health-proactive-grid">
                                  <div className="health-proactive-card">
                                    <span className="health-proactive-label">Last checked</span>
                                    <span className="health-proactive-value">{LAST_SCAN_DATE}</span>
                                    <span className="health-proactive-sub">All clear</span>
                                  </div>
                                  <div className="health-proactive-card">
                                    <span className="health-proactive-label">Next check</span>
                                    <span className="health-proactive-value">{NEXT_SCAN_DATE}</span>
                                    <span className="health-proactive-sub">Automatic</span>
                                  </div>
                                  <div className="health-proactive-card">
                                    <span className="health-proactive-label">App version</span>
                                    <span className="health-proactive-value">{SCAN_APP_VERSION}</span>
                                    <span className="health-proactive-sub">{mockContentItems.length} items monitored</span>
                                  </div>
                                </div>
                                <p className="health-proactive-hint">
                                  Tip: Run a health check after each app deployment to catch issues early.
                                </p>
                              </div>
                            )
                          }

                          if (allDomResolved) {
                            return (
                              <div className="health-resolved-state">
                                <div className="health-resolved-header">
                                  <IconCircleCheck size={24} stroke={1.5} className="health-resolved-icon" />
                                  <div>
                                    <p className="health-resolved-title">All issues resolved</p>
                                    <p className="health-resolved-desc">{affectedItems.length} {affectedItems.length === 1 ? 'item' : 'items'} fixed · Checked {LAST_SCAN_DATE}</p>
                                  </div>
                                </div>
                                <button
                                  className="health-resolved-toggle"
                                  onClick={() => setShowResolvedDom(!showResolvedDom)}
                                >
                                  {showResolvedDom ? 'Hide' : 'Show'} fixed items ({affectedItems.length})
                                  {showResolvedDom ? <IconChevronUp size={14} stroke={2} /> : <IconChevronDown size={14} stroke={2} />}
                                </button>
                                {showResolvedDom && (
                                  <div style={{ marginTop: 16 }}>
                                    <ContentHealthTable
                                      issues={affectedItems.map((d): HealthIssue => ({ kind: 'dom', data: d }))}
                                      onAutoReselect={handleAutoReselect}
                                      onReselect={handleReselect}
                                      onReAuthor={handleReAuthor}
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          }

                          return (
                            <>
                              <div className="health-context-banner">
                                <IconAlertTriangle size={16} stroke={1.5} className="health-context-icon" />
                                <div className="health-context-text">
                                  <span className="health-context-title">
                                    {SCAN_APP_VERSION} update on {LAST_SCAN_DATE} affected your content
                                  </span>
                                  <span className="health-context-desc">
                                    {allUnresolved.length} {allUnresolved.length === 1 ? 'element' : 'elements'} across {uniqueContent} content {uniqueContent === 1 ? 'item' : 'items'} may not display correctly. Fixes are saved as draft until you push to production.
                                  </span>
                                </div>
                              </div>
                              <div style={{ marginTop: 16 }}>
                                <ContentHealthTable
                                  issues={affectedItems.map((d): HealthIssue => ({ kind: 'dom', data: d }))}
                                  onAutoReselect={handleAutoReselect}
                                  onReselect={handleReselect}
                                  onReAuthor={handleReAuthor}
                                />
                              </div>
                            </>
                          )
                        })()}

                        {!healthLoading && healthViewMode === 'content_errors' && (() => {
                          const allErrorsResolved = !hasContentErrors && contentErrors.length > 0
                          const noErrors = contentErrors.length === 0
                          const criticalCount = activeErrors.filter(e => e.severity === 'critical').length
                          const warningCount = activeErrors.filter(e => e.severity === 'warning').length
                          const totalAffectedUsers = activeErrors.reduce((sum, e) => sum + (e.affectedUsers ?? 0), 0)

                          if (noErrors) {
                            return (
                              <div className="health-detail-empty">
                                <IconCircleCheck size={32} stroke={1.5} />
                                <p className="health-detail-empty-title">No failures detected</p>
                                <p className="health-detail-empty-desc">All content is running correctly in production</p>
                              </div>
                            )
                          }

                          if (allErrorsResolved) {
                            return (
                              <div className="health-resolved-state">
                                <div className="health-resolved-header">
                                  <IconCircleCheck size={24} stroke={1.5} className="health-resolved-icon" />
                                  <div>
                                    <p className="health-resolved-title">All failures resolved</p>
                                    <p className="health-resolved-desc">{contentErrors.length} {contentErrors.length === 1 ? 'issue' : 'issues'} fixed</p>
                                  </div>
                                </div>
                                <button
                                  className="health-resolved-toggle"
                                  onClick={() => setShowResolvedErrors(!showResolvedErrors)}
                                >
                                  {showResolvedErrors ? 'Hide' : 'Show'} fixed items ({contentErrors.length})
                                  {showResolvedErrors ? <IconChevronUp size={14} stroke={2} /> : <IconChevronDown size={14} stroke={2} />}
                                </button>
                                {showResolvedErrors && (
                                  <div style={{ marginTop: 16 }}>
                                    <ContentHealthTable
                                      issues={contentErrors.map((d): HealthIssue => ({ kind: 'error', data: d }))}
                                      onOpenInStudio={handleOpenErrorInStudio}
                                      onIgnore={handleIgnoreError}
                                      onInvestigate={handleInvestigateError}
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          }

                          return (
                            <>
                              <div className="health-context-banner health-context-critical">
                                <IconAlertCircle size={16} stroke={1.5} className="health-context-icon" />
                                <div className="health-context-text">
                                  <span className="health-context-title">
                                    {activeErrors.length} {activeErrors.length === 1 ? 'item is' : 'items are'} failing for users in production
                                  </span>
                                  <span className="health-context-desc">
                                    {criticalCount > 0 && <>{criticalCount} critical</>}
                                    {criticalCount > 0 && warningCount > 0 && <> · </>}
                                    {warningCount > 0 && <>{warningCount} {warningCount === 1 ? 'needs' : 'need'} review</>}
                                    {totalAffectedUsers > 0 && <> · {totalAffectedUsers.toLocaleString()} users impacted</>}
                                  </span>
                                </div>
                              </div>
                              <div style={{ marginTop: 16 }}>
                                <ContentHealthTable
                                  issues={contentErrors.map((d): HealthIssue => ({ kind: 'error', data: d }))}
                                  onOpenInStudio={handleOpenErrorInStudio}
                                  onIgnore={handleIgnoreError}
                                  onInvestigate={handleInvestigateError}
                                />
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {/* Show ContentPageHeader for Mirror Workflows */}
          {currentProduct === 'mirror' && activeNavItem === 'workflows' && (
            <>
              <ContentPageHeader
                title="Workflows"
                showCreateButton={false}
                tabs={[
                  { id: 'draft', label: 'Draft' },
                  { id: 'ready', label: 'Ready' },
                  { id: 'production', label: 'Production' },
                ]}
                defaultTabId={workflowsTab}
                onTabChange={setWorkflowsTab}
                primaryAction={{
                  label: 'Create simulation',
                  icon: <IconFolderPlus size={20} stroke={2} />,
                  onClick: () => console.log('Create simulation clicked'),
                }}
                searchPlaceholder="Search folders"
                showCreateFolder={false}
              />
              {workflowsTab === 'production' && (
                <div style={{ flex: 1, padding: '16px 24px', overflow: 'auto' }}>
                  <WorkflowsTable
                    items={sampleWorkflowItems}
                    totalItems={120}
                    currentPage={workflowsPage}
                    itemsPerPage={15}
                    onPageChange={setWorkflowsPage}
                    selectedItems={selectedWorkflows}
                    onSelectionChange={setSelectedWorkflows}
                    onItemClick={(item) => console.log('Clicked:', item)}
                    onItemEdit={(item) => console.log('Edit:', item)}
                    onItemMenu={(item) => console.log('Menu:', item)}
                  />
                </div>
              )}
            </>
          )}

          {/* ═══════════ PAGE: Content health (dedicated sidebar tab) ═══════════ */}
          {isGuidanceContentHealth && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="content-page-header">
                <div className="content-page-header-top" style={{ padding: '16px 24px 0' }}>
                  <h1 className="content-page-header-title">Content health</h1>
                  <div className="health-detail-actions">
                    <button onClick={handleRunHealthCheck} className="health-check-btn">
                      <IconRefresh size={16} stroke={1.5} />
                      Check for issues
                    </button>
                    {hasHealthIssues && (
                      <button onClick={() => setShowEmailPreview(true)} className="health-check-btn">
                        <IconMail size={16} stroke={1.5} />
                        Email preview
                      </button>
                    )}
                  </div>
                </div>
                <div className="content-page-header-bottom" style={{ padding: '0 24px' }}>
                  <div className="health-detail-tabs">
                    <button
                      className={`health-detail-tab ${healthViewMode === 'element_health' ? 'active' : ''}`}
                      onClick={() => setHealthViewMode('element_health')}
                    >
                      Platform changes
                      {allUnresolved.length > 0 && <span className="health-tab-count">{allUnresolved.length}</span>}
                    </button>
                    <button
                      className={`health-detail-tab ${healthViewMode === 'content_errors' ? 'active' : ''}`}
                      onClick={() => setHealthViewMode('content_errors')}
                    >
                      Production failures
                      {activeErrors.length > 0 && <span className="health-tab-count health-tab-count-critical">{activeErrors.length}</span>}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, padding: '16px 24px 24px', overflow: 'auto' }}>
                {healthViewMode === 'element_health' && (() => {
                  const allDomResolved = !hasHealthIssues && affectedItems.length > 0
                  const noDomIssues = affectedItems.length === 0
                  const uniqueContent = new Set(allUnresolved.map(i => i.name)).size

                  if (noDomIssues) {
                    return (
                      <div className="health-proactive">
                        <div className="health-proactive-header">
                          <IconCircleCheck size={28} stroke={1.5} className="health-proactive-icon" />
                          <div>
                            <p className="health-proactive-title">No issues found</p>
                            <p className="health-proactive-desc">Your content is running correctly on the latest version of the app.</p>
                          </div>
                        </div>
                        <div className="health-proactive-grid">
                          <div className="health-proactive-card">
                            <span className="health-proactive-label">Last checked</span>
                            <span className="health-proactive-value">{LAST_SCAN_DATE}</span>
                            <span className="health-proactive-sub">All clear</span>
                          </div>
                          <div className="health-proactive-card">
                            <span className="health-proactive-label">Next check</span>
                            <span className="health-proactive-value">{NEXT_SCAN_DATE}</span>
                            <span className="health-proactive-sub">Automatic</span>
                          </div>
                          <div className="health-proactive-card">
                            <span className="health-proactive-label">App version</span>
                            <span className="health-proactive-value">{SCAN_APP_VERSION}</span>
                            <span className="health-proactive-sub">{mockContentItems.length} items monitored</span>
                          </div>
                        </div>
                        <p className="health-proactive-hint">
                          Tip: Run a health check after each app deployment to catch issues early.
                        </p>
                      </div>
                    )
                  }

                  if (allDomResolved) {
                    return (
                      <div className="health-resolved-state">
                        <div className="health-resolved-header">
                          <IconCircleCheck size={24} stroke={1.5} className="health-resolved-icon" />
                          <div>
                            <p className="health-resolved-title">All issues resolved</p>
                            <p className="health-resolved-desc">{affectedItems.length} {affectedItems.length === 1 ? 'item' : 'items'} fixed · Checked {LAST_SCAN_DATE}</p>
                          </div>
                        </div>
                        <button
                          className="health-resolved-toggle"
                          onClick={() => setShowResolvedDom(!showResolvedDom)}
                        >
                          {showResolvedDom ? 'Hide' : 'Show'} fixed items ({affectedItems.length})
                          {showResolvedDom ? <IconChevronUp size={14} stroke={2} /> : <IconChevronDown size={14} stroke={2} />}
                        </button>
                        {showResolvedDom && (
                          <div style={{ marginTop: 16, width: '100%' }}>
                            <ContentHealthTable
                              issues={affectedItems.map((d): HealthIssue => ({ kind: 'dom', data: d }))}
                              onAutoReselect={handleAutoReselect}
                              onReselect={handleReselect}
                              onReAuthor={handleReAuthor}
                            />
                          </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <>
                      <div className="health-context-banner">
                        <IconAlertTriangle size={16} stroke={1.5} className="health-context-icon" />
                        <div className="health-context-text">
                          <span className="health-context-title">
                            {SCAN_APP_VERSION} update on {LAST_SCAN_DATE} affected your content
                          </span>
                          <span className="health-context-desc">
                            {allUnresolved.length} {allUnresolved.length === 1 ? 'element' : 'elements'} across {uniqueContent} content {uniqueContent === 1 ? 'item' : 'items'} may not display correctly. Fixes are saved as draft until you push to production.
                          </span>
                        </div>
                      </div>
                      <div style={{ marginTop: 16 }}>
                        <ContentHealthTable
                          issues={affectedItems.map((d): HealthIssue => ({ kind: 'dom', data: d }))}
                          onAutoReselect={handleAutoReselect}
                          onReselect={handleReselect}
                          onReAuthor={handleReAuthor}
                        />
                      </div>
                    </>
                  )
                })()}

                {healthViewMode === 'content_errors' && (() => {
                  const allErrorsResolved = !hasContentErrors && contentErrors.length > 0
                  const noErrors = contentErrors.length === 0
                  const criticalCount = activeErrors.filter(e => e.severity === 'critical').length
                  const warningCount = activeErrors.filter(e => e.severity === 'warning').length
                  const totalAffectedUsers = activeErrors.reduce((sum, e) => sum + (e.affectedUsers ?? 0), 0)

                  if (noErrors) {
                    return (
                      <div className="health-detail-empty">
                        <IconCircleCheck size={32} stroke={1.5} />
                        <p className="health-detail-empty-title">No failures detected</p>
                        <p className="health-detail-empty-desc">All content is running correctly in production</p>
                      </div>
                    )
                  }

                  if (allErrorsResolved) {
                    return (
                      <div className="health-resolved-state">
                        <div className="health-resolved-header">
                          <IconCircleCheck size={24} stroke={1.5} className="health-resolved-icon" />
                          <div>
                            <p className="health-resolved-title">All failures resolved</p>
                            <p className="health-resolved-desc">{contentErrors.length} {contentErrors.length === 1 ? 'issue' : 'issues'} fixed</p>
                          </div>
                        </div>
                        <button
                          className="health-resolved-toggle"
                          onClick={() => setShowResolvedErrors(!showResolvedErrors)}
                        >
                          {showResolvedErrors ? 'Hide' : 'Show'} fixed items ({contentErrors.length})
                          {showResolvedErrors ? <IconChevronUp size={14} stroke={2} /> : <IconChevronDown size={14} stroke={2} />}
                        </button>
                        {showResolvedErrors && (
                          <div style={{ marginTop: 16, width: '100%' }}>
                            <ContentHealthTable
                              issues={contentErrors.map((d): HealthIssue => ({ kind: 'error', data: d }))}
                              onOpenInStudio={handleOpenErrorInStudio}
                              onIgnore={handleIgnoreError}
                              onInvestigate={handleInvestigateError}
                            />
                          </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <>
                      <div className="health-context-banner health-context-critical">
                        <IconAlertCircle size={16} stroke={1.5} className="health-context-icon" />
                        <div className="health-context-text">
                          <span className="health-context-title">
                            {activeErrors.length} {activeErrors.length === 1 ? 'item is' : 'items are'} failing for users in production
                          </span>
                          <span className="health-context-desc">
                            {criticalCount > 0 && <>{criticalCount} critical</>}
                            {criticalCount > 0 && warningCount > 0 && <> · </>}
                            {warningCount > 0 && <>{warningCount} {warningCount === 1 ? 'needs' : 'need'} review</>}
                            {totalAffectedUsers > 0 && <> · {totalAffectedUsers.toLocaleString()} users impacted</>}
                          </span>
                        </div>
                      </div>
                      <div style={{ marginTop: 16 }}>
                        <ContentHealthTable
                          issues={contentErrors.map((d): HealthIssue => ({ kind: 'error', data: d }))}
                          onOpenInStudio={handleOpenErrorInStudio}
                          onIgnore={handleIgnoreError}
                          onInvestigate={handleInvestigateError}
                        />
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          {/* ═══════════ Widgets health banner ═══════════ */}
          {isGuidanceWidgets && hasWidgetIssues && (
            <NotificationBanner
              message={`${widgetUnresolved.length + widgetErrors.length} widget issues need attention — review element health and content errors.`}
              severity="warning"
              ctaLabel="Review in Content health"
              onCtaClick={handleBannerReview}
            />
          )}

          {/* Empty state for other pages */}
          {!isGuidanceContent && !(currentProduct === 'mirror' && activeNavItem === 'workflows' && workflowsTab === 'production') && (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
            }}>
              <div style={{ width: '200px', height: '160px', marginBottom: '24px', opacity: 0.6 }}>
                <EmptyStateIllustration />
              </div>
              <p style={{ fontSize: '15px', color: '#7B7891' }}>
                Select an item from the sidebar to get started
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Floating design version switcher */}
      <div className="design-version-switcher">
        <span className="design-version-label">Design version</span>
        <div className="design-version-toggle">
          <button
            className={`design-version-btn ${designVersion === 'v1' ? 'active' : ''}`}
            onClick={() => { setDesignVersion('v1'); setContentViewMode('list') }}
          >
            v1
          </button>
          <button
            className={`design-version-btn ${designVersion === 'v2' ? 'active' : ''}`}
            onClick={() => { setDesignVersion('v2'); setContentViewMode('list') }}
          >
            v2
          </button>
          <button
            className={`design-version-btn ${designVersion === 'v3' ? 'active' : ''}`}
            onClick={() => { setDesignVersion('v3'); setContentViewMode('list') }}
          >
            v3
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

function EmptyStateIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="160" height="110" rx="8" fill="#F6F6F9" stroke="#ECECF3" strokeWidth="2" />
      <rect x="35" y="35" width="60" height="8" rx="2" fill="#DFDDE7" />
      <rect x="35" y="50" width="130" height="5" rx="1.5" fill="#ECECF3" />
      <rect x="35" y="60" width="100" height="5" rx="1.5" fill="#ECECF3" />
      <rect x="35" y="75" width="55" height="40" rx="4" fill="#ECECF3" />
      <rect x="100" y="75" width="55" height="40" rx="4" fill="#ECECF3" />
      <circle cx="62" cy="90" r="8" fill="#DFDDE7" />
      <circle cx="127" cy="90" r="8" fill="#E45913" opacity="0.6" />
      <rect x="50" y="103" width="25" height="4" rx="1" fill="#DFDDE7" />
      <rect x="115" y="103" width="25" height="4" rx="1" fill="#DFDDE7" />
    </svg>
  )
}

export default App
