# Episodic Research System

This directory contains the infrastructure for parallel agentic research of One Piece episodes. Each episode is researched independently by Claude agents, creating rich, structured data that feeds into the main website.

## Overview

**Goal:** Research all One Piece episodes (1000+) through parallel agent execution, building a comprehensive database of events, characters, locations, devil fruits, crews, and external content.

**Approach:** Each agent researches ONE episode independently, creating minimal/incremental data structures. These are later merged into the complete database.

**Output:** Structured JSON data following TypeScript type definitions, ready for website integration.

---

## Directory Structure

```
episodic-research/
├── README.md                          # This file
├── episode_research_prompt.md         # Main instruction file for agents
│
├── one-piece-types/                   # TypeScript type definitions
│   ├── arc.ts                         # Story arc structure
│   ├── character.ts                   # Enhanced character with progressive revelation
│   ├── crew.ts                        # Crew/organization timeline
│   ├── devilFruit.ts                  # Devil fruit progression
│   ├── episode.ts                     # Core episode structure
│   ├── event.ts                       # Event-based content with spoiler protection
│   ├── spoiler.ts                     # Spoiler management system
│   └── worldBuilding.ts               # Location timeline
│
├── templates/                         # JSON templates for agents
│   ├── episode-template.json          # Episode metadata with embedded events
│   ├── character-template.json        # Minimal character data structure
│   ├── devil-fruit-template.json      # Minimal devil fruit data structure
│   ├── crew-template.json             # Minimal crew data structure
│   ├── location-template.json         # Minimal location data structure
│   ├── fan-theory-template.json       # Fan theory structure
│   ├── external-media-template.json   # External media structure
│   └── source-template.json           # Source citation structure
│
└── episodes/                          # Episode research output (created by agents)
    ├── episode-00001/                   # Episode 1 research
    │   ├── episode.json               # Core episode data + embedded events
    │   ├── characters.json            # Character debuts/updates for this episode
    │   ├── devil-fruits.json          # Devil fruit debuts/updates (if any)
    │   ├── crews.json                 # Crew debuts/updates (if any)
    │   ├── locations.json             # Location debuts/updates (if any)
    │   ├── fan-theories.json          # Fan theories about this episode
    │   ├── external-media.json        # Reviews, analyses, podcasts, etc.
    │   ├── sources.json               # Source citations
    │   └── notes.md                   # Optional research notes
    │
    ├── episode-00002/                   # Episode 2 research
    │   └── ... (same structure)
    │
    └── episode-XXXXX/                   # Continues for all episodes
        └── ...
```

---

## How It Works

### 1. Agent Assignment

Each Claude agent is assigned ONE episode to research:
- Agent 1: Episode 1
- Agent 2: Episode 2
- Agent 3: Episode 3
- ... (parallel execution)

### 2. Research Process

Each agent follows `episode_research_prompt.md`:

1. **Find Scripts** - Search for episode scripts from multiple sources
2. **Read Episode** - Read episode script while taking detailed notes
3. **Annotate Line-by-Line** - Create EpisodeEvents for key moments
4. **Extract Entity Data** - Document character/location/devil fruit/crew debuts and changes
5. **Gather Media** - Find official images, fan content, analyses
6. **Find Fan Theories** - Search Reddit, YouTube, forums for theories
7. **Document Sources** - Cite all information sources

### 3. Output Creation

Each agent creates a `episodes/episode-XXXXX/` folder with JSON files following the templates.

**Key Principle: Minimal/Incremental Data**

Agents only document what's **new or changed** in their episode:
- Character debuts → Full minimal profile
- Character key moment → Add to `keyMoments` array only
- New bounty → Add to `bounties` array only
- New ability → Add to `abilities` array only

**DO NOT** try to build complete entity profiles. Just record THIS episode's contributions.

### 4. Data Merging (Post-Research)

