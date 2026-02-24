import { FileText, Mail, Share2 } from 'lucide-react'
import type { ToolType } from '../types'

interface Tab {
  id: ToolType
  label: string
  icon: React.ReactNode
  description: string
}

const tabs: Tab[] = [
  {
    id: 'blog-outline',
    label: 'Blog Outline',
    icon: <FileText size={18} />,
    description: 'Generate structured blog outlines',
  },
  {
    id: 'email-rewrite',
    label: 'Email Rewriter',
    icon: <Mail size={18} />,
    description: 'Rewrite emails with a new tone',
  },
  {
    id: 'social-post',
    label: 'Social Posts',
    icon: <Share2 size={18} />,
    description: 'Create platform-specific posts',
  },
]

interface TabNavigationProps {
  activeTab: ToolType
  onTabChange: (tab: ToolType) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`group flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
            activeTab === tab.id
              ? 'glass glow text-primary-300 shadow-lg'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          <span
            className={`transition-colors duration-300 ${
              activeTab === tab.id ? 'text-primary-400' : 'text-gray-500 group-hover:text-gray-300'
            }`}
          >
            {tab.icon}
          </span>
          <div className="text-left">
            <div>{tab.label}</div>
            <div
              className={`text-xs font-normal transition-colors duration-300 ${
                activeTab === tab.id ? 'text-primary-400/70' : 'text-gray-600'
              } hidden sm:block`}
            >
              {tab.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
