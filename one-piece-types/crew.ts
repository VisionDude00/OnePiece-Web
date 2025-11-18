/**
 * Crew and organization type definitions with member progression tracking
 *
 * Crews are tracked with episodic timeline data, enabling features like:
 * - Crew timeline pages ("Straw Hat Pirates journey")
 * - Member join/leave tracking with episode sourcing
 * - Crew milestone tracking (ship acquisitions, major battles)
 * - Total bounty progression over time
 */

import type { SpoilerSeverity } from './spoiler';

/**
 * Types of crews and organizations
 */
export enum CrewType {
  PIRATE_CREW = 'pirate_crew',
  MARINE = 'marine',
  REVOLUTIONARY = 'revolutionary',
  GOVERNMENT = 'government',
  CRIMINAL_ORGANIZATION = 'criminal_organization',
  MERCHANT = 'merchant',
  EXPLORER = 'explorer',
  OTHER = 'other',
}

/**
 * Current status of a crew
 */
export enum CrewStatus {
  ACTIVE = 'active',           // Crew is currently active
  DISBANDED = 'disbanded',     // Crew has disbanded
  DEFEATED = 'defeated',       // Crew was defeated/destroyed
  ABSORBED = 'absorbed',       // Crew was absorbed into another crew
  UNKNOWN = 'unknown',         // Status is unknown
}

/**
 * Member progression over time
 * Tracks when members join and leave the crew
 */
export interface CrewMemberProgression {
  /** Character ID of the member */
  characterId: string;

  /** Character name (for convenience) */
  characterName: string;

  /** Role/position within the crew */
  role?: string;

  /** Episode when member joined */
  joinedEpisode: number;

  /** Chapter when member joined (optional) */
  joinedChapter?: number;

  /** Episode when member left (if applicable) */
  leftEpisode?: number;

  /** Chapter when member left (optional) */
  leftChapter?: number;

  /** Current status of this membership */
  status: 'ACTIVE' | 'FORMER' | 'DECEASED' | 'TEMPORARY';

  /** Spoiler severity for this member's association */
  spoilerSeverity: SpoilerSeverity;

  /** Reference to event where member joined */
  joinEventId?: string;

  /** Reference to event where member left */
  leaveEventId?: string;

  /** Member's bounty (if applicable) */
  bounty?: number;
}

/**
 * Types of crew milestone moments
 */
export type CrewMomentType =
  | 'FOUNDING'        // Crew was founded
  | 'MEMBER_JOIN'     // New member joins
  | 'MEMBER_LEAVE'    // Member leaves or dies
  | 'SHIP_ACQUIRED'   // New ship acquired
  | 'SHIP_LOST'       // Ship lost or destroyed
  | 'MAJOR_BATTLE'    // Significant battle or conflict
  | 'ALLIANCE'        // Alliance formed with another crew
  | 'BETRAYAL'        // Betrayal within or against crew
  | 'DISBANDED'       // Crew disbanded
  | 'REFORMED'        // Crew reformed after disbanding
  | 'BASE_ESTABLISHED' // New base or territory acquired
  | 'BASE_LOST'       // Base or territory lost
  | 'OTHER';

/**
 * A key moment in a crew's timeline
 */
export interface CrewMoment {
  /** Episode number where this moment occurs */
  episodeNumber: number;

  /** Chapter number (optional) */
  chapterNumber?: number;

  /** Reference to event ID in episode data (for bidirectional linking) */
  eventId?: string;

  /** Type of moment */
  type: CrewMomentType;

  /** Title of this moment */
  title: string;

  /** Description of what happened */
  description: string;

  /** Spoiler severity for this moment */
  spoilerSeverity: SpoilerSeverity;

  /** Characters involved in this moment */
  relatedCharacterIds?: string[];

  /** Location where this moment occurred */
  locationId?: string;
}

/**
 * Total crew bounty progression over time
 */
export interface CrewBountyProgression {
  /** Total combined bounty of all crew members */
  totalBounty: number;

  /** Display string (e.g., "3,000,000,000" or "3B") */
  displayAmount: string;

  /** Episode where this total was reached */
  episodeRevealed: number;

  /** Chapter (optional) */
  chapterRevealed?: number;

  /** Reason for bounty change (e.g., "After Enies Lobby") */
  reason?: string;

  /** Spoiler severity for this bounty reveal */
  spoilerSeverity: SpoilerSeverity;
}

/**
 * Crew base/territory progression over time
 */
