## Usage

### Single Episode Research

Use this prompt to research a single episode:

```
You are a One Piece research agent. Your task is to thoroughly research Episode 1 of One Piece.

Working Directory: /episodic-research/

Instructions:
1. Read the complete instructions in episode_research_prompt.md
2. Review the data structure templates in templates/
3. Research Episode 1 following the 7-step process:
   - Find episode script(s) from multiple sources
   - Read the episode script line-by-line
   - Create EpisodeEvents for all key moments
   - Extract entity data (characters, crews, devil fruits, locations)
   - Gather external media (YouTube analyses, podcasts, articles)
   - Find fan theories about this episode
   - Document all sources

4. Create the output folder: episodes/episode-00001/
5. Generate all required JSON files:
   - episode.json (with embedded events)
   - characters.json
   - devil-fruits.json
   - crews.json
   - locations.json
   - fan-theories.json
   - external-media.json
   - sources.json
   - notes.md (optional)

6. Follow the Quality Checklist in episode_research_prompt.md

Remember:
- Use incremental data - only what's NEW in this episode
- Assign appropriate spoiler severity to all events
- Cite all sources with URLs and reliability ratings
- Be thorough with event annotations and timestamps
- Search extensively for external media and fan content

Output folder: episodes/episode-00001/

Begin research now.
```

**To research a different episode, simply change the episode number throughout the prompt.**

---

### Parallel Episode Research (Small Batch)

Use this prompt to research multiple episodes in parallel (recommended: 5-10 episodes at a time):

```
You are coordinating One Piece episode research. Launch parallel research agents for Episodes 1-10.

Working Directory: /episodic-research/

Task: Create 10 independent research agents, each researching one episode.

For EACH episode (1-10), launch an agent with this task:

---
AGENT [X]: Research Episode [X]

Working Directory: /Users/fernandodelrey/Developer/OnePiece-Web/episodic-research/

Instructions:
1. Read episode_research_prompt.md completely
2. Review templates/ for data structure examples
3. Research Episode [X] following the 7-step process
4. Create output folder: episodes/episode-000[X]/
5. Generate all required JSON files (episode.json, characters.json, etc.)
6. Follow Quality Checklist before finalizing

Key Principles:
- Minimal/incremental data only (what's NEW in this episode)
- Proper spoiler severity ratings
- Thorough source citations
- Extensive external media search
- Detailed event annotations with timestamps

Output: episodes/episode-000[X]/
---

Coordination Notes:
- All agents work independently in parallel
- No cross-episode dependencies
- Each agent outputs to separate folder (episode-00001/, episode-00002/, etc.)
- Monitor progress by checking folder creation
- Review notes.md files for any blockers or questions

Launch all 10 agents now and report progress.
```

**Adjust the episode range (1-10) as needed for your batch size.**

---

### Parallel Episode Research (Large Batch)

For larger batches (e.g., Episodes 1-100), use this approach:

```
You are managing large-scale One Piece episode research for Episodes 1-100.

Working Directory: /Users/fernandodelrey/Developer/OnePiece-Web/episodic-research/

Approach: Launch agents in groups of 10 to manage resources.

Group 1: Episodes 1-10
Group 2: Episodes 11-20
Group 3: Episodes 21-30
...
Group 10: Episodes 91-100

For EACH GROUP, launch 10 parallel agents following this pattern:

---
GROUP [N] - Episodes [START]-[END]

For each episode in this range, launch an independent research agent:

AGENT TASK:
Working Directory: /Users/fernandodelrey/Developer/OnePiece-Web/episodic-research/

1. Read episode_research_prompt.md
2. Research assigned episode following 7-step process
3. Output to episodes/episode-XXXXX/ (zero-padded 5 digits)
4. Generate all required JSON files
5. Complete Quality Checklist

Episode Assignment:
- Agent 1: Episode [START]
- Agent 2: Episode [START+1]
- ...
- Agent 10: Episode [END]

Output Pattern:
- episodes/episode-00001/ through episodes/episode-00100/
---

Execution Plan:
1. Launch Group 1 (Episodes 1-10) - wait for completion
2. Review Group 1 output quality
3. Launch Group 2 (Episodes 11-20) - wait for completion
4. Review Group 2 output quality
5. Continue pattern through Group 10

Progress Tracking:
- After each group, validate JSON syntax
- Check for missing files or placeholder data
- Review severity ratings for consistency
- Verify source citations are present
- Note any episodes that need re-research

Begin with Group 1 now.
```

**This staged approach allows for quality checks between batches.**

---

### Quality Assurance Workflow

After agents complete research, use this validation process:

```bash
# Navigate to episodic research directory
cd /Users/fernandodelrey/Developer/OnePiece-Web/episodic-research/

# Check which episodes have been researched
ls -la episodes/

# Validate JSON syntax for all files in an episode
find episodes/episode-00001/ -name "*.json" -exec jq empty {} \;

# Check for required files in an episode
ls episodes/episode-00001/ | grep -E "(episode|characters|crews|devil-fruits|locations|fan-theories|external-media|sources)\.json"

# Search for placeholder text across all episodes
grep -r "TODO\|FIXME\|example\.com\|XXX" episodes/

# Count events per episode
jq '.events | length' episodes/episode-00001/episode.json

# List all character IDs found in an episode
jq '.debuts.characters[]' episodes/episode-00001/episode.json

# Verify source citations exist
jq 'if . == [] then "WARNING: No sources" else "OK" end' episodes/episode-00001/sources.json
```

---