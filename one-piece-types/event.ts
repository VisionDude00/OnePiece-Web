/**
 * Event types for episode-by-episode and chapter-by-chapter content
 *
 * Events are the core unit of spoiler-protected content. Each event represents
 * a specific moment or reveal within an episode/chapter and has its own severity rating.
 */

import type { SpoilerSeverity, MediaType } from './spoiler';

/**
 * Classification of event types for categorization and filtering
 *
 * These types help users find specific kinds of moments and enable
 * content-specific filtering (e.g., "hide all deaths")
 */
export enum EventType {
  /** Character appears for the first time */
  FIRST_APPEARANCE = 'first_appearance',

  /** Character death or presumed death */
  DEATH = 'death',

  /** Devil Fruit power revealed or awakened */
  POWER_REVEAL = 'power_reveal',

  /** Character relationship revealed (family, romantic, alliance, etc.) */
  RELATIONSHIP_REVEAL = 'relationship_reveal',

  /** Location shown for the first time */
  LOCATION_DEBUT = 'location_debut',

  /** Devil Fruit introduced or its nature explained */
  DEVIL_FRUIT_REVEAL = 'devil_fruit_reveal',

  /** Character bounty announced or updated */
  BOUNTY_UPDATE = 'bounty_update',

  /** Major plot revelation or twist */
  MAJOR_REVEAL = 'major_reveal',

  /** Foreshadowing or setup for future events */
  FORESHADOWING = 'foreshadowing',

  /** Callback to earlier episode/chapter */
  CALLBACK = 'callback',

  /** Significant emotional moment (Merry's farewell, Ace's death, etc.) */
  EMOTIONAL_MOMENT = 'emotional_moment',

  /** Combat encounter or battle */
  BATTLE = 'battle',

  /** Comedy or gag moment */
  COMEDY = 'comedy',

  /** Crew member joins the Straw Hats */
  CREW_JOIN = 'crew_join',

  /** Backstory or flashback sequence */
  BACKSTORY = 'backstory',

  /** World-building information or lore */
  LORE = 'lore',

  /** Mystery or question posed */
  MYSTERY = 'mystery',

  /** Other significant moment */
  OTHER = 'other',
}

/**
 * Quote from a character during an event
 */
export interface EventQuote {
  /** The text of the quote */
  text: string;

  /** Character ID or name who said it */
  character: string;

  /** Optional timestamp within the episode (e.g., "14:32") */
  timestamp?: string;

  /** Optional context for the quote */
  context?: string;
}

/**
 * Episode event - represents a single moment or reveal within an episode
 *
 * This is the primary data structure for episode-by-episode content.
 * Each episode will have an array of events that can be filtered based on user progress.
 */
export interface EpisodeEvent {
  /** Unique identifier for this event */
  id: string;

  /** Episode number this event occurs in */
  episodeNumber: number;

  /** Timestamp within the episode (OPTIONAL - e.g., "14:32" or "2:30:15") */
  timestamp?: string;

  /** Type of event for categorization */
  eventType: EventType;

  /** Severity level for spoiler filtering (REQUIRED) */
  severity: SpoilerSeverity;

  /** Media source type (typically ANIME for episodes) */
  mediaType: MediaType;

  /** Short title for this event (e.g., "Luffy's First Gomu Gomu Stretch") */
  title: string;

  /** Detailed description of the event */
  description: string;

  // ============================================
  // References to Other Entities (Bidirectional Links)
  // ============================================
  //
  // These arrays enable bidirectional querying:
  // - Query "which characters appear in this episode?" → use characterIds
  // - Query "which episodes does this character appear in?" → character.episodeAppearances
  //
  // IMPORTANT: Keep these in sync with entity data:
  // - If event includes characterIds: ["luffy"], then Luffy's character.episodeAppearances
  //   should include this episode number, and optionally character.keyMoments can reference
  //   this event by ID
  //

  /**
   * Character IDs involved in this event
   * Use character slugs (e.g., "monkey-d-luffy", "roronoa-zoro")
   * Bidirectional: Characters should reference back via episodeAppearances or keyMoments[].eventId
   */
  characterIds?: string[];

