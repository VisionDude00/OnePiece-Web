/**
 * Devil Fruit type definitions with user progression and ability reveal tracking
 *
 * Devil Fruits are tracked with episodic timeline data, enabling features like:
 * - Devil Fruit progression timelines (ability reveals episode-by-episode)
 * - User history tracking (if fruit changes hands)
 * - Technique unlock timelines
 * - Awakening tracking with episode sourcing
 */

import type { SpoilerSeverity } from './spoiler';

/**
 * Types of Devil Fruits
 */
export enum DevilFruitType {
  PARAMECIA = 'paramecia',
  ZOAN = 'zoan',
  LOGIA = 'logia',
  UNKNOWN = 'unknown',
}

/**
 * Zoan fruit subtypes
 */
export enum ZoanSubtype {
  STANDARD = 'standard',
  ANCIENT = 'ancient',
  MYTHICAL = 'mythical',
  ARTIFICIAL = 'artificial',        // SMILE fruits
}

/**
 * Current status of a Devil Fruit
 */
export enum DevilFruitStatus {
  IN_USE = 'in_use',               // Currently has a user
  NO_USER = 'no_user',             // User died, fruit reincarnated
  UNKNOWN = 'unknown',             // Status unknown
}

/**
 * User progression over time
 * Tracks who has had the fruit and when
 */
export interface DevilFruitUserProgression {
  /** Character ID of the user */
  characterId: string;

  /** Character name (for convenience) */
  characterName: string;

  /** Episode when character acquired the fruit */
  acquiredEpisode: number;

  /** Chapter when character acquired the fruit (optional) */
  acquiredChapter?: number;

  /** Episode when character lost the fruit (death, etc.) */
  lostEpisode?: number;

  /** Chapter when character lost the fruit (optional) */
  lostChapter?: number;

  /** How the fruit was acquired */
  acquisitionMethod?: string;

  /** Current status of this user relationship */
  status: 'CURRENT' | 'FORMER' | 'DECEASED';

  /** Spoiler severity for this user */
  spoilerSeverity: SpoilerSeverity;

  /** Reference to event where fruit was acquired */
  acquisitionEventId?: string;

  /** Reference to event where fruit was lost */
  lossEventId?: string;
}

/**
 * Types of ability reveals
 */
export type AbilityRevealType =
  | 'BASIC'           // Basic/fundamental ability
  | 'INTERMEDIATE'    // Intermediate technique
  | 'ADVANCED'        // Advanced technique
  | 'AWAKENED'        // Awakened ability
  | 'ULTIMATE';       // Ultimate/signature move

/**
 * A specific ability or technique revealed over time
 */
export interface AbilityReveal {
  /** Episode number where ability was revealed */
  episodeNumber: number;

  /** Chapter number (optional) */
  chapterNumber?: number;

  /** Reference to event where ability was first used */
  eventId?: string;

  /** Technique/ability name */
  technique: string;

  /** Japanese name of technique (if applicable) */
  japaneseName?: string;

  /** Description of what the technique does */
  description: string;

  /** Type/level of this ability */
  significance: AbilityRevealType;

  /** Spoiler severity for this ability */
  spoilerSeverity: SpoilerSeverity;

  /** Location where ability was first used */
  locationId?: string;

  /** Opponent or context for first use */
  context?: string;
}

/**
 * Awakening information
 */
export interface DevilFruitAwakening {
  /** Episode when awakening was revealed */
  episodeRevealed: number;

  /** Chapter when awakening was revealed (optional) */
  chapterRevealed?: number;

  /** Character who awakened it */
  characterId: string;

  /** Description of awakened abilities */
  description: string;

  /** Spoiler severity for awakening */
  spoilerSeverity: SpoilerSeverity;

  /** Reference to event where awakening was revealed */
  eventId?: string;

  /** New abilities gained from awakening */
  awakenedAbilities?: string[];
}

/**
 * Devil Fruit weaknesses
 */
export interface DevilFruitWeakness {
  /** Type of weakness */
  type: 'WATER' | 'SEASTONE' | 'HAKI' | 'SPECIFIC' | 'OTHER';

