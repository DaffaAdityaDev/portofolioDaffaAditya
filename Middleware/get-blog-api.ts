import { gql } from "graphql-request";

const QUERYALLBLOG = gql`
  {
    posts {
      datePublished
      title
      id
      slug
      timeRead
      description
    }
  }
`;
export default QUERYALLBLOG;

export const QUERYSLUGBLOG = gql`
  query Post($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      datePublished
      author {
        id
        name
        avatar {
          url
        }
      }
      content {
        html
      }
      coverPhoto {
        id
        url
      }
    }
  }
`;
export const SLUGLIST = gql`
  {
    posts {
      slug
    }
  }
`;
