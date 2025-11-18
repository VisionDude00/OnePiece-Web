/**
 * Spoiler management types for the One Piece episode-by-episode site
 *
 * Architecture:
 * - PRIMARY FILTER: Episode/Chapter progress (what user has watched/read)
 * - SECONDARY FILTER: Severity (user preference for spoiler sensitivity)
 * - MediaType is tracked separately for organizational purposes
 */

/**
 * Spoiler severity levels - indicates how impactful the reveal is
 *
 * This is used as a SECONDARY filter after episode/chapter progress.
 * Users can choose to hide higher severity spoilers even if they've watched the content.
 */
export enum SpoilerSeverity {
  /** Minor background information, character names, basic facts */
  MINOR = 'minor',
  /** Important reveals, power-ups, significant plot developments */
  MAJOR = 'major',
  /** Major character deaths, key relationship reveals, arc-defining moments */
  CRITICAL = 'critical',
  /** Series-defining moments (e.g., Ace's death, Gear 5/Nika reveal, One Piece truth) */
  ULTRA_SECRET = 'ultra-secret',
}

/**
 * Media type classification - tracks where content originates
 *
 * NOTE: This is NOT used as a filter. Episode/chapter progress is the filter.
 * This is metadata for organizational and display purposes.
 */
export enum MediaType {
  /** TV anime episode content */
  ANIME = 'anime',
  /** Manga chapter content */
  MANGA = 'manga',
  /** One Piece movies */
  MOVIE = 'movie',
  /** Special episodes, OVAs */
  SPECIAL = 'special',
  /** Cover stories, SBS, vivre cards */
  SUPPLEMENTARY = 'supplementary',
}

/**
 * Content tagging categories
 */
export enum ContentTag {
  SAGA = 'saga',
  ARC = 'arc',
  CHARACTER = 'character',
  LORE = 'lore',
  POWER = 'power',
  LOCATION = 'location',
  FANART = 'fanart',
  THEORY = 'theory',
  NEWS = 'news',
}

/**
 * User's spoiler preferences for content filtering
 *
 * FILTERING HIERARCHY:
 * 1. PRIMARY: lastWatchedEpisode / lastReadChapter (required)
 * 2. SECONDARY: maxSeverity (optional, defaults to show all)
 */
export interface SpoilerPreferences {
  // ============================================
  // PRIMARY FILTERS - What content user has consumed
  // ============================================

  /** Last anime episode the user has watched (PRIMARY FILTER) */
  lastWatchedEpisode?: number;

  /** Last manga chapter the user has read (PRIMARY FILTER) */
  lastReadChapter?: number;

  // ============================================
  // SECONDARY FILTER - Spoiler sensitivity preference
  // ============================================

  /**
   * Maximum severity level the user wants to see (SECONDARY FILTER)
   * Default: ULTRA_SECRET (show all severity levels)
   *
   * Even if user has watched an episode, they can choose to hide high-severity content.
   * Example: User watched episode 500 but sets maxSeverity to MAJOR - won't see CRITICAL/ULTRA_SECRET events
   */
  maxSeverity: SpoilerSeverity;

  // ============================================
  // UI Preferences
  // ============================================

  /** Whether to show spoiler warnings before revealing content */
  showSpoilerWarnings: boolean;

  /** Whether to auto-unmask spoilers on hover */
  autoUnmaskOnHover: boolean;

  /**
   * Automatically update maxSeverity when user marks episode as watched
   * If true: Watching episode auto-reveals all severity levels for that episode
   * If false: User must manually increase maxSeverity
   */
  autoRevealWhenWatched: boolean;

  /** Show extra confirmation dialog before revealing CRITICAL or ULTRA_SECRET content */
  warnBeforeCritical: boolean;

  // ============================================
  // Content-Specific Filters (optional)
  // ============================================

  /** Hide character deaths even if user has watched the content */
  hideDeaths: boolean;

  /** Hide character bounty reveals */
  hideBounties: boolean;

  /** Hide character relationship reveals (family, romantic, etc.) */
  hideRelationships: boolean;
}

/**
 * Content metadata for spoiler filtering and organization
 *
 * NOTE: This is legacy interface for discussion board posts and user-generated content.
 * For episode events, use the EpisodeEvent type from event.ts instead.
 */
