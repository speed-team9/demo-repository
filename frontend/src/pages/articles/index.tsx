import { GetStaticProps, NextPage } from "next";
import SortableTable from "../../components/table/SortableTable";
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
  console.log('Articles received in component:', articles);

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

export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {

  const baseUrl = process.env.NEXT_PUBLIC_API ?? '';
  const url = `${baseUrl}/api/articles`;

  try {
    const response = await axios.get(url);
    const articles = response.data;

    if (!Array.isArray(articles)) {
      console.error('Expected an array of articles, but got:', articles);
      return { props: { articles: [] } };
    }

    const formattedArticles = articles.map((article) => ({
      id: article._id ?? article.id,
      title: article.title,
      authors: article.authors,
      source: article.source,
      pubyear: article.pubyear,
      doi: article.doi,
      claim: article.claim
    }));

    return { props: { articles: formattedArticles } };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { props: { articles: [] } };
  }
};

export default Articles;