After all episodes are researched, a separate process merges the incremental data:
- Combines `episodeAppearances` arrays across all episodes
- Merges `keyMoments` chronologically
- Validates bidirectional references
- Builds complete character/crew/devil fruit profiles

---

### Manual Research Workflow

If you're a human researcher (not an AI agent), follow this process:

**Step 1: Prepare**
1. Open `episode_research_prompt.md` in one window
2. Open `templates/episode-template.json` in another window
3. Have One Piece episode ready to watch
4. Prepare note-taking tool

**Step 2: Research**
1. Find episode script from 2+ sources
2. Watch episode while reading script line-by-line
3. Take detailed notes on events, characters, locations
4. Search web for external media (YouTube, podcasts, Reddit)
5. Document all sources with URLs

**Step 3: Create Output**
1. Create folder: `episodes/episode-XXXXX/` (zero-padded 5 digits)
2. Copy templates from `templates/` folder
3. Fill in data based on your research notes
4. Validate JSON syntax using online validator or `jq`
5. Run through Quality Checklist in prompt

**Step 4: Quality Check**
- ✅ All required JSON files present
- ✅ No placeholder text remaining
- ✅ All events have severity ratings
- ✅ All facts have source citations
- ✅ Minimal/incremental approach followed
- ✅ External media searched thoroughly

---

## Data Architecture

### Event-Based Structure

Episodes are collections of **EpisodeEvents**. Each event:
- Has a unique ID (`ep001-event-001`)
- Has a spoiiler severity level (MINOR, MAJOR, CRITICAL, ULTRA_SECRET)
- References entities (characters, locations, devil fruits, crews)
- Can have timestamps, quotes, images
- Can setup/payoff/callback to other episodes

This enables:
- Granular spoiler control (show some events, hide others)
- Timeline visualization across episodes
- Character arc tracking through event references

### Hybrid Granularity

Entities track both:
- **Comprehensive:** `episodeAppearances: number[]` (every appearance)
- **Curated:** `keyMoments` / `keyEvents` (only pivotal moments)

This prevents data bloat while enabling both statistics and storytelling.

### Progressive Revelation

Characters, crews, and world elements reveal information gradually:
- Character's true identity revealed in episode 313
- Bounties updated at specific episodes
- Relationships evolve over time
- Status changes (alive → deceased) at specific episodes

Incremental data naturally supports this - each episode adds what's newly revealed.

### Bidirectional Linking

Events reference entities, entities reference events:
- `EpisodeEvent.characterIds` → `EnhancedCharacter.episodeAppearances`
- `EpisodeEvent.eventId` → `CharacterMoment.eventId`

**Note:** Agents DON'T validate this during research. Merge process handles it.

---

## Type System Summary

**Core Types:**

- **Episode** (`episode.ts`) - Episode metadata with embedded events array
- **EpisodeEvent** (`event.ts`) - Individual story moment with spoiler protection
- **EnhancedCharacter** (`character.ts`) - Character with progressive revelation and episodic timeline
- **EnhancedDevilFruit** (`devilFruit.ts`) - Devil fruit with user progression and ability reveals
- **EnhancedCrew** (`crew.ts`) - Crew with member progression and key moments
- **EnhancedLocation** (`worldBuilding.ts`) - Location with status progression and key events
- **FanTheory** (`event.ts`) - Fan theory with spoiler metadata
- **EpisodeMedia** (`event.ts`) - External media (reviews, analyses, podcasts)
- **Source** (`event.ts`) - Source citation

**Spoiler System:**

- `SpoilerSeverity` - MINOR, MAJOR, CRITICAL, ULTRA_SECRET
- `SpoilerPreferences` - User's viewing progress + sensitivity settings
- Filtering functions - `shouldShowEvent()`, `shouldShowFanTheory()`, etc.

See type files for complete definitions.

---

## Best Practices

### For Agents

✅ **DO:**
- Be thorough with details discovered in YOUR episode
- Use multiple script sources for accuracy
- Cite all information with reliable sources
- Use appropriate severity ratings
- Create detailed event descriptions
- Include timestamps for key moments
- Search extensively for external media and fan theories