export interface SpoilerMetadata {
  // ============================================
  // Core Spoiler Classification
  // ============================================

  /** Severity level of this content */
  severity: SpoilerSeverity;

  /** Media source type */
  mediaType: MediaType;

  // ============================================
  // Episode/Chapter References (PRIMARY FILTERS)
  // ============================================

  /** Minimum episode number to view this content */
  minEpisode?: number;

  /** Minimum chapter number to view this content */
  minChapter?: number;

  // ============================================
  // Story Context
  // ============================================

  /** Saga this content relates to */
  saga?: string;

  /** Arc this content relates to */
  arc?: string;

  // ============================================
  // Content Tags and Categories
  // ============================================

  /** Primary character focus */
  character?: string;

  /** Related characters (for multi-character content) */
  relatedCharacters?: string[];

  /** Topic category */
  topic?: ContentTag;

  // ============================================
  // Timestamps and Metadata
  // ============================================

  /** When this content was created/posted */
  createdAt?: Date;

  /** Optional curator notes */
  notes?: string;
}

/**
 * Tagged content item (post, comment, discussion)
 */
export interface TaggedContent {
  id: string;
  title: string;
  body: string;
  metadata: SpoilerMetadata;
  /** Parts of the content that should be masked */
  spoilerMasks?: SpoilerMask[];
}

/**
 * Defines a section of text that should be masked for spoilers
 */
export interface SpoilerMask {
  /** Starting position in the text */
  start: number;
  /** Ending position in the text */
  end: number;
  /** Severity level of this masked section */
  severity: SpoilerSeverity;
  /** Episode/chapter this spoiler is from */
  minEpisode?: number;
  minChapter?: number;
  /** Reason for masking (shown in warning) */
  reason?: string;
}

// ============================================
// FILTERING FUNCTIONS
// ============================================

/**
 * Check if content should be visible based on user preferences
 *
 * FILTERING LOGIC:
 * 1. PRIMARY: Check episode/chapter progress (user must have watched/read the content)
 * 2. SECONDARY: Check severity level (user's sensitivity preference)
 * 3. OPTIONAL: Check content-specific filters (deaths, bounties, relationships)
 *
 * @param metadata - Content metadata to check
 * @param preferences - User's spoiler preferences
 * @returns true if content should be shown, false if it should be hidden/masked
 */
export function shouldShowContent(
  metadata: SpoilerMetadata,
  preferences: SpoilerPreferences | null
): boolean {
  // If no preferences (during SSR or no user logged in), only show MINOR severity content
  if (!preferences) {
    return metadata.severity === SpoilerSeverity.MINOR && !metadata.minEpisode;
  }

  // ============================================
  // PRIMARY FILTER: Episode/Chapter Progress
  // ============================================

  let hasWatchedContent = false;

  // Check episode progress (if content has episode reference)
  if (metadata.minEpisode !== undefined) {
    if (preferences.lastWatchedEpisode === undefined) {
      // User hasn't set episode progress - hide content
      return false;
    }
    if (metadata.minEpisode > preferences.lastWatchedEpisode) {
      // User hasn't watched this episode yet - hide content
      return false;
    }
    hasWatchedContent = true;
  }

  // Check chapter progress (if content has chapter reference)
  if (metadata.minChapter !== undefined) {
    if (preferences.lastReadChapter === undefined) {
      // User hasn't set chapter progress - hide content
      return false;
    }
    if (metadata.minChapter > preferences.lastReadChapter) {
      // User hasn't read this chapter yet - hide content
      return false;
    }
    hasWatchedContent = true;
  }

  // If content has no episode/chapter reference, assume it's safe to show
  // (This handles general discussion posts that aren't tied to specific content)
  if (!hasWatchedContent && metadata.minEpisode === undefined && metadata.minChapter === undefined) {
    hasWatchedContent = true;
  }

  // ============================================
  // SECONDARY FILTER: Severity Level
  // ============================================

  const severityOrder = [
    SpoilerSeverity.MINOR,
    SpoilerSeverity.MAJOR,
    SpoilerSeverity.CRITICAL,
    SpoilerSeverity.ULTRA_SECRET,
  ];

  const contentSeverityLevel = severityOrder.indexOf(metadata.severity);
  const userMaxSeverityLevel = severityOrder.indexOf(preferences.maxSeverity);

  if (contentSeverityLevel > userMaxSeverityLevel) {
    // Content is too severe for user's preference - hide it
    return false;
  }

  // ============================================
  // OPTIONAL: Content-Specific Filters
  // ============================================
  // Note: These would require eventType information, which SpoilerMetadata doesn't have.
  // For now, these filters are only applied in shouldShowEvent() function.
  // This function is primarily for legacy discussion board content.

  return true;
}

/**
 * Check if an event should be visible based on user preferences
 *
 * This is the PRIMARY filtering function for EpisodeEvent and ChapterEvent.
 * More specific than shouldShowContent() with content-specific filtering.
 *
 * FILTERING LOGIC:
 * 1. PRIMARY: Check episode/chapter progress (user must have watched/read the content)
 * 2. SECONDARY: Check severity level (user's sensitivity preference)
 * 3. CONTENT-SPECIFIC: Check event type filters (deaths, bounties, relationships)
 *
 * @param event - EpisodeEvent or ChapterEvent to check (must have episodeNumber or chapterNumber, severity, and eventType)
 * @param preferences - User's spoiler preferences
 * @returns true if event should be shown, false if it should be hidden/masked
 */
export function shouldShowEvent(
  event: {
    episodeNumber?: number;
    chapterNumber?: number;
    severity: SpoilerSeverity;
    eventType?: string;
  },
  preferences: SpoilerPreferences | null
): boolean {
  // If no preferences (during SSR or no user logged in), only show MINOR severity content
  if (!preferences) {
    return event.severity === SpoilerSeverity.MINOR;
  }

  // ============================================
  // PRIMARY FILTER: Episode/Chapter Progress
  // ============================================

  let hasWatchedContent = false;

  // Check episode progress (if event has episode reference)
  if (event.episodeNumber !== undefined) {
    if (preferences.lastWatchedEpisode === undefined) {
      // User hasn't set episode progress - hide event
      return false;
    }
    if (event.episodeNumber > preferences.lastWatchedEpisode) {
      // User hasn't watched this episode yet - hide event
      return false;
    }
    hasWatchedContent = true;
  }

  // Check chapter progress (if event has chapter reference)
  if (event.chapterNumber !== undefined) {
    if (preferences.lastReadChapter === undefined) {
      // User hasn't set chapter progress - hide event
      return false;
    }
    if (event.chapterNumber > preferences.lastReadChapter) {
      // User hasn't read this chapter yet - hide event
      return false;
    }
    hasWatchedContent = true;
  }

  // If event has no episode/chapter reference, can't determine if user has watched it
  if (!hasWatchedContent) {
    return false;
  }

  // ============================================
  // SECONDARY FILTER: Severity Level
  // ============================================

  const severityOrder = [
    SpoilerSeverity.MINOR,
    SpoilerSeverity.MAJOR,
    SpoilerSeverity.CRITICAL,
    SpoilerSeverity.ULTRA_SECRET,
  ];

  const eventSeverityLevel = severityOrder.indexOf(event.severity);
  const userMaxSeverityLevel = severityOrder.indexOf(preferences.maxSeverity);

  if (eventSeverityLevel > userMaxSeverityLevel) {
    // Event is too severe for user's preference - hide it
    return false;
  }

  // ============================================
  // CONTENT-SPECIFIC FILTERS
  // ============================================

  if (event.eventType) {
    // Hide deaths if user has death filter enabled
    if (preferences.hideDeaths && event.eventType === 'death') {
      return false;
    }

    // Hide bounty updates if user has bounty filter enabled
    if (preferences.hideBounties && event.eventType === 'bounty_update') {
      return false;
    }

    // Hide relationship reveals if user has relationship filter enabled
    if (preferences.hideRelationships && event.eventType === 'relationship_reveal') {
      return false;
    }
  }

  return true;
}

/**
 * Check if a fan theory should be visible based on user preferences
 *
 * Fan theories are generally MAJOR severity and require user to have
 * watched up to minEpisode (determined by agent analysis).
 *
 * FILTERING LOGIC:
 * 1. PRIMARY: Check if user has watched minEpisode
 * 2. SECONDARY: Check severity level (user's sensitivity preference)
 *
 * @param theory - FanTheory to check (must have minEpisode and severity)
 * @param preferences - User's spoiler preferences
 * @returns true if theory should be shown, false if it should be hidden
 */
export function shouldShowFanTheory(
  theory: {
    minEpisode: number;
    severity: SpoilerSeverity;
  },
  preferences: SpoilerPreferences | null
): boolean {
  // If no preferences (during SSR or no user logged in), hide fan theories
  if (!preferences) {
    return false;
  }

  // ============================================
  // PRIMARY FILTER: Episode Progress
  // ============================================

  // User must have watched up to minEpisode
  if (preferences.lastWatchedEpisode === undefined) {
    // User hasn't set episode progress - hide theory
    return false;
  }

  if (preferences.lastWatchedEpisode < theory.minEpisode) {
    // User hasn't watched enough episodes yet - hide theory
    return false;
  }

  // ============================================
  // SECONDARY FILTER: Severity Level
  // ============================================

  const severityOrder = [
    SpoilerSeverity.MINOR,
    SpoilerSeverity.MAJOR,
    SpoilerSeverity.CRITICAL,
    SpoilerSeverity.ULTRA_SECRET,
  ];

  const theorySeverityLevel = severityOrder.indexOf(theory.severity);
  const userMaxSeverityLevel = severityOrder.indexOf(preferences.maxSeverity);

  if (theorySeverityLevel > userMaxSeverityLevel) {
    // Theory is too severe for user's preference - hide it
    return false;
  }

  return true;
}

/**
 * Check if external media should be visible based on user preferences
 *
 * Similar to shouldShowFanTheory but for EpisodeMedia (reviews, reactions, etc.)
 *
 * @param media - EpisodeMedia to check (must have minEpisode and severity)
 * @param preferences - User's spoiler preferences
 * @returns true if media should be shown, false if it should be hidden
 */
export function shouldShowExternalMedia(
  media: {
    minEpisode: number;
    severity: SpoilerSeverity;
  },
  preferences: SpoilerPreferences | null
): boolean {
  // Same logic as fan theories
  return shouldShowFanTheory(media, preferences);
}

/**
 * Warning level for spoiler content
 */
export type WarningLevel = 'none' | 'standard' | 'two-stage';

/**
 * Result of warning level calculation
 */
export interface WarningResult {
  needsWarning: boolean;
  warningLevel: WarningLevel;
  episodeGap: number;
  reason: string;
}

/**
 * Check if a discussion should be visible in the discussion list
 *
 * VISIBILITY LOGIC:
 * - If showSpoilers toggle is ON: show all discussions
 * - If showSpoilers toggle is OFF: only show discussions user has watched
 *
 * @param discussion - Discussion to check (must have minEpisode and severity)
 * @param userProgress - User's progress (lastWatchedEpisode)
 * @param showSpoilers - Whether user has toggled "Show Spoiler Discussions"
 * @returns Object with visibility status and optional reason
 */
export function shouldShowDiscussionInList(
  discussion: {
    minEpisode: number;
    severity: SpoilerSeverity;
  },
  userProgress: { lastWatchedEpisode?: number } | null,
  showSpoilers: boolean
): { visible: boolean; reason?: string } {
  // If user explicitly wants to see spoilers, show everything
  if (showSpoilers) {
    return { visible: true };
  }

  // If no user progress, hide all discussions by default
  if (!userProgress || userProgress.lastWatchedEpisode === undefined) {
    return {
      visible: false,
      reason: 'Set your episode progress to see discussions',
    };
  }

  // Check if user has watched enough to see this discussion
  if (discussion.minEpisode > userProgress.lastWatchedEpisode) {
    return {
      visible: false,
      reason: `Requires Episode ${discussion.minEpisode} (you're on ${userProgress.lastWatchedEpisode})`,
    };
  }

  // User has watched this episode - show it
  return { visible: true };
}

/**
 * Get warning level for a discussion
 *
 * WARNING LEVEL LOGIC:
 * - If user has watched minEpisode: no warning needed
 * - If user hasn't watched AND severity is CRITICAL/ULTRA_SECRET: two-stage warning
 * - If user hasn't watched AND severity is MINOR/MAJOR: standard warning
 *
 * @param discussion - Discussion to check (must have minEpisode and severity)
 * @param userProgress - User's progress (lastWatchedEpisode)
 * @returns WarningResult with warning level and details
 */
export function getDiscussionWarningLevel(
  discussion: {
    minEpisode: number;
    severity: SpoilerSeverity;
  },
  userProgress: { lastWatchedEpisode?: number } | null
): WarningResult {
  // If no user progress, assume episode 0 (hasn't started watching)
  const currentEpisode = userProgress?.lastWatchedEpisode ?? 0;

  // Calculate how far ahead this discussion spoils
  const episodeGap = discussion.minEpisode - currentEpisode;

  // If user has already watched this episode, no warning needed
  if (episodeGap <= 0) {
    return {
      needsWarning: false,
      warningLevel: 'none',
      episodeGap: 0,
      reason: '',
    };
  }

  // User hasn't watched this episode yet - determine warning level
  const isCritical =
    discussion.severity === SpoilerSeverity.CRITICAL ||
    discussion.severity === SpoilerSeverity.ULTRA_SECRET;

  return {
    needsWarning: true,
    warningLevel: isCritical ? 'two-stage' : 'standard',
    episodeGap,
    reason: `Contains spoilers for Episode ${discussion.minEpisode} (${episodeGap} episodes ahead)`,
  };
}

/**
 * Get warning level for a discussion post
 *
 * Posts can have stricter requirements than their parent discussion.
 * Uses same logic as getDiscussionWarningLevel.
 *
 * @param post - Post to check (must have minEpisode and spoilerSeverity)
 * @param userProgress - User's progress (lastWatchedEpisode)
 * @returns WarningResult with warning level and details
 */
export function getPostWarningLevel(
  post: {
    minEpisode?: number;
    spoilerSeverity: SpoilerSeverity;
  },
  userProgress: { lastWatchedEpisode?: number } | null
): WarningResult {
  // If post doesn't specify minEpisode, no warning needed
  // (This means it's safe for anyone in the discussion to view)
  if (post.minEpisode === undefined) {
    return {
      needsWarning: false,
      warningLevel: 'none',
      episodeGap: 0,
      reason: '',
    };
  }

  // Use same logic as discussion warnings
  return getDiscussionWarningLevel(
    {
      minEpisode: post.minEpisode,
      severity: post.spoilerSeverity,
    },
    userProgress
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the appropriate spoiler warning text for a severity level
 *
 * @param severity - Spoiler severity level
 * @param mediaType - Optional media type for context
 * @returns Spoiler warning tag text
 */
export function getSpoilerTagText(
  severity: SpoilerSeverity,
  mediaType?: MediaType
): string {
  const mediaPrefix = mediaType ? `[${mediaType.toUpperCase()}] ` : '';

  switch (severity) {
    case SpoilerSeverity.MINOR:
      return `${mediaPrefix}[MINOR SPOILER]`;
    case SpoilerSeverity.MAJOR:
      return `${mediaPrefix}[MAJOR SPOILER]`;
    case SpoilerSeverity.CRITICAL:
      return `${mediaPrefix}[CRITICAL SPOILER]`;
    case SpoilerSeverity.ULTRA_SECRET:
      return `${mediaPrefix}[⚠️ ULTRA SECRET SPOILER ⚠️]`;
  }
}

/**
 * Get user-friendly description of severity level
 *
 * @param severity - Spoiler severity level
 * @returns Human-readable description
 */
export function getSeverityDescription(severity: SpoilerSeverity): string {
  switch (severity) {
    case SpoilerSeverity.MINOR:
      return 'Minor information that won\'t significantly impact your experience';
    case SpoilerSeverity.MAJOR:
      return 'Important plot developments and reveals';
    case SpoilerSeverity.CRITICAL:
      return 'Major character deaths and arc-defining moments';
    case SpoilerSeverity.ULTRA_SECRET:
      return 'Series-defining revelations that will change your entire perspective';
  }
}

/**
 * Get color code for severity level (for UI styling)
 *
 * @param severity - Spoiler severity level
 * @returns Tailwind color class
 */
export function getSeverityColor(severity: SpoilerSeverity): string {
  switch (severity) {
    case SpoilerSeverity.MINOR:
      return 'text-blue-500';
    case SpoilerSeverity.MAJOR:
      return 'text-yellow-500';
    case SpoilerSeverity.CRITICAL:
      return 'text-orange-500';
    case SpoilerSeverity.ULTRA_SECRET:
      return 'text-red-600';
  }
}
