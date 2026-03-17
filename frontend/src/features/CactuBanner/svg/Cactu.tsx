import gliphs from "./gliphs"

export default function CactuFont() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${(gliphs.length < 5 ? gliphs.length : 5) * 4 - 1} ${Math.ceil( gliphs.length / 5 ) * 5 - 1}`}
      fill="#5da234"
      stroke="green"
      strokeWidth="0.05"
    >
      {
        gliphs.map( (gliph, i) => (
          <path key={gliph.sign} d={gliph.path} transform={`translate( ${(i % 5) * 4} ${Math.floor( i / 5 ) * 5} )`} />
        ) )
      }
    </svg>
  )
}
