type castProps = {
  name: string,
  found: boolean
}

export default function CastMember (props: castProps) {
  return props.found ? <div>{props.name}</div> : <div>?????????</div> 
}