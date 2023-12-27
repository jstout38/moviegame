import { SetStateAction } from "react";
import { Dispatch } from 'react';

type resultsProps = {
  results: {title: string, release_date: string, id: number}[],
  setLastAnswer: Dispatch<SetStateAction<number>>,
}

export default function SearchResults(props: resultsProps) {
    if ( props.results[0] && props.results[0].title === '') {
      return <div></div>
    }

    var setAnswer = function(id: number) {
      props.setLastAnswer(id);
    }

    var resultList = props.results.map((result, index) => {
        var title = result.title;
        if (result.release_date.length > 0) {
          title += ' (' + result.release_date.slice(0,4) + ')';
        }
        return <div className="text-black bg-white border-solid border border-black hover:bg-blue-600 hover:text-white p-2" onMouseDown={() => setAnswer(result.id)} key={result.id}>{title}</div>
      });

    return (
      <div className="">
        {resultList}
      </div>
    )
}