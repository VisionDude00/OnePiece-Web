/**
 * Character type definitions with progressive revelation support
 *
 * Characters reveal information progressively as the user watches more episodes.
 * For example, Luffy's grandfather isn't revealed until much later in the series.
 */

import type { SpoilerSeverity } from './spoiler';

/**
 * Types of character information that can be revealed progressively
 */
export type CharacterRevealType =
  | 'name'             // Character's name revealed
  | 'affiliation'      // Crew/organization membership revealed
  | 'devil_fruit'      // Devil Fruit ability revealed
  | 'dream'            // Character's dream/goal revealed
  | 'backstory'        // Backstory elements revealed
  | 'relationship'     // Family/romantic/alliance relationship revealed
  | 'bounty'           // Bounty amount announced
  | 'true_identity'    // Secret identity or true nature revealed
  | 'power'            // Special ability or technique revealed
  | 'death'            // Character's death
  | 'status_change';   // Major status change (joins crew, leaves crew, etc.)

/**
 * A single piece of character information that's revealed at a specific point
 *
 * This enables character pages to show information progressively based on
 * what episode the user has watched.
 */
export interface CharacterReveal {
  /** Type of information being revealed */
  revealType: CharacterRevealType;

  /** Episode where this information is revealed (if from anime) */
  revealedInEpisode?: number;

  /** Chapter where this information is revealed (if from manga) */
  revealedInChapter?: number;

  /** Severity of this spoiler */
  severity: SpoilerSeverity;

  /** The actual information being revealed */
  description: string;

  /** For relationship reveals - which character(s) are involved */
  relatedCharacters?: string[];

  /** Optional context or notes */
  context?: string;

  /**
   * Field path in character object this reveal updates
   * Example: "affiliations.2" or "bounty" or "relationships.grandfather"
   */
  fieldPath?: string;

  /** The value to set when this reveal is shown */
  value?: string | number | string[];
}

/**
 * Raw character data from the database
 */
export interface Character {
  'Japanese Name': string;
  'Romanized Name': string;
  'Official English Name': string;
  'Debut': string; // e.g., "Chapter 551; Episode 460"
  'Affiliations': string;
  'Occupations': string;
  'Status': 'Alive' | 'Deceased' | 'Unknown';
  'Birthday'?: string;
  'Residence'?: string;
  'Origin'?: string; // e.g., "West Blue", "East Blue"
  'Epithet'?: string; // e.g., "\"Water Buffalo\""
  'Age'?: string; // e.g., "40 (debut)42 (after timeskip)"
  'Height'?: string; // e.g., "505 cm (16'6\")"
  'Blood Type'?: string; // e.g., "X", "F", "S"
  'Bounty'?: string;
  'Japanese VA'?: string;
  'Funi English VA'?: string;
  '4Kids English VA'?: string;
  'Odex English VA'?: string;
}

/**
 * Simplified character display data for UI components
 */
export interface CharacterDisplay {
  id: string; // Generated from romanized name
  japaneseName: string;
  romanizedName: string;
  englishName: string;
  debut: {
    chapter?: number;
    episode?: number;
    arc?: string;
    saga?: string;
    raw: string;
  };
  affiliations: string[];
  occupations: string[];
  status: 'Alive' | 'Deceased' | 'Unknown';
  epithet?: string;
  bounty?: string;
  imageUrl?: string; // Path to character image
}

/**
 * Types of key character moments for timeline tracking
 */
export type CharacterMomentType =
  | 'DEBUT'                 // First appearance
  | 'POWER_UP'              // New ability or technique unlocked
  | 'MAJOR_DECISION'        // Pivotal character choice
  | 'ARC_CONCLUSION'        // End of character arc
  | 'RELATIONSHIP_CHANGE'   // Significant relationship change
  | 'STATUS_CHANGE'         // Status change (joins crew, becomes enemy, etc.)
  | 'BACKSTORY_REVEAL'      // Major backstory revelation
  | 'BOUNTY_INCREASE'       // New bounty announced
  | 'DEFEAT'                // Major defeat or setback
  | 'VICTORY'               // Major victory or achievement
  | 'AWAKENING';            // Devil Fruit awakening or similar power awakening

/**
 * A key moment in a character's timeline
 * Used for character arc pages and timeline visualizations
 */
export interface CharacterMoment {
  /** Episode number where this moment occurs */
  episodeNumber: number;

  /** Chapter number (optional) */
  chapterNumber?: number;

  /** Reference to event ID in episode data (for bidirectional linking) */
  eventId?: string;

  /** Type of moment */
  type: CharacterMomentType;

  /** Title of this moment */
  title: string;

  /** Description of what happened */
  description: string;

  /** Spoiler severity for this moment */
  spoilerSeverity: SpoilerSeverity;

  /** Related characters involved in this moment */
  relatedCharacterIds?: string[];

  /** Location where this moment occurred */
  locationId?: string;
}

/**
 * Bounty progression over time
 */
export interface BountyProgression {
  /** Bounty amount (in Berries) */
  amount: number;

