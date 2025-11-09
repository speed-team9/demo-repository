import { GetStaticProps, NextPage } from "next";
import SortableTable from "../../components/table/SortableTable";
// import data from "../../utils/dummydate";
import axios from "axios";

interface ArticlesInterface {
  id: string;
  title: string;
  authors: string;
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
}

type ArticlesProps = {
  articles: ArticlesInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
  const headers: { key: keyof ArticlesInterface; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "source", label: "Source" },
    { key: "pubyear", label: "Publication Year" },
    { key: "doi", label: "DOI" },
    { key: "claim", label: "Claim" }
  ];

  return (
    <div className="container">
      <h1>Articles Index Page</h1>
      <p>Page containing a table of articles:</p>
      <SortableTable headers={headers} data={articles} />
    </div>
  );
};

// export const getStaticProps: GetStaticProps<ArticlesProps> = async (_) => {
//   // Map the data to ensure all articles have consistent property names
//   const articles = data.map((article) => ({
//     id: article.id ?? article._id,
//     title: article.title,
//     authors: article.authors,
//     source: article.source,
//     pubyear: article.pubyear,
//     doi: article.doi,
//     claim: article.claim,
//     evidence: article.evidence,
//   }));


//   return {
//     props: {
//       articles,
//     },
//   };
// };

export const getStaticProps: GetStaticProps<ArticlesProps> = async (_) => {
  try {
    // 修改为直接调用后端API
    const response = await axios.get('http://localhost:8082/api/articles');
    const articles = response.data;

    // 确保articles是数组，否则设置为空数组
    if (!Array.isArray(articles)) {
      console.error('Expected an array of articles, but got:', articles);
      return {
        props: {
          articles: [],
        },
      };
    }

    // 可以在这里对articles进行映射，确保属性名称一致
    const formattedArticles = articles.map((article) => ({
      id: article._id ?? article.id, // 如果后端返回_id，则使用它，否则用id
      title: article.title,
      authors: article.authors,
      source: article.source,
      pubyear: article.pubyear,
      doi: article.doi,
      claim: article.claim
    }));

    return {
      props: {
        articles: formattedArticles,
      },
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    // 在发生错误时返回空数组，防止前端页面崩溃
    return {
      props: {
        articles: [],
      },
    };
  }
};

export default Articles;