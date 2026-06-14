import React from 'react';
import CodeBlock from '../components/CodeBlock';
import CustomImage from '../components/CustomImage';

export default function VideoSharing() {
  return (
    <div className="blog-content-static">
      <p>In this blog, we will focus on creating the architecture and features that will be needed in this video Sharing service. If you are curious about implementation, check my Github: <a href="https://github.com/DaffaAdityaDev/streaming_video.git" target="_blank" rel="noopener noreferrer">Github Implementation</a></p>

      <h3>Functional Requirements</h3>
      <ul>
        <li>Users can sign up and log in</li>
        <li>Users can upload videos</li>
        <li>Users can watch videos</li>
        <li>Users should be able to change video quality.</li>
        <li>The system should keep the count of likes, dislikes, and views.</li>
      </ul>

      <h3>Non-Functional Requirements</h3>
      <ul>
        <li>Video uploading should be fast and users should have a smooth video Sharing experience.</li>
        <li>The system should be scalable and should be able to handle a large number of users and offer high availability.</li>
        <li>The system should offer low latency and high throughput.</li>
        <li>The system should be cost-effective to run.</li>
      </ul>

      <h3>Design Considerations and Constraints</h3>
      <p>The following estimates are base ony many factors such as the number of users, the number of videos, and the number of videos watched.</p>
      <ul>
        <li>Let's assume total users = 2 billion</li>
        <li>Daily active users = 400 million</li>
        <li>the number of video watched/day/user = 5</li>
        <li>Total videos watched/day = 400 million * 5 = 2 billion views/day</li>
      </ul>

      <p>Most of streaming service like youtube, netflix, prime video, etc. would be view-heavy(read-heavy) systems, so are our system. Suppose upload to view ratio (read-to-write ration) is 1:100, then total video upload/day = 2 billion / 100 = 20 million videos uploaded/day.</p>

      <p>Suppose the average video size is 100 MB. Total storage needed/day = 20 million * 100 MB = 2 PB/day. Here we ignore video compression and replication, which would change the numbers.</p>

      <p>if we use existing CDN cloud services to serve videos. then it would cost money for data transfer. suppose we use Google Cloud CDN, which cost $0.02 per GB of data transfer. so the total cost for video streaming/day = Total video views/day * avg video size in GB * cost/GB = 2 billion * 0.1 * 0.02 = 4$ Million or 62 IDR Million a day. As we can see, serving videos from the CDN would cost lots of money.</p>

      <h3>High-Level System Design</h3>

      <CustomImage 
        src="/image/blogs/videoSharing/systemDesign.webp" 
        alt="Image of video Sharing Service" 
      />

      <p>High-level design requires the following components:</p>

      <ol>
        <li><strong>Client</strong>: A computer, mobile, or any other device that can play videos.</li>
        <li><strong>web server</strong>: This is used for handling incoming request from the client. Base on the request, it routes the request to the appropriate service.</li>
        <li><strong>Load balancer</strong>: This is used to distribute the incoming request to the appropriate server. It helps in scaling the system and also helps in high availability.</li>
        <li><strong>Video Storage</strong>: This is a BLOB storage for storing transcoded videos. A binary Large Object (BLOB) is a collection of binary data stored as a single entity in a database management system. Blobs are typically images, audio or other multimedia objects, though sometimes binary executable code is stored</li>
        <li><strong>Transcoding Server</strong>: We use this for video transcoding or encoding purposes, which converts a video into multiple formats and resolutions (e.g., 1080p, 720p, 480p, etc.) to support different devices and network bandwidths.</li>
        <li><strong>API server</strong>: This is used for handling all the client requests. It is responsible for user authentication, video transcoding, and video streaming. generating thumbnails, metadata, cache, etc. This server also interacts with the database.</li>
        <li><strong>CDN</strong>: This is used for serving videos to the client. It helps in reducing the load on the API server and also helps in reducing the latency. a popular video streamed from the CDN</li>
        <li><strong>Metadata Database</strong>: We use this to store all video metadata like title, video URL, thumbnail, user information, view count, likes, comments, resolution, format, etc. It is sharded and replicated for meet perfomance and availability requirements.</li>
        <li><strong>Metadata Cache</strong>: This is used to cache the metadata of the videos, user info, thumbnails. It helps in reducing the load on the database and also helps in reducing the latency.</li>
      </ol>

      <p>As video Sharing service is heavily loaded service, it has various APIs to perform different operations smoothly. There could be different APIs to design feature like video uploading, video streaming, video search, adding comments, any many more. We can use either SOAP or REST architecture to design these APIs.</p>

      <h3>Video Uploading Process</h3>
      <p>We use the uploadVideo API for uploading the video content, which return an HTTP response that demonstrates vide is uploaded successfully or not.</p>
      <ul>
        <li><strong>apiKey</strong>: A unique key that is used to authenticate the user.</li>
        <li><strong>title</strong>: The title of the video.</li>
        <li><strong>description</strong>: The description of the video.</li>
        <li><strong>video</strong>: The video file that needs to be uploaded.</li>
      </ul>

      <p>The video upload flow is divided into two process running in parallel:</p>
      <ol>
        <li><strong>Video Transcoding</strong>: The video is transcoded into multiple formats and resolutions to support different devices and network bandwidths. The transcoded videos are then stored in the video storage.</li>
        <li><strong>Metadata Storage</strong>: The metadata of the video is stored in the metadata database. It includes the title, video URL, thumbnail, user information, view count, likes, comments, resolution, format, etc.</li>
      </ol>

      <h4>1. Video Transcoding Process</h4>
      <p>First, videos are uploaded by the user, and then transcoding servers start the video encoding process. The encoding process converts video into multiple formats and resolutions set by our in advance. For increasing the throughput, we can parallelize the process by spreading this task across several machines. If a video will be popular, it can do another level of compression to ensure the same visual quality but with a smaller file size. Overall, video is processed by a batch job that runs several automated processes such as generating thumbnails, metadata, encoding, etc.</p>

      <p>Video encoding is possible in two ways: <strong>lossless</strong> and <strong>lossy</strong>. in lossless encoding. there is no data loss between the original format to a new format. in the lossy encoding, some data is dropped from original video to reduce the file size of the new format. We might have experienced this when uploading a high-resolution image on a social network. After the upload. the image doesn't look as sharp as the original one. This is because the social network uses lossy compression to reduce the file size of the image.</p>

      <p>After the completion of the encoding process, two things get executed in parallel:</p>
      <ol>
        <li><strong>Video Storage</strong>: The transcoded videos are stored in the video storage.</li>
        <li><strong>Metadata Storage</strong>: The metadata of the video is stored in the metadata database. It includes the title, video URL, thumbnail, user information, view count, likes, comments, resolution, format, etc.</li>
      </ol>

      <p>Finally, API servers inform the client that the video is successfully uploaded and ready for streaming.</p>

      <h4>2. Updating the video metadata</h4>
      <p>While content is being uploaded to the video storage, the client, in parallel, sends a request to update the video metadata. This data includes title, video URL, thumbnails, user information, view count, likes, comments, resolution, format, etc.</p>

      <h3>Video Streaming Process</h3>
      <p>We use the viewVideo API for streaming the video content, which continuously sends the small pieces of the video media stream from the given offset.</p>

      <CodeBlock className="language-javascript">
{`stream viewVideo(string videoId, int offset, int videoResolution)`}
      </CodeBlock>

      <p>Whenever a user sends a request to watch the video, the platform checks the viewer's device type, screen size, processing capability, and network bandwidth. Based on these factors, it delivers the best video version from the nearest edge server in real-time. After this, our device immediately loads a little bit of data at a time and continuously receives video streams from CDN or Video Storage. Here are two critical observations:</p>

      <ol>
        <li><strong>Adaptive Bitrate Streaming</strong>: The platform uses adaptive bitrate streaming to deliver the best video quality to the user. It continuously monitors the viewer's network bandwidth and device capability and adjusts the video quality in real-time. This ensures that the user gets the best video quality without buffering.</li>
        <li><strong>Video Caching</strong>: The platform uses video caching to reduce the load on the API server and reduce latency. The video is cached at the edge server, and the user gets the video from the nearest edge server. This reduces the load on the API server and reduces latency.</li>
      </ol>

      <h3>db Schema</h3>
      <p>We can use PostgreSQL to store the metadata like user and video information. For this, we can maintain the following tables:</p>
      
      <CustomImage 
        src="/image/blogs/videoSharing/dbSchema.webp" 
        alt="db Schema" 
      />

      <h4>Metadata Replication: Master-Slave Architecture</h4>
      <p>In this architecture, we need two data sources to scale out the application: one to handle the write query and the other one to handle the read query. Here write request will go to the master first and then apply to all the slaves. Read request will be routed to slave replicas parallelly to reduce the load on the master. This could help up to increase the read throughput.</p>

      <p>Such a design may cause staleness in data from the read replicas. now imagine, suppose we performed a write operation by adding a new video, then its metadata would be first inserted in the master. Now before this new data gets updated to the slave, a new read request came. At this point, slaves would not be able to see it and return stale data to the user. This inconsistency may create a difference in view counts for a video between the master and the replica. But this can be okay for the user if there is slight inconsistency (for a short period of time) in the view count of a video.</p>

      <p>But here is a problem with this approach: Since we have a huge number of new videos every day and our read operation is extremely high, the master-slave architecture will suffer from replication lag. On another side, update operation causes cache misses, which go to disk where slow I/O causes slow replication. Now the critical question is how can we improve the performance the read/write operation.</p>

      <h4>Metadata Sharding</h4>
      <p>Sharding is one of the way of scaling a relational database besides the master-slave architecture. In this approach, we distribute our data across multiple machines so that we can perform read/write operations efficiently. Now instead of a single master handling the write requests, it could be done on various sharded machines and increase the write performance. We can also create separate replicas to improve redundancy and throughput.</p>

      <p>Sharding can increase the system complexity and we need an abstract system to handle the scaling and manageability challenges. so we going to use Postgres-XL, which is an open-source distributed database management system. It is based on PostgreSQL and is designed to handle large-scale databases and high throughput.</p>

      <CustomImage 
        src="/image/blogs/videoSharing/sharding.webp" 
        alt="sharding" 
      />

      <p>Here are some important features of Postgres-XL:</p>
      <ul>
        <li><strong>Global Transaction Manager (GTM)</strong>: It is responsible for managing the global transaction and sequence numbers.</li>
        <li><strong>Coordinator</strong>: It is responsible for parsing the query, planning, and optimizing the query, and then sending the query to the datanodes.</li>
        <li><strong>Datanode</strong>: It is responsible for storing the data and executing the query.</li>
      </ul>

      <h3>Caching</h3>
      <p>For building such extensive scalable system, we need to use different caching strategies. We can use distributed cache such as Redis or Memcached to store the metadata. To make the caching service efficiently perform all its operations, we can use LRU (Least Recently Used) cache eviction policy. This policy removes the least recently used items first, which makes space for new items.</p>

      <p>We can also use CDN as video content cache. CDN is useful in fetching media content directly from BLOB storage. Most used CDN are Cloudflare, Akamai, and Amazon CloudFront.</p>

      <h3>Load Balancing</h3>
      <p>We can use a load balancer to distribute the incoming request to the appropriate server. It helps in scaling the system and also helps in high availability. We can use Nginx or HAProxy as a load balancer.</p>

      <h3>Conclusion</h3>
      <p>In this blog, we have designed a video Sharing service that can scale. We have discussed the high-level architecture, the video uploading process, the video streaming process, the database schema, and the caching strategy. We have also discussed the load balancing and the metadata sharding. We have also discussed the cost-effective way. However, there are many other things that we can discuss, such as security, monitoring, and logging, etc. I hope this blog will help you to understand how to design a video Sharing service that can scale.</p>
    </div>
  );
}