❌ **DON'T:**
- Try to build "complete" character profiles
- Include information from other episodes (unless as cross-reference)
- Download media files (URLs only)
- Skip source citations
- Use placeholder values (e.g., "TODO", "example.com")
- Worry about bidirectional reference validation

### For Quality Review

✅ **Check:**
- All required JSON files present
- Valid JSON syntax
- Consistent ID naming conventions
- Appropriate severity ratings
- Working source URLs
- Minimal/incremental approach followed

❌ **Red Flags:**
- Missing source citations
- Placeholder text still present
- Empty required fields
- Overly complete entity profiles (should be minimal)
- Severity ratings seem off
- Missing external media (every episode has analysis videos/articles)

---

## Examples

**Episode 1 Research Output:**

```
episodes/episode-00001/
├── episode.json          # 15 events embedded (Luffy debut, Gomu Gomu Pistol, etc.)
├── characters.json       # Luffy, Koby, Alvida (minimal profiles)
├── devil-fruits.json     # Gomu Gomu no Mi (basic info + 2 abilities)
├── crews.json            # Straw Hat Pirates founding, Alvida Pirates
├── locations.json        # Alvida's Ship, Shells Town
├── fan-theories.json     # 3 theories found
├── external-media.json   # 5 YouTube videos, 2 podcasts, 3 articles
├── sources.json          # 8 sources (scripts, wikis, official sites)
└── notes.md              # Agent's research notes
```

**Episode 45 Research Output:**

```
episodes/episode-045/
├── episode.json          # 12 events (ongoing story moments)
├── characters.json       # Only NEW characters or significant updates
├── devil-fruits.json     # Only if new fruit debuts or ability revealed
├── crews.json            # Only if crew changes membership or has key moment
├── locations.json        # Only if new location or key event at existing location
├── fan-theories.json     # Theories specific to this episode
├── external-media.json   # Reviews and analyses of episode 45
├── sources.json          # All sources consulted
└── notes.md              # Optional
```

Notice: Episode 45 might have fewer entity files if no new characters/fruits/crews debut.

---

## FAQ

**Q: How many episodes need to be researched?**
A: 1000+ episodes and counting. This is a long-term project.

**Q: Can multiple agents research the same episode?**
A: Not recommended. Each episode should be researched once. If quality issues found, re-research that specific episode.

**Q: What if an episode has no character debuts?**
A: That's fine! Just create the required files. `characters.json` can be an empty array `[]`. Same for other entity files.

**Q: How detailed should event descriptions be?**
A: 2-3 sentences explaining what happens and why it matters. Be concise but informative.

**Q: Should I include filler episodes?**
A: Yes. Research ALL episodes, including filler. Mark filler status in episode metadata.

**Q: What about episode timestamps?**
A: Approximate is fine. Aim for accuracy within 5-10 seconds. If unsure, estimate based on episode section (opening, early, middle, climax, ending).

**Q: How do I know if something is MAJOR vs CRITICAL severity?**
A: MAJOR = important to plot/character. CRITICAL = major twist, death, or series-defining moment. When in doubt, go higher.

**Q: What if I can't find an episode script?**
A: Do your best with wiki summaries and watching the episode. Note in `sources.json` that script wasn't available.

**Q: Should I include spoilers in descriptions?**
A: Yes, be thorough in descriptions. The severity rating controls visibility. Don't self-censor information - let the spoiler system handle it.

**Q: What about recap episodes or clip shows?**
A: Research them normally. They often have new content (frame story, new scenes). Mark as recap in episode metadata if applicable.

---


## Contributing

This system is designed for AI agent execution, but humans can contribute:
- Quality review of agent output
- Source validation
- Severity rating adjustments
- External media discovery
- Fan theory curation

See main project `CLAUDE.md` for contribution guidelines.

---

**Happy Researching! Let's build the ultimate One Piece episode database!** 🏴‍☠️
