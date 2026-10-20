import React from 'react';
import Callout from '@/features/Blog/components/Callout';
import CodeBlock from '@/features/Blog/components/CodeBlock';
import Reveal from '@/features/Blog/components/Reveal';
import { lazyOnView } from '@/features/Blog/components/LazyOnView';
import BlogTable from '@/features/Blog/components/BlogTable';

// Every widget sits below the first screen: its HTML is in the static page, its JS loads on scroll.
const AgentCapacityEstimator = lazyOnView(() => import('./widgets/capacity/components/AgentCapacityEstimator'));
const SystemMapVisualizer = lazyOnView(() => import('./widgets/systemMap/components/SystemMapVisualizer'));
const ChatTurnSequenceDiagram = lazyOnView(() => import('./widgets/chatTurnSequence/components/ChatTurnSequenceDiagram'));
const MemorySequenceDiagram = lazyOnView(() => import('./widgets/memorySequence/components/MemorySequenceDiagram'));
const DelegationSequenceDiagram = lazyOnView(() => import('./widgets/delegationSequence/components/DelegationSequenceDiagram'));
const HitlSequenceDiagram = lazyOnView(() => import('./widgets/hitlSequence/components/HitlSequenceDiagram'));

export default function EchoAgentService() {
  return (
    <div className="blog-content-static">
      <p>One agent on a laptop is a loop, a model and a few tools. Serving agents to thousands of people is a different problem. Missions run for tens of seconds and stream the whole time, agents spawn other agents, every model call costs money, and the system still has to be easy to change next month.</p>

      <p>This post designs that service. The goal is three things at once: it <strong>scales</strong> by adding boxes, it stays <strong>fast</strong> where users feel it, and it stays <strong>maintainable</strong> as models, prompts and tools change. The examples come from Echo, an agent platform I built with a Go gateway and a Bun agent engine, but the patterns apply to any stack.</p>

      <ul>
        <li><strong>Estimate the load</strong> and see which limit you hit first. It is rarely the CPU.</li>
        <li><strong>Replay the system map</strong> to follow a chat turn, a memory call and a cancelled mission across every service.</li>
        <li><strong>Follow a sub-agent</strong> from the parent&apos;s tool call to its result.</li>
      </ul>

      <p>The code is in the <a href="https://github.com/DaffaAdityaDev/echo" target="_blank" rel="noopener noreferrer">echo repository on GitHub</a>.</p>

      <Reveal>
        <h2>Requirements</h2>

        <h3>What the service must do</h3>
        <ul>
          <li><strong>Run missions.</strong> An agent plans, calls tools and streams its reasoning and answer as it goes.</li>
          <li><strong>Run many agents.</strong> An agent can hand a sub-task to a specialised sub-agent, and many users run missions at the same time.</li>
          <li><strong>Remember.</strong> A session keeps its history, and a mission can save and reload its state.</li>
          <li><strong>Serve many clients.</strong> Any client that speaks HTTP and SSE can use the same agents. Today that is a web app, with early desktop and chat-bot prototypes.</li>
          <li><strong>Ask before acting.</strong> Risky tools wait for a human to approve them.</li>
        </ul>

        <h3>How well it must do it</h3>
        <ul>
          <li><strong>It scales horizontally.</strong> More users means more replicas, not a bigger machine or a rewrite.</li>
          <li><strong>The first token is fast.</strong> Users see the agent start working within a second or two, even if the mission takes a minute.</li>
          <li><strong>Cost has a ceiling.</strong> No mission, loop or sub-agent can spend without limit.</li>
          <li><strong>Change is cheap.</strong> A new model, prompt or tool is a config change or one new file, not a cross-service rewrite.</li>
          <li><strong>Failures stay small.</strong> A broken tool, a dead replica or a closed tab affects one mission, not the service.</li>
        </ul>

        <h3>Edge cases: what goes wrong at scale</h3>
        <BlogTable>
          <thead>
            <tr>
              <th>The situation</th>
              <th>What goes wrong</th>
              <th>What the system should do</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Traffic doubles at lunch</td>
              <td>Missions queue behind full replicas.</td>
              <td>Keep agents stateless so new replicas take traffic at once.</td>
            </tr>
            <tr>
              <td>The model provider rate-limits you</td>
              <td>Every mission fails at the same moment.</td>
              <td>Estimate tokens per minute up front and cut them with prompt caching and shorter context.</td>
            </tr>
            <tr>
              <td>An agent repeats the same tool call forever</td>
              <td>It burns tokens and never answers.</td>
              <td>Detect loops, cap iterations and cap cost per mission.</td>
            </tr>
            <tr>
              <td>Sub-agents spawn sub-agents</td>
              <td>The tree grows without bound.</td>
              <td>Limit delegation depth.</td>
            </tr>
            <tr>
              <td>A tool keeps failing</td>
              <td>Every mission retries it and slows down.</td>
              <td>Open a circuit breaker for that tool and degrade gracefully.</td>
            </tr>
            <tr>
              <td>A user closes the tab mid-answer</td>
              <td>The model keeps generating tokens nobody reads.</td>
              <td>Cancel the mission and keep what was written.</td>
            </tr>
            <tr>
              <td>A session grows to a million tokens</td>
              <td>Every call carries megabytes of history.</td>
              <td>Budget the history and summarise old turns.</td>
            </tr>
            <tr>
              <td>The prompt team ships a new prompt</td>
              <td>A redeploy, or worse, a half-updated fleet.</td>
              <td>Version prompts in storage and let agents pick up the active one.</td>
            </tr>
          </tbody>
        </BlogTable>
      </Reveal>

      <Reveal>
        <h2>Estimating the load</h2>

        <p>An agent mission is not a normal request. It holds a stream open for its whole length and spends most of that time <em>waiting</em>: for the model to generate, for a tool to answer. So the useful numbers are not requests per second but <strong>open streams</strong> and <strong>tokens per minute</strong>. Little&apos;s law gives the first one: open streams equal the arrival rate times how long each one lasts.</p>
      </Reveal>

      <AgentCapacityEstimator />

      <Reveal>
        <p>Play with the defaults and a pattern shows up. A few replicas hold every open stream, because a waiting stream costs almost no CPU. The number that explodes is tokens per minute, and that one is capped by the model provider, not by your servers. So the design has two jobs: keep the agent tier easy to multiply, and treat every token as the scarce resource.</p>

        <Callout variant="warning" title="The first wall is someone else's">
          Provider rate limits are per account and per minute. Doubling your replicas does nothing for them. Prompt caching, a history budget and fewer wasted iterations do.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>High-level design</h2>

        <p>The core decision is to split the system into a <strong>control plane</strong> and an <strong>execution plane</strong>. The control plane is a gateway that knows about users, sessions, tiers, history and storage. The execution plane is a pool of agent workers that know only how to run a mission. Clients only ever talk to the gateway.</p>

        <BlogTable>
          <thead>
            <tr>
              <th>Tier</th>
              <th>In Echo</th>
              <th>Owns</th>
              <th>Scales on</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Clients</td>
              <td>Next.js (Electron and Discord prototypes)</td>
              <td>Rendering the stream, asking for approvals</td>
              <td>Users</td>
            </tr>
            <tr>
              <td>Gateway (control plane)</td>
              <td>Go, Fiber v3</td>
              <td>Auth, tiers, sessions, model choice, history, storage, the SSE relay</td>
              <td>Open connections</td>
            </tr>
            <tr>
              <td>Agent workers (execution plane)</td>
              <td>Bun, Hono, LangChain model clients</td>
              <td>The mission loop, tools, model providers, guardrails</td>
              <td>Open missions</td>
            </tr>
            <tr>
              <td>Storage</td>
              <td>Postgres, Redis</td>
              <td>Sessions, messages, prompts, memory, caches</td>
              <td>Writes per second</td>
            </tr>
          </tbody>
        </BlogTable>

        <p>Each tier scales on a different signal, which is the point of the split: you can add agent workers without touching the database, and change how users log in without redeploying a single agent. The map below plays the three paths that matter most.</p>
      </Reveal>

      <SystemMapVisualizer />

      <Reveal>
        <Callout variant="tip" title="Why not let agents talk to the database?">
          It is faster to write, and it welds every worker to the schema. With the gateway in between, a worker needs no driver, no pool and no migrations, a schema change touches one service, and every read and write passes one place where it can be logged and limited.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>Scaling the agent tier</h2>

        <p>Horizontal scaling only works if any worker can serve any request. That means a worker must not be the only place where anything lives. Echo gets there with three rules.</p>

        <h3>1. Everything a mission needs arrives with it</h3>
        <p>The gateway resolves the user, the model, the history and the settings, and sends them in one payload. The worker does not look anything up about the user. The only things it fetches are the tenant&apos;s active prompt (through the gateway, cached for 60 seconds) and the session&apos;s saved mission state, so a brand-new replica can take the next mission with no warm-up.</p>

        <CodeBlock language="json" title="POST {agent}/api/v1/generate-mission?mode=agent (trimmed)">{`{
  "user_id": "42",
  "session_id": "6f1c2a4e-8b7d-4f3a-9c2e-1d5b7a9e0f12",
  "tenant_id": "default",
  "message": "Compare the last three releases",
  "model": "claude-sonnet-...",
  "history": [{ "role": "system", "content": "Summary of earlier turns..." }],
  "provider_config": {
    "type": "anthropic",
    "base_url": "https://api.anthropic.com",
    "model": "claude-sonnet-...",
    "max_context_tokens": 200000,
    "api_key": "..."
  },
  "features": [],
  "strategy_version": "nlah:v1"
}`}</CodeBlock>

        <h3>2. State goes out, through the gateway</h3>
        <p>A mission&apos;s working state, and a mission paused for approval, are saved through the gateway&apos;s internal memory routes. The gateway keeps each in a Redis list keyed by user and session (a paused mission gets its own list per approval), with the expiry the agent asks for: 10 minutes for mission state, 5 for a paused mission. Long-lived data (sessions, messages, prompt versions) lives in Postgres. When a worker dies, nothing is lost that another worker cannot load. This is the <code>STATE_BACKEND=backend</code> setting the production config uses; the default keeps state in the worker&apos;s memory, which is only fine for a single replica.</p>
      </Reveal>

      <MemorySequenceDiagram />

      <Reveal>
        <p>Some state is allowed to stay inside a worker, as long as losing it is harmless: the handle used to abort a running mission, and the marker that says a mission is already running. The rule is not &quot;no state&quot;, it is &quot;no state you would miss&quot;.</p>

        <h3>3. Scale on open missions, not CPU</h3>
        <p>A worker streaming ten missions and a worker streaming two hundred look the same on a CPU graph, because both are mostly waiting. Autoscale the agent tier on the number of open missions per replica, and keep headroom so one replica can die without a queue forming. The gateway scales the same way, on open connections.</p>

        <h3>Two guards that keep the pool honest</h3>
        <ul>
          <li><strong>One turn per session at a time.</strong> The gateway takes a per-session lock before each turn: an in-process lock, plus a Redis lock (<code>SET NX</code> with a 5-minute expiry, renewed while the turn streams) so turns stay ordered across gateway replicas. Two quick messages never get the same turn number or overwrite each other.</li>
          <li><strong>No listener, no mission.</strong> When the user presses Stop, the gateway cancels the mission from three sides: the agent&apos;s cancel endpoint, its own request context, and closing the connection. The cancel call only reaches one agent replica, so closing the connection is the step that always works. When the client just disconnects, the last two are enough, because the closed connection fires the agent&apos;s abort handler. A worker never keeps generating tokens for nobody.</li>
        </ul>
      </Reveal>

      <Reveal>
        <h2>A chat turn, end to end</h2>

        <p>The client sends almost nothing: a message, a session id (left out for a new chat), and optionally a model or mode that overrides the saved defaults. Features, skills and settings come only from the user&apos;s saved preferences on the server, so a client cannot ask for a feature it is not allowed to use. Everything else is the gateway&apos;s job, done before the mission starts.</p>
      </Reveal>

      <ChatTurnSequenceDiagram />

      <Reveal>
        <ol>
          <li><strong>Who and what tier.</strong> The user id comes from the signed JWT, and the tier is looked up by that id and cached in Redis for 60 seconds.</li>
          <li><strong>Whose session.</strong> The session is loaded and its owner compared with the caller.</li>
          <li><strong>How much history.</strong> History is packed newest first into a 50,000-token budget, from at most the last 200 messages. Once a session reaches 100,000 tokens, the gateway pauses the turn and asks the agent to summarise the oldest turns, never the latest 10. Those turns are deleted, and the summary is sent ahead of the history from then on. A background worker does the same for long sessions that have gone idle.</li>
          <li><strong>Which model.</strong> The model id becomes a full <code>provider_config</code> from the user&apos;s saved provider settings.</li>
          <li><strong>One turn at a time.</strong> A per-session lock makes turns wait their turn. Inside one Postgres transaction the gateway locks the session row, takes the next turn number, and writes the user message plus an empty assistant placeholder.</li>
        </ol>
        <p>Then the worker streams packets back, and the gateway relays them line by line while saving the answer text to the placeholder every 2 seconds. A crash, a cancel or a closed tab leaves an interrupted turn with everything written so far, and a refresh rebuilds the chat from Postgres, minus any turns already folded into the summary.</p>
      </Reveal>

      <Reveal>
        <h2>Multi-agent: delegation</h2>

        <p>Some missions are better split. A research question might need one agent to search, one to read, and one to write the answer. Echo handles this with a single tool, <code>delegate_task</code>. The parent agent calls it like any other tool, with an <code>agentName</code>, an <code>instruction</code> and a <code>systemPrompt</code> for the sub-agent.</p>
      </Reveal>

      <DelegationSequenceDiagram />

      <Reveal>
        <p>The sub-agent is a <strong>new harness in the same process</strong>, running its own loop with its own prompt, on the parent&apos;s provider and tools. Three choices make this scale well:</p>
        <ul>
          <li><strong>A clean context by default.</strong> The child starts with only its instruction, unless the parent sets <code>fork_context</code> to share its history. The child&apos;s whole working conversation never enters the parent&apos;s context; only its final text comes back, as one tool result. That keeps the parent&apos;s prompt short and its cache warm.</li>
          <li><strong>One stream for everything.</strong> The child&apos;s packets are re-tagged with the parent&apos;s mission id and flow out on the parent&apos;s stream, so the user watches the sub-agent work, and the gateway needs no new connection or protocol.</li>
          <li><strong>A depth limit.</strong> Each child runs one level deeper. At depth 3 the <code>delegate_task</code> tool is removed from the agent&apos;s toolbox, so delegation can never recurse without end.</li>
        </ul>

        <Callout variant="note" title="In-process or a separate service?">
          Running sub-agents in the same process means no network hop and no new queue, but a mission with three sub-agents counts as four model loops on one replica. That is why the capacity estimate counts model calls per mission, not missions. When sub-agents need different hardware or very long runs, the same tool interface can post the instruction to another worker pool instead.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>Keeping it fast</h2>

        <p>Users judge an agent by how quickly it starts and how steadily it moves. Most of the speed comes from not doing work twice.</p>

        <BlogTable>
          <thead>
            <tr>
              <th>Technique</th>
              <th>How Echo does it</th>
              <th>What it saves</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Stream everything</td>
              <td>The gateway relays SSE line by line and flushes each one, with proxy buffering turned off</td>
              <td>Time to first token: the user sees reasoning within the first model chunk</td>
            </tr>
            <tr>
              <td>Prompt caching</td>
              <td>Stable parts first: tool definitions, then the system prompt, then history, then the new turn; Anthropic calls mark the system prompt and each tool with <code>cache_control</code></td>
              <td>Input tokens for the stable prefix on every call after the first, in both money and latency</td>
            </tr>
            <tr>
              <td>Load only the tools you need</td>
              <td>Each mission gets only the tools it asks for; without an explicit list, a keyword retriever picks up to 8 that match the request</td>
              <td>Tool schemas in every prompt</td>
            </tr>
            <tr>
              <td>Budget the context</td>
              <td>A 50,000-token history budget, summaries past 100,000, and compaction of middle turns when a mission nears the model&apos;s window</td>
              <td>Token cost, latency, and context-overflow errors</td>
            </tr>
            <tr>
              <td>Cache what rarely changes</td>
              <td>Tiers for 60 s, the feature and skill catalogs for 10 min, active prompts for 60 s, all in Redis</td>
              <td>A database or agent round trip on every message</td>
            </tr>
            <tr>
              <td>Keep slow work out of locks</td>
              <td>The user message is tokenized before the session lock is taken</td>
              <td>One slow call blocking every turn in the session</td>
            </tr>
          </tbody>
        </BlogTable>

        <p>Prompt caching only works if the start of the prompt never moves. That gives a simple rule for everyone who touches the agent:</p>

        <CodeBlock language="plain" title="Prompt layout, from most to least stable">{`1. tool definitions   fixed for the whole mission     → cached
2. system prompt      fixed for the whole mission     → cached
3. year anchor        one line, fixed                 → after this, nothing is cached yet
4. history            grows only at the end
5. latest turn        new every call                  → never cached

Rules: append, never insert. Compact the middle, keep the start.`}</CodeBlock>

        <p>The anchor is a one-line system message with the current year, so the model does not guess the date. Echo breaks its own rule in one place today: a per-call timestamp sits in the system text, which stops the cache after the tools. Moving it to the end of the prompt is the next fix.</p>
      </Reveal>

      <Reveal>
        <h2>Keeping it under control</h2>

        <p>An agent decides its own next step, so it can also decide to do something expensive forever. Every mission runs inside a <strong>harness</strong> that watches the loop and stops it before it hurts. These are Echo&apos;s defaults; users can tune most of them in their settings:</p>

        <BlogTable>
          <thead>
            <tr>
              <th>Guard</th>
              <th>Default</th>
              <th>What it stops</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Iteration cap</td><td>15 loop iterations</td><td>A mission that never converges</td></tr>
            <tr><td>Budget monitor</td><td>$1.00 and 2 minutes per mission, sub-agent costs included</td><td>One mission draining the account</td></tr>
            <tr><td>Loop detector</td><td>The same tool call with identical arguments 3 times in a row, or two consecutive replies with word-level cosine similarity of 0.92 or more</td><td>An agent repeating itself; the repeated call is skipped and the agent is told to try something else</td></tr>
            <tr><td>Circuit breaker</td><td>Opens after 3 failures in a row of the same tool</td><td>Retrying a broken tool on every step</td></tr>
            <tr><td>Graceful degradation</td><td>After 3 failed iterations in a row, restricted mode with no tools; after 5, a plain direct answer with trimmed history; abort after 7</td><td>A mission stuck on failing tools, which still gets an answer from the model&apos;s knowledge</td></tr>
            <tr><td>Delegation depth</td><td>3 levels</td><td>Sub-agents spawning sub-agents forever</td></tr>
            <tr><td>Heartbeat and stall detection</td><td>Heartbeat every 5 s, stalled after 10 s without output</td><td>A frozen stream that looks alive</td></tr>
          </tbody>
        </BlogTable>

        <p>The guards also show up on the stream. A <code>state_change</code> packet moves the agent between states such as running, looping, degraded, stalled and aborted, and loop and budget hits also send a <code>system_notice</code>, so the client can show what the agent is doing instead of a spinner that might be lying.</p>
      </Reveal>

      <Reveal>
        <h2>Keeping it maintainable</h2>

        <p>Maintainability in an agent system mostly means one thing: the parts that change often (models, prompts, tools, strategies) must be cheap to change without touching the parts that do not.</p>

        <h3>Registries instead of if-statements</h3>
        <ul>
          <li><strong>Providers.</strong> A small factory maps a provider type to a class: OpenAI, Anthropic, LM Studio and OpenCode Go. A new model API is one class, one registry entry, and its name in the provider lists on the agent, the gateway and the web settings form. The harness and the chat flow do not change.</li>
          <li><strong>Tools.</strong> Built-in tools are registered by name, picked up from a definitions folder at boot. MCP servers are discovered at runtime, with their JSON Schemas converted to Zod, and plain REST APIs are described by a name, an endpoint, a method, headers and an input schema.</li>
          <li><strong>Strategies, versioned.</strong> The mission loop itself is a strategy with a version, such as <code>nlah:v1</code> or <code>standard:v1</code>. Each session is pinned to the version it started with, so rolling out <code>v2</code> never changes a conversation halfway through.</li>
        </ul>

        <h3>Behaviour as data</h3>
        <p>Prompts are versioned in a studio on the gateway. Prompt engineers write versions; admins and product managers promote or roll them back. Agents ask the gateway for the active version and cache it for 60 seconds, and a promotion clears that cache, so behaviour changes with no redeploy. Feature flags and per-user harness settings work the same way: they are rows, not code.</p>

        <h3>Ports and adapters</h3>
        <p>The agent&apos;s code is split into <code>adapter/inbound</code> (HTTP routes), <code>adapter/outbound</code> (calls to the gateway), <code>core</code> (harness, strategies, tools) and <code>infrastructure</code> (providers, MCP and REST transports). Every call to the gateway sits in <code>adapter/outbound/backend</code> (one adapter for state, one for prompts), and the state store is picked by a small factory, so swapping the backend is a new adapter rather than a change across the harness. The split is not perfect yet (about ten core files still import adapters and transports directly), and keeping that direction one-way is the rule worth defending in review.</p>

        <h3>Contracts at every boundary</h3>
        <p>Requests are validated with Zod on the agent and typed structs on the gateway, and both services publish OpenAPI specs (served with Scalar at <code>/docs</code> and <code>/api/docs</code>). As long as a service honours its contract, it can be rewritten in another language without the other side noticing.</p>
      </Reveal>

      <Reveal>
        <h2>Security without slowing down</h2>

        <p>Splitting the system creates trust boundaries, and each one gets its own credential so a leak opens one door, not all of them:</p>

        <BlogTable>
          <thead>
            <tr>
              <th>Boundary</th>
              <th>Credential</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Client to gateway</td><td>User JWT with the user id and role; the tier is looked up per request</td></tr>
            <tr><td>Gateway to agent</td><td><code>X-Internal-Token</code>, a shared secret; workers have no public address</td></tr>
            <tr><td>Agent to gateway</td><td>Service JWT with <code>sub: &quot;agent&quot;</code>, minted for every call and valid for 60 seconds</td></tr>
            <tr><td>Programs to the API</td><td>API keys stored only as SHA-256 hashes, acting as a plain user, with a revoke switch</td></tr>
          </tbody>
        </BlogTable>

        <p>All checks happen inside the services: a signature check, a cached tier lookup, and for API keys one database read. Nothing calls out to an auth service in the hot path. The internal routes are protected once, at the group level, so a route added later cannot be forgotten:</p>

        <CodeBlock language="go" title="backend/internal/router/router.go (trimmed)">{`internalGroup := api.Group(routes.V1InternalGroup, middleware.InternalAuthRequired(cfg))

memoryGroup := internalGroup.Group("/memory")
memoryGroup.Post("/episodic/store", memoryHandler.HandleStoreEpisodic)
memoryGroup.Post("/episodic/recall", memoryHandler.HandleGetEpisodic)`}</CodeBlock>
      </Reveal>

      <Reveal>
        <h2>Asking a human first</h2>

        <p>Approval is where a stateless design pays off. When a risky tool needs a yes, the agent saves everything it needs to continue (messages, the pending call, tools, provider settings without the key, cost so far) through the gateway for five minutes, sends an approval packet, and ends the stream. Nothing waits in memory.</p>
      </Reveal>

      <HitlSequenceDiagram />

      <Reveal>
        <p>The approval can arrive minutes later at any replica. That replica loads the snapshot, runs the approved tool or tells the model it was denied, builds a fresh harness, and streams the rest. If that replica saw the mission cancelled while it waited, it answers 409 and the approval is used up, so a late click cannot bring a stopped mission back to life. Sharing that cancel flag across replicas, for example in Redis, closes the gap completely.</p>

        <Callout variant="tip" title="Make approvals single-use">
          Claim the paused state when you load it, so a second click finds nothing, and stream the resumed response straight through the gateway like a normal chat turn. Echo does both now, but the claim lives in each replica&apos;s memory and the delete is a separate write after the read, so two replicas could still race. An atomic get-and-delete in the store closes that.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>What breaks first</h2>

        <p>Push the estimator&apos;s users slider to the right and walk down this list. It is roughly the order in which a design like this runs out of room, with the fix for each step.</p>

        <BlogTable>
          <thead>
            <tr>
              <th>Limit</th>
              <th>Symptom</th>
              <th>Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Provider tokens per minute</td><td>429s from the model API at peak</td><td>Prompt caching, smaller context, more provider accounts or regions, a queue in front of low-priority missions</td></tr>
            <tr><td>Open connections on the gateway</td><td>New streams refused or slow to start</td><td>More gateway replicas behind a load balancer; streams are independent</td></tr>
            <tr><td>Open missions per agent replica</td><td>Time to first token grows</td><td>Autoscale workers on open missions; keep headroom</td></tr>
            <tr><td>Database writes from streaming</td><td>Flush updates pile up</td><td>Longer flush interval, batched updates, or a write-behind buffer in Redis</td></tr>
            <tr><td>Long sessions</td><td>Every call gets slower and pricier</td><td>Tighter history budget, earlier summaries</td></tr>
          </tbody>
        </BlogTable>
      </Reveal>

      <Reveal>
        <h2>Seeing what agents do</h2>

        <p>At scale you cannot read every transcript, so the system has to tell you. Echo&apos;s agent records each mission as a Langfuse trace: every turn, tool call and model call, with its prompt, tokens and cost. It exports these as OpenTelemetry spans to Langfuse, and the gateway passes the caller&apos;s W3C <code>traceparent</code> header through to the agent. The next step is for the gateway to record and export its own spans, so one trace shows where a slow answer actually spent its time.</p>
      </Reveal>

      <Reveal>
        <h2>What to keep</h2>

        <BlogTable>
          <thead>
            <tr>
              <th>Rule</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Split control plane and execution plane</td><td>Each tier scales on its own signal and changes on its own schedule</td></tr>
            <tr><td>Keep workers free of state you would miss</td><td>Any replica serves any mission, and a dead one loses nothing</td></tr>
            <tr><td>Count tokens, not requests</td><td>The provider&apos;s limit is the first wall, not your CPU</td></tr>
            <tr><td>Keep the prompt prefix still</td><td>Prompt caching turns repeated context into a discount</td></tr>
            <tr><td>Give sub-agents a clean context and a depth limit</td><td>Multi-agent work stays cheap and can never run away</td></tr>
            <tr><td>Wrap every mission in guardrails</td><td>Loops, failures and costs stop at a known ceiling</td></tr>
            <tr><td>Put behaviour in registries and data</td><td>New models, prompts, tools and strategies ship without rewrites</td></tr>
            <tr><td>One secret per boundary, checked locally</td><td>Security that costs microseconds, and a leak that opens one door</td></tr>
          </tbody>
        </BlogTable>

        <p>Most of the work in serving agents has nothing to do with the agent. It is deciding where state lives, which tier scales on what, and where to put the ceilings. Once those are fixed, the agent itself becomes the easiest part of the system to change.</p>
      </Reveal>
    </div>
  );
}