  /** Display string (e.g., "30,000,000" or "30M") */
  displayAmount: string;

  /** Episode where this bounty was revealed */
  episodeRevealed: number;

  /** Chapter where this bounty was revealed (optional) */
  chapterRevealed?: number;

  /** Reason for bounty increase */
  reason?: string;

  /** Spoiler severity for this bounty reveal */
  spoilerSeverity: SpoilerSeverity;
}

/**
 * Affiliation progression over time
 * Tracks crew memberships, organization allegiances, etc.
 */
export interface AffiliationProgression {
  /** Organization/crew ID */
  organizationId: string;

  /** Organization/crew name */
  organizationName: string;

  /** Role within the organization */
  role?: string;

  /** Episode when affiliation started */
  startEpisode: number;

  /** Episode when affiliation ended (if applicable) */
  endEpisode?: number;

  /** Current status of this affiliation */
  status: 'ACTIVE' | 'FORMER' | 'DECEASED';

  /** Spoiler severity for this affiliation */
  spoilerSeverity: SpoilerSeverity;
}

/**
 * Ability progression over time
 * Tracks new techniques, Haki unlocks, fighting style evolution
 */
export interface AbilityProgression {
  /** Ability/technique name */
  name: string;

  /** Category of ability */
  category: 'HAKI' | 'TECHNIQUE' | 'SKILL' | 'DEVIL_FRUIT' | 'OTHER';

  /** Haki type (if category is HAKI) */
  hakiType?: 'ARMAMENT' | 'OBSERVATION' | 'CONQUERORS';

  /** Episode when ability was revealed */
  episodeRevealed: number;

  /** Chapter when ability was revealed (optional) */
  chapterRevealed?: number;

  /** Description of the ability */
  description: string;

  /** Spoiler severity for this ability */
  spoilerSeverity: SpoilerSeverity;

  /** Reference to event where ability was first used */
  firstUseEventId?: string;
}

/**
 * Status progression over time
 * Tracks alive/deceased/unknown status changes
 */
export interface StatusProgression {
  /** New status */
  status: 'Alive' | 'Deceased' | 'Unknown';

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
 * Relationship type between characters
 */
export type RelationshipType =
  | 'ALLY'          // Allied but not crew
  | 'ENEMY'         // Antagonistic relationship
  | 'RIVAL'         // Competitive relationship
  | 'FAMILY'        // Family relation
  | 'CREW'          // Crew member
  | 'MENTOR'        // Teacher/mentor relationship
  | 'STUDENT'       // Student/apprentice relationship
  | 'FRIEND'        // Friendship
  | 'ROMANTIC'      // Romantic relationship
  | 'NEUTRAL';      // Neutral/unknown

/**
 * A moment where a relationship changed
 */
export interface RelationshipMoment {
  /** Episode where relationship changed */
  episodeNumber: number;

  /** Chapter (optional) */
  chapterNumber?: number;

  /** Previous relationship type (if relationship existed before) */
  previousType?: RelationshipType;

  /** New relationship type */
  newType: RelationshipType;

  /** Description of what caused the change */
  description: string;

  /** Spoiler severity for this relationship change */
  spoilerSeverity: SpoilerSeverity;

  /** Reference to event where relationship changed */
  eventId?: string;
}

/**
 * Evolving relationship between two characters
 */
export interface CharacterRelationship {
  /** Target character ID */
  targetCharacterId: string;

  /** Target character name (for convenience) */
  targetCharacterName: string;

  /** Current relationship type */
  currentType: RelationshipType;

  /** Current status of this relationship */
  status: 'ACTIVE' | 'FORMER' | 'DECEASED';

  /** Episode when relationship started */
  startEpisode: number;

  /** Episode when relationship ended (if applicable) */
  endEpisode?: number;

  /** Evolution of this relationship over time */
  evolution: RelationshipMoment[];

  /** Notes about this relationship */
  notes?: string;
}

/**
 * Devil Fruit progression over time
 * Tracks when fruit was acquired, techniques learned, awakening
 */
export interface DevilFruitProgression {
  /** Devil Fruit ID */
  devilFruitId: string;

  /** Devil Fruit name */
  devilFruitName: string;

  /** Episode when character acquired the fruit */
  acquiredEpisode: number;

  /** Episode when character lost the fruit (death, etc.) */
  lostEpisode?: number;

  /** Current status */
  status: 'CURRENT' | 'FORMER';

  /** Episode when awakening was revealed (if applicable) */
  awakenedEpisode?: number;

