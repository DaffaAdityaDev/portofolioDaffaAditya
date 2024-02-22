import { GetStaticPropsContext } from 'next';
import { getAllPostIds, getPostData } from '../../../lib/posts';

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // Add the "await" keyword like this:
  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
}


// Your page component here
function Post({ postData }) {
  // Render your post data
  console.log(postData);
  return (
    <div className='bg-red-500'>
      <h1>{postData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </div>
  );
}

export default Post;