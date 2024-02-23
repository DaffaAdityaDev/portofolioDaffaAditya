import { getAllPostIds, getPostData } from '../../../lib/posts';
import Breadcrumb from '../../../components/Breadcrumb';
import styles from '../../../styles/blog.module.scss'
import Navbar from '../../../components/Navbar';

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

// Your page component here
function Post({ postData } : any) {
  // Render your post data
  console.log(postData);
  return (
    <div className='grid grid-cols-12 text-white'>
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
          <h1 className='text-4xl'>{postData.title}</h1>
        </div>
        <div className={styles.blogPost} dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </div>
    </div>
  );
}

export default Post;