  /** Description of the weakness */
  description: string;

  /** Episode where weakness was revealed */
  revealedEpisode?: number;

  /** Spoiler severity for this weakness */
  spoilerSeverity?: SpoilerSeverity;
}

/**
 * Devil Fruit interface with user progression and ability timeline tracking
 *
 * Features enabled:
 * - Devil Fruit progression pages with ability reveals
 * - User history ("Who has had the Gomu Gomu no Mi?")
 * - Technique unlock timeline
 * - Awakening tracking with episode sourcing
 * - "Appears in X episodes" statistics
 */
export interface DevilFruit {
  /** Unique identifier (slug, e.g., "gomu-gomu-no-mi") */
  id: string;

  /** Devil Fruit name */
  name: string;

  /** Japanese name */
  japaneseName?: string;

  /** Official English name */
  officialEnglishName?: string;

  /** Meaning/translation of the name */
  meaning?: string;

  /** Fruit type */
  type: DevilFruitType;

  /** Zoan subtype (if applicable) */
  zoanSubtype?: ZoanSubtype;

  // ============================================
  // User Progression (Versioned)
  // ============================================

  /**
   * VERSIONED: Complete user history
   * Tracks who has had this fruit and when
   * Sorted by acquiredEpisode (ascending)
   */
  users: DevilFruitUserProgression[];

  /**
   * Current user character ID (if fruit is in use)
   */
  currentUserId?: string;

  /**
   * Current user name (for convenience)
   */
  currentUserName?: string;

  /** Current status of the fruit */
  status: DevilFruitStatus;

  // ============================================
  // Episode Tracking (Hybrid Granularity)
  // ============================================

  /**
   * First episode where fruit appears or is mentioned
   */
  firstAppearance: number;

  /**
   * First chapter where fruit appears (optional)
   */
  firstChapter?: number;

  /**
   * COMPREHENSIVE TRACKING: All episodes where this fruit appears or is used
   * Used for statistics ("appears in X episodes")
   * Sorted in ascending order
   */
  episodeAppearances: number[];

  /**
   * CURATED TIMELINE: Ability reveals over time
   * New techniques, power-ups, awakening, etc.
   * Sorted by episodeNumber (ascending)
   */
  abilityReveals: AbilityReveal[];

  // ============================================
  // Awakening
  // ============================================

  /**
   * Awakening information (if fruit has been awakened)
   */
  awakening?: DevilFruitAwakening;

  /**
   * Whether this fruit is currently awakened
   */
  isAwakened?: boolean;

  // ============================================
  // Description and Properties
  // ============================================

  /**
   * Brief description of the fruit's power
   * Spoiler-free summary
   */
  description: string;

  /**
   * Detailed explanation of abilities
   * Can contain spoilers
   */
  detailedDescription?: string;

  /**
   * Known weaknesses beyond standard Devil Fruit weaknesses
   */
  weaknesses?: DevilFruitWeakness[];

  /**
   * Strengths and advantages of this fruit
   */
  strengths?: string[];

  // ============================================
  // Classification and Rarity
  // ============================================

  /**
   * Rarity level (if known)
   */
  rarity?: 'COMMON' | 'UNCOMMON' | 'RARE' | 'VERY_RARE' | 'MYTHICAL' | 'UNIQUE';

  /**
   * Power level or tier (subjective)
   */
  powerTier?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 'LEGENDARY';

  // ============================================
  // Relationships
  // ============================================

  /**
   * Related Devil Fruits (similar powers, same series, etc.)
   */
  relatedFruits?: string[];

  /**
   * Story arcs where this fruit is prominent
   */
  relatedArcs?: string[];

  // ============================================
  // Media Assets
  // ============================================

  /** Image URLs for this fruit */
  images?: string[];

  /** Physical appearance description */
  appearance?: string;

  // ============================================
  // Metadata
  // ============================================

  /** Curator notes (not shown to users, internal documentation) */
  curatorNotes?: string;

  /** When this fruit entry was created in the database */
  createdAt?: Date;

  /** Last updated timestamp */
  updatedAt?: Date;
}

