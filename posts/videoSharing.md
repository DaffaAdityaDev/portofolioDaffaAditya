---
title: "How i design a video Sharing service"
date: "2024-02-26"
timeToRead: 10
description: "Explore the architecture and features of a scalable video sharing service, including user authentication, video uploading, streaming, and more. Learn about design considerations, system architecture, and the importance of scalability and performance."
image: "/image/blogs/videoSharing/systemDesign.webp"
---

In this blog, we will focus on creating the architecture and features that will be needed in this video Sharing service.

**[Functional Requirements](#functionalRequirements)**

- Users can sign up and log in
- Users can upload videos
- Users can watch videos
- Users should be able to change video quality.
- The system should keep the count of likes, dislikes, and views.

**[Non-Functional Requirements](#non-FunctionalRequirements)**

- Video uploading should be fast and users should have a smooth video Sharing experience.
- The system should be scalable and should be able to handle a large number of users and offer high availability.
- The system should offer low latency and high throughput.
- The system should be cost-effective to run.

### Design Considerations and Constraints

The following estimates are base ony many factors such as the number of users, the number of videos, and the number of videos watched.

- Let's assume total users = 2 billion
- Daily active users = 400 million
- the number of video watched/day/user = 5
- Total videos watched/day = 400 million \* 5 = 2 billion views/day

Most of streaming service like youtube, netflix, prime video, etc. would be view-heavy(read-heavy) systems, so are our system.
Suppose upload to view ratio (read-to-write ration) is 1:100, then total video upload/day = 2 billion / 100 = 20 million videos uploaded/day.

Suppose the average video size is 100 MB. Total storage needed/day = 20 million \* 100 MB = 2 PB/day. Here we ignore video compression and replication, which would change the numbers.

if we use existing CDN cloud services to serve videos. then it would cost money for data transfer. suppose we use Google Cloud CDN, which cost $0.02 per GB of data transfer. so the total cost for video streaming/day = Total video views/day * avg video size in GB * cost/GB = 2 billion * 0.1 * 0.02 = 4$ Million or 62 IDR Million a day. As we can see, serving videos from the CDN would cost lots of money.

### High-Level System Design

![Image of video Sharing Service](/image/blogs/videoSharing/systemDesign.webp)

High-level design requires the following components:

**1. Client**: A computer, mobile, or any other device that can play videos.

**2. web server**: This is used for handling incoming request from the client. Base on the request, it routes the request to the appropriate service.

**3. Load balancer**: This is used to distribute the incoming request to the appropriate server. It helps in scaling the system and also helps in high availability.

**4. Video Storage**: This is a BLOB storage for stroing transcoded videos. A binary Large Object (BLOB) is a collection of binary data stored as a single entity in a database management system. Blobs are typically images, audio or other multimedia objects, though sometimes binary executable code is stored

**5. Transcoding Server**: We use this for video transcoding or encoding purposes, which converts a video into multiple formats and resolutions (e.g., 1080p, 720p, 480p, etc.) to support different devices and network bandwidths.

**6. API server**: This is used for handling all the client requests. It is responsible for user authentication, video transcoding, and video streaming. generating thumbnails, metadata, cache, etc. This server also interacts with the database.

**7. CDN**: This is used for serving videos to the client. It helps in reducing the load on the API server and also helps in reducing the latency. a popular video streamed from the CDN

**8. Metadata Database**: We use this to store all video metadata like title, video URL, thumbnail, user information, view count, likes, comments, resolution, format, etc. It is sharded and replicated for meet perfomance and availability requirements.

**9. Metadata Cache**: This is used to cache the metadata of the videos, user info, thumbnails. It helps in reducing the load on the database and also helps in reducing the latency.

As video Sharing service is heavily loaded service, it has various APIs to perform different operations smoothly. There could be different APIs to design feature like video uploading, video streaming, video search, adding comments, any many more. We can use either SOAP or REST architecture to design these APIs.

### Video Uploading Process

We use the uploadVideo API for uploading the video content, which return an HTTP response that demonstrates vide is uploaded successfully or not.

- **apiKey**: A unique key that is used to authenticate the user.
- **title**: The title of the video.
- **description**: The description of the video.
- **video**: The video file that needs to be uploaded.

The video upload flow is divided into two process running in parrallel:

1. **Video Transcoding**: The video is transcoded into multiple formats and resolutions to support different devices and network bandwidths. The transcoded videos are then stored in the video storage.
2. **Metadata Storage**: The metadata of the video is stored in the metadata database. It includes the title, video URL, thumbnail, user information, view count, likes, comments, resolution, format, etc.

#### 1. Video Streaming Process

First, videos are uploaded by the user, and then transcoding servers start the video encoding process. The encoding process converts video into multiple formats and resolutions set by our in advance. For increasing the throughput, we can parallelize the process by spreading this task across several machines. If a video will be popular, it can do another level of compression to ensure the same visual quality but with a smaller file size. Overall, video is processed by a batch job that runs several automated processes such as generating thumbnails, metadata, encoding, etc.

Video encoding is possible in two ways: **lossless** and **lossy**. in lossless encoding. there is no data loss between the original format to a new format. in the lossy encoding, some data is dropped from original video to reduce the file size of the new format. We might have experienced this when uploading a high-resolution image on a social network. After the upload. the image doesn't look as sharp as the original one. This is because the social network uses lossy compression to reduce the file size of the image.

After the completion of the encoding process, two things get executed in parralel:

1. **Video Storage**: The transcoded videos are stored in the video storage.
2. **Metadata Storage**: The metadata of the video is stored in the metadata database. It includes the title, video URL, thumbnail, user information, view count, likes, comments, resolution, format, etc.

Finally, API servers inform the client that the video is successfully uploaded and ready for streaming.

#### 2. Updating the video metadata

While content is being uploadted to the video storage, the client, in parallel, sends a request to update the video metadata. This data includes title, video URL, thumbnails, user information, view count, likes, comments, resolution, format, etc.

### Video Streaming Process

We use the uploadVideo API for uploading the video content, which continuously sends the small pieces of the video media stream from the given offset.

stream viewVideo(string videoId, int offset, int videoResolution)

- **videoId**: The unique identifier of the video.
- **offset**: The offset from where the video needs to be streamed.
- **videoResolution**: The resolution of the video.

Whenever a user sends a request to watch the video, the platform checks the viewer's device type, screen size, processing capability, and network bandwidth. Based on these factors, it delivers the best video version from the nearest edge server in real-time. After this, our device immediately loads a little bit of data at a time and continuously receives video streams from CDN or Video Storage. Here are two critical observations:

1. **Adaptive Bitrate Streaming**: The platform uses adaptive bitrate streaming to deliver the best video quality to the user. It continuously monitors the viewer's network bandwidth and device capability and adjusts the video quality in real-time. This ensures that the user gets the best video quality without buffering.

2. **Video Caching**: The platform uses video caching to reduce the load on the API server and reduce latency. The video is cached at the edge server, and the user gets the video from the nearest edge server. This reduces the load on the API server and reduces latency.

### db Schema

We can use PostgreSQL to store the metadata like user and video information. For this, we can maintain the following tables:
![db Schema](/image/blogs/videoSharing/dbSchema.webp)

#### Metadata Replication: Master-Slave Architecture

In this architecture, we need two data sources to scale out the application: one to handle the write query and the other one to handle the ready query. Here write request will go to the master first and then apply to all the slaves. Read request will be routed to slave replicas parallelly to reduce the load on the master. This could help up to increase the read throughput.

Such a design may case staleness in data from the read replicas. now imagine, suppose we performed a write operation by adding a new video, then its metadata would be first inserted in the master. Now before this new data gets updated to the slave, a new read request came. At this point, slaves would not be able to see it and return stale data to the user.

This inconsistency may create a difference in view counts for a video between the master and the replica. But this can be okay for the user if there is slight inconsistency (for a short period of time) in the view count of a video.

But here is a problem with this approach: Since we have a huge number of new videos every day and our read operation is extremely high, the master-slave architecture will suffer from replication lag. On another side, update operation causes cache misses, which go to disk where slow I/O causes slow replication. Now the critical question is how can we improve the perfomance the read/write operation.

#### Metadata Sharding

Sharding is one of the way of scaling a relational database besides the master-slave architecture. IN this approach, we distribute our data across multiple machines so taht we can perform read/write operations efficiently. Now instead of a single master handling the write requests, it could be done on various sharded machines and increase the write perfomance. We can also create seperate replicas to improve redundancy and throughput.

Sharding can increase the system complexity and we need an abstract system to handle the scaling and manageability challenges. so we going to use postgress-XL, which is an open-source distributed database management system. It is based on PostgreSQL and is designed to handle large-scale databases and high throughput. [postgressXL](https://www.postgres-xl.org/)

![sharding](/image/blogs/videoSharing/sharding.webp)

Here are some imporatnt features of postgress-XL:

- **Global Transaction Manager (GTM)**: It is responsible for managing the global transaction and sequence numbers.
- **Coordinator**: It is responsible for parsing the query, planning, and optimizing the query, and then sending the query to the datanodes.
- **Datanode**: It is responsible for storing the data and executing the query.

### Caching

For building such extensive scalable system, we need to use different caching strategies. We can use distributed cache such as Redis or Memcache to store the metadata. To make the caching service efficiently perform all its operations, we can use LRU (Least Recenlty Used) cache eviction policy. This policy removes the least recently used items first. This policy is useful because it removes the least recently used items first, which makes space for new items.

We can also use CDN as video content cache. CDN is useful is fetching media content directly from BLOB storage. most used CDN are Cloudflare, Akamai, and Amazon CloudFront. suit your needs.

### Load Balancing

We can use a load balancer to distribute the incoming request to the appropriate server. It helps in scaling the system and also helps in high availability. We can use Nginx or HAProxy as a load balancer. We can also use a hardware load balancer like F5 BIG-IP, Citrix ADC, etc.

### Conclusion

In this blog, we have designed a video Sharing service that can scale. We have discussed the high-level architecture, the video uploading process, the video streaming process, the database schema, and the caching strategy. We have also discussed the load balancing and the metadata sharding. We have also discussed the cost-effective way. However, there are many other things that we can discuss, such as security, monitoring, and logging, etc. I hope this blog will help you to understand how to design a video Sharing service that can scale.
