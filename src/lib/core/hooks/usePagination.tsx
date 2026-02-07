import { useEffect, useState } from "react"

export type PaginationPerPageOption = {
  name: string
  label: React.ReactNode
  value: number
}

export type PaginationType = `entire` | `from-left` | `from-right` | `in-middle`
export type PaginationButtonRenderer = (pageIndex:number, buttonLoopIndex?:number) => React.ReactNode
export type PaginationCustomPageInputRenderer = () => React.ReactNode

export type PaginationConfig = {
  allAvailablePaginationOptions?: PaginationPerPageOption[]
  defaultItemsPerPage?: number
  buttonsLength?: number
  renderButton?: PaginationButtonRenderer
  renderCustomPageInput?: PaginationCustomPageInputRenderer
}

export default function usePagination<T>( dataset:T[], config:PaginationConfig = {} ) {
  const getPaginationOptions = (max?:number) => config.allAvailablePaginationOptions?.filter( o => !max || o.value < max || o.value === Infinity )
  const perPageOptions = getPaginationOptions( dataset.length )

  const [ perPageOption, setPerPageOption ] = useState( config.defaultItemsPerPage ?? perPageOptions?.[ 0 ].value ?? Infinity )
  const [ currentPageIndex, setPageIndex ] = useState( 0 )

  const perPage = Number( perPageOptions?.find( o => o.value === perPageOption )?.value ?? Infinity )
  const hasPreviousPage = currentPageIndex > 0
  const hasNextPage = currentPageIndex * perPage + perPage < dataset.length
  const pagesCount = Math.ceil( dataset.length / perPage )
  const buttonsLength = config.buttonsLength ?? 7

  const currentPaginationType:PaginationType = pagesCount < buttonsLength ? `entire`
    : currentPageIndex < Math.ceil( buttonsLength / 2 ) ? `from-left`
      : currentPageIndex > pagesCount - Math.ceil( buttonsLength / 2 ) - 1 ? `from-right`
        : `in-middle`

  const renderButton:PaginationButtonRenderer = config.renderButton
    ?? ((pageIndex, buttonIndex) => <button key={buttonIndex} onClick={() => setPageIndex( pageIndex )}>{pageIndex}</button>)

  const renderCustomPageInput:PaginationCustomPageInputRenderer = config.renderCustomPageInput
    ?? (() => <form onSubmit={handleCustomPageIndexSubmit}><input name="custom-page" onBlur={handleCustomPageIndexInputBlur} /></form>)

  const handleCustomPage = (newPageIndex:number) => {
    if (newPageIndex > 0 && newPageIndex <= pagesCount) setPageIndex( newPageIndex - 1 )
  }

  const handleCustomPageIndexSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleCustomPage( Number( (e.currentTarget.elements.namedItem( `custom-page-index` ) as HTMLInputElement).value ) )
    e.currentTarget.reset()
  }

  const handleCustomPageIndexInputBlur = (e:React.FocusEvent<HTMLInputElement, Element>) => {
    handleCustomPage( Number( e.target.value ) )
    e.target.value = ``
  }

  const renderers = {
    renderEntire() {
      return <>{Array.from( { length:pagesCount }, (_, i) => i ).map( (pageIndex, i) => renderButton( pageIndex, i ) )}</>
    },
    renderFromLeft() {
      return (
        <>
          {Array.from( { length:5 }, (_, i) => i ).map( (pageIndex, i) => renderButton( pageIndex, i ) )}
          {renderCustomPageInput()}
          {renderButton( pagesCount )}
        </>
      )
    },
    renderFromRight() {
      return (
        <>
          {renderButton( 1 )}
          {renderCustomPageInput()}
          {Array.from( { length:5 }, (_, i) => pagesCount - 5 + i ).map( (pageIndex, i) => renderButton( pageIndex, i ) )}
        </>
      )
    },
    renderMiddle() {
      return (
        <>
          {renderButton( 1 )}
          {renderCustomPageInput()}
          {Array.from( { length:3 }, (_, i) => currentPageIndex - 1 + i ).map( (pageIndex, i) => renderButton( pageIndex, i ) )}
          {renderCustomPageInput()}
          {renderButton( pagesCount )}
        </>
      )
    },
    renderCurrentType() {
      return <>never</>
    },
  }

  renderers.renderCurrentType = () => {
    if (currentPaginationType === `entire`) return renderers.renderEntire()
    if (currentPaginationType === `from-left`) return renderers.renderFromLeft()
    if (currentPaginationType === `in-middle`) return renderers.renderMiddle()
    if (currentPaginationType === `from-right`) return renderers.renderFromRight()
    throw new Error( `Undefined pagination type "${currentPaginationType}"` )
  }

  useEffect( () => setPageIndex( 0 ), [ perPage ] )

  return {
    currentPageIndex,
    pagesCount,
    perPage,
    hasPreviousPage,
    hasNextPage,
    type: currentPaginationType,
    slicedDataset: perPage === Infinity ? dataset : dataset.slice( currentPageIndex * perPage, currentPageIndex * perPage + perPage ),
    perPageOptions,
    defaultPerPageOptionName: (perPageOptions?.find( o => o.value === perPageOption ) ?? perPageOptions?.[ 0 ])?.name,
    handleCustomPageIndexSubmit,
    handleCustomPageIndexInputBlur,
    setPerPageOption,
    setPageIndex,
    renderers,
  }
}
