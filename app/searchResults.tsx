type resultsProps = {
  results: [{title: string, release_date: string}],
}

export default function SearchResults(props: resultsProps) {
    return props.results.length > 0 ? props.results.map((result, index) => {
      return <div key={index}>{result.title + ' (' + result.release_date.slice(0,4) + ')'}</div>
    }) : <div></div>
}