import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

const SubmitArticlePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [pubYear, setPubYear] = useState<number>(0);
  const [doi, setDoi] = useState("");
  const [summary, setSummary] = useState("");

  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const articleData = {
      title: title.trim(),
      authors: authors.map(author => author.trim()).filter(author => author),
      source: source.trim(),
      pubyear: pubYear.toString(),
      doi: doi.trim(),
      claim: summary.trim(),
      status: "pending"
    };

    console.log("Sending article data:", articleData);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API;
      const fullUrl = `${apiBaseUrl}/api/articles`;

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(articleData),
      });
      
      const result = await response.json();

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        throw new Error(`Failed to submit article: ${response.status} ${response.statusText}`);
      }

      console.log("Server response success:", result);

      alert("Article submitted successfully!");

    } catch (error: any) {
      console.error("Submission error details:", error);
      alert(`Submission error: ${error.message}`);
    }
  };

  const addAuthor = () => {
    setAuthors(authors.concat([""]));
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const changeAuthor = (index: number, value: string) => {
    setAuthors(
      authors.map((oldValue, i) => {
        return index === i ? value : oldValue;
      })
    );
  };

  return (
    <div className="container">
      <h1>New Article</h1>
      <form onSubmit={submitNewArticle}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />

        <label htmlFor="author">Authors:</label>
        {authors.map((author, index) => {
          return (
            <div key={`author ${index}`}>
              <input
                type="text"
                name="author"
                value={author}
                onChange={(event) => changeAuthor(index, event.target.value)}
              />
              <button
                onClick={() => removeAuthor(index)}
                type="button"
              >
                -
              </button>
            </div>
          );
        })}

        <button
          onClick={() => addAuthor()}
          type="button"
        >
          +
        </button>

        <label htmlFor="source">Source:</label>
        <input
          type="text"
          name="source"
          id="source"
          value={source}
          onChange={(event) => {
            setSource(event.target.value);
          }}
        />

        <label htmlFor="pubYear">Publication Year:</label>
        <input
          type="number"
          name="pubYear"
          id="pubYear"
          value={pubYear}
          onChange={(event) => {
            const val = event.target.value;
            if (val === "") {
              setPubYear(0);
            } else {
              setPubYear(parseInt(val));
            }
          }}
        />

        <label htmlFor="doi">DOI:</label>
        <input
          type="text"
          name="doi"
          id="doi"
          value={doi}
          onChange={(event) => {
            setDoi(event.target.value);
          }}
        />

        <label htmlFor="summary">Summary:</label>
        <textarea
          name="summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />

        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitArticlePage;