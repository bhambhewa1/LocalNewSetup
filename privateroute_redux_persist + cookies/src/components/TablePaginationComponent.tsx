// MUI Imports
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

// Third Party Imports
import type { useReactTable } from '@tanstack/react-table'

// ✅ Define prop type like this:
type TablePaginationComponentProps<TData> = {
  table: ReturnType<typeof useReactTable<TData>>
  totalDBData: number
  filters: any
  setFilters: (filters: any) => void
  // filters: { search: string; pageSize: number; page: number }
  // setFilters: (filters: { search: string; pageSize: number; page: number }) => void
}

const TablePaginationComponent = <TData,>({
  table,
  totalDBData,
  filters,
  setFilters
}: TablePaginationComponentProps<TData>) => {
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize

  const start = totalDBData === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, totalDBData)

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>{`Showing ${start} to ${end} of ${totalDBData} entries`}</Typography>
      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={table.getPageCount()}
        page={pageIndex + 1} // filters.page is same as pageIndex+1
        onChange={(_, page) => {
          // console.log('page change', page)
          setFilters({ ...filters, page: page })
          // table.setPageIndex(page - 1)
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TablePaginationComponent

// // MUI Imports
// import Pagination from '@mui/material/Pagination'
// import Typography from '@mui/material/Typography'

// // Third Party Imports
// import type { useReactTable } from '@tanstack/react-table'

// const TablePaginationComponent = ({ table }: { table: ReturnType<typeof useReactTable> }) => {
//   return (
//     <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
//       <Typography color='text.disabled'>
//         {`Showing ${
//           table.getFilteredRowModel().rows.length === 0
//             ? 0
//             : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
//         }
//         to ${Math.min(
//           (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
//           table.getFilteredRowModel().rows.length
//         )} of ${table.getFilteredRowModel().rows.length} entries`}
//       </Typography>
//       <Pagination
//         shape='rounded'
//         color='primary'
//         variant='tonal'
//         count={Math.ceil(table.getFilteredRowModel().rows.length / table.getState().pagination.pageSize)}
//         page={table.getState().pagination.pageIndex + 1}
//         onChange={(_, page) => {
//           table.setPageIndex(page - 1)
//         }}
//         showFirstButton
//         showLastButton
//       />
//     </div>
//   )
// }

// export default TablePaginationComponent
