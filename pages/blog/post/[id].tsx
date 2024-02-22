import { getAllPostIds, getPostData } from '../../../lib/posts';
import Breadcrumb from '../../../components/Breadcrumb';
import styles from '../../../styles/blog.module.scss'

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
        <Breadcrumb
          items={[
            { title: 'Home', href: '/' },
            { title: 'Blog', href: '/blog' },
            { title: postData.title, href: 'null' },
          ]}
        />
        <img src={postData.image} alt="profile" />
        <h1>{postData.title}</h1>
        <div className={styles.blogPost} dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </div>
    </div>
  );
}

export default Post;