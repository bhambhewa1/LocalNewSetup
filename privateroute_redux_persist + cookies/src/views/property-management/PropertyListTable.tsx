'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import { styled } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { Button, CardHeader, Pagination, Tooltip, type IconButtonProps, type TextFieldProps } from '@mui/material'
import type { propertyListType, propertyShowListingType } from '@/types/propety'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import PropertyDialog from '@/components/dialogs/edit-property-dialog'
import AlertDialog from '@/components/dialogs/alert-dialog'
import ViewPropertyDialog from '@/components/dialogs/view-property-details'
import CustomIconButton from '@/@core/components/mui/IconButton'
import TableFilters from './TableFilters'
import useMutateList from '@/hooks/useMutateList'
import { toast } from 'react-toastify'
import { HttpVerb } from '@/API/APICall'
import { propertyAPI } from '@/API/API'
import APILoader from '@/components/loader/APILoader'
import AssignDealerDialog from '@/components/dialogs/assign-dealer-dialog'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export const PropertyDummyData = {
  name: '',
  owner: '',
  propertyType: '',
  furnishedStatus: '',
  listingType: '',
  price: '',
  address: '',
  dimension: { length: '', width: '', area: '', facing: '' },
  description: '',
  status: '',
  media: []
}

type propertyTypeWithAction = propertyShowListingType & {
  action: string
}

type UserRoleType = {
  [key: string]: { icon: string; color: string }
}

