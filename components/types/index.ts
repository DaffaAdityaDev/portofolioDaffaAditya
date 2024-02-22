interface IPostData {
    id: string;
    date: string;
    title: string;
}

interface IBlogProps {
    allPostsData: IPostData[];
}

interface IParams {
    id: string;
}