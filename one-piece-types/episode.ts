/**
 * Episode type definitions for One Piece anime episodes
 *
 * Enhanced episode model with event-based structure and rich metadata
 * for the episode-by-episode homage site.
 */

import type { EpisodeEvent, FanTheory, EpisodeMedia, Source } from './event';
import type { SpoilerSeverity } from './spoiler';

/**
 * Quote from a character within an episode
 */
export interface EpisodeQuote {
  /** Character ID or name who said the quote */
  character: string;
  /** The actual quote text */
  quote: string;
  /** Optional timestamp within episode (e.g., "14:32") */
  timestamp?: string;
  /** Optional context for the quote */
  context?: string;
}

/**
 * Episode relationship tracking for cross-episode connections
 */
export interface EpisodeRelationships {
  /** Episodes that set up this episode (foreshadowing, setup) */
  setup: number[];
  /** Episodes that this episode pays off */
  payoff: number[];
  /** Episodes with similar themes or vibes (recommendations) */
  thematicLinks: number[];
}

/**
 * Animation quality classification
 */
export enum AnimationQuality {
  /** Standard weekly anime quality */
  STANDARD = 'standard',
  /** Above-average quality animation */
  GOOD = 'good',
  /** Excellent animation with notable moments */
  EXCELLENT = 'excellent',
  /** Sakuga-level animation (movie-quality) */
  SAKUGA = 'sakuga',
}

/**
 * Individual episode data
 *
 * ARCHITECTURE NOTES:
 * - Each episode contains an array of EpisodeEvents for granular spoiler control
 * - spoilerTier field REMOVED - events each have their own severity
 * - Debut tracking enables auto-generation of "New This Episode" sections
 * - Episode relationships power the recommendation engine
 */
export interface Episode {
  // ============================================
  // Basic Metadata
  // ============================================

  /** Episode number */
  number: number;

  /** Episode title (English) */
  title: string;

  /** Japanese episode title */
  titleJapanese?: string;

  /** Romanized Japanese title */
  titleRomanized?: string;

  /** Short spoiler-free description */
  description?: string;

  // ============================================
  // Story Context
  // ============================================

  /** Arc this episode belongs to */
  arc: string;

  /** Saga this episode belongs to */
  saga: string;

  // ============================================
  // Air Dates and Adaptation
  // ============================================

  /** Original Japanese air date (YYYY-MM-DD format) */
  airDate?: string;

  /** Funimation English dub air date (YYYY-MM-DD format) */
  dubAirDate?: string;

  /** Manga chapters this episode adapts */
  chaptersAdapted?: number[];

  /** Chapters per episode ratio (for pacing analysis) */
  pacing?: number;

  // ============================================
  // Filler Classification
  // ============================================

  /** Whether this episode is filler (non-canon) */
  isFiller: boolean;

  /** Whether this is anime-only content (no manga basis) */
  isAnimeOnly: boolean;

  // ============================================
  // EVENT-BASED STRUCTURE (Core Feature)
  // ============================================

  /**
   * Array of events within this episode
   * Each event has its own severity rating for granular spoiler control
   */
  events: EpisodeEvent[];

  // ============================================
  // Debut Tracking
  // ============================================

  /** Character IDs debuting in this episode (first appearance) */
  characterDebuts: string[];

  /** Location IDs debuting in this episode */
  locationDebuts: string[];

  /** Devil Fruit IDs revealed in this episode */
  devilFruitDebuts: string[];

  /** Crew/organization IDs introduced in this episode */
  crewDebuts: string[];

  // ============================================
  // Episode Relationships (for recommendations)
  // ============================================

  /** Cross-episode relationships and callbacks */
  relatedEpisodes: EpisodeRelationships;

  // ============================================
  // Rich Content
  // ============================================

  /** Key memorable quotes from this episode */
  keyQuotes: EpisodeQuote[];

  /** Thematic tags (e.g., "Dreams", "Courage", "Freedom") */
  themes: string[];

  /** Emotional tone tags (e.g., "Hopeful", "Intense", "Funny", "Sad") */
  emotionalTone: string[];

  // ============================================
  // Quality and Pacing
  // ============================================

  /** Animation quality classification */
  animationQuality: AnimationQuality;

  /** Optional notes about animation, directing, or production */
  animationNotes?: string;

  // ============================================
  // Media
  // ============================================

  /** Thumbnail/poster image URL */
  thumbnailUrl?: string;

  /** Hero image URL for episode page */
  heroImageUrl?: string;

  // ============================================
  // Discussion Board Integration
  // ============================================

  /** Reference to episode-specific discussion board (Firestore document ID) */
  discussionId?: string;

  // ============================================
  // Fan Theories & External Content
  // ============================================

  /**
   * Fan theories about this episode
   * Sorted by engagement (highest upvotes/views first)
   * Requires user to have watched minEpisode (agent-determined)
   */
  fanTheories: FanTheory[];

  /**
   * External media about this episode
   * (Reviews, analyses, reactions, podcasts, video essays, articles)
   * Sorted by popularity/views
   */
  externalMedia: EpisodeMedia[];

  // ============================================
  // Source Citations
  // ============================================

  /**
   * Primary sources for episode data
   * (Wiki pages, official sources, manga chapters)
   * Agents cast a wide net to discover everything related to this episode
   */
  sources: Source[];

  // ============================================
  // Metadata
  // ============================================

  /** When this episode entry was created in the database */
  createdAt?: Date;

  /** Last updated timestamp */
  updatedAt?: Date;
}

/**
 * Episode list item for UI display (lightweight version for lists)
 */
export interface EpisodeListItem {
  number: number;
  title: string;
  arc: string;
  saga: string;
  isFiller: boolean;
  airDate?: string;
  thumbnailUrl?: string;
  /** Highest severity level of any event in this episode */
  maxSeverity?: SpoilerSeverity;
  /** Number of events in this episode */
  eventCount?: number;
}

/**
 * Episode filter options
 */
export interface EpisodeFilter {
  /** Filter by arc name */
  arc?: string;
  /** Filter by saga name */
  saga?: string;
  /** Show only filler episodes */
  fillerOnly?: boolean;
  /** Hide filler episodes */
  hideFiller?: boolean;
  /** Show only canon episodes */
  canonOnly?: boolean;
  /** Episode number range */
  numberRange?: {
    start: number;
    end: number;
  };
  /** Filter by user's watched progress (show only episodes user has watched) */
  watchedOnly?: boolean;
  /** Filter by animation quality */
  animationQuality?: AnimationQuality;
  /** Filter by themes */
  themes?: string[];
}

/**
 * Episode watch progress tracking
 */
export interface EpisodeProgress {
  episodeNumber: number;
  /** Whether the user has watched this episode */
  watched: boolean;
  /** Timestamp when marked as watched */
  watchedAt?: Date;
  /** Watch progress percentage (0-100) */
  progress?: number;
  /** User rating (1-5 stars) */
  rating?: number;
  /** User notes about this episode */
  notes?: string;
}

/**
 * Filler classification types
 */
export enum FillerType {
  /** Pure filler with no manga basis */
  PURE_FILLER = 'pure-filler',
  /** Mixed canon and filler content */
  MIXED = 'mixed',
  /** Canon episode with filler scenes added */
  CANON_WITH_FILLER = 'canon-with-filler',
  /** Fully canon, adapted from manga */
  CANON = 'canon',
}

/**
 * Extended episode metadata
 */
export interface EpisodeMetadata {
  episode: Episode;
  /** Detailed filler classification */
  fillerType: FillerType;
  /** Estimated manga-to-anime pacing (chapters per episode) */
  pacing?: number;
  /** Notable animation quality or director info */
  animationNotes?: string;
  /** Featured characters in this episode */
  featuredCharacters?: string[];
}

/**
 * Helper function to determine filler type
 */
export function getFillerType(episode: Episode): FillerType {
  if (!episode.isFiller) {
    return FillerType.CANON;
  }
  if (episode.isAnimeOnly) {
    return FillerType.PURE_FILLER;
  }
  if (episode.chaptersAdapted && episode.chaptersAdapted.length > 0) {
    return FillerType.CANON_WITH_FILLER;
  }
  return FillerType.MIXED;
}

/**
 * Calculate manga pacing for an episode
 */
export function calculatePacing(episode: Episode): number | undefined {
  if (!episode.chaptersAdapted || episode.chaptersAdapted.length === 0) {
    return undefined;
  }
  return episode.chaptersAdapted.length;
}

/**
 * Get episodes within a specific arc
 */
export function getEpisodesByArc(episodes: Episode[], arcName: string): Episode[] {
  return episodes.filter(ep => ep.arc === arcName);
}

/**
 * Get only canon episodes
 */
export function getCanonEpisodes(episodes: Episode[]): Episode[] {
  return episodes.filter(ep => !ep.isFiller);
}

/**
 * Get only filler episodes
 */
export function getFillerEpisodes(episodes: Episode[]): Episode[] {
  return episodes.filter(ep => ep.isFiller);
}
