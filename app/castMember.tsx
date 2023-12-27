type castProps = {
  name: string,
  found: boolean
}

export default function CastMember (props: castProps) {
  return <div className={"rounded text-white m-1 p-1 " + (props.found ? "bg-green-500" : "bg-purple-600")}>{props.found ? <div>{props.name}</div> : <div>?????????</div>}</div>
}