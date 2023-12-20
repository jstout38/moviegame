type resultsProps = {
  results: {title: string, release_date: string}[],
}

export default function SearchResults(props: resultsProps) {
    if ( props.results[0] && props.results[0].title === '') {
      return <div></div>
    }

    var resultList = props.results.map((result, index) => {
        var title = result.title;
        if (result.release_date.length > 0) {
          title += ' (' + result.release_date.slice(0,4) + ')';
        }
        return <div className="bg-white border-solid border border-black hover:bg-blue-600 hover:text-white p-2" key={index}>{title}</div>
      });

    return (
      <div>
        {resultList}
      </div>
    )
}