  /**
   * Location IDs where this event takes place
   * Use location slugs (e.g., "windmill-village", "arlong-park")
   * Bidirectional: Locations should reference back via episodeAppearances or keyEvents[].eventId
   */
  locationIds?: string[];

  /**
   * Devil Fruit IDs revealed or used in this event
   * Use fruit slugs (e.g., "gomu-gomu-no-mi", "bara-bara-no-mi")
   * Bidirectional: Fruits should reference back via episodeAppearances or abilityReveals[].eventId
   */
  devilFruitIds?: string[];

  /**
   * Crew/organization IDs involved in this event
   * Use crew slugs (e.g., "straw-hat-pirates", "arlong-pirates")
   * Bidirectional: Crews should reference back via episodeAppearances or keyMoments[].eventId
   */
  crewIds?: string[];

  // ============================================
  // Media Assets
  // ============================================

  /** Image URLs for this event (screenshots, fan art, etc.) */
  imageUrls?: string[];

  /** Video clip timestamp reference (e.g., "14:32-15:45") */
  videoTimestamp?: string;

  /** YouTube or video URL for this specific moment */
  videoUrl?: string;

  /** Notable quote from this event */
  quote?: EventQuote;

  // ============================================
  // Cross-Episode Relationships
  // ============================================

  /**
   * Episode numbers where this moment is set up or foreshadowed
   * Example: Gear 2 reveal in episode 272 was set up in episodes 226, 227
   */
  setupInEpisodes?: number[];

  /**
   * Episode numbers where this moment pays off or is referenced
   * Example: Laboon introduction in episode 61 pays off in episode 381
   */
  payoffInEpisodes?: number[];

  /**
   * Episode numbers that this event directly callbacks to
   * Example: Sanji's "I need a light" callback in episode 1030 to episode 808
   */
  callbacksToEpisodes?: number[];

  // ============================================
  // Story Context
  // ============================================

  /** Arc this event is part of */
  arc: string;

  /** Saga this event is part of */
  saga: string;

  /** Thematic tags for this event */
  themes?: string[];

  // ============================================
  // Source Citations
  // ============================================

  /**
   * Source citations for this event
   * Most important for debated facts or external media references
   * Agents cast a wide net to discover everything related to the episode
   */
  sources?: Source[];

  // ============================================
  // Metadata
  // ============================================

  /** Curator notes (not shown to users, internal documentation) */
  curatorNotes?: string;

  /** When this event entry was created in the database */
  createdAt?: Date;

  /** Last updated timestamp */
  updatedAt?: Date;
}

/**
 * Chapter event - represents a single moment or reveal within a manga chapter
 *
 * Similar to EpisodeEvent but for manga chapters. This enables the future
 * chapter-by-chapter site feature.
 */
export interface ChapterEvent {
  /** Unique identifier for this event */
  id: string;

  /** Chapter number this event occurs in */
  chapterNumber: number;

  /** Page number within the chapter (OPTIONAL) */
  pageNumber?: number;

  /** Panel number within the page (OPTIONAL) */
  panelNumber?: number;

  /** Type of event for categorization */
  eventType: EventType;

  /** Severity level for spoiler filtering (REQUIRED) */
  severity: SpoilerSeverity;

  /** Media source type (typically MANGA for chapters) */
  mediaType: MediaType;

  /** Short title for this event */
  title: string;

  /** Detailed description of the event */
  description: string;

  // ============================================
  // References to Other Entities (Bidirectional Links)
  // ============================================
  //
  // These arrays enable bidirectional querying:
  // - Query "which characters appear in this episode?" → use characterIds
  // - Query "which episodes does this character appear in?" → character.episodeAppearances
  //
  // IMPORTANT: Keep these in sync with entity data:
  // - If event includes characterIds: ["luffy"], then Luffy's character.episodeAppearances
  //   should include this episode number, and optionally character.keyMoments can reference
  //   this event by ID
  //

  /**
   * Character IDs involved in this event
   * Use character slugs (e.g., "monkey-d-luffy", "roronoa-zoro")
   * Bidirectional: Characters should reference back via episodeAppearances or keyMoments[].eventId
   */
  characterIds?: string[];

  /**
   * Location IDs where this event takes place
   * Use location slugs (e.g., "windmill-village", "arlong-park")
   * Bidirectional: Locations should reference back via episodeAppearances or keyEvents[].eventId
   */
  locationIds?: string[];

  /**
   * Devil Fruit IDs revealed or used in this event
   * Use fruit slugs (e.g., "gomu-gomu-no-mi", "bara-bara-no-mi")
   * Bidirectional: Fruits should reference back via episodeAppearances or abilityReveals[].eventId
   */
  devilFruitIds?: string[];

  /**
   * Crew/organization IDs involved in this event
   * Use crew slugs (e.g., "straw-hat-pirates", "arlong-pirates")
   * Bidirectional: Crews should reference back via episodeAppearances or keyMoments[].eventId
   */
  crewIds?: string[];

  // ============================================
  // Media Assets
  // ============================================

  /** Image URLs for this event (manga panels, colored versions, etc.) */
  imageUrls?: string[];

  /** Notable quote/dialogue from this event */
  quote?: EventQuote;

  // ============================================
  // Cross-Chapter Relationships
  // ============================================

  /** Chapter numbers where this moment is set up or foreshadowed */
  setupInChapters?: number[];

  /** Chapter numbers where this moment pays off or is referenced */
  payoffInChapters?: number[];

  /** Chapter numbers that this event directly callbacks to */
  callbacksToChapters?: number[];

  /** If this chapter event was adapted to anime, the episode number(s) */
  adaptedInEpisodes?: number[];

  // ============================================
  // Story Context
  // ============================================

  /** Arc this event is part of */
  arc: string;

  /** Saga this event is part of */
  saga: string;

  /** Thematic tags for this event */
  themes?: string[];

  // ============================================
  // Source Citations
  // ============================================

  /**
   * Source citations for this event
   * Most important for debated facts or external media references
   */
  sources?: Source[];

  // ============================================
  // Metadata
  // ============================================

  /** Curator notes (not shown to users, internal documentation) */
  curatorNotes?: string;

  /** When this event entry was created in the database */
  createdAt?: Date;

  /** Last updated timestamp */
  updatedAt?: Date;
}

/**
 * Union type for all event types
 */
export type AnyEvent = EpisodeEvent | ChapterEvent;

/**
 * Type guard to check if an event is an EpisodeEvent
 */
export function isEpisodeEvent(event: AnyEvent): event is EpisodeEvent {
  return 'episodeNumber' in event;
}

/**
 * Type guard to check if an event is a ChapterEvent
 */
export function isChapterEvent(event: AnyEvent): event is ChapterEvent {
  return 'chapterNumber' in event;
}

/**
 * Get user-friendly display name for event type
 */
export function getEventTypeLabel(eventType: EventType): string {
  switch (eventType) {
    case EventType.FIRST_APPEARANCE:
      return 'First Appearance';
    case EventType.DEATH:
      return 'Death';
    case EventType.POWER_REVEAL:
      return 'Power Reveal';
    case EventType.RELATIONSHIP_REVEAL:
      return 'Relationship Reveal';
    case EventType.LOCATION_DEBUT:
      return 'Location Debut';
    case EventType.DEVIL_FRUIT_REVEAL:
      return 'Devil Fruit Reveal';
    case EventType.BOUNTY_UPDATE:
      return 'Bounty Update';
    case EventType.MAJOR_REVEAL:
      return 'Major Reveal';
    case EventType.FORESHADOWING:
      return 'Foreshadowing';
    case EventType.CALLBACK:
      return 'Callback';
    case EventType.EMOTIONAL_MOMENT:
      return 'Emotional Moment';
    case EventType.BATTLE:
      return 'Battle';
    case EventType.COMEDY:
      return 'Comedy';
    case EventType.CREW_JOIN:
      return 'Crew Join';
    case EventType.BACKSTORY:
      return 'Backstory';
    case EventType.LORE:
      return 'Lore';
    case EventType.MYSTERY:
      return 'Mystery';
    case EventType.OTHER:
      return 'Other';
  }
}

/**
 * Get emoji icon for event type (for UI display)
 */
export function getEventTypeIcon(eventType: EventType): string {
  switch (eventType) {
    case EventType.FIRST_APPEARANCE:
      return '👋';
    case EventType.DEATH:
      return '💀';
    case EventType.POWER_REVEAL:
      return '⚡';
    case EventType.RELATIONSHIP_REVEAL:
      return '🤝';
    case EventType.LOCATION_DEBUT:
      return '🗺️';
    case EventType.DEVIL_FRUIT_REVEAL:
      return '🍎';
    case EventType.BOUNTY_UPDATE:
      return '💰';
    case EventType.MAJOR_REVEAL:
      return '🔍';
    case EventType.FORESHADOWING:
      return '🔮';
    case EventType.CALLBACK:
      return '🔄';
    case EventType.EMOTIONAL_MOMENT:
      return '😢';
    case EventType.BATTLE:
      return '⚔️';
    case EventType.COMEDY:
      return '😂';
    case EventType.CREW_JOIN:
      return '🏴‍☠️';
    case EventType.BACKSTORY:
      return '📖';
    case EventType.LORE:
      return '📚';
    case EventType.MYSTERY:
      return '❓';
    case EventType.OTHER:
      return '📌';
  }
}

// ============================================
// SOURCING & EXTERNAL CONTENT TYPES
// ============================================

/**
 * Source citation for episode data
 *
 * Agents will cast a wide net to find everything related to an episode.
 * Sources are most important for fan theories and external media, but can
 * also be used for factual data verification (wiki, official sources).
 */
export interface Source {
  /** Source type classification */
  type: 'wiki' | 'official' | 'manga' | 'reddit' | 'youtube' | 'forum' | 'article' | 'other';

  /** URL to the source */
  url: string;

  /** Title/name of the source */
  title: string;

  /** Platform/site name (e.g., "One Piece Wiki", "Reddit r/OnePiece", "YouTube") */
  platform?: string;

  /** Author/creator if applicable */
  author?: string;

  /** When this source was accessed/scraped by agent */
  accessedAt?: Date;

  /** Curator notes about this source (reliability, context, etc.) */
  notes?: string;
}

/**
 * Fan theory linking external discussions about episodes
 *
 * SEVERITY: Generally MAJOR (assumes theories spoil content)
 * VISIBILITY: User must have watched minEpisode (agent determines this)
 * SCOPE: Can span multiple episodes (episode range 1-10 for arc theories)
 *
 * Example: "Shanks uses Conqueror's Haki in Episode 4" theory
 * - episodeRange: { start: 1, end: 4 }
 * - minEpisode: 4 (must watch through episode 4)
 * - severity: MAJOR
 * - status: confirmed (confirmed in episode 389)
 */
export interface FanTheory {
  /** Unique identifier */
  id: string;

  /** Theory title */
  title: string;

  /** Brief summary of the theory (2-3 sentences) */
  summary: string;

  /**
   * Full embedded content for archival purposes
   * Prevents dead link issues - store the entire discussion/video transcript
   */
  content?: string;

  // ============================================
  // Source Information
  // ============================================

  /** URL to the original discussion/video/post */
  url: string;

  /** Platform where theory was posted */
  platform: 'reddit' | 'youtube' | 'forum' | 'twitter' | 'blog' | 'other';

  /** Author/creator username or channel name */
  author: string;

  /** When theory was originally posted */
  postedAt?: Date;

  /**
   * Engagement metrics from the platform
   * Helps prioritize most popular/discussed theories
   */
  engagement?: {
    /** Reddit upvotes, YouTube likes, etc. */
    upvotes?: number;
    /** Video views, post views */
    views?: number;
    /** Comment count */
    comments?: number;
    /** Generic likes (Twitter, etc.) */
    likes?: number;
  };

  // ============================================
  // Episode Range and Spoiler Control
  // ============================================

  /**
   * Episode range this theory covers
   * Can span multiple episodes
   * Example: { start: 1, end: 10 } for Romance Dawn arc theory
   * Example: { start: 312, end: 312 } for single-episode theory
   */
  episodeRange: {
    start: number;
    end: number;
  };

  /**
   * Minimum episode user must watch before seeing this theory
   * Agent determines this through spoiler analysis
   * Default: theory.episodeRange.end (user must finish the episode range)
   *
   * Example: Theory about episode 1-4 but spoils up to episode 10
   * → minEpisode: 10
   */
  minEpisode: number;

  /**
   * Severity level - defaults to MAJOR
   * MAJOR: Most theories (assumes spoilers)
   * CRITICAL: Theory reveals major deaths or relationships
   * ULTRA_SECRET: Theory reveals series-defining secrets
   */
  severity: SpoilerSeverity;

  // ============================================
  // Theory Metadata
  // ============================================

  /**
   * Theory tags for categorization
   * Examples: "foreshadowing", "character_analysis", "plot_prediction",
   * "power_system", "worldbuilding", "symbolism"
   */
  tags: string[];

  /** Related character IDs */
  relatedCharacters?: string[];

  /** Related story arcs */
  relatedArcs?: string[];

  /**
   * Whether this theory has been confirmed/debunked by canon
   * - unconfirmed: Still speculative
   * - confirmed: Canon events proved it true
   * - debunked: Canon events proved it false
   * - partially_confirmed: Some aspects confirmed, some not
   */
  status?: 'unconfirmed' | 'confirmed' | 'debunked' | 'partially_confirmed';

  /** If confirmed/debunked, which episode did it */
  confirmedInEpisode?: number;

  /** If confirmed/debunked, which chapter did it */
  confirmedInChapter?: number;

  /** Curator notes (not shown to users) */
  curatorNotes?: string;

  /** When this theory entry was added to database */
  createdAt?: Date;

  /** Last updated timestamp */
  updatedAt?: Date;
}

/**
 * External media about an episode (reviews, analyses, reactions, etc.)
 *
 * Separate from fan theories - this is for professional/semi-professional content:
 * - YouTube reviews and reactions
 * - Podcast episodes
 * - Video essays and analyses
 * - Professional articles
 * - Blog posts
 *
 * Example: "Totally Not Mark's Episode 1 Reaction" or "TheLibraryOfOhara's Episode Analysis"
 */
export interface EpisodeMedia {
  /** Unique identifier */
  id: string;

  /** Media type classification */
  type: 'review' | 'analysis' | 'reaction' | 'podcast' | 'video_essay' | 'article' | 'other';

  /** Title of the media */
  title: string;

  /** Creator/author name (channel name, podcast host, writer) */
  creator: string;

  /** URL to the media */
  url: string;

  /** Platform (YouTube, Spotify, Medium, personal blog, etc.) */
  platform: string;

  /** Brief description of the content (2-3 sentences) */
  description?: string;

  /** Thumbnail/cover image URL */
  thumbnailUrl?: string;

  /** Duration in minutes (for videos/podcasts) */
  duration?: number;

  /** When media was published */
  publishedAt?: Date;

  /** View/listen count (if available) */
  views?: number;

  /**
   * Episode(s) this media covers
   * Can be multiple episodes for arc reviews or marathon reactions
   */
  episodes: number[];

  /**
   * Severity - does this media contain spoilers?
   * MINOR: Spoiler-free discussion
   * MAJOR: Contains spoilers for covered episodes only
   * CRITICAL: Contains spoilers beyond covered episodes
   */
  severity: SpoilerSeverity;

  /**
   * Minimum episode user must watch before viewing this media
   * Usually max(episodes) unless media contains spoilers beyond
   */
  minEpisode: number;

  /** Source citation for this media */
  source: Source;

  /** Tags for categorization (e.g., "first_time_viewer", "manga_reader", "analysis") */
  tags: string[];

  /** Curator notes (not shown to users) */
  curatorNotes?: string;

  /** When this media entry was added to database */
  createdAt?: Date;
}
