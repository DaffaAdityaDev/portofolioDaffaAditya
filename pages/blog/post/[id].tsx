import { getAllPostIds, getPostData } from '../../../lib/posts';
import Breadcrumb from '../../../components/Breadcrumb';
import styles from '../../../styles/blog.module.scss'
import Navbar from '../../../components/Navbar';
import Head from 'next/head';
import useDynamicContent from '../../../hooks/useDynamicConten';

interface PostProps {
  postData: {
    title: string;
    description: string;
    contentHtml: string;
    image: string;
    id: string;
  };
}

function loadContent(postData: PostProps['postData']) {
  console.log('Loading dynamic content for post', postData.id);
  return (
    <div className={styles.blogPost} dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
  );
}

// Your page component here
function Post({ postData } : PostProps) {
  const { ref, content } = useDynamicContent(() => loadContent(postData));

  return (
    <div className='grid grid-cols-12 text-white'>
      <Head>
        <title>{postData.title}</title>
        <meta name="description" content={postData.description} />
        <meta property="og:title" content={postData.title} />
        <meta property="og:description" content={postData.description} />
        <meta property="og:image" content={postData.image} />
        <meta property="og:url" content={`https://yourwebsite.com/blog/${postData.id}`} />
        <meta property="og:type" content="article" />
      </Head>
      <div className='col-start-2 col-span-10'>
        <Navbar />
        <div className='my-4'>
          <Breadcrumb
            items={[
              { title: 'Home', href: '/' },
              { title: 'Blog', href: '/blog' },
              { title: postData.title, href: 'null' },
            ]}
          />
        </div>
        <div className='flex flex-col justify-center'>
          <img src={postData.image} alt="profile" />
          <h1 className='text-4xl font-bold mt-6 text-center'>{postData.title}</h1>
        </div>
        <div ref={ref} id="dynamic-content">
          {content}
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params } : any) {
  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
}

export default Post;