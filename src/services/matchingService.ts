export interface UserActivityChoice {
  activityId: string
  userId: string
  choice: 'selected' | 'love' | 'like' | 'pass'
  activityName?: string | null
  activityIcon?: string | null
  activitySlug?: string | null
}

export interface MatchResult {
  matchedActivities: {
    activityId: string
    name: string
    icon: string
    creatorChoice: string
    responderChoice: 'love' | 'like'
  }[]
  unmatchedActivities: {
    activityId: string
    name: string
    icon: string
    reason: 'declined' | 'creator_only'
  }[]
}

export const matchingService = {
  calculateMatches(
    creatorId: string,
    allChoices: UserActivityChoice[]
  ): MatchResult {
    // 1. Get creator's selections
    const creatorSelected = allChoices.filter(
      (c) => c.userId === creatorId && c.choice === 'selected'
    )

    // 2. Get responder's reactions
    const responderChoices = allChoices.filter((c) => c.userId !== creatorId)
    const responderChoiceMap = new Map(
      responderChoices.map((c) => [c.activityId, c.choice])
    )

    const matchedActivities: MatchResult['matchedActivities'] = []
    const unmatchedActivities: MatchResult['unmatchedActivities'] = []

    for (const c of creatorSelected) {
      const respChoice = responderChoiceMap.get(c.activityId)
      const name = c.activityName || c.activityId
      const icon = c.activityIcon || '✨'

      if (respChoice === 'love' || respChoice === 'like') {
        matchedActivities.push({
          activityId: c.activityId,
          name,
          icon,
          creatorChoice: 'selected',
          responderChoice: respChoice,
        })
      } else if (respChoice === 'pass') {
        unmatchedActivities.push({
          activityId: c.activityId,
          name,
          icon,
          reason: 'declined',
        })
      } else {
        // Responder hasn't voted yet or skipped
        unmatchedActivities.push({
          activityId: c.activityId,
          name,
          icon,
          reason: 'creator_only',
        })
      }
    }

    return {
      matchedActivities,
      unmatchedActivities,
    }
  },
}
