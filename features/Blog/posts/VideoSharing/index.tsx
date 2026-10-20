import React from 'react';
import Callout from '@/features/Blog/components/Callout';
import CodeBlock from '@/features/Blog/components/CodeBlock';
import Reveal from '@/features/Blog/components/Reveal';
import { lazyOnView } from '@/features/Blog/components/LazyOnView';
import BlogTable from '@/features/Blog/components/BlogTable';
import ComponentTable from './widgets/architecture/components/ComponentTable';

// Every widget sits below the first screen: its HTML is in the static page, its JS loads on scroll.
const CapacityEstimator = lazyOnView(() => import('./widgets/capacity/components/CapacityEstimator'));
const ArchitectureOverview = lazyOnView(() => import('./widgets/architecture/components/ArchitectureOverview'));
const LoginFlowVisualizer = lazyOnView(() => import('./widgets/loginFlow/components/LoginFlowVisualizer'));
const ApiModulesDiagram = lazyOnView(() => import('./widgets/apiModules/components/ApiModulesDiagram'));
const UploadSequenceDiagram = lazyOnView(() => import('./widgets/uploadSequence/components/UploadSequenceDiagram'));
const UploadFlowVisualizer = lazyOnView(() => import('./widgets/uploadFlow/components/UploadFlowVisualizer'));
const TranscodeTaskVisualizer = lazyOnView(() => import('./widgets/transcodeTask/components/TranscodeTaskVisualizer'));
const StreamingSequenceDiagram = lazyOnView(() => import('./widgets/streamingSequence/components/StreamingSequenceDiagram'));
const AbrSimulator = lazyOnView(() => import('./widgets/abr/components/AbrSimulator'));
const StreamingFlowVisualizer =lazyOnView(() => import('./widgets/streamingFlow/components/StreamingFlowVisualizer'));
const SchemaDiagram = lazyOnView(() => import('./widgets/schemaDiagram/components/SchemaDiagram'));
const VitessDiagram = lazyOnView(() => import('./widgets/vitess/components/VitessDiagram'));
const MetadataCacheVisualizer = lazyOnView(() => import('./widgets/metadataCache/components/MetadataCacheVisualizer'));
const LoadBalancerVisualizer = lazyOnView(() => import('./widgets/loadBalancer/components/LoadBalancerVisualizer'));
const ResumeSequenceDiagram = lazyOnView(() => import('./widgets/resumeSequence/components/ResumeSequenceDiagram'));
const ViewCountVisualizer = lazyOnView(() => import('./widgets/viewCount/components/ViewCountVisualizer'));
const OriginShieldVisualizer = lazyOnView(() => import('./widgets/originShield/components/OriginShieldVisualizer'));
const VideoStatusVisualizer = lazyOnView(() => import('./widgets/videoStatus/components/VideoStatusVisualizer'));
const DeployPipelineVisualizer = lazyOnView(() => import('./widgets/deployPipeline/components/DeployPipelineVisualizer'));
const ArchitectureSimulator = lazyOnView(() => import('./widgets/capacity/components/ArchitectureSimulator'));