  /** Spoiler severity for fruit acquisition */
  spoilerSeverity: SpoilerSeverity;
}

/**
 * Enhanced character with progressive revelation support and episodic timeline tracking
 *
 * Complete character data model for detailed character pages with:
 * - Basic character information (name, debut, status)
 * - Progressive revelation system (reveals[])
 * - Comprehensive episode appearance tracking (episodeAppearances[])
 * - Curated timeline of key moments (keyMoments[])
 * - Versioned progressions (bounties, affiliations, abilities, status)
 * - Relationship evolution tracking (relationships[])
 *
 * Example use case:
 * - Episode 1: Show Luffy's name, age, dream
 * - Episode 4: Show Shanks relationship
 * - Episode 45: Show first bounty (30M)
 * - Episode 313: Show grandfather (Garp) relationship
 * - Episode 432: Show father (Dragon) relationship
 *
 * Features enabled:
 * - Character arc timeline page with spoiler filtering
 * - Bounty progression visualization
 * - Relationship network graphs
 * - Ability unlock timeline
 * - "Appears in X episodes" statistics
 */
export interface EnhancedCharacter {
  // ============================================
  // Basic Information
  // ============================================

  /** Unique identifier (slug) */
  id: string;

  /** Japanese name */
  japaneseName: string;

  /** Romanized name */
  romanizedName: string;

  /** Official English name */
  englishName: string;

  /** Aliases and alternate names */
  aliases?: string[];

  /** Epithet/title (e.g., "Straw Hat", "Pirate Hunter") */
  epithet?: string;

  /** Debut information */
  debut: {
    chapter?: number;
    episode?: number;
    arc?: string;
    saga?: string;
    raw: string;
  };

  /** Current status */
  status: 'Alive' | 'Deceased' | 'Unknown';

  /** Occupations/roles */
  occupations?: string[];

  /** Character image URL */
  imageUrl?: string;

  // ============================================
  // Physical Attributes
  // ============================================

  /** Birthday */
  birthday?: string;

  /** Age (can be versioned in statusHistory if needed) */
  age?: string;

  /** Height */
  height?: string;

  /** Blood type */
  bloodType?: string;

  // ============================================
  // Voice Actors
  // ============================================

  /** Japanese voice actor */
  japaneseVA?: string;

  /** English voice actor (Funimation) */
  funiEnglishVA?: string;

  // ============================================
  // Episodic Timeline Tracking
  // ============================================

  /**
   * COMPREHENSIVE TRACKING: All episodes where this character appears
   * Used for statistics ("appears in X episodes")
   * Sorted in ascending order
   */
  episodeAppearances: number[];

  /**
   * CURATED TIMELINE: Key moments in character's journey
   * Pivotal events, character development beats, major reveals
   * Sorted by episode number (ascending)
   */
  keyMoments: CharacterMoment[];

  /**
   * Array of progressive revelations for this character
   * Sorted by episode/chapter number (earliest first)
   * @deprecated Consider migrating to keyMoments for consistency
   */
  reveals: CharacterReveal[];

  /**
   * VERSIONED: Bounty progression over time
   * Tracks all bounty increases with episode sourcing
   * Sorted by episode number (ascending)
   */
  bounties: BountyProgression[];

  /**
   * VERSIONED: Affiliation history
   * Tracks crew memberships, organization allegiances over time
   * Sorted by startEpisode (ascending)
   */
  affiliations: AffiliationProgression[];

  /**
   * VERSIONED: Ability progression
   * Tracks new techniques, Haki unlocks, fighting style evolution
   * Sorted by episodeRevealed (ascending)
   */
  abilities: AbilityProgression[];

  /**
   * VERSIONED: Devil Fruit progression
   * Tracks fruit acquisition, techniques, awakening
   */
  devilFruitProgression?: DevilFruitProgression;

  /**
   * VERSIONED: Status history
   * Tracks alive/deceased status changes over time
   * Sorted by episodeChanged (ascending)
   */
  statusHistory: StatusProgression[];

  /**
   * RELATIONSHIP EVOLUTION: Evolving relationships with other characters
   * Tracks how relationships change over time (stranger → ally → crew)
   */
  relationships: CharacterRelationship[];
}

/**
 * Character search/filter options
 */
export interface CharacterFilter {
  status?: 'Alive' | 'Deceased' | 'Unknown';
  affiliation?: string;
  occupation?: string;
  origin?: string; // Blue sea origin
  hasEpithet?: boolean;
  hasBounty?: boolean;
}

/**
 * Helper function to transform raw character data to display format
 */
export function transformCharacterToDisplay(character: Character): CharacterDisplay {
  // Parse debut string (e.g., "Chapter 551; Episode 460")
  const debutMatch = character.Debut.match(/Chapter (\d+)(?:; Episode (\d+))?/);

  return {
    id: character['Romanized Name'].toLowerCase().replace(/\s+/g, '-'),
    japaneseName: character['Japanese Name'],
    romanizedName: character['Romanized Name'],
    englishName: character['Official English Name'],
    debut: {
      chapter: debutMatch?.[1] ? parseInt(debutMatch[1]) : undefined,
      episode: debutMatch?.[2] ? parseInt(debutMatch[2]) : undefined,
      raw: character.Debut,
    },
    affiliations: character.Affiliations.split(';').map(a => a.trim()),
    occupations: character.Occupations.split(';').map(o => o.trim()),
    status: character.Status,
    epithet: character.Epithet,
    bounty: character.Bounty,
  };
}
