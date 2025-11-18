# Episode Research Instructions

**Mission:** Research ONE specific One Piece episode thoroughly and output structured data following our type definitions.

**Input:** Episode number (e.g., "Research Episode 45")

**Output:** `episodes/episode-XXXXX/` folder with JSON data files

---

## Research Process

### Step 1: Find Episode Script(s)

1. Search for the episode script using multiple sources:
   - Official transcripts (Crunchyroll, Funimation)
   - Fan-maintained script databases
   - Wiki episode summaries
   - Multiple language versions (English, Japanese romanized) preferred for accuracy

2. Document all script sources in `sources.json`

3. If multiple scripts found, use them cross-reference for accuracy. (To ensure accuracy, multiple scripts is better than 1)

### Step 2: Read the Episode

Read the full episode while taking detailed notes. Record:
- Timestamps for key moments
- Character interactions and dialogue
- Visual details (animation quality, sakuga moments)
- Opening/ending songs and credits
- Any manga differences or anime-original content

### Step 3: Annotate Line-by-Line → Create Events

As you read the script, identify events worth documenting. Create an `EpisodeEvent` for each:

**Event Types to Look For:**
- `FIRST_APPEARANCE` - Character, location, crew, or devil fruit debuts
- `DEATH` - Character deaths (mark as CRITICAL severity)
- `POWER_REVEAL` - Devil fruit abilities, haki, techniques
- `TECHNIQUE_DEBUT` - New fighting techniques or abilities
- `BACKSTORY_REVEAL` - Character history or flashbacks
- `RELATIONSHIP_REVEAL` - Family ties, friendships, rivalries
- `MAJOR_DECISION` - Character makes life-changing choice
- `BOUNTY_REVEAL` - New bounty posters shown
- `CREW_JOIN` - Character joins a crew
- `CREW_DEPARTURE` - Character leaves a crew
- `LOCATION_ARRIVAL` - Arriving at significant new location
- `LOCATION_DEPARTURE` - Leaving a location
- `BATTLE_START` / `BATTLE_END` - Major fights
- `TREASURE_DISCOVERY` - Finding important items/poneglyphs
- `WORLD_LORE` - Major world-building information
- `PROPHECY_FORESHADOWING` - Setup for future events
- `CULTURAL_MOMENT` - Significant cultural or thematic beat

**For Each Event, Record:**
- **id:** `ep001-event-001` (episode number + sequential counter)
- **timestamp:** "14:32" (approximate time in episode)
- **eventType:** One of the above types
- **spoiler severity:** MINOR / MAJOR / CRITICAL / ULTRA_SECRET (see severity guide below)
- **title:** Short descriptive title
- **description:** 2-3 sentences explaining what happens
- **significance:** Why this moment matters to the story
- **characterIds:** Array of character IDs involved (use kebab-case: "monkey-d-luffy" → "luffy")
- **locationIds:** Array of location IDs where this happens
- **devilFruitIds:** Array of devil fruits involved (if applicable)
- **crewIds:** Array of crews involved (if applicable)
- **quotes:** Key dialogue from this moment
- **images:** Media URLs (official sources preferred)
- **setupInEpisodes:** Episodes that set up this moment (if any)
- **payoffInEpisodes:** Episodes where this pays off (if known - leave empty if unknown)
- **callbacksToEpisodes:** Episodes this references/callbacks to

### Step 4: Extract Entity Data (Incremental)

For each entity that **debuts or changes** in this episode, create data revealed in this episode:

#### Characters (characters.json)
Only include characters that:
- **Debut** in this episode (first appearance)
- Have **key moments** worth documenting
- Receive **new information reveals** (bounty, affiliation, ability, relationship)

For each character, include ONLY:
- Basic identification (names, debut episode)
- `episodeAppearances: [X]` (just this episode number)
- `keyMoments` array with moments from THIS episode only
- Any new `reveals`, `bounties`, `affiliations`, `abilities` discovered in THIS episode
- `relationships` established or evolved in THIS episode

**Do NOT build complete profiles** - just record what's NEW in this episode.

#### Devil Fruits (devil-fruits.json)
Only include if:
- Fruit **debuts** in this episode
- New **ability revealed** in this episode
- **User changes** (someone eats it or previous user dies)

#### Crews (crews.json)
Only include if:
- Crew **debuts** in this episode
- Member **joins or leaves** in this episode
- Crew has a **key moment** in this episode

#### Locations (locations.json)
Only include if:
- Location **debuts** in this episode
- Location has a **key event** in this episode
- Location **status changes** (e.g., destroyed)

**Remember:** Other episodes will fill in the rest. You're only documenting THIS episode's contributions.