export default function VideoSharing() {
  return (
    <div className="blog-content-static">
      <p>At the scale of a large video site, the servers, the database and the cache barely show up on the bill. With 400 million daily users and 2 billion views a day, the cost is in moving bytes: at $0.02 per GB on a rented CDN, those views come to about <strong>$4 million a day</strong>.</p>

      <p>Cost is only half the problem. Out of about 20 million uploads a day, some drop halfway, some get sent twice, and some transcodes die before they finish. So every step in this design has to answer three questions: what if it runs twice, what if it stops halfway, and which copy wins?</p>

      <p>The post designs the whole service, from upload to playback to deploys, and you can check it as you read:</p>
      <ul>
        <li><strong>Change the assumptions</strong> and watch storage and the bandwidth bill move.</li>
        <li><strong>Replay the failures</strong> in uploads, streaming, caching and deploys, one step at a time.</li>
        <li><strong>Press Go viral</strong> at the end and see which part breaks first.</li>
      </ul>

      <p>The working code is in the <a href="https://github.com/DaffaAdityaDev/streaming_video.git" target="_blank" rel="noopener noreferrer">streaming_video repository on GitHub</a>.</p>

      <Reveal>
        <h2>Requirements</h2>

        <p>Before drawing any boxes, decide what the system must do and how well it must do it. Every component later in this post exists because one of these lines demands it. The targets are my assumptions for this exercise, not numbers from a real company.</p>

        <h3>What the service must do</h3>
        <ul>
          <li><strong>Accounts.</strong> Users can sign up and log in.</li>
          <li><strong>Upload.</strong> Creators can upload a video with a title and a description.</li>
          <li><strong>Watch.</strong> Viewers can play any published video and choose its quality, for example 480p or 1080p.</li>
          <li><strong>Count.</strong> Every video keeps its number of views, likes, and dislikes.</li>
        </ul>

        <p>Search, recommendations, and live streaming are out of scope, and they deserve their own designs. Comments and the creator dashboard are covered only as far as where they live and how they are kept from hurting playback.</p>

        <h3>How well it must do it</h3>
        <ul>
          <li><strong>Playback starts fast.</strong> A video begins within a couple of seconds and keeps playing without buffering.</li>
          <li><strong>It survives scale and spikes.</strong> It serves hundreds of millions of daily users (we assume 400 million) and stays up when one video suddenly goes viral.</li>
          <li><strong>It stays available.</strong> A failed server, disk, or data center does not take the service down.</li>
          <li><strong>Uploads are fast and reliable.</strong> Large files get through, and a creator is never left wondering whether the upload worked.</li>
          <li><strong>It is affordable to run.</strong> Bandwidth is the biggest cost, so every choice is judged by what it does to the bill.</li>
        </ul>

        <h3>Edge cases: when users do the unexpected</h3>

        <p>The happy path is easy. A design is judged by what happens when a user does something odd, or when something breaks halfway. These are the cases the system has to survive:</p>

        <BlogTable>
          <thead>
            <tr>
              <th>The user</th>
              <th>What goes wrong</th>
              <th>What the system should do</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Uploads a large file on a flaky connection</td>
              <td>The connection drops at 90%.</td>
              <td>Resume from the last chunk that arrived instead of starting over.</td>
            </tr>
            <tr>
              <td>Uploads a corrupt or unsupported file</td>
              <td>Transcoding fails after a long wait.</td>
              <td>Check type and size up front. If transcoding still fails, mark the video as failed with a reason and let the creator retry.</td>
            </tr>
            <tr>
              <td>Taps upload twice, or retries after a timeout</td>
              <td>The same video exists twice.</td>
              <td>The client makes an idempotency key when the user taps Upload and sends it with every attempt, so a retry is recognized as the same upload.</td>
            </tr>
            <tr>
              <td>Opens a video that is still processing</td>
              <td>There is nothing to play yet.</td>
              <td>Show a "processing" state, and publish the video only when every resolution is ready.</td>
            </tr>
            <tr>
              <td>Watches on a slow or changing network</td>
              <td>The video stalls to buffer.</td>
              <td>Drop to a lower resolution instead of stopping, and climb back when the network recovers.</td>
            </tr>
            <tr>
              <td>Refreshes a video again and again, or is a bot</td>
              <td>View and like counts are inflated.</td>
              <td>Count one view per user per time window, accept one like per user, and rate-limit abusive clients.</td>
            </tr>
            <tr>
              <td>Opens a video that was deleted or made private</td>
              <td>A cached copy keeps playing after the owner removed it.</td>
              <td>Remove it from the metadata first, purge the CDN copy, and show a clear "not available" message.</td>
            </tr>
            <tr>
              <td>Enters the wrong password many times</td>
              <td>Someone is guessing passwords.</td>
              <td>Limit login attempts and lock the account for a short time.</td>
            </tr>
            <tr>
              <td>Joins thousands of others on a brand-new video</td>
              <td>Every request misses the cache and hits the origin.</td>
              <td>Let the CDN and the metadata cache absorb the spike, and keep the origin for the first miss only.</td>
            </tr>
          </tbody>
        </BlogTable>

        <p>Every row is answered later in the post, and the recap at the end collects them all.</p>
      </Reveal>

      <Reveal>
        <h2>Estimating the scale</h2>

        <p>Every design decision starts with numbers: how many views, how many uploads, how many bytes. Change the assumptions below and watch the totals move. The defaults are the ones used for the rest of this post.</p>
      </Reveal>

      <CapacityEstimator />

      <Reveal>
        <h3>What the defaults tell us</h3>
        <ul>
          <li><strong>2 billion views a day.</strong> 400 million daily active users, each watching 5 videos.</li>
          <li><strong>Reads dominate.</strong> Far more people watch than upload. At 100 views per upload, 2 billion views means about 20 million uploads a day.</li>
          <li><strong>2 PB of new storage a day.</strong> 20 million uploads at 100 MB each, before compression and replication.</li>
          <li><strong>About $4 million a day in bandwidth.</strong> Serving every view through a paid CDN at $0.02 per GB costs roughly Rp62 billion a day. That price is not made up: it is the AWS CloudFront list price above 5 PB a month, and at this volume the whole bill blends to about that rate. Smaller services pay much more per GB (up to $0.085 at the first tier), and some CDNs charge a fraction of it.</li>
        </ul>

        <Callout variant="warning" title="The bill is the constraint">
          The servers are not what makes a video service expensive. Moving bytes is. That is why caching and CDNs show up in almost every part of the design that follows.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>High-level design</h2>

        <ArchitectureOverview />

        <p>The system is built from eleven components:</p>

        <ComponentTable />

        <p>Three of them are services with very different loads, so each is deployed and scaled on its own:</p>
        <ul>
          <li><strong>The API service</strong> serves many small read requests. It decides who may watch and from which edge, and returns the manifest. It never touches video bytes.</li>
          <li><strong>The upload service</strong> serves few requests, each with a long life. It owns the lifecycle of every upload and is the only writer of video status.</li>
          <li><strong>The delivery service</strong> moves the bytes. It is the data plane: a fleet of cache servers that must sit close to viewers and is sized by bandwidth and disk, not by request count.</li>
        </ul>

        <Callout variant="note" title="A compromise worth naming">
          The upload service and the API service share the metadata database. Every service scales horizontally, and the rule is one writer, many readers: only the upload service writes the video status, and the API only reads it. Two concerns remain. The services are coupled through the shape of that table, so a change to it needs both teams. And when the API reads from replicas, a creator who checks right after the video turns ready can still see "processing" for a moment, because of replication lag. Reading the status of your own videos from the primary, or briefly from the cache the upload service refreshed, avoids that.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>Accounts and the services around the core</h2>

        <h3>How login works</h3>
        <p>Login lives in the API tier, as an accounts module backed by its own user store. The client sends its credentials over HTTPS, the API compares them with the stored password hash, and it answers with two tokens:</p>
        <ul>
          <li><strong>An access token</strong> that lives for minutes. The client sends it with every request, and any API server can verify its signature locally, without calling the database. That is what keeps the API servers stateless, so more of them can be added at any time.</li>
          <li><strong>A refresh token</strong> that lives for days. It is stored on the server side, so logging out or banning an account can revoke it. When the access token expires, the client trades the refresh token for a new one.</li>
        </ul>

        <p>The panel under the diagram shows what the two tokens are worth at each step.</p>
      </Reveal>

      <LoginFlowVisualizer />

      <Reveal>

        <p>Two details keep this cheap. Logins are rare compared with views, and most authentication traffic is just token checks, which cost no database call. Password hashing is slow on purpose, so the login endpoint gets its own rate limit and can be scaled separately from the rest. The upload and private-video flows reuse the same token: the upload service or the API checks it before it hands out signed URLs.</p>

        <Callout variant="warning" title="Trade-off: tokens are hard to revoke">
          A signed access token stays valid until it expires, even after the account is banned. Short lifetimes shrink that window, and the revocable refresh token closes the door for good.
        </Callout>

        <h3>Where comments, dashboards and the rest live</h3>
        <p>To the client they are all just API endpoints behind the same load balancer. Inside, they have very different load, so they should not share a data store with video metadata:</p>

        <ApiModulesDiagram />

        <BlogTable>
          <thead>
            <tr>
              <th>Module</th>
              <th>Load</th>
              <th>Data lives in</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Accounts and login</td>
              <td>Few writes, many token checks</td>
              <td>A user database, plus a fast store for refresh tokens and rate limits.</td>
            </tr>
            <tr>
              <td>Video metadata (the watch page)</td>
              <td>Extremely read-heavy</td>
              <td>The metadata database behind a cache.</td>
            </tr>
            <tr>
              <td>Comments</td>
              <td>Write-heavy, appended and read per video</td>
              <td>Their own store, keyed by video, with the top comments cached.</td>
            </tr>
            <tr>
              <td>Creator dashboard</td>
              <td>Read-heavy, built from aggregates</td>
              <td>An analytics store filled from events, never the primary database.</td>
            </tr>
            <tr>
              <td>Likes and view counters</td>
              <td>A very high write rate</td>
              <td>An event stream. An aggregator removes duplicates, keeps the totals in memory and flushes them to the database in batches.</td>
            </tr>
          </tbody>
        </BlogTable>

        <p>A comment storm should not slow down playback, and a heavy dashboard query should not lock the database that serves the watch page. Giving each module its own store and its own limits means one of them can fail or be overloaded while the others keep working. A practical path is to start with one API codebase split into modules, and to pull a module out as its own service only when its load or its data store really differs from the rest.</p>

        <p>The same goes for the data. On day one, the stores in the diagram are separate schemas in one MySQL server (in MySQL, a schema and a database are the same thing): one database to run, back up and pay for. What makes them separate is a rule, not a server: a module touches only its own schema. At scale, a schema moves to its own server when its load demands it. Comments and analytics usually go first, and users rarely need to. The schema further down shows that starting point.</p>
      </Reveal>

      <Reveal>
        <h2>Uploading a video</h2>

        <p>An upload is two very different jobs: a tiny request that creates the upload, and a huge transfer of video bytes. The design keeps them apart, so the bytes never touch the servers that serve viewers.</p>

        <ol>
          <li><strong>Create the upload.</strong> The client calls the upload service with its <strong>access token</strong>, an <strong>idempotency key</strong> it made when the user tapped Upload, the <strong>title</strong>, the <strong>description</strong> and the file size. The service checks the user's upload quota, stores a record with the status "uploading" and an expiry time, and returns an <strong>uploadId</strong> plus signed URLs, one per chunk. The URLs are limited in size and lifetime.</li>
          <li><strong>Send the chunks straight to video storage.</strong> The client uploads to the signed URLs. Storage checks every chunk as it arrives.</li>
          <li><strong>Hint that it is done.</strong> The client sends one tiny request to the upload service. It is only a hint, because the service checks storage itself.</li>
          <li><strong>The upload service finishes the file.</strong> It compares its record with storage, checks that every chunk is there, assembles them with a control call, moves the video to "processing". Then it splits the work into one task per segment and resolution, and queues the tasks.</li>
          <li><strong>Transcode.</strong> GPU transcoders take the tasks. Each one reads only its own part of the raw video, encodes it, and writes the result back to video storage.</li>
          <li><strong>Report back through the broker.</strong> Each finished task publishes <strong>transcode.done</strong>. The upload service records each one exactly once. When every task is in, it writes the manifests to video storage (one playlist per resolution and a master playlist that lists them), and only then sets the status to "ready" and announces <strong>video.ready</strong> for follow-ups such as a notification or a cache refresh.</li>
        </ol>

        <Callout variant="note" title="Two kinds of pieces, and when the creator can leave">
          <strong>Upload chunks</strong> exist only to move the file safely. The client cuts the raw file into pieces of a few megabytes, so a dropped connection costs one chunk, not the whole file. Once storage holds every chunk, they are joined into one raw file.
          <br />
          <br />
          <strong>Segments</strong> are cut later, by the server, from that raw file: a few seconds of video each, at keyframes, in every resolution. They are what the transcode tasks produce and what the player streams.
          <br />
          <br />
          So the creator's device is only needed until the last chunk arrives. Everything after that runs on the server, and the creator can close the app at 100% and get a notification when the video is ready.
        </Callout>

        <p>The same six steps in order, one lane per component. The thick red arrows are the only ones that carry video, and none of them touches the upload service.</p>
      </Reveal>

      <UploadSequenceDiagram />

      <Reveal>
        <h3>The whole upload, step by step</h3>
        <p>Now in motion, with the status as it changes. The other scenarios replay the failures explained below.</p>
      </Reveal>

      <UploadFlowVisualizer />

      <Reveal>
        <p><strong>Why a broker?</strong> Workers and storage never write to the database directly. Status changes travel through the broker, so a burst of finished videos queues up instead of overloading the database, and a crashed consumer simply picks the message up again. Only the upload service writes the status, so the rules for which status may follow which live in one place.</p>

        <p><strong>Who decides the upload is done?</strong> The record created at the start knows how many chunks to expect, and storage knows how many it holds. The client is never the judge, because it can lie, crash or lose signal. Three things can notice that the numbers match: the client's finish hint, which is fastest, a storage event, and a sweep, which is the safety net when the client is gone. All three run the same idempotent routine. It queues the transcode tasks only after storage confirms the file, and the messages carry only IDs and paths, never video bytes.</p>

        <Callout variant="note" title="Who calls whom?">
          In the architecture diagram every arrow points from the caller, so no arrow leaves the broker. In the step-by-step flows, the moving dots show where a message travels instead. Every consumer in this design pulls, with long polling: it waits on an open request, reacts within milliseconds, takes work at its own pace, and cannot be flooded. A message is removed only after the consumer acknowledges it, and one that is never acknowledged is delivered again. That is why every consumer must tolerate duplicates.
        </Callout>

        <Callout variant="note" title="Direct to storage, or through an ingest service?">
          Uploading straight to storage with signed URLs is the simplest option and scales furthest, and it is not less secure: the upload service still decides who may upload, and only the bytes skip it. Each signed URL works for minutes, for one object key that the service picks, and for a size it signed in advance, so a client cannot overwrite another user's file or upload more than it declared. The file lands in a private quarantine area, and the transcoder probes it before anyone can watch it.
          <br />
          <br />
          A separate ingest service makes sense when a file must be inspected before it is accepted, for example for malware, or when clients cannot use signed URLs. The order stays the same: the file is stored first, then the message is queued.
        </Callout>

        <h3>When an upload goes wrong</h3>
        <p><strong>A dropped connection.</strong> Storage remembers which chunks arrived. After a drop, the client asks the upload service what is missing and gets fresh signed URLs for those chunks, because the old ones may have expired during a long break. Then it sends only the missing ones. Multipart uploads in cloud storage and the open tus protocol work this way.</p>
      </Reveal>

      <ResumeSequenceDiagram />

      <Reveal>
        <p><strong>The creator leaves midway.</strong> The waste is bounded before the first byte: a quota on open uploads and pending bytes, an expiry time, and signed URLs limited in size and lifetime. While the upload runs, the client sends a heartbeat every minute, and the service moves <strong>last_activity</strong> only when the stored value is a few minutes old, so even a two-hour upload costs a few dozen writes. The upload belongs to the uploadId, not to the login session, so logging out only stops the heartbeats. The sweep picks up uploads that went quiet (an index on status and last activity keeps that cheap, and SKIP LOCKED keeps two instances off the same rows) and asks storage when the last chunk arrived, because a client that stopped its heartbeats may still be uploading. After a grace period the upload expires and its chunks are deleted. A lifecycle rule in storage that aborts old unfinished uploads is the last net, in case the sweep itself fails.</p>

        <p><strong>A double tap or a retry.</strong> The server creates the uploadId, so it cannot protect the first request: if the answer is lost, the client never learns it. That is why the client makes its own idempotency key the moment the user taps Upload, and sends it with every attempt. A key the server has already seen returns the existing upload, and a unique constraint on the key holds even when two requests arrive at the same moment.</p>

        <p><strong>A bad file.</strong> Fail early: check the type, size and duration while the upload runs, and probe the container before accepting it. Whatever still fails during transcoding ends in the failed status described below.</p>

        <h3>Transcoding</h3>
        <p>Transcoders convert the video into the formats and resolutions we defined in advance, and generate thumbnails on the way. The work is split across many machines: one task per segment and resolution, each a few seconds of video. If a video turns popular, an extra compression pass can shrink it further while keeping the same visual quality.</p>

        <Callout variant="note" title="Lossless vs lossy encoding">
          Lossless encoding keeps every bit of the original. Lossy encoding throws some data away to make the file smaller. You have seen the effect when a sharp photo looks softer after you upload it to a social network. Video services use lossy encoding because the size savings are huge.
        </Callout>

        <h3>Life of a transcode task</h3>
        <p>Every GPU machine runs one small, stateless process: the <strong>transcode worker</strong>. It is the whole "Transcoders" box in the diagram. Nobody watches the GPUs. Each worker follows a fixed order, and the broker's own features catch every crash.</p>

        <CodeBlock language="plain" title="The worker loop">
{`loop:
  1. pull a task (long poll)       the broker hides it from others: lease = 60 s
  2. run ffmpeg on the GPU         extend the lease every 20 s while it runs
  3. write the result to storage   fixed path: v_42/720p/seg_005.ts
  4. publish transcode.done        { videoId, taskId }
  5. ack the task                  the broker deletes it from the queue`}
        </CodeBlock>

        <p>The order is the point: write, then publish, then ack. A crash between any two steps causes a repeat, never a loss. This is called at-least-once delivery: a message can arrive more than once but is never dropped, so everyone who receives one must handle a duplicate.</p>

        <BlogTable>
          <thead>
            <tr>
              <th>The worker dies between</th>
              <th>What happens</th>
              <th>Why it is safe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 and 3, while encoding</td>
              <td>The lease runs out, the task becomes visible again, and another GPU takes it.</td>
              <td>Nothing was written yet.</td>
            </tr>
            <tr>
              <td>3 and 4</td>
              <td>The task is repeated, and the segment is encoded again.</td>
              <td>The path is fixed, so the same file is overwritten.</td>
            </tr>
            <tr>
              <td>4 and 5</td>
              <td>The task is repeated, and transcode.done arrives twice.</td>
              <td>The task's completion row already exists, so the duplicate changes nothing.</td>
            </tr>
          </tbody>
        </BlogTable>

        <p>Replay each of those crashes below. Watch the worker loop on the left, and on the right what the broker and the upload service believe about the same task.</p>
      </Reveal>

      <TranscodeTaskVisualizer />

      <Reveal>
        <p>The numbers are chosen so that one missed lease extension does not cause a repeat, and a dead worker is noticed within a minute. The broker counts deliveries (ApproximateReceiveCount in SQS, x-delivery-count in a RabbitMQ quorum queue). The first attempt plus three retries makes four, with waits of 5 seconds, 30 seconds and 2 minutes, and after that the task goes to a dead-letter queue.</p>

        <ul>
          <li><strong>A crash or a power cut</strong> sends no signal at all. The expired lease is the signal, so no separate heartbeat service is needed.</li>
          <li><strong>An ffmpeg error</strong>, such as a corrupt frame, leaves the worker alive. It rejects the task with a delay right away instead of waiting for the lease to run out.</li>
          <li><strong>A slow worker that lost its lease</strong> may finish while another GPU works on the same task. Both write the same path, the done event counts once, and the broker refuses the old worker's ack.</li>
          <li><strong>Scaling down, or a spot instance being taken back,</strong> sends the worker a stop signal. It hands its current task back at once, so another GPU can start without waiting a minute.</li>
        </ul>

        <p><strong>Counting finished tasks.</strong> In one transaction, the upload service inserts a row with a unique key on (video, task). A redelivered transcode.done hits that key and stops there. Only a new row adds one to the video's counter, with <code>UPDATE ... RETURNING</code>, which locks the video's row: of two tasks that finish together, exactly one sees the count reach 18, writes the manifests and marks the video ready. A plain counter without the unique row is the classic bug: one redelivered message, and a video turns ready with a segment missing.</p>

        <p><strong>A task that never succeeds.</strong> After four attempts it goes to the dead-letter queue, so it cannot block other videos, and the whole video fails: its encoded segments are deleted and the reason is stored. That throws away finished work, but a video with a missing resolution must never be published. The same rule is why a video goes live only when every task succeeded. The raw upload is kept for a few days so the creator can retry without uploading again. Once a video is ready, the raw upload is deleted, because keeping originals would roughly double the storage bill. The price is that a video can never be encoded again from its original, for example into a newer codec.</p>

        <p><strong>A video stuck in processing.</strong> If a message was lost to a bug, or a task was never published, the count stops moving. The same sweep that finds abandoned uploads looks for videos whose count has not moved for much longer than an encode takes, and publishes the missing tasks again or marks the video failed.</p>

        <Callout variant="note" title="Which broker fits a task queue?">
          Kafka has no acknowledgment per message, only a position per partition, so one slow task can hold up the tasks behind it. For a queue of independent tasks, SQS, RabbitMQ with quorum queues, or NATS JetStream fit better, because each message is acknowledged on its own.
        </Callout>

        <h3>A video's status</h3>
        <p>Every video moves through explicit states, and only the upload service moves it:</p>

        <BlogTable>
          <thead>
            <tr>
              <th>Status</th>
              <th>Meaning</th>
              <th>What people see</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>uploading</td>
              <td>Chunks are still arriving.</td>
              <td>The creator sees progress.</td>
            </tr>
            <tr>
              <td>processing</td>
              <td>Transcoding is running.</td>
              <td>Viewers see "processing".</td>
            </tr>
            <tr>
              <td>ready</td>
              <td>Every task succeeded, so every resolution can be played.</td>
              <td>The video plays.</td>
            </tr>
            <tr>
              <td>failed</td>
              <td>A task ran out of retries. Every encoded segment was deleted, and the reason is stored.</td>
              <td>The creator sees the reason and a Retry button, which works while the raw upload is still kept.</td>
            </tr>
            <tr>
              <td>expired</td>
              <td>The upload was never finished. Its chunks were removed.</td>
              <td>The creator sees "upload not finished" and can start again.</td>
            </tr>
            <tr>
              <td>removed</td>
              <td>The owner deleted or hid the video. Its copies are being cleaned up.</td>
              <td>Viewers see "not available".</td>
            </tr>
          </tbody>
        </BlogTable>

        <p>Every change is a conditional update: <code>UPDATE videos SET status = 'processing' WHERE id = ? AND status = 'uploading'</code>. When the finish hint and the sweep notice the same upload in the same second, one changes a row and the other changes none and stops, so the tasks are queued once. The same rule guards every arrow below, so a late or repeated trigger is always harmless.</p>
      </Reveal>

      <VideoStatusVisualizer />

      <Reveal>
        <h2>Streaming a video</h2>

        <p>Playback is two separate jobs, just like an upload. One small request asks the API whether this viewer may watch and where from. The video itself then comes from an edge cache over plain HTTP. The API never sends a single video byte.</p>

        <p>That small call cannot be skipped. It is the only place where the service decides who may watch: a private or deleted video gets a 403 here, and a bare file URL could never do that. It also picks the edge for this viewer, from their location and the load on each edge. The answer has three parts: the manifest URL on that edge, a few fallback edges, and a playback token. Everything after that goes to the edge.</p>
      </Reveal>

      <StreamingSequenceDiagram />

      <Reveal>
        <p>The manifest is a small text file (an HLS <code>.m3u8</code> or a DASH <code>.mpd</code>). It lists every resolution, and for each one the segments of a few seconds that make up the video. From then on the player is in charge, not the server. Segments are static files cached at the edge nearest to the viewer, so most views never reach the origin, and if an edge fails the player asks a fallback edge for the same segment.</p>

        <h3>Auto quality: switching resolution mid-video</h3>
        <p>The "Auto" entry in a player's quality menu is adaptive bitrate streaming. Every video is stored as a ladder of renditions, the same video encoded at several sizes:</p>

        <BlogTable>
          <thead>
            <tr>
              <th>Rendition</th>
              <th>Bitrate</th>
              <th>Plays smoothly on</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>240p</td>
              <td>0.4 Mbps</td>
              <td>A weak mobile signal</td>
            </tr>
            <tr>
              <td>360p</td>
              <td>0.8 Mbps</td>
              <td>A busy 3G or crowded Wi-Fi</td>
            </tr>
            <tr>
              <td>480p</td>
              <td>1.4 Mbps</td>
              <td>An average mobile connection</td>
            </tr>
            <tr>
              <td>720p</td>
              <td>2.8 Mbps</td>
              <td>Good 4G</td>
            </tr>
            <tr>
              <td>1080p</td>
              <td>5 Mbps</td>
              <td>Home Wi-Fi</td>
            </tr>
          </tbody>
        </BlogTable>

        <p><strong>Why the switch is seamless.</strong> Every rendition is cut at exactly the same timestamps, and every segment starts with a keyframe: a complete picture that does not depend on earlier frames. Segment 5 at 240p and segment 5 at 720p cover the same four seconds. So the player can fetch segment 5 in one quality and segment 6 in another, and the decoder starts the new one cleanly. Nothing restarts. At most, the viewer sees the picture turn sharper or softer. The transcoders make this possible by placing a keyframe at every segment boundary, with a fixed keyframe interval and no extra keyframes at scene changes, so every rendition breaks at the same frames. That is also what lets the upload service split the work into one task per segment and resolution.</p>

        <p><strong>How the player decides.</strong> The server takes no part in this. Every rendition is just a set of files on the edge, and the player chooses which one to request next. Before each segment it looks at two numbers:</p>
        <ul>
          <li><strong>Bandwidth.</strong> How fast the last segments arrived, smoothed so one fast segment does not fool it. It plans with only about 80% of that, to leave room for a dip.</li>
          <li><strong>Buffer.</strong> How many seconds are downloaded ahead of the playhead. A full buffer means it can afford to try a higher rung. An almost empty one means the next segment must be small.</li>
        </ul>

        <p>The rules are lopsided on purpose. The player drops as far as it needs to at once, but climbs one rung at a time and only with a healthy buffer, so a short burst of speed does not make the quality flicker. If a segment arrives far too slowly, the player abandons it halfway and fetches the same segment at the lowest rung, before the buffer runs dry. Auto also caps the quality at the size of the player, because a phone screen 360 pixels wide gains nothing from 1080p. Real players such as hls.js, dash.js, ExoPlayer and Shaka Player refine these rules, for example with buffer-based algorithms like BOLA, but they all rest on the same two numbers.</p>

        <p><strong>Auto or a fixed quality?</strong> Choosing 1080p in the menu pins that rendition. The player stops adapting and will freeze rather than step down. That works on a fast connection and hurts everywhere else, which is why Auto is the default. Try it: pick a network, then compare Auto with a fixed 1080p.</p>
      </Reveal>

      <AbrSimulator />

      <Reveal>
        <p>The simulator is simplified. Bandwidth is constant while each segment downloads, and there are no round trips or dropped frames. The shape of the result still holds: on a network that changes, a fixed high quality freezes, and Auto trades sharpness for smooth playback.</p>

        <h3>One token per video, not one signature per segment</h3>
        <p>A two-hour film cut into 4-second segments has about 1,800 segments in every resolution. Signing each segment URL would make the manifest heavy, and a URL that expires after a few minutes would die in the middle of the film. Instead the API signs one <strong>playback token</strong> that covers the video's path prefix (<code>/v_42/*</code>) and lives for about ten minutes. It travels as a signed cookie, or as part of the path, so the manifest itself stays a plain file that the edge can cache for everyone.</p>
        <p>The edge checks the token on every request without calling anyone, because it only needs the key to verify the signature. Shortly before the token expires, the player asks the API for a fresh one. That tiny call also checks again that the video may still be watched, so a video that turns private stops playing within one token lifetime, even for a viewer who started it earlier.</p>

        <h3>The whole stream, step by step</h3>
        <p>One press of the play button, from the metadata lookup to segments arriving from the edge, plus the cases where it goes wrong.</p>
      </Reveal>

      <StreamingFlowVisualizer />

      <Reveal>
        <h2>Storing the metadata</h2>

        <p>On day one everything lives in one MySQL server, with one schema per module. A module reads and writes only its own schema. Between schemas only IDs travel: a comment stores the video's ID, but there is no foreign key to the videos table and no JOIN across schemas. That is what lets a schema move to its own server later without rewriting a single query.</p>
      </Reveal>

      <SchemaDiagram />

      <Reveal>
        <p>The videos schema is what the rest of this post calls the metadata database. It holds the video status that only the upload service writes, the uploads with their idempotency keys, and the completion row per transcode task. A like is a (video, user) pair with a primary key, so liking twice changes nothing. The counters on the video row are written by the aggregator in batches, never once per view.</p>

        <Callout variant="note" title="No foreign keys between modules: who keeps the data straight?">
          The database no longer checks references across schemas, so the services do. Before a comment is stored, the comments module asks the videos API, through its cache, whether the video exists and is ready. The author ID comes from the signed access token, so it needs no lookup.
          <br />
          <br />
          Instead of a JOIN, the watch page fetches the video and its top comments in parallel and merges them. Data shown next to every comment, such as the author's name and avatar, is copied onto the comment row and refreshed when a <strong>user.updated</strong> event arrives.
          <br />
          <br />
          Instead of <code>ON DELETE CASCADE</code>, the videos module publishes <strong>video.deleted</strong>, and the comments and likes modules delete their own rows a few seconds later. Until then, a reader simply hides a comment whose video is gone, and a sweep catches anything an event missed. Tables that must be joined, or changed in one transaction, belong in the same module.
        </Callout>

        <Callout variant="tip" title="Why not Cassandra or ScyllaDB?">
          Wide-column stores take enormous write volumes, but every table is built around one known query, there are no unique constraints, and there are no transactions across rows. The videos schema leans on all three: the unique idempotency key, the completion row and the task count changing together, and a status that may only move forward. That is why it stays relational. YouTube took the same road: MySQL, then sharded MySQL with Vitess, and according to public accounts, later Spanner, Google's distributed SQL database.
          <br />
          <br />
          The parts that do fit a wide-column store are append-only and read by one key: comments, watch history and raw view events. If comments ever outgrow MySQL, ScyllaDB is a fair home for them. Discord moved its messages, a very similar workload, from Cassandra to ScyllaDB.
        </Callout>

        <h3>Scaling in steps</h3>
        <p>Not every database problem needs more machines. Each step below is cheaper than the next, and you take the next one only when a measurement says the current one is not enough:</p>
        <ol>
          <li><strong>Make each query cheap.</strong> Indexes for the queries that really run, and a connection pooler such as ProxySQL, so hundreds of API servers do not each hold their own connections.</li>
          <li><strong>Cache in front.</strong> The metadata cache, described further down, keeps most watch-page reads away from the database.</li>
          <li><strong>Add read replicas</strong> for the reads that still reach it.</li>
          <li><strong>Buy a bigger machine.</strong> One MySQL server with 64 cores and hundreds of gigabytes of memory goes further than most people expect, and it costs no engineering time.</li>
          <li><strong>Give each module its own server.</strong> This is where the schema rule pays off: comments and analytics move out first, and the watch page stops competing with them.</li>
          <li><strong>Shard</strong> the one module that still outgrows a single primary. Here that is the videos schema, and only at a very large scale.</li>
        </ol>

        <h3>Replication: one primary, many replicas</h3>
        <p>We need two kinds of database machines to scale. The <strong>primary</strong> handles writes. <strong>Replicas</strong> handle reads. A write goes to the primary first and is then copied to every replica, while reads are spread across the replicas. This raises read throughput.</p>

        <Callout variant="warning" title="Stale reads">
          Replicas copy data after the primary does, so a read can briefly return old data. For a view counter that is fine. A count that is a few seconds behind hurts nobody.
        </Callout>

        <p>The trouble starts at scale. New videos arrive constantly and reads are extremely heavy, so replication lag grows. Writes also cause cache misses that hit slow disks, which slows replication even more. Replication alone cannot keep up.</p>

        <h3>Sharding: spreading the writes too</h3>
        <p>Sharding splits the data across several machines, so writes are spread out as well as reads. Each shard is an ordinary MySQL primary with its own replicas. Running dozens of shards by hand is where it gets painful, so we let Vitess manage them. YouTube built Vitess in 2010 for exactly this problem, when its hand-sharded MySQL setup became too hard to run, and it is now an open-source CNCF project used by Slack and GitHub.</p>

        <p>Vitess has four parts that matter here:</p>
        <ul>
          <li><strong>VTGate</strong>: a stateless proxy that speaks the MySQL protocol. The API connects to it as if it were one database. VTGate reads the shard key from each query and sends the query only to the shard that holds the row.</li>
          <li><strong>VTTablet</strong>: a process next to every MySQL instance. It pools connections, kills runaway queries, and takes backups.</li>
          <li><strong>Topology service</strong> (etcd): records which shard owns which range of keys and which tablet is the primary. VTGate keeps a cached copy.</li>
          <li><strong>VSchema</strong>: tells Vitess how each table is sharded. The rule that turns a column into a shard is called a <strong>vindex</strong>.</li>
        </ul>
      </Reveal>

      <VitessDiagram />

      <Reveal>
        <p>The videos keyspace uses <code>hash(video_id)</code> as its primary vindex. The uploads, transcode_tasks_done and likes tables use the same vindex on their video_id column, so every row of one video lands on the same shard as the video. Recording a finished task and moving the count up stays one ordinary MySQL transaction on one shard, and the rule that a status may only move from processing to ready is still a single UPDATE with a WHERE clause. When a shard grows too big, Vitess splits it online: it copies the rows to two new shards while traffic continues, follows the changes as they happen, and then switches over in seconds.</p>

        <h3>What sharding still needs</h3>
        <p>Reads now go to the cache and replicas, writes are spread over shards, counters arrive in batches, and status changes travel through the broker. Sharding still leaves four gaps:</p>
        <ul>
          <li><strong>The shard key.</strong> Sharding by video ID spreads the data evenly, and a watch-page lookup hits exactly one shard. A question like "all videos by this creator" does not. Vitess answers it with a lookup vindex: a small table, sharded by owner, that maps an owner ID to video IDs and that Vitess keeps up to date on every insert. Heavier questions, like the creator dashboard, still go to the analytics store.</li>
          <li><strong>A unique key across shards.</strong> MySQL can only enforce a unique key inside one shard, and a retried upload arrives with its idempotency key but no video ID yet, so Vitess cannot tell which shard to check. A unique lookup vindex on idempotency_key fixes this: the key lives in its own table, sharded by the key itself, so a second upload with the same key is rejected and the service returns the first one.</li>
          <li><strong>IDs.</strong> AUTO_INCREMENT counts per shard, so two shards would hand out the same ID. A Vitess sequence hands out IDs from one small unsharded table, in blocks, so IDs stay unique and that table is rarely touched.</li>
          <li><strong>Transactions across shards.</strong> Vitess can run them, but they are slower and fail in more ways. The design avoids them: everything that must change together belongs to one video, and one video lives on one shard.</li>
        </ul>

        <h3>Surviving the loss of a whole region</h3>
        <p>Replicas and shards protect against a failed machine, not against a whole data center going dark. For that, the metadata needs a copy in a second region. Two numbers decide how much that costs. The <strong>RPO</strong> (recovery point objective) is how much recent data you can afford to lose. The <strong>RTO</strong> (recovery time objective) is how long you can afford to be down.</p>

        <BlogTable>
          <thead>
            <tr>
              <th>Approach</th>
              <th>Data lost (RPO)</th>
              <th>Time down (RTO)</th>
              <th>Cost and effort</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Backups in another region: a nightly full backup (Vitess's built-in backups, with XtraBackup) plus the binary log streamed continuously</td>
              <td>Seconds to minutes</td>
              <td>Hours, while the backup is restored</td>
              <td>Cheapest. Needed in every setup, because a replica faithfully copies a mistaken DELETE too.</td>
            </tr>
            <tr>
              <td>Warm standby: an asynchronous replica of every shard in the second region (a second Vitess cell), promoted when the main region fails</td>
              <td>The last few seconds of writes</td>
              <td>Minutes</td>
              <td>A second set of database machines that mostly waits.</td>
            </tr>
            <tr>
              <td>Active in both regions: both accept writes</td>
              <td>Almost none</td>
              <td>Almost none</td>
              <td>By far the hardest, because two regions can change the same record at the same moment.</td>
            </tr>
          </tbody>
        </BlogTable>

        <p>For a video service, backups plus a warm standby are the sensible choice. Losing a few seconds of view counts or comments hurts nobody, and a status change that was lost is caught again by the sweep, which compares the database with what storage actually holds. Two other things must fail over together with the database. The processed zone of video storage is copied to the second region with bucket replication (raw uploads are not worth it, they are deleted soon anyway). And the DNS name of the API must point to the promoted region, so that clients follow. A failover that has never been tried is only a hope, so it is practised on a schedule.</p>
      </Reveal>

      <Reveal>
        <h2>Caching and load balancing</h2>

        <h3>Caching</h3>
        <p>A distributed cache such as Redis or Memcached holds the metadata, so the database is queried less. The cache never talks to the database by itself. The API service handles it, a pattern called cache-aside: it asks the cache first, and on a miss it reads the database and writes the answer into the cache. When a video changes, the upload service's video.ready or update event tells the API to drop the old entry. An LRU (least recently used) policy decides what to evict: the item unused for the longest time goes first, which makes room for new ones.</p>
        <p>This cache is cheap, because it holds only metadata: the title, the owner, the status, the counters and the manifest path, about 1 KB per video. Views follow a long tail, so a few million videos take most of them. Ten million hot videos at 1 KB each is about 10 GB, which fits in the memory of one ordinary server. The load is not large either: 2 billion views a day is about 23,000 reads a second, perhaps 70,000 at peak, and one Redis node handles around 100,000 simple reads a second. A small cluster of three to six nodes, each with a replica, covers both size and failover for a few thousand dollars a month. Next to roughly $4 million a day for bandwidth, that is a rounding error. The money goes to the video bytes, not to the metadata.</p>

        <p>Below: a hit and a miss, an edit, a viral video, and a cache node that dies.</p>
      </Reveal>

      <MetadataCacheVisualizer />

      <Reveal>
        <p>The delivery service plays the same role for video files. It fetches them from BLOB storage on demand and serves them from the edge. You can rent it: popular choices are Cloudflare, Akamai and Amazon CloudFront. Or you can run it yourself, as YouTube and Netflix do, which the next part describes.</p>

        <p>Why not let viewers read from storage directly? It works for a small service, but every view becomes a read on storage, which has request limits and charges for outbound traffic, and viewers far from the storage region pay the distance on every segment. An edge reads each segment from storage once and then serves it to everyone nearby. On a miss the edge does not download the whole file first. It passes the bytes to the viewer as they arrive and keeps a copy, so the extra hop costs only the first viewers a little latency. With a hit ratio above 95%, most views take a single short hop to a nearby edge.</p>

        <h3>Running your own delivery layer</h3>

        <Callout variant="note" title="Two terms worth knowing">
          <strong>CDN and edge cache.</strong> A CDN (content delivery network) is a set of servers spread across many places that keep copies of popular files close to viewers. Each server is an edge, and "edge cache" means the copies it keeps. A viewer in Surabaya gets the file from a server in Surabaya instead of one in another country.
          <br />
          <br />
          <strong>Steering.</strong> The decision of which edge a viewer should use. Fetching from the closest edge is not always best: it may be overloaded, down, or not hold the video yet. Steering looks at the viewer's location, the load on each edge and what each already has, and then hands out the URL of the best one.
        </Callout>

        <p>Video segments are static files, so a delivery service is not a streaming engine. It is a fleet of HTTP cache servers (nginx, Varnish or Apache Traffic Server) that serve files from disk with range requests. Its parts:</p>
        <ul>
          <li><strong>Edge nodes</strong> with large disks, fast ones for hot segments and cheap ones for the rest, serving files with the kernel's sendfile instead of application code.</li>
          <li><strong>A shield</strong>, a cache between the edges and video storage, so many edges share one fetch from the origin.</li>
          <li><strong>Steering.</strong> The API picks an edge for each viewer, by location, load and what that edge already holds, and puts its address in the answer, with one or two fallbacks. Every edge reports its health and load every few seconds into a small Redis of its own, with an expiry, so an edge that stops reporting drops out by itself. DNS based on location, or anycast, can do the same job without the API.</li>
          <li><strong>Consistent hashing inside one location.</strong> The same video always goes to the same node, so there are no duplicate copies and the hit ratio rises. A very hot video is copied to several nodes.</li>
                    <li><strong>Health checks and failover,</strong> playback token checks at the edge, and purge.</li>
        </ul>

        <p><strong>Launch day.</strong> A brand-new video is in no cache yet, so without protection every viewer's request goes straight to the origin. Three defenses stack: each edge collapses identical misses into one request, the shield collapses the edges' requests again, and cache expiry times get a little randomness so a popular video never vanishes from every cache at once. For a launch you know about, pre-warm the edges the night before.</p>
      </Reveal>

      <OriginShieldVisualizer />

      <Reveal>
        <p>The software is the easy part. The hard part is the network: servers near viewers, cheap bandwidth, and peering with ISPs, which "Hosting it all" comes back to. The mechanism can still be measured at small scale: a thousand viewers asking for a new video should cause one request to the origin.</p>

        <h3>Load balancing</h3>
        <p>A load balancer spreads incoming requests across servers, so the system grows by adding servers and keeps working when one fails. Nginx, HAProxy and Envoy are common self-hosted choices, and every cloud offers a managed one. Four details matter more than the choice of product:</p>
        <ul>
          <li><strong>Layer 4 or layer 7.</strong> The numbers come from the layers of the network model. A layer-4 balancer only sees IP addresses and ports. It forwards whole TCP connections without reading them, which is fast and cheap. A layer-7 balancer reads every HTTP request, so it can route by host or path: <code>upload.example.com</code> to the upload service, <code>/api/*</code> to the API servers. It also ends TLS, so the servers behind it do not have to. This design needs layer 7 at the entry point, because two separate fleets sit behind one address.</li>
          <li><strong>Health checks.</strong> Every few seconds the balancer calls a small endpoint such as <code>/health</code> on every server. A server that fails a few checks in a row gets no new requests until it passes again. The check answers only for the server itself, never for the database behind it; "Containing the blast radius" explains why.</li>
          <li><strong>Connection draining.</strong> During a deploy, a server first leaves the rotation, finishes the requests it already holds, and only then shuts down. Nobody sees a connection cut off.</li>
          <li><strong>The balancer is a fleet too.</strong> A single balancer in front of everything would be the one machine that takes the whole site down. A managed balancer is already many machines; a self-hosted one runs at least two copies. Clients reach them through DNS, which returns several addresses, or through <strong>anycast</strong>: the same IP address is announced from several locations, and internet routing sends each client to the nearest one. When one location goes down, routing moves its clients to the others, without anyone changing a DNS record.</li>
        </ul>
        <p>Below: routing a request, a server failing its health checks, and a balancer going down.</p>
      </Reveal>

      <LoadBalancerVisualizer />

      <Reveal>
        <h2>Hosting it all</h2>

        <p>So far the design is a list of boxes. Someone has to run them, pay for them, and change them every week without breaking anything.</p>

        <h3>What the bill is made of</h3>
        <p>A rough estimate with the numbers from the start of the post, at public cloud prices. Assume the 100 MB upload is a few minutes of 1080p video, and that the whole ladder from 240p to 1080p takes about twice the size of its top rung.</p>
        <BlogTable>
          <thead>
            <tr>
              <th>Part</th>
              <th>Rough size</th>
              <th>Rough cost a day</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bandwidth</td>
              <td>2 billion views</td>
              <td>About $4 million on a rented CDN</td>
            </tr>
            <tr>
              <td>Video storage</td>
              <td>About 4 PB of processed video a day, so about 1.5 EB after a year</td>
              <td>About $1 million after one year, and growing every day</td>
            </tr>
            <tr>
              <td>Transcoding</td>
              <td>Around 50 million minutes of video a day, a few thousand GPUs busy all the time</td>
              <td>Tens of thousands of dollars on spot GPUs</td>
            </tr>
            <tr>
              <td>Everything else</td>
              <td>API fleet, Vitess shards, Redis, broker, monitoring: a few hundred machines</td>
              <td>A few thousand dollars</td>
            </tr>
          </tbody>
        </BlogTable>

        <p>The numbers are rough, but the order is not. The services, the database and the cache that took most of this post are a rounding error. That decides where effort goes: a 1% better hit ratio at the edges, a newer codec such as AV1 for popular videos (roughly a third less bandwidth for the same picture), a cheaper storage class for videos nobody watches, or storing a re-uploaded file once, found by a hash of its content, saves more than any database tuning.</p>

        <h3>Own the baseline, rent the peak</h3>
        <p>The cloud charges for flexibility: a thousand machines in minutes, given back an hour later. Your own servers in a rented rack cost far less for the same work, but you pay for them whether they are busy or not, and adding more takes weeks. So the split follows the shape of the load: what is large and steady runs on your own hardware, and what spikes, or mostly waits, runs in the cloud.</p>
        <BlogTable>
          <thead>
            <tr>
              <th>Part</th>
              <th>Own hardware</th>
              <th>Cloud</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Delivery (edges)</td>
              <td>Edge servers with flat-rate ports and direct links to ISPs carry the normal traffic.</td>
              <td>A rented CDN takes the overflow of a viral video, and the regions without edges of your own.</td>
            </tr>
            <tr>
              <td>Video storage</td>
              <td>Ceph or MinIO with erasure coding, which keeps data safe at about 1.5 times its size instead of 3 full copies.</td>
              <td>A cold copy as an off-site backup, read only in a disaster.</td>
            </tr>
            <tr>
              <td>Transcoding</td>
              <td>GPUs sized for an ordinary day. The queue keeps them busy around the clock.</td>
              <td>Spot GPUs, added by queue length (KEDA does this on Kubernetes) when the queue grows faster than your own GPUs drain it.</td>
            </tr>
            <tr>
              <td>API, database, cache, broker</td>
              <td>Kubernetes on your own machines, next to the storage. The stores get dedicated machines with fast local disks.</td>
              <td>Nothing in normal operation.</td>
            </tr>
            <tr>
              <td>Second region</td>
              <td>Nothing.</td>
              <td>The warm standby from the disaster recovery plan: machines that mostly wait are the worst case for owned hardware and the best case for the cloud.</td>
            </tr>
          </tbody>
        </BlogTable>
        <p>The mix works because the same tools run on both sides: Kubernetes for the services and Terraform for everything around them, so a workload can move without being rewritten, and the second region is a copy of the first. Start fully in the cloud with managed services, when the load is small and unpredictable. Bring a line home when its bill clearly outweighs the people it needs: someone on call, spare parts on a shelf, capacity ordered weeks ahead. Edges come first, then storage, then the GPUs for an ordinary day.</p>

        <h3>Shipping a change</h3>
        <p>Every service above changes many times a week, and every change can break production. The pipeline stops a bad change as early, and as cheaply, as possible:</p>
        <ul>
          <li><strong>CI builds one image per commit.</strong> Tests run first, and the image that passed them is the one that runs everywhere. It is never rebuilt for production.</li>
          <li><strong>Git holds the desired state.</strong> CI never touches the cluster. It writes the new image tag to a config repository, and Argo CD inside the cluster makes the cluster match git. Every release and every rollback is a commit.</li>
          <li><strong>New versions start as a canary.</strong> A few pods take 5% of the traffic, and their errors and latency are compared with the old pods on the same traffic. A bad canary is aborted automatically.</li>
          <li><strong>Rollback takes minutes.</strong> Old images stay in the registry, so rolling back is one revert in git. Schema changes come in two halves: add the new column first, and drop the old one only after the release has proven itself, so the previous code can always run against the current database.</li>
        </ul>
      </Reveal>

      <DeployPipelineVisualizer />

      <Reveal>
        <h2>Handling failures</h2>

        <p>Most failures were handled where their component was introduced: dropped, abandoned and duplicate uploads in "Uploading a video", crashed workers in "Life of a transcode task", slow networks and dead edges in the streaming flow, launch-day crowds in the delivery layer, and a failed cache or balancer in their own flows. What is left are the cases that cut across components.</p>

        <h3>Counts and abuse</h3>

        <h4>Views and likes</h4>
        <p>A view only counts after the viewer has watched for a minimum time, and only once per viewer per time window. Writing the counter once per view would put about 23,000 writes a second on one database row for a popular video, so counting is its own pipeline:</p>
        <ul>
          <li><strong>The API only accepts.</strong> It checks the login token and the rate limits, appends the event to the event stream and answers at once. It never writes a counter.</li>
          <li><strong>An aggregator counts.</strong> It reads the stream, drops the event if this viewer was already counted for this video in the window (that set lives in Redis, with an expiry), and adds the rest to totals in memory.</li>
          <li><strong>Totals go out in batches.</strong> Every few seconds one UPDATE per video adds the batch, and the counter in the cache follows. A thousand views become one write, which is the slight staleness we already accepted for counters. The stream position is saved in the same transaction, so an aggregator that crashes restarts right after its last flush: no view is lost and none is counted twice.</li>
          <li><strong>A like is a row, not a counter.</strong> The (user, video) pair has a primary key, so a second like inserts nothing. Only a like that actually inserted a row sends "+1" to the stream.</li>
          <li><strong>Bots are slowed early and removed late.</strong> Rate limits per account and per address stop the crude ones at the API. Bots that spread over many addresses are counted at first, then found by a fraud job that reads the same stream, and their views are subtracted. That is why a public count can go down.</li>
        </ul>
      </Reveal>

      <ViewCountVisualizer />

      <Reveal>

        <h4>Password guessing</h4>
        <p>Limit login attempts per account and per IP, and make the delay grow with each failure. After a few failures, lock the account for a short time or ask for a CAPTCHA. Store passwords with a slow hash such as bcrypt or Argon2, and return the same error whether the user or the password was wrong. The "Password guessing" scenario in the login flow above plays this out.</p>

        <h3>Deleted and private videos</h3>
        <p>The metadata database is the source of truth. Deleting or hiding a video changes its status there first, so new requests are refused at once. The CDN copy is only a cache, so it is purged in the background. Every request for a segment needs a playback token that expires after minutes, and a fresh token is refused once the video is gone, so even a cached copy stops working before the purge reaches every edge. The viewer sees a clear "not available" message.</p>

        <h3>Containing the blast radius</h3>
        <p>The <strong>blast radius</strong> of a failure is how much of the system it takes down with it. The goal is that a broken part breaks only the features that truly need it. The trap is that the obvious safety measures can spread a failure instead of stopping it. Take a database that turns slow:</p>

        <ol>
          <li>Every API request that needs the database now waits, and each waiting request holds a thread or a connection.</li>
          <li>The servers run out of threads, so requests that never needed the database, such as a token check or a cached watch page, start to wait too.</li>
          <li>If the health check also asks the database, every server fails it at the same moment, and the load balancer removes the whole fleet. A slow database has become a site that is completely down.</li>
        </ol>

        <p>Each of those steps has its own defense:</p>

        <BlogTable>
          <thead>
            <tr>
              <th>Defense</th>
              <th>What it does</th>
              <th>Stops</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Shallow health check</td>
              <td>The check answers only "is this process alive and able to serve". It never calls a database, a cache or another service.</td>
              <td>One shared dependency taking every server out of the balancer.</td>
            </tr>
            <tr>
              <td>Timeouts</td>
              <td>Every call to another component gives up after a short, fixed time (for example 300 ms for a metadata read) instead of waiting forever.</td>
              <td>A slow dependency holding threads hostage.</td>
            </tr>
            <tr>
              <td>Circuit breaker</td>
              <td>After a run of failures the server stops calling that dependency for a few seconds and fails at once. Then it lets a few trial calls through, and closes again when they succeed.</td>
              <td>Hammering a dependency that is trying to recover.</td>
            </tr>
            <tr>
              <td>Bulkheads</td>
              <td>Each dependency gets its own small pool of connections, like the sealed compartments of a ship. When the database pool is full, only database work waits.</td>
              <td>One dependency using up the threads the others need.</td>
            </tr>
            <tr>
              <td>Degraded answers</td>
              <td>When a dependency is down, answer with what is still known: metadata from the cache even if it is a little stale, a watch page without comments, a clear error for the one feature that cannot work.</td>
              <td>A missing feature turning into a missing site.</td>
            </tr>
            <tr>
              <td>Load shedding</td>
              <td>When a server is over capacity it refuses the excess at once with a 503, and the client retries later with backoff, instead of queueing everything and getting slow for everyone.</td>
              <td>Overload spreading from some requests to all of them.</td>
            </tr>
            <tr>
              <td>Fail open at the balancer</td>
              <td>When most servers fail their checks at once, a broken check is far more likely than a broken fleet, so the balancer keeps sending traffic to all of them. Envoy calls this the panic threshold, and AWS load balancers behave the same way.</td>
              <td>The last step of the cascade, even if a deep check slipped in.</td>
            </tr>
          </tbody>
        </BlogTable>

        <p>The architecture already contains the blast radius at a larger scale. The upload service, the API and the delivery service are separate fleets with separate data stores, so a flood of uploads cannot slow down playback. The broker sits between the services and the workers, so a burst queues up instead of knocking anything over. And playback leans on copies: segments come from the edge, metadata from the cache, so viewers of a popular video keep watching for a while even when the database is down. Splitting by load is what makes this possible. These defenses make sure one bad dependency stays inside its own box.</p>

      </Reveal>

      <Reveal>
        <h2>Stress-testing the design</h2>

        <p>A design on paper is only a claim. Below is the same architecture running at the scale you set in the estimator. Press "Go viral" to send a traffic spike through it, then turn design choices on and off to see what each one protects. A box turns amber at 70% load and red at 100%, and the moving dots show how much traffic flows through each route.</p>
      </Reveal>

      <ArchitectureSimulator />

      <Reveal>
        <h3>Things to try</h3>
        <ol>
          <li>On <strong>Blog design</strong>, press <strong>Go viral</strong>. Traffic jumps to 5x, the API servers turn red, and the upload queue starts to grow.</li>
          <li>Switch on <strong>Autoscale API servers</strong> and go viral again. Servers climb toward what the traffic needs, but not instantly. Watch the success rate dip before it recovers.</li>
          <li>Pick <strong>Naive</strong>. With no CDN and no cache, the design struggles even at normal traffic.</li>
          <li>Go back to <strong>Blog design</strong> and turn the <strong>Metadata cache</strong> off. Every view becomes a database query.</li>
          <li>Lower the <strong>Transcoding workers</strong> and go viral. Playback holds, but uploaded videos wait in the queue.</li>
          <li>Pick <strong>Hardened</strong> and push traffic to 10x. Playback now fails at the CDN, not at your own servers.</li>
        </ol>

        <Callout variant="note" title="About the numbers">
          Capacities are round, illustrative values, not benchmarks. What matters is the shape: which component fails first, and how fixing one layer moves the problem to the next.
        </Callout>

        <Callout variant="warning" title="What the simulator leaves out">
          It models playback reads, uploads, engagement writes and transcoding. It does not model login traffic, comments, dashboards, hot keys, or a cache that fails. Those are discussed above, but they would each add their own boxes and their own ways to break.
        </Callout>
      </Reveal>

      <Reveal>
        <h2>What to keep</h2>

        <p>Pressing play looked simple at the start. It took a whole post to make it survive real users, real networks and real failures. Here is what to keep.</p>

        <h3>The main points</h3>
        <ol>
          <li><strong>Estimate first.</strong> The numbers decide the architecture. Bandwidth dominates the bill, storage grows every day because videos are almost never deleted, and the metadata that most of the design is about is small.</li>
          <li><strong>Separate the paths, and keep the bytes off your servers.</strong> Uploading is slow and write-heavy, watching is fast and read-heavy. Clients upload straight to storage and stream from edges, and the services only exchange small requests and events.</li>
          <li><strong>Split by load, not by feature.</strong> Login, metadata, comments, counters and dashboards have different loads, so each gets its own store, its own limits, and its own way to fail.</li>
          <li><strong>One source of truth, and everything else is a copy.</strong> The database holds the truth about a video, and storage holds the truth about its bytes. Caches, edges, replicas and counters are copies that may be a little behind and can be thrown away, and the source of truth always overrules them.</li>
          <li><strong>Make every action safe to repeat.</strong> Networks retry, users double tap, brokers redeliver. An idempotency key, a unique row per finished task, a conditional status update, a primary key per like and a saved stream position all make the second attempt do nothing.</li>
          <li><strong>Never wait for someone to stay alive.</strong> Clients close the app, workers crash, aggregators die. Leases, expiries, sweeps and replayable streams finish or clean up whatever they leave behind.</li>
          <li><strong>Scale in steps, on measurements.</strong> Cheap queries, a cache, replicas, a bigger machine and a server per module come first. Shard only what still outgrows one primary.</li>
          <li><strong>Contain failures.</strong> Shallow health checks, timeouts, circuit breakers, separate pools, degraded answers and spare capacity keep one broken part from taking the rest with it.</li>
          <li><strong>Ship in small, reversible steps.</strong> A canary takes the first hit of a bad release, and a rollback is one revert in git because old images stay and schema changes come in two halves.</li>
          <li><strong>Spend effort where the money is.</strong> A better hit ratio or a cheaper storage class beats any database tuning. Own the large, steady load, rent the spikes.</li>
        </ol>

        <h3>Every catch we found, in one place</h3>
        <p>Each one looked harmless on the whiteboard. Open the list for a recap of all of them, grouped by where they bite.</p>

        <details className="my-6 border border-neutral-800">
          <summary className="cursor-pointer select-none px-4 py-3 font-mono text-xs uppercase tracking-wider text-neutral-300 hover:text-neutral-100">
            Show all 36 catches
          </summary>
          <div className="px-4 pb-2">

        <h4>Uploads</h4>
        <BlogTable>
          <thead>
            <tr>
              <th>The catch</th>
              <th>What goes wrong</th>
              <th>What the design does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>The connection drops at 90%</td>
              <td>The whole file starts over</td>
              <td>Chunks; the client asks which are missing and gets fresh URLs</td>
            </tr>
            <tr>
              <td>A double tap, or a retry after a timeout</td>
              <td>Two videos</td>
              <td>A client-made idempotency key with a unique constraint, kept unique across shards by a lookup vindex</td>
            </tr>
            <tr>
              <td>The client says "done"</td>
              <td>Clients lie, crash and lose signal</td>
              <td>Storage is the judge; the hint, a storage event and the sweep all run one idempotent routine</td>
            </tr>
            <tr>
              <td>The finish hint and the sweep fire together</td>
              <td>Every task is queued twice</td>
              <td>A conditional status update: one changes the row, the other changes nothing</td>
            </tr>
            <tr>
              <td>The creator leaves midway</td>
              <td>Orphaned chunks fill storage</td>
              <td>Quota and expiry up front, heartbeats, a sweep that asks storage, a grace period, and a storage lifecycle rule as the last net</td>
            </tr>
          </tbody>
        </BlogTable>

        <h4>Transcoding</h4>
        <BlogTable>
          <thead>
            <tr>
              <th>The catch</th>
              <th>What goes wrong</th>
              <th>What the design does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A worker dies mid-encode</td>
              <td>The task is lost, or stuck forever</td>
              <td>A lease that expires, and a fixed output path so any worker writes the same file</td>
            </tr>
            <tr>
              <td>A "done" message is delivered twice</td>
              <td>The video turns ready with a segment missing</td>
              <td>A unique row per (video, task) before the counter moves</td>
            </tr>
            <tr>
              <td>Two tasks finish at the same moment</td>
              <td>Nobody, or two services, see the count reach 18</td>
              <td>The counter update locks the row, so exactly one sees 18</td>
            </tr>
            <tr>
              <td>A segment can never be encoded</td>
              <td>A blocked queue, or a video with a hole in it</td>
              <td>Retries with backoff, then the dead-letter queue; the video fails cleanly, partial segments are deleted, the raw upload is kept for a retry</td>
            </tr>
            <tr>
              <td>A spot GPU is taken back</td>
              <td>Work in progress vanishes</td>
              <td>The worker hands its task back on the stop signal</td>
            </tr>
          </tbody>
        </BlogTable>

        <h4>Playback</h4>
        <BlogTable>
          <thead>
            <tr>
              <th>The catch</th>
              <th>What goes wrong</th>
              <th>What the design does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A slow or changing network</td>
              <td>The picture freezes</td>
              <td>Auto quality: drop at once, climb one rung at a time with a healthy buffer, abandon a segment that is too slow</td>
            </tr>
            <tr>
              <td>An edge fails</td>
              <td>Playback stops</td>
              <td>Fallback edges in the answer, and steering that drops an edge that stops reporting</td>
            </tr>
            <tr>
              <td>A two-hour film with signed URLs</td>
              <td>A heavy manifest, and URLs that expire mid-film</td>
              <td>One playback token for the whole video</td>
            </tr>
            <tr>
              <td>Thousands on a brand-new video</td>
              <td>The origin is flooded</td>
              <td>Request collapsing, a shield layer, jittered expiry and pre-warming</td>
            </tr>
            <tr>
              <td>A deleted video is still cached</td>
              <td>It keeps playing</td>
              <td>The status changes first, tokens expire in minutes, and the purge follows</td>
            </tr>
          </tbody>
        </BlogTable>

        <h4>Data</h4>
        <BlogTable>
          <thead>
            <tr>
              <th>The catch</th>
              <th>What goes wrong</th>
              <th>What the design does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>No foreign keys between modules</td>
              <td>Comments point at videos that are gone</td>
              <td>Checks through the API, video.deleted events, and sweeps</td>
            </tr>
            <tr>
              <td>Replication lag</td>
              <td>A creator sees "processing" after the video is ready</td>
              <td>Read your own videos from the primary</td>
            </tr>
            <tr>
              <td>Queries by anything but the shard key</td>
              <td>Every query asks every shard</td>
              <td>Lookup vindexes, and rows of one video kept on one shard</td>
            </tr>
            <tr>
              <td>A mistaken DELETE</td>
              <td>Every replica copies it faithfully</td>
              <td>Backups plus the binary log</td>
            </tr>
            <tr>
              <td>A whole region goes dark</td>
              <td>Data and service are gone</td>
              <td>Backups and a warm standby in a second region, with failover practised on a schedule</td>
            </tr>
          </tbody>
        </BlogTable>

        <h4>Caching and traffic</h4>
        <BlogTable>
          <thead>
            <tr>
              <th>The catch</th>
              <th>What goes wrong</th>
              <th>What the design does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>An edit while the old value is cached</td>
              <td>The old title stays</td>
              <td>Delete the entry instead of updating it, with a time limit as the safety net</td>
            </tr>
            <tr>
              <td>One viral video</td>
              <td>One cache node takes all the load</td>
              <td>A short copy on every API server, and collapsed misses</td>
            </tr>
            <tr>
              <td>The cache goes down</td>
              <td>Every read hits the database at once</td>
              <td>One read per key, a cap on database queries, and a replica that takes over</td>
            </tr>
            <tr>
              <td>A health check that calls the database</td>
              <td>One slow database takes every server out of the balancer</td>
              <td>Shallow checks, and a balancer that fails open</td>
            </tr>
            <tr>
              <td>A slow dependency</td>
              <td>Threads wait on it until everything is slow</td>
              <td>Timeouts, circuit breakers, separate pools, degraded answers and load shedding</td>
            </tr>
            <tr>
              <td>A balancer dies</td>
              <td>The whole site goes with it</td>
              <td>Two or more copies behind one address, each running under half its capacity</td>
            </tr>
            <tr>
              <td>A spike faster than autoscaling</td>
              <td>Errors before the new servers arrive</td>
              <td>Spare capacity kept on purpose</td>
            </tr>
          </tbody>
        </BlogTable>

        <h4>Counts and abuse</h4>
        <BlogTable>
          <thead>
            <tr>
              <th>The catch</th>
              <th>What goes wrong</th>
              <th>What the design does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A write per view</td>
              <td>One database row takes thousands of writes a second</td>
              <td>An event stream and an aggregator that writes in batches</td>
            </tr>
            <tr>
              <td>Refreshing, double likes</td>
              <td>Inflated counts</td>
              <td>One view per viewer per window, and a primary key per like</td>
            </tr>
            <tr>
              <td>Bots</td>
              <td>Fake views</td>
              <td>Rate limits at the door, and a fraud job that subtracts later</td>
            </tr>
            <tr>
              <td>The aggregator crashes</td>
              <td>Views lost, or counted twice</td>
              <td>The stream position is saved with the counts</td>
            </tr>
            <tr>
              <td>Password guessing</td>
              <td>Accounts taken over</td>
              <td>Growing delays, short locks, a slow hash and one error for both mistakes</td>
            </tr>
          </tbody>
        </BlogTable>

        <h4>Shipping and hosting</h4>
        <BlogTable>
          <thead>
            <tr>
              <th>The catch</th>
              <th>What goes wrong</th>
              <th>What the design does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A release that passes the tests but fails on real traffic</td>
              <td>Errors for everyone</td>
              <td>A canary that aborts itself</td>
            </tr>
            <tr>
              <td>A bug that shows only hours later</td>
              <td>A slow, risky rollback</td>
              <td>A revert in git to an image that still exists, and schema changes the old code can live with</td>
            </tr>
            <tr>
              <td>The deploy tool is down</td>
              <td>Nothing, if it is kept off the request path</td>
              <td>Production keeps serving and only releases wait</td>
            </tr>
            <tr>
              <td>The bill</td>
              <td>Bandwidth and storage dwarf everything else</td>
              <td>Own edges, cheaper storage for old videos, own hardware for the baseline and the cloud for the peak</td>
            </tr>
          </tbody>
        </BlogTable>

          </div>
        </details>

        <h3>The idea underneath</h3>
        <p>Almost every catch above has the same shape: something happens twice, or never finishes, or a copy disagrees with the truth. So the design asks three questions of every step. What if it runs twice? What if it stops halfway? Which copy wins? When each step has an answer, the edge cases stop being surprises and become scenarios you can replay, which is exactly what the diagrams in this post do.</p>

        <p>There is more to a real system: security, monitoring and logging each deserve their own post. I hope this one helps you reason about how a video service scales, and how it keeps working when things go wrong.</p>
      </Reveal>
    </div>
  );
}