type UserStatusType = {
  [key: string]: ThemeColor
}

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Vars
const userRoleObj: UserRoleType = {
  admin: { icon: 'tabler-crown', color: 'primary' },
  author: { icon: 'tabler-device-desktop', color: 'error' },
  editor: { icon: 'tabler-edit', color: 'warning' },
  maintainer: { icon: 'tabler-chart-pie', color: 'info' },
  subscriber: { icon: 'tabler-user', color: 'success' }
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper<propertyTypeWithAction>()
const PropertyListTable = ({
  filters,
  setFilters,
  tableData
}: {
  filters: { propertyType: string; listingType: string; status: string; search: string; pageSize: number; page: number }
  setFilters: (filters: {
    propertyType: string
    listingType: string
    status: string
    search: string
    pageSize: number
    page: number
  }) => void
  tableData?: any
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const reactMutation = useMutateList()

  const iconButtonProps = (children: React.ReactNode, disabled?: string): IconButtonProps => ({
    disabled: Boolean(disabled),
    children
  })

  const handleDeleteProperty = async (id: string) => {
    setIsLoading(true)
    const deleteProperty = {
      ModuleName: 'Property',
      ApiData: {
        method: HttpVerb.DELETE,
        url: propertyAPI.deleteProperty + `/${id}`
      },
      ItemId: id
    }
    try {
      await reactMutation.mutateAsync(deleteProperty)
      toast.success(`Property deleted successfully!`)
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  const columns = useMemo<ColumnDef<propertyTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'Property Name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.name}
          </Typography>
        )
      }),
      columnHelper.accessor('propertyType', {
        header: 'Property Type',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.propertyType}
          </Typography>
        )
      }),
      columnHelper.accessor('listingType', {
        header: 'Listing Type',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.listingType}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.status}
          </Typography>
        )
      }),
      //   columnHelper.accessor('status', {
      //     header: 'Status',
      //     cell: ({ row }) => (
      //       <div className='flex items-center gap-3'>
      //         <Chip
      //           variant='tonal'
      //           className='capitalize'
      //           label={row.original.status}
      //           size='small'
      //           color={userStatusObj[row.original.status]}
      //         />
      //       </div>
      //     )
      //   }),
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <OpenDialogOnElementClick
              element={IconButton}
              elementProps={iconButtonProps(
                <Tooltip title='View Details'>
                  <i className='tabler-eye text-lg text-textSecondary' />
                </Tooltip>
              )}
              dialog={ViewPropertyDialog}
              dialogProps={{ data: { ...PropertyDummyData, ...row?.original } }}
            />
            {/* <OpenDialogOnElementClick
              element={IconButton}
              elementProps={iconButtonProps(
                <Tooltip title='Assign Dealer'>
                  <i className='tabler-user-plus text-lg text-textSecondary' />
                </Tooltip>
              )}
              dialog={AssignDealerDialog}
              dialogProps={{ data: { ...PropertyDummyData, ...row?.original } }}
            /> */}
            <OpenDialogOnElementClick
              element={IconButton}
              elementProps={iconButtonProps(
                <Tooltip title='Edit Property'>
                  <i className='tabler-edit text-lg text-textSecondary' />
                </Tooltip>
              )}
              dialog={PropertyDialog}
              dialogProps={{ data: { ...PropertyDummyData, ...row?.original } }}
            />
            <OpenDialogOnElementClick
              element={IconButton}
              elementProps={iconButtonProps(
                <Tooltip title='Delete Property'>
                  <i className='tabler-trash text-lg text-textSecondary' />
                </Tooltip>
              )}
              dialog={AlertDialog}
              dialogProps={{
                iconName: 'tabler-trash',
                message: (
                  <>
                    Are you sure you want to delete <span className='font-medium italic'>{row.original.name}</span>{' '}
                    property?
                  </>
                ),
                handleConfirm: () => handleDeleteProperty(row?.original?._id)
              }}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableData]
  )

  const table = useReactTable({
    data: tableData?.data ?? ([] as propertyListType[]),
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    // state: {
    //   rowSelection,
    //   globalFilter
    // },
    // enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    pageCount: tableData?.totalPages ?? 0, // total number of pages
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: filters.page - 1, // selected current page number
        pageSize: filters.pageSize // number of entries on a page
      }
    },
    // globalFilterFn: fuzzyFilter,
    // onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    // onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel()
    // getSortedRowModel: getSortedRowModel(),
    // getFacetedRowModel: getFacetedRowModel(),
    // getFacetedUniqueValues: getFacetedUniqueValues(),
    // getFacetedMinMaxValues: getFacetedMinMaxValues()
    // getPaginationRowModel: getPaginationRowModel(),
    // onPaginationChange: updater => {
    //   const newPagination =
    //     typeof updater === 'function' ? updater({ pageIndex: filters.page - 1, pageSize: filters.pageSize }) : updater
    //   setFilters(prev => ({
    //     ...prev,
    //     page: newPagination.pageIndex + 1,
    //     pageSize: newPagination.pageSize
    //   }))
    // },
  })

  // console.log('get the row selection state', table.getState().rowSelection) //get the row selection state - { 1: true, 2: false, etc... }
  // console.log('get full client-side selected rows', table.getSelectedRowModel().rows) //get full client-side selected rows
  // console.log('get filtered client-side selected rows', table.getFilteredSelectedRowModel().rows) //get filtered client-side selected rows
  // console.log('get grouped client-side selected rows', table.getGroupedSelectedRowModel().rows) //get grouped client-side selected rows

  return (
    <Card>
      <APILoader isLoading={isLoading} />
      <CardHeader title='Filters' className='pbe-4' />
      <TableFilters filters={filters} setFilters={setFilters} />
      <div className='flex items-center justify-between p-6'>
        <div className='flex items-center gap-2'>
          {/* <div className='flex justify-between flex-col gap-4 items-start sm:flex-row sm:items-center'>
        <div className='flex items-center gap-2'> */}
          <Typography>Show</Typography>
          <CustomTextField
            select
            // value={table.getState().pagination.pageSize}
            // onChange={e => table.setPageSize(Number(e.target.value))}
            value={filters.pageSize}
            onChange={e => setFilters({ ...filters, pageSize: Number(e.target.value), page: 1 })}
            className='max-sm:is-full sm:is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
        </div>
        <div className='flex gap-4 flex-col !items-start max-sm:is-full sm:flex-row sm:items-center'>
          <DebouncedInput
            value={filters.search ?? ''}
            onChange={value => {
              const newSearch = String(value)?.trim()
              if (newSearch !== filters?.search?.trim())
                setFilters({ ...filters, search: String(value)?.trim(), page: 1 })
            }}
            debounce={2000}
            className='max-sm:is-full min-is-[250px]'
            placeholder='Search property'
          />
          <OpenDialogOnElementClick
            // element={IconButton}
            // elementProps={iconButtonProps(<i className='tabler-info-circle text-2xl text-info' />)}
            element={CustomIconButton}
            elementProps={{
              // disabled: isLoading,
              variant: 'contained',
              color: 'primary',
              startIcon: <i className='tabler-plus' />,
              className: 'max-sm:is-full text-sm px-4 ',
              children: 'Add New Property'
            }}
            dialog={PropertyDialog}
            dialogProps={{ data: PropertyDummyData }}
          />
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl' />,
                            desc: <i className='tabler-chevron-down text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center p-6'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          )}
        </table>
      </div>
      {tableData?.totalPages > 0 && (
        <TablePagination
          component={() => (
            <TablePaginationComponent
              table={table}
              totalDBData={tableData?.total ?? 0}
              filters={filters}
              setFilters={setFilters}
            />
          )}
          count={table.getPageCount()}
          rowsPerPage={filters.pageSize}
          page={table.getState().pagination.pageIndex + 1}
          onPageChange={(_, newPage) => {
            // setFilters(prev => ({ ...prev, page: newPage + 1 }))
            // table.setPageIndex(newPage - 1)
          }}
        />
        // <>
        //   <div className='border-t'></div>
        //   <Pagination
        //     count={tableData?.totalPages}
        //     page={filters.page}
        //     onChange={(_, page) => {
        //       setFilters({ ...filters, page: page })
        //     }}
        //     // defaultPage={1}
        //     // siblingCount={1}
        //     // boundaryCount={1}
        //     // className="pagination"
        //     color='primary'
        //     sx={{
        //       my: 3,
        //       width: '100%',
        //       display: 'flex',
        //       justifyContent: { xs: 'center', md: 'flex-end' }
        //     }}
        //   />
        // </>
      )}
    </Card>
  )
}

export default PropertyListTable
