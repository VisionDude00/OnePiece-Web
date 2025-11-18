/**
 * World-building type definitions for locations, geography, and lore
 *
 * Locations are tracked with episodic timeline data, enabling features like:
 * - Location history pages ("What happened at Arlong Park?")
 * - Episode-based location discovery
 * - Temporal status tracking (before/after destruction)
 */

import type { SpoilerSeverity } from './spoiler';

/**
 * Types of locations in the One Piece world
 */
export enum LocationType {
  ISLAND = 'island',
  SEA = 'sea',
  OCEAN = 'ocean',
  TOWN = 'town',
  VILLAGE = 'village',
  CITY = 'city',
  BUILDING = 'building',
  SHIP = 'ship',
  REGION = 'region',
  LANDMARK = 'landmark',
  BASE = 'base',
  RESTAURANT = 'restaurant',
  BAR = 'bar',
  OTHER = 'other',
}

/**
 * Current status of a location
 */
export enum LocationStatus {
  ACTIVE = 'active',           // Location is intact and functioning
  DESTROYED = 'destroyed',     // Location has been destroyed
  ABANDONED = 'abandoned',     // Location exists but is abandoned
  RESTRICTED = 'restricted',   // Location exists but access is restricted
  UNKNOWN = 'unknown',         // Status is unknown
}

/**
 * A key event that occurred at a location
 * Used for location history timelines
 */
export interface LocationEvent {
  /** Episode number where this event occurred */
  episodeNumber: number;

  /** Chapter number (optional) */
  chapterNumber?: number;

  /** Reference to event ID in episode data (for bidirectional linking) */
  eventId?: string;

  /** Title of the event */
  title: string;

  /** Description of what happened */
  description: string;

  /** Significance of this event at this location */
  significance: 'MINOR' | 'MAJOR' | 'CRITICAL';

  /** Spoiler severity for this event */
  spoilerSeverity: SpoilerSeverity;

  /** Characters involved in this event */
  characterIds?: string[];
}

/**
 * Location status change over time
 * Tracks when locations are destroyed, abandoned, etc.
 */
export interface LocationStatusProgression {
  /** New status */
  status: LocationStatus;

  /** Episode when status changed */
  episodeChanged: number;

  /** Chapter when status changed (optional) */
  chapterChanged?: number;

  /** Reason for status change */
  reason?: string;

  /** Spoiler severity for this status change */
  spoilerSeverity: SpoilerSeverity;

  /** Reference to event where status changed */
  eventId?: string;
}

/**
 * Location interface with episodic timeline tracking
 *
 * Features enabled:
 * - Location history pages with chronological events
 * - "This location appears in X episodes" statistics
 * - Temporal status tracking (active → destroyed)
 * - Related character tracking
 */
export interface Location {
  /** Unique identifier (slug, e.g., "arlong-park") */
  id: string;

  /** Primary location name */
  name: string;

  /** Alternative names or aliases */
  aliases?: string[];

  /** Japanese name */
  japaneseName?: string;

  /** Type of location */
  type: LocationType;

  // ============================================
  // Episode Tracking (Hybrid Granularity)
  // ============================================

  /**
   * First episode where location appears
   * Used for debut tracking
   */
  firstAppearance: number;

  /**
   * First chapter where location appears (optional)
   */
  firstChapter?: number;

  /**
   * COMPREHENSIVE TRACKING: All episodes where this location appears
   * Used for statistics ("appears in X episodes")
   * Sorted in ascending order
   */
  episodeAppearances: number[];

  /**
   * CURATED TIMELINE: Key events that happened at this location
   * Major battles, significant meetings, story beats
   * Sorted by episodeNumber (ascending)
   */
  keyEvents: LocationEvent[];

  // ============================================
  // Status Evolution
  // ============================================

  /** Current status of this location */
  status: LocationStatus;

  /**
   * VERSIONED: History of status changes
   * Tracks when location was destroyed, abandoned, etc.
   * Sorted by episodeChanged (ascending)
   */
  statusHistory: LocationStatusProgression[];

  // ============================================
  // Geographic Information
  // ============================================

  /**
   * Parent location (hierarchical relationship)
   * Example: "Arlong Park" → parent: "Cocoyasi Village"
   * Example: "Cocoyasi Village" → parent: "Conomi Islands"
   */
  parentLocation?: string;

  /**
   * Child locations contained within this location
   * Example: "Conomi Islands" → children: ["Cocoyasi Village", "Gosa Village"]
   */
  childLocations?: string[];

  /**
   * Geographic sea/region this location belongs to
   * Example: "East Blue", "Grand Line", "New World"
   */
  sea?: string;

  /**
   * Coordinates or position description (if known)
   * Example: "First half of the Grand Line"
   */
  position?: string;

  // ============================================
  // Significance and Relationships
  // ============================================

  /**
   * Brief description of location's significance
   * Spoiler-free summary of what this place is
   */
  significance: string;

  /**
   * Characters with special connection to this location
   * Born here, lived here, rules here, etc.
   */
  relatedCharacterIds?: string[];

  /**
   * Crews or organizations based at this location
   */
  relatedCrewIds?: string[];

  /**
   * Story arcs that take place at this location
   */
  relatedArcs?: string[];

  // ============================================
  // Media Assets
  // ============================================

  /** Image URLs for this location */
  images?: string[];

  /** Map image URL (if available) */
  mapImageUrl?: string;

  // ============================================
  // Metadata
  // ============================================

  /** Curator notes (not shown to users, internal documentation) */
  curatorNotes?: string;

  /** When this location entry was created in the database */
  createdAt?: Date;

  /** Last updated timestamp */
  updatedAt?: Date;
}

/**
 * Simplified location display data for UI components
 */
export interface LocationDisplay {
  id: string;
  name: string;
  type: LocationType;
  firstAppearance: number;
  status: LocationStatus;
  significance: string;
  imageUrl?: string;
}

/**
 * Location search/filter options
 */
export interface LocationFilter {
  type?: LocationType;
  status?: LocationStatus;
  sea?: string;
  hasMap?: boolean;
  minEpisode?: number;
  maxEpisode?: number;
}

/**
 * Get user-friendly display name for location type
 */
export function getLocationTypeLabel(type: LocationType): string {
  switch (type) {
    case LocationType.ISLAND:
      return 'Island';
    case LocationType.SEA:
      return 'Sea';
    case LocationType.OCEAN:
      return 'Ocean';
    case LocationType.TOWN:
      return 'Town';
    case LocationType.VILLAGE:
      return 'Village';
    case LocationType.CITY:
      return 'City';
    case LocationType.BUILDING:
      return 'Building';
    case LocationType.SHIP:
      return 'Ship';
    case LocationType.REGION:
      return 'Region';
    case LocationType.LANDMARK:
      return 'Landmark';
    case LocationType.BASE:
      return 'Base';
    case LocationType.RESTAURANT:
      return 'Restaurant';
    case LocationType.BAR:
      return 'Bar';
    case LocationType.OTHER:
      return 'Other';
  }
}

/**
 * Get emoji icon for location type
 */
export function getLocationTypeIcon(type: LocationType): string {
  switch (type) {
    case LocationType.ISLAND:
      return '🏝️';
    case LocationType.SEA:
    case LocationType.OCEAN:
      return '🌊';
    case LocationType.TOWN:
    case LocationType.VILLAGE:
    case LocationType.CITY:
      return '🏘️';
    case LocationType.BUILDING:
      return '🏛️';
    case LocationType.SHIP:
      return '⛵';
    case LocationType.REGION:
      return '🗺️';
    case LocationType.LANDMARK:
      return '🗿';
    case LocationType.BASE:
      return '🏰';
    case LocationType.RESTAURANT:
      return '🍽️';
    case LocationType.BAR:
      return '🍺';
    case LocationType.OTHER:
      return '📍';
  }
}

/**
 * Get user-friendly display name for location status
 */
export function getLocationStatusLabel(status: LocationStatus): string {
  switch (status) {
    case LocationStatus.ACTIVE:
      return 'Active';
    case LocationStatus.DESTROYED:
      return 'Destroyed';
    case LocationStatus.ABANDONED:
      return 'Abandoned';
    case LocationStatus.RESTRICTED:
      return 'Restricted';
    case LocationStatus.UNKNOWN:
      return 'Unknown';
  }
}

/**
 * Get color class for location status (Tailwind)
 */
export function getLocationStatusColor(status: LocationStatus): string {
  switch (status) {
    case LocationStatus.ACTIVE:
      return 'text-green-600';
    case LocationStatus.DESTROYED:
      return 'text-red-600';
    case LocationStatus.ABANDONED:
      return 'text-gray-500';
    case LocationStatus.RESTRICTED:
      return 'text-yellow-600';
    case LocationStatus.UNKNOWN:
      return 'text-gray-400';
  }
}

/**
 * Helper function to transform raw location data to display format
 */
export function transformLocationToDisplay(location: Location): LocationDisplay {
  return {
    id: location.id,
    name: location.name,
    type: location.type,
    firstAppearance: location.firstAppearance,
    status: location.status,
    significance: location.significance,
    imageUrl: location.images?.[0],
  };
}