export interface CrewBaseProgression {
  /** Location ID of the base */
  locationId: string;

  /** Base/territory name */
  name: string;

  /** Episode when base was acquired */
  acquiredEpisode: number;

  /** Episode when base was lost (if applicable) */
  lostEpisode?: number;

  /** Current status */
  status: 'ACTIVE' | 'FORMER' | 'DESTROYED';

  /** Spoiler severity for this base */
  spoilerSeverity: SpoilerSeverity;
}

/**
 * Ship information for a crew
 */
export interface CrewShip {
  /** Ship name */
  name: string;

  /** Ship type (e.g., "Caravel", "Brigantine") */
  type?: string;

  /** Episode when ship was acquired */
  acquiredEpisode: number;

  /** Episode when ship was lost (if applicable) */
  lostEpisode?: number;

  /** Current status */
  status: 'ACTIVE' | 'FORMER' | 'DESTROYED';

  /** Spoiler severity for this ship */
  spoilerSeverity: SpoilerSeverity;

  /** Description of the ship */
  description?: string;

  /** Image URL for the ship */
  imageUrl?: string;
}

/**
 * Crew interface with member progression and timeline tracking
 *
 * Features enabled:
 * - Crew timeline pages with chronological milestones
 * - Member join/leave tracking ("When did Zoro join?" → Episode 3)
 * - "Crew has X members" statistics
 * - Total bounty progression visualization
 * - Ship and base tracking
 */
export interface Crew {
  /** Unique identifier (slug, e.g., "straw-hat-pirates") */
  id: string;

  /** Crew name */
  name: string;

  /** Alternative names or aliases */
  aliases?: string[];

  /** Japanese name */
  japaneseName?: string;

  /** Crew type */
  type: CrewType;

  // ============================================
  // Leadership
  // ============================================

  /** Captain/leader character ID */
  captainId?: string;

  /** Captain/leader name (for convenience) */
  captainName?: string;

  // ============================================
  // Member Progression (Versioned)
  // ============================================

  /**
   * VERSIONED: Complete member history
   * Tracks when each member joined and left
   * Sorted by joinedEpisode (ascending)
   */
  members: CrewMemberProgression[];

  /**
   * Current active member IDs
   * Derived from members array (status === 'ACTIVE')
   */
  currentMemberIds?: string[];

  // ============================================
  // Episode Tracking (Hybrid Granularity)
  // ============================================

  /**
   * First episode where crew appears
   */
  firstAppearance: number;

  /**
   * First chapter where crew appears (optional)
   */
  firstChapter?: number;

  /**
   * COMPREHENSIVE TRACKING: All episodes where this crew appears
   * Used for statistics ("appears in X episodes")
   * Sorted in ascending order
   */
  episodeAppearances: number[];

  /**
   * CURATED TIMELINE: Key moments in crew's history
   * Member joins, major battles, ship acquisitions, etc.
   * Sorted by episodeNumber (ascending)
   */
  keyMoments: CrewMoment[];

  // ============================================
  // Status and Evolution
  // ============================================

  /** Current status of this crew */
  status: CrewStatus;

  /**
   * Episode when crew was founded/formed
   */
  foundedEpisode?: number;

  /**
   * Episode when crew disbanded (if applicable)
   */
  disbandedEpisode?: number;

  // ============================================
  // Ships and Bases
  // ============================================

  /**
   * VERSIONED: Ship history
   * Tracks all ships the crew has had
   * Sorted by acquiredEpisode (ascending)
   */
  ships: CrewShip[];

  /**
   * Current active ship
   */
  currentShip?: string;

  /**
   * VERSIONED: Base/territory history
   * Tracks crew's bases and territories over time
   * Sorted by acquiredEpisode (ascending)
   */
  bases?: CrewBaseProgression[];

  // ============================================
  // Bounty Progression
  // ============================================

  /**
   * VERSIONED: Total crew bounty over time
   * Sum of all active member bounties
   * Sorted by episodeRevealed (ascending)
   */
  totalBounties?: CrewBountyProgression[];

  // ============================================
  // Visual Identity
  // ============================================

  /** Jolly Roger (pirate flag) image URL */
  jollyRoger?: string;

  /** Crew emblem/logo image URL */
  emblem?: string;

  /** Primary color (hex code) */
  primaryColor?: string;

  // ============================================
  // Description and Significance
  // ============================================

  /**
   * Brief description of the crew
   * Spoiler-free summary
   */
  description?: string;