### Step 5: Gather External Media

Search for and document (URLs only, no downloads):

#### Official Media
- Episode thumbnail/key visual (Toei Animation, Crunchyroll)
- Character images for featured characters (official art)
- Location images (if new location debuts)
- Opening/ending song information

#### Fan Content & Analysis
- YouTube video analyses
- Podcast episode reviews
- Written articles/editorials
- Reddit discussions
- Blog posts

For each external media item:
- Record URL, title, author, platform, publish date
- Note if it contains spoilers beyond this episode
- Include engagement metrics if available (views, likes, upvotes)
- Add to `external-media.json`

### Step 6: Find Fan Theories

Search for fan theories related to THIS specific episode:
- Reddit threads (r/OnePiece)
- YouTube theory videos
- Discussion forums
- Wiki talk pages

For each theory:
- Record the theory text and author
- Note which episodes it spans
- Mark spoiler status (does it spoil future episodes?)
- Include popularity metrics
- Add to `fan-theories.json`

### Step 7: Document Sources

Every piece of information must be sourced. In `sources.json`, list:
- Episode scripts (all versions found)
- Official websites (Toei, Crunchyroll, Funimation)
- Wiki pages consulted
- Any other references used

Include URL, title, platform, author, access date, and reliability rating.

---

## Spoiler Severity Guide

Assign spoiler severity to each event based on story impact:

**MINOR** - Information that:
- Is common knowledge by this point
- Doesn't significantly impact plot
- Example: Character's favorite food, minor character introduction

**MAJOR** - Information that:
- Reveals important character abilities or backstory
- Significantly advances the plot
- Introduces important locations or organizations
- Example: Luffy's Devil Fruit powers, new crew member joining

**CRITICAL** - Information that:
- Reveals major plot twists
- Character deaths
- Major power reveals (Haki, Awakening)
- Huge backstory revelations
- Example: major villain reveal, world-changing event, new minor power 

**ULTRA_SECRET** - Information that:
- Spoils endgame content
- Reveals series-defining mysteries
- Late-series plot twists
- Example: Character death, Gear 5, One Piece treasure reveals, Void Century secrets

**When in doubt, err on the side of higher severity.** Better to over-protect than spoil.

---

## Output Structure

Create folder: `episodes/episode-XXXXX/` (zero-padded to 5 digits)

**Required Files:**

1. **episode.json** - Core episode data with embedded events array
   - Use `templates/episode-template.json` as reference
   - Include ALL events discovered in `events` array

2. **characters.json** - Array of character updates (minimal/incremental)
   - Use `templates/character-template.json` as reference
   - Only characters that debut or have key moments THIS episode

3. **devil-fruits.json** - Array of devil fruit updates (if applicable)
   - Use `templates/devil-fruit-template.json` as reference

4. **crews.json** - Array of crew updates (if applicable)
   - Use `templates/crew-template.json` as reference

5. **locations.json** - Array of location updates (if applicable)
   - Use `templates/location-template.json` as reference

6. **fan-theories.json** - Array of fan theories about this episode
   - Use `templates/fan-theory-template.json` as reference

7. **external-media.json** - Array of external media (reviews, analyses, etc.)
   - Use `templates/external-media-template.json` as reference

8. **sources.json** - Array of all sources consulted
   - Use `templates/source-template.json` as reference

**Optional File:**

9. **notes.md** - Your personal research notes, observations, or questions

---

## Data Guidelines

### ID Conventions
- Episode events: `ep001-event-001` (zero-padded episode + sequential)
- Character IDs: Use kebab-case of primary name: "Monkey D. Luffy" → "luffy"
- Location IDs: Descriptive kebab-case: "Alvida's Ship" → "alvida-ship"
- Devil Fruit IDs: Romanized Japanese name: "gomu-gomu-no-mi"
- Crew IDs: Descriptive kebab-case: "straw-hat-pirates"

### Timestamps
- Format: "MM:SS" or "HH:MM:SS"
- Approximate is fine - aim for accuracy within 5-10 seconds
- If exact timestamp unknown, estimate based on episode section

### Quotes
- Use exact dialogue when possible
- Include speaker name
- Provide context for why quote is significant
- For Japanese quotes, include romanization if available

### Images/Media URLs
- Prioritize official sources (Toei Animation, Crunchyroll, Funimation)
- If using fan sources, ensure proper credit
- Store URL only - do NOT download or save actual media files
- Include description and credit information

### Cross-References
- When referencing other episodes, use episode numbers
- When referencing characters/locations/crews, use consistent IDs
- Don't worry about bidirectional consistency - that's handled later in merge

---

## Quality Checklist

Before finalizing your research, verify:

**Completeness:**
- [ ] Watched full episode with notes
- [ ] Found and reviewed at least one episode script
- [ ] Created events for all major moments
- [ ] Documented all character debuts
- [ ] Documented all location debuts
- [ ] Documented all devil fruit/ability debuts
- [ ] Searched for external media (YouTube, podcasts, articles)
- [ ] Searched for fan theories
- [ ] Documented all sources

**Accuracy:**
- [ ] All timestamps verified (within 5-10 seconds)
- [ ] Character names match official spellings (English, Japanese, Romanized)
- [ ] Episode number, title, air dates correct
- [ ] Arc and saga names correct
- [ ] Opening/ending song information verified
- [ ] Voice actor credits verified (Japanese and English)

**Severity Ratings:**
- [ ] All events have appropriate severity levels
- [ ] Deaths marked as CRITICAL
- [ ] Major reveals marked as MAJOR or CRITICAL
- [ ] Common information marked as MINOR

**Data Structure:**
- [ ] All required JSON files created
- [ ] JSON is valid (no syntax errors)
- [ ] IDs follow naming conventions
- [ ] Arrays are properly formatted
- [ ] No placeholder text (e.g., "TODO", "FIXME", "example.com")

**Sources:**
- [ ] Every fact has a source
- [ ] All source URLs tested and working
- [ ] Source reliability noted
- [ ] Access dates recorded

**Incremental Approach:**
- [ ] Character data includes ONLY this episode's contributions
- [ ] No attempt to build "complete" character profiles
- [ ] episodeAppearances arrays contain only this episode number
- [ ] Entity data focuses on debuts and changes in THIS episode

---

## Example Workflow

**Input:** "Research Episode 1"

**Output:** `episodes/episode-00001/` containing:

```
episode-001/
├── episode.json          (Episode metadata + 15 embedded events)
├── characters.json       (Luffy, Koby, Alvida minimal profiles)
├── devil-fruits.json     (Gomu Gomu no Mi basic info)
├── crews.json            (Straw Hat Pirates founding, Alvida Pirates)
├── locations.json        (Alvida's Ship, Shells Town)
├── fan-theories.json     (3 theories found)
├── external-media.json   (5 YouTube analyses, 2 podcast episodes, 3 articles)
├── sources.json          (8 sources: scripts, wikis, official sites)
└── notes.md              (Optional research notes)
```

**episode.json** contains:
- Basic episode info (number, title, air dates, arc, saga)
- Opening/ending songs
- Credits (animation director, voice actors)
- a number of events embedded in `events` array (Luffy debut, Gomu Gomu no Pistol, meeting Koby, defeating Alvida, etc.)
- Character/location/devil fruit/crew debut arrays
- Themes, trivia, manga differences

**characters.json** contains:
- Luffy (example only, should contain more data from episode): name, debut, episodeAppearances: [1], 3 key moments, Gomu Gomu fruit, age 17, no bounty yet
- Koby (example only, should contain more data from episode): name, debut, episodeAppearances: [1], 2 key moments, relationship with Luffy
- Alvida (example only, should contain more data from episode): name, debut, episodeAppearances: [1], 1 key moment, captain of Alvida Pirates

**devil-fruits.json** contains:
- Gomu Gomu no Mi (example only, should contain more data from episode): name, type, debut, episodeAppearances: [1], current user: Luffy, 2 abilities revealed

**crews.json** contains:
- Straw Hat Pirates (example only): name, debut, captain: Luffy, 1 member, episodeAppearances: [1], formation key moment
- Alvida Pirates (example only): name, debut, captain: Alvida, episodeAppearances: [1]

**locations.json** contains:
- Alvida's Ship: name, type, debut, episodeAppearances: [1], 2 key events
- Shells Town: name, type, debut, episodeAppearances: [1], mentioned as destination

**Sources cited for all facts. No bidirectional validation needed.**

---

## Final Notes

**Philosophy:** You are creating a **rich, detailed snapshot** of THIS episode only. Future episode research will build on your work. Don't try to be comprehensive about characters or world - just be thorough about what THIS episode reveals.

**Parallel Research:** Multiple agents will research different episodes simultaneously. Your output will be merged with others later. Focus on YOUR episode.

**Quality over Speed:** Take your time to be thorough. A well-researched episode with detailed events, accurate sources, and proper severity ratings is worth more than a rushed job.

**When Stuck:** Refer to `templates/` folder for JSON structure examples. The TypeScript types in `one-piece-types/` define the full data model.

**Questions?** Document them in `notes.md` for human review. 

If you are unable to find the episode script fail and leave a note detailing issue. 

---

**Now go forth and research! Document this episode with the care and detail it deserves!**