/**
 * Simplified Devil Fruit display data for UI components
 */
export interface DevilFruitDisplay {
  id: string;
  name: string;
  type: DevilFruitType;
  currentUserName?: string;
  firstAppearance: number;
  description: string;
  imageUrl?: string;
  isAwakened?: boolean;
}

/**
 * Devil Fruit search/filter options
 */
export interface DevilFruitFilter {
  type?: DevilFruitType;
  zoanSubtype?: ZoanSubtype;
  status?: DevilFruitStatus;
  rarity?: string;
  isAwakened?: boolean;
  hasCurrentUser?: boolean;
  minEpisode?: number;
  maxEpisode?: number;
}

/**
 * Get user-friendly display name for Devil Fruit type
 */
export function getDevilFruitTypeLabel(type: DevilFruitType): string {
  switch (type) {
    case DevilFruitType.PARAMECIA:
      return 'Paramecia';
    case DevilFruitType.ZOAN:
      return 'Zoan';
    case DevilFruitType.LOGIA:
      return 'Logia';
    case DevilFruitType.UNKNOWN:
      return 'Unknown';
  }
}

/**
 * Get emoji icon for Devil Fruit type
 */
export function getDevilFruitTypeIcon(type: DevilFruitType): string {
  switch (type) {
    case DevilFruitType.PARAMECIA:
      return '🍎';
    case DevilFruitType.ZOAN:
      return '🦁';
    case DevilFruitType.LOGIA:
      return '💨';
    case DevilFruitType.UNKNOWN:
      return '❓';
  }
}

/**
 * Get color for Devil Fruit type (Tailwind classes)
 */
export function getDevilFruitTypeColor(type: DevilFruitType): string {
  switch (type) {
    case DevilFruitType.PARAMECIA:
      return 'text-purple-600';
    case DevilFruitType.ZOAN:
      return 'text-yellow-600';
    case DevilFruitType.LOGIA:
      return 'text-blue-600';
    case DevilFruitType.UNKNOWN:
      return 'text-gray-400';
  }
}

/**
 * Get user-friendly display name for Zoan subtype
 */
export function getZoanSubtypeLabel(subtype: ZoanSubtype): string {
  switch (subtype) {
    case ZoanSubtype.STANDARD:
      return 'Standard Zoan';
    case ZoanSubtype.ANCIENT:
      return 'Ancient Zoan';
    case ZoanSubtype.MYTHICAL:
      return 'Mythical Zoan';
    case ZoanSubtype.ARTIFICIAL:
      return 'Artificial Zoan (SMILE)';
  }
}

/**
 * Get user-friendly display name for ability reveal type
 */
export function getAbilityRevealTypeLabel(type: AbilityRevealType): string {
  switch (type) {
    case 'BASIC':
      return 'Basic Ability';
    case 'INTERMEDIATE':
      return 'Intermediate Technique';
    case 'ADVANCED':
      return 'Advanced Technique';
    case 'AWAKENED':
      return 'Awakened Ability';
    case 'ULTIMATE':
      return 'Ultimate Move';
  }
}

/**
 * Get badge color for ability reveal type (Tailwind)
 */
export function getAbilityRevealTypeBadgeColor(type: AbilityRevealType): string {
  switch (type) {
    case 'BASIC':
      return 'bg-gray-100 text-gray-800';
    case 'INTERMEDIATE':
      return 'bg-blue-100 text-blue-800';
    case 'ADVANCED':
      return 'bg-purple-100 text-purple-800';
    case 'AWAKENED':
      return 'bg-red-100 text-red-800';
    case 'ULTIMATE':
      return 'bg-yellow-100 text-yellow-800';
  }
}

/**
 * Helper function to transform Devil Fruit data to display format
 */
export function transformDevilFruitToDisplay(fruit: DevilFruit): DevilFruitDisplay {
  return {
    id: fruit.id,
    name: fruit.name,
    type: fruit.type,
    currentUserName: fruit.currentUserName,
    firstAppearance: fruit.firstAppearance,
    description: fruit.description,
    imageUrl: fruit.images?.[0],
    isAwakened: fruit.isAwakened,
  };
}