  /**
   * Notable achievements or significance
   */
  significance?: string;

  // ============================================
  // Relationships
  // ============================================

  /**
   * Allied crew IDs
   */
  allies?: string[];

  /**
   * Enemy crew IDs
   */
  enemies?: string[];

  /**
   * Parent organization (if crew is part of larger org)
   * Example: A marine division → parent: "Marines"
   */
  parentOrganization?: string;

  /**
   * Story arcs this crew is prominent in
   */
  relatedArcs?: string[];

  // ============================================
  // Media Assets
  // ============================================

  /** Image URLs for this crew */
  images?: string[];

  // ============================================
  // Metadata
  // ============================================

  /** Curator notes (not shown to users, internal documentation) */
  curatorNotes?: string;

  /** When this crew entry was created in the database */
  createdAt?: Date;

  /** Last updated timestamp */
  updatedAt?: Date;
}

/**
 * Simplified crew display data for UI components
 */
export interface CrewDisplay {
  id: string;
  name: string;
  type: CrewType;
  captainName?: string;
  currentMemberCount: number;
  totalBounty?: string;
  firstAppearance: number;
  status: CrewStatus;
  jollyRoger?: string;
}

/**
 * Crew search/filter options
 */
export interface CrewFilter {
  type?: CrewType;
  status?: CrewStatus;
  minMembers?: number;
  maxMembers?: number;
  hasJollyRoger?: boolean;
  minEpisode?: number;
  maxEpisode?: number;
}

/**
 * Get user-friendly display name for crew type
 */
export function getCrewTypeLabel(type: CrewType): string {
  switch (type) {
    case CrewType.PIRATE_CREW:
      return 'Pirate Crew';
    case CrewType.MARINE:
      return 'Marine';
    case CrewType.REVOLUTIONARY:
      return 'Revolutionary Army';
    case CrewType.GOVERNMENT:
      return 'World Government';
    case CrewType.CRIMINAL_ORGANIZATION:
      return 'Criminal Organization';
    case CrewType.MERCHANT:
      return 'Merchant';
    case CrewType.EXPLORER:
      return 'Explorer';
    case CrewType.OTHER:
      return 'Other';
  }
}

/**
 * Get emoji icon for crew type
 */
export function getCrewTypeIcon(type: CrewType): string {
  switch (type) {
    case CrewType.PIRATE_CREW:
      return '🏴‍☠️';
    case CrewType.MARINE:
      return '⚓';
    case CrewType.REVOLUTIONARY:
      return '🔥';
    case CrewType.GOVERNMENT:
      return '🏛️';
    case CrewType.CRIMINAL_ORGANIZATION:
      return '💀';
    case CrewType.MERCHANT:
      return '🚢';
    case CrewType.EXPLORER:
      return '🧭';
    case CrewType.OTHER:
      return '⚓';
  }
}

/**
 * Get user-friendly display name for crew status
 */
export function getCrewStatusLabel(status: CrewStatus): string {
  switch (status) {
    case CrewStatus.ACTIVE:
      return 'Active';
    case CrewStatus.DISBANDED:
      return 'Disbanded';
    case CrewStatus.DEFEATED:
      return 'Defeated';
    case CrewStatus.ABSORBED:
      return 'Absorbed';
    case CrewStatus.UNKNOWN:
      return 'Unknown';
  }
}

/**
 * Get color class for crew status (Tailwind)
 */
export function getCrewStatusColor(status: CrewStatus): string {
  switch (status) {
    case CrewStatus.ACTIVE:
      return 'text-green-600';
    case CrewStatus.DISBANDED:
      return 'text-gray-500';
    case CrewStatus.DEFEATED:
      return 'text-red-600';
    case CrewStatus.ABSORBED:
      return 'text-purple-600';
    case CrewStatus.UNKNOWN:
      return 'text-gray-400';
  }
}

/**
 * Helper function to transform crew data to display format
 */
export function transformCrewToDisplay(crew: Crew): CrewDisplay {
  const activeMembers = crew.members.filter(m => m.status === 'ACTIVE');
  const latestBounty = crew.totalBounties?.[crew.totalBounties.length - 1];

  return {
    id: crew.id,
    name: crew.name,
    type: crew.type,
    captainName: crew.captainName,
    currentMemberCount: activeMembers.length,
    totalBounty: latestBounty?.displayAmount,
    firstAppearance: crew.firstAppearance,
    status: crew.status,
    jollyRoger: crew.jollyRoger,
  };
}
