import React from "react"

export default function joinByNodes( arr:React.ReactNode[], node:React.ReactNode ) {
  return (
    <>
      {arr[ 0 ]}
      {arr.slice( 1 ).map( (n, i) => <React.Fragment key={i}>{node}{n}</React.Fragment> )}
    </>
  )
}
