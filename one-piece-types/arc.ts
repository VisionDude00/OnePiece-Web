/**
 * Story Arc type definition based on the One Piece story arcs database
 *
 * Arcs define episode/chapter ranges and serve as organizational units for content.
 * Enhanced with bidirectional references to related entities.
 */

export interface Arc {
  /** Unique identifier (slug, e.g., "arlong-park-arc") */
  id?: string;

  /** Arc name */
  arc_name: string;

  /** Parent saga */
  saga: string;

  /** Chapter range (e.g., "1-7" or "1094-present") */
  chapter_range: string;

  /** Episode range (e.g., "1-4" or "1089-present") */
  episode_range: string;

  /** Volume range (e.g., "1" or "1-3") */
  volume_range: string;

  /** Spoiler-free description */
  spoiler_free_description: string;

  /** Key plot points (semicolon-separated) */
  key_plot_points: string;

  /** Is this arc filler */
  is_filler: boolean;

  /** Anime-only filler episodes within this arc */
  anime_only_filler_episodes: number[];

  // ============================================
  // Optional Enhanced Fields for Bidirectional Linking
  // ============================================

  /**
   * Main characters featured in this arc
   * Bidirectional: Characters should list this arc in relatedArcs
   */
  featuredCharacterIds?: string[];

  /**
   * Primary location(s) for this arc
   * Bidirectional: Locations should list this arc in relatedArcs
   */
  primaryLocationIds?: string[];

  /**
   * Crews prominently featured in this arc
   * Bidirectional: Crews should list this arc in relatedArcs
   */
  featuredCrewIds?: string[];

  /**
   * Devil Fruits revealed or prominently used in this arc
   */
  devilFruitIds?: string[];

  /**
   * Arc thumbnail/cover image URL
   */
  imageUrl?: string;

  /**
   * Primary theme or focus of the arc
   */
  theme?: string;

  /**
   * Arc status (for ongoing arcs)
   */
  status?: 'COMPLETED' | 'ONGOING';
}

/**
 * Parsed chapter/episode range for easier filtering
 */
export interface ChapterRange {
  start: number;
  end: number | 'present';
}

export interface EpisodeRange {
  start: number;
  end: number | 'present';
}

/**
 * Simplified arc display data for UI components
 */
export interface ArcDisplay {
  id: string; // Generated from arc_name
  name: string;
  saga: string;
  chapters: ChapterRange;
  episodes: EpisodeRange;
  description: string;
  keyPlotPoints: string[];
  isFiller: boolean;
  fillerEpisodes: number[];
  imageUrl?: string; // Path to arc thumbnail
}

/**
 * Arc filter options for browsing
 */
export interface ArcFilter {
  saga?: string;
  isFiller?: boolean;
  hasAnimatedEpisodes?: boolean;
}

/**
 * Helper function to parse range strings like "1-7" or "1094-present"
 */
export function parseRange(rangeStr: string): { start: number; end: number | 'present' } {
  const [startStr, endStr] = rangeStr.split('-');
  const start = parseInt(startStr);
  const end = endStr === 'present' || endStr === undefined ? 'present' : parseInt(endStr);

  return { start, end };
}

/**
 * Helper function to transform raw arc data to display format
 */
export function transformArcToDisplay(arc: Arc): ArcDisplay {
  return {
    id: arc.arc_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    name: arc.arc_name,
    saga: arc.saga,
    chapters: parseRange(arc.chapter_range),
    episodes: parseRange(arc.episode_range),
    description: arc.spoiler_free_description,
    keyPlotPoints: arc.key_plot_points.split(';').map(p => p.trim()),
    isFiller: arc.is_filler,
    fillerEpisodes: arc.anime_only_filler_episodes,
  };
}

/**
 * Check if a chapter number falls within an arc's range
 */
export function isChapterInArc(chapterNumber: number, arc: Arc): boolean {
  const range = parseRange(arc.chapter_range);
  return chapterNumber >= range.start && (range.end === 'present' || chapterNumber <= range.end);
}

/**
 * Check if an episode number falls within an arc's range
 */
export function isEpisodeInArc(episodeNumber: number, arc: Arc): boolean {
  const range = parseRange(arc.episode_range);
  return episodeNumber >= range.start && (range.end === 'present' || episodeNumber <= range.end);
}
