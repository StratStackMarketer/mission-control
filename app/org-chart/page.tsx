'use client'

import React, { useEffect, useState } from 'react'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Clock, Users } from 'lucide-react'

interface Agent {
  sessionKey: string
  label?: string
  role?: string
  status?: 'active' | 'idle' | 'error'
  model?: string
  tokensUsed?: number
  description?: string
  parentAgent?: string
  subAgents?: string[]
  lastActive?: number
}

interface AgentFleet {
  main: Agent
  subAgents: Agent[]
}

type StatusType = 'active' | 'idle' | 'error'

export default function OrgChartPage() {
  const [fleet, setFleet] = useState<AgentFleet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAgentFleet = async () => {
    try {
      const res = await fetch('/api/gateway/sessions')
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`)
      }
      const sessions = await res.json()

      // Parse sessions into fleet structure
      const agents = sessions.map((session: any) => ({
        sessionKey: session.sessionKey || '',
        label: session.label || extractAgentName(session.sessionKey),
        role: session.role || inferRole(session.sessionKey),
        status: inferStatus(session),
        model: session.model,
        tokensUsed: session.tokens || 0,
        description: getAgentDescription(session.sessionKey),
        lastActive: session.lastActive || Date.now(),
      }))

      // Identify main agent (usually the first one or one with specific criteria)
      const mainAgent = agents.find((a: Agent) => 
        a.label?.toLowerCase().includes('main') || 
        a.label?.toLowerCase().includes('kai') ||
        a.sessionKey.includes('main')
      ) || agents[0]

      const subAgents = agents.filter((a: Agent) => a.sessionKey !== mainAgent.sessionKey)

      setFleet({ main: mainAgent, subAgents })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Failed to fetch agent fleet:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgentFleet()
    const interval = setInterval(fetchAgentFleet, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!loading && fleet) {
      setLastUpdated(new Date())
    }
  }, [loading, fleet])

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
      case 'idle':
        return <Clock className="w-5 h-5 text-[#F59E0B]" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#EF4444]" />
      default:
        return <Clock className="w-5 h-5 text-[#6B7280]" />
    }
  }

  const getStatusBadgeVariant = (status: StatusType) => {
    switch (status) {
      case 'active':
        return 'done'
      case 'idle':
        return 'in_progress'
      case 'error':
        return 'blocked'
      default:
        return 'default'
    }
  }

  if (loading && !fleet) {
    return (
      <div className="min-h-screen bg-[#F7F7FB]">
        <div className="bg-white border-b border-[#EEEEEE] sticky top-0 z-40">
          <div className="h-14 px-6 flex items-center">
            <h1 className="text-[28px] font-bold text-[#1A1A2E]">Agent Fleet</h1>
          </div>
        </div>
        <div className="px-8 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-[#5B4EE8] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#6B7280]">Loading agent fleet...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F7FB]">
      {/* Header */}
      <div className="bg-white border-b border-[#EEEEEE] sticky top-0 z-40">
        <div className="h-14 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#1A1A2E]">Agent Fleet</h1>
          </div>
          {lastUpdated && (
            <div className="text-xs text-[#9CA3AF]">
              Updated {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="stat-card">
            <Users className="w-6 h-6 text-[#5B4EE8]" />
            <div>
              <div className="text-sm text-[#6B7280]">Total Agents</div>
              <div className="text-2xl font-semibold text-[#1A1A2E]">
                {fleet ? 1 + (fleet.subAgents?.length || 0) : 0}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
            </div>
            <div>
              <div className="text-sm text-[#6B7280]">Active Agents</div>
              <div className="text-2xl font-semibold text-[#1A1A2E]">
                {fleet ? [fleet.main, ...(fleet.subAgents || [])].filter(a => a.status === 'active').length : 0}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-[#FEE2E2] border border-[#FCA5A5] rounded-lg p-4 mb-6 text-[#991B1B]">
            <p className="font-medium">Error loading agent fleet:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Fleet Hierarchy */}
        {fleet && (
          <div className="space-y-8">
            {/* Main Agent */}
            <div>
              <div className="text-sm font-semibold text-[#6B7280] mb-4 uppercase tracking-wide">Primary Agent</div>
              <MainAgentCard agent={fleet.main} getStatusIcon={getStatusIcon} getStatusBadgeVariant={getStatusBadgeVariant} />
            </div>

            {/* Sub Agents */}
            {fleet.subAgents && fleet.subAgents.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-[#6B7280] mb-4 uppercase tracking-wide flex items-center gap-2">
                  <div className="flex-1 h-px bg-[#E5E7EB]"></div>
                  Sub-Agents ({fleet.subAgents.length})
                  <div className="flex-1 h-px bg-[#E5E7EB]"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fleet.subAgents.map((agent) => (
                    <SubAgentCard 
                      key={agent.sessionKey}
                      agent={agent}
                      getStatusIcon={getStatusIcon}
                      getStatusBadgeVariant={getStatusBadgeVariant}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!fleet.subAgents || fleet.subAgents.length === 0) && (
              <div className="text-center py-12">
                <p className="text-[#6B7280]">No sub-agents currently active</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface MainAgentCardProps {
  agent: Agent
  getStatusIcon: (status: StatusType) => JSX.Element
  getStatusBadgeVariant: (status: StatusType) => string
}

function MainAgentCard({ agent, getStatusIcon, getStatusBadgeVariant }: MainAgentCardProps) {
  return (
    <GlassCard className="bg-gradient-to-br from-[#F0EFFE] to-white border-[#DDD6FE]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-[#1A1A2E]">{agent.label || 'Unknown Agent'}</h2>
                {agent.status && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(agent.status as StatusType)}
                    <Badge variant={getStatusBadgeVariant(agent.status as StatusType) as any}>
                      {agent.status}
                    </Badge>
                  </div>
                )}
              </div>
              {agent.role && (
                <p className="text-sm font-medium text-[#5B4EE8]">{agent.role}</p>
              )}
            </div>
          </div>

          {agent.description && (
            <p className="text-sm text-[#6B7280] leading-relaxed">
              {agent.description}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {agent.model && (
            <div className="bg-white rounded-lg p-3 border border-[#E5E7EB]">
              <div className="text-xs text-[#9CA3AF] mb-1">Model</div>
              <div className="text-sm font-medium text-[#1A1A2E] truncate">{agent.model}</div>
            </div>
          )}
          
          {agent.tokensUsed !== undefined && (
            <div className="bg-white rounded-lg p-3 border border-[#E5E7EB]">
              <div className="text-xs text-[#9CA3AF] mb-1">Tokens Used</div>
              <div className="text-sm font-medium text-[#1A1A2E]">
                {agent.tokensUsed.toLocaleString()}
              </div>
            </div>
          )}

          {agent.sessionKey && (
            <div className="bg-white rounded-lg p-3 border border-[#E5E7EB]">
              <div className="text-xs text-[#9CA3AF] mb-1">Session ID</div>
              <div className="text-xs font-mono text-[#6B7280] break-all">
                {agent.sessionKey.substring(0, 16)}...
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  )
}

interface SubAgentCardProps {
  agent: Agent
  getStatusIcon: (status: StatusType) => JSX.Element
  getStatusBadgeVariant: (status: StatusType) => string
}

function SubAgentCard({ agent, getStatusIcon, getStatusBadgeVariant }: SubAgentCardProps) {
  return (
    <GlassCard>
      <GlassCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <GlassCardTitle>{agent.label || 'Unknown'}</GlassCardTitle>
              {agent.status && getStatusIcon(agent.status as StatusType)}
            </div>
            {agent.role && (
              <GlassCardDescription className="!mt-1">{agent.role}</GlassCardDescription>
            )}
          </div>
          {agent.status && (
            <Badge variant={getStatusBadgeVariant(agent.status as StatusType) as any} className="ml-2 flex-shrink-0">
              {agent.status}
            </Badge>
          )}
        </div>
      </GlassCardHeader>

      <GlassCardContent className="space-y-2">
        {agent.description && (
          <p className="text-xs text-[#6B7280] line-clamp-2">
            {agent.description}
          </p>
        )}
        
        {agent.model && (
          <div className="text-xs text-[#9CA3AF]">
            <span className="font-medium">Model:</span> {agent.model}
          </div>
        )}

        {agent.tokensUsed !== undefined && (
          <div className="text-xs text-[#9CA3AF]">
            <span className="font-medium">Tokens:</span> {agent.tokensUsed.toLocaleString()}
          </div>
        )}
      </GlassCardContent>
    </GlassCard>
  )
}

// Helper functions
function extractAgentName(sessionKey: string): string {
  // Try to extract a meaningful name from the session key
  const parts = sessionKey.split(':').filter(p => p.length > 0)
  if (parts.length >= 3) {
    return parts[2].charAt(0).toUpperCase() + parts[2].slice(1)
  }
  return sessionKey.substring(0, 12)
}

function inferRole(sessionKey: string): string {
  if (sessionKey.includes('main')) return 'Primary Orchestrator'
  if (sessionKey.includes('api')) return 'API Integration'
  if (sessionKey.includes('lead')) return 'Lead Generation'
  if (sessionKey.includes('audit')) return 'Quality Auditor'
  if (sessionKey.includes('content')) return 'Content Creator'
  if (sessionKey.includes('social')) return 'Social Media'
  return 'Agent'
}

function inferStatus(session: any): StatusType {
  // Determine status based on activity and errors
  if (session.error) return 'error'
  if (!session.lastActive) return 'idle'
  
  const timeSinceActive = Date.now() - (session.lastActive || Date.now())
  const fiveMinutes = 5 * 60 * 1000
  
  if (timeSinceActive < fiveMinutes) return 'active'
  return 'idle'
}

function getAgentDescription(sessionKey: string): string {
  const descriptionMap: Record<string, string> = {
    'main': 'Primary agent orchestrating the fleet. Handles strategic decisions and multi-agent coordination.',
    'lead': 'Autonomous lead generation agent. Performs prospect research and outreach automation.',
    'audit': 'Quality assurance agent. Reviews work, validates processes, and ensures standards compliance.',
    'content': 'Content creation agent. Generates marketing copy, documentation, and creative assets.',
    'social': 'Social media automation agent. Manages posting, engagement, and analytics across platforms.',
    'api': 'API integration agent. Handles third-party service connections and data synchronization.',
  }

  for (const [key, desc] of Object.entries(descriptionMap)) {
    if (sessionKey.toLowerCase().includes(key)) {
      return desc
    }
  }

  return 'Autonomous sub-agent in the fleet.'
}
