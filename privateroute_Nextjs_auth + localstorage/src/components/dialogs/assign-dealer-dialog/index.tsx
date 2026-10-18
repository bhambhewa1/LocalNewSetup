'use client'

// React Imports
import { SyntheticEvent, useEffect, useState, useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Pagination, Tooltip, MenuItem, Typography, Card, CardHeader, Checkbox, TablePagination } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import APILoader from '@/components/loader/APILoader'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { propertyAPI, userAPI } from '@/API/API'
import { toast } from 'react-toastify'
import useMutateList from '@/hooks/useMutateList'
import type { userDataType, userListingType } from '@/types/user'
import type { propertyListType } from '@/types/propety'
import { Controller, useForm } from 'react-hook-form'
import useQueryList from '@/hooks/useQueryList'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import { RoleType } from '@/utils/constants'

type UsersTypeWithAction = Omit<userListingType, 'fullName'> & {
  fullName: string // Computed field
}

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

// Column Definitions
const columnHelper = createColumnHelper<UsersTypeWithAction>()

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  data: propertyListType
}

const AssignDealerDialog = ({ open, setOpen, data }: Props) => {
  // States
  const [isLoading, setIsLoading] = useState(false)
  const [isHidePassword, setIsHidePassword] = useState(true)
  // const [rowSelection, setRowSelection] = useState({})
  const [filters, setFilters] = useState({
    search: '',
    pageSize: 10,
    page: 1
  })

  const getDealerListing = {
    ModuleName: RoleType.DEALER,
    ApiData: { url: userAPI.getUserListing, configParam: { params: filters } }
  }
  const { data: tableData, isLoading: queryLoading, isFetched, isError, error } = useQueryList(getDealerListing)
  const reactMutation = useMutateList()

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<userDataType>({
    defaultValues: { ...tableData }
  })

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = async (formData: userDataType) => {
    // setIsLoading(true)
    // const updateProperty = {
    //   ModuleName: 'Property',
    //   ApiData: {
    //     method: HttpVerb.PUT,
    //     url: propertyAPI.assignDealerToProperty + `/${formData._id}/assign-dealers`,
    //     payload: { dealerIds: formData },
    //     contentType: 'application/json'
    //   },
    //   ItemId: formData?._id
    // }
    // // response of this should be like a getPropertyById (when getProperty in use)
    // try {
    //   await reactMutation.mutateAsync(updateProperty)
    //   toast.success(`Dealer assigned successfully!`)
    //   handleClose()
    // } catch (err) {
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor(
        row => `${row.firstname || ''} ${row.lastname || ''}`.trim(), // Compute the full name
        {
          id: 'fullName', // Use a unique id for this column
          header: 'Name',
          cell: ({ row, getValue }) => (
            <div className='flex items-center gap-4'>
              {getAvatar({
                // avatar: row.original.avatar,
                fullName: `${row.original.firstname} ${row.original.lastname}`
              })}
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {getValue()}
                </Typography>
              </div>
            </div>
          )
        }
      ),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.email}
          </Typography>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableData]
  )

  const table = useReactTable({
    data: tableData?.data ?? ([] as userDataType[]),
    columns,
    // enableRowSelection: true, //enable row selection for all rows
    // getRowId: row => row._id,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    pageCount: tableData?.totalPages ?? 0, // total number of pages
    manualPagination: true,
    autoResetPageIndex: false, // Prevent auto-reset of page index
    state: {
      pagination: {
        pageIndex: filters.page - 1, // Convert 1-based index to 0-based index
        pageSize: filters.pageSize // number of entries on a page
      }
    },
    onPaginationChange: updater => {
      const newPagination =
        typeof updater === 'function'
          ? updater({
              pageIndex: filters.page - 1,
              pageSize: filters.pageSize
            })
          : updater
      setFilters(prev => ({
        ...prev,
        page: newPagination.pageIndex + 1,
        pageSize: newPagination.pageSize
      }))
    },
    // onPaginationChange: updater => {
    //   const newPagination =
    //     typeof updater === 'function' ? updater({ pageIndex: filters.page - 1, pageSize: filters.pageSize }) : updater
    //   setFilters(prev => ({
    //     ...prev,
    //     page: newPagination.pageIndex + 1,
    //     pageSize: newPagination.pageSize
    //   }))
    // },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  // console.log('count', Math.ceil(table.getFilteredRowModel().rows.length / table.getState().pagination.pageSize))
  // console.log('get the row selection state', table.getState().rowSelection) //get the row selection state - { 1: true, 2: false, etc... }
  // console.log('get full client-side selected rows', table.getSelectedRowModel().rows) //get full client-side selected rows
  // console.log('get filtered client-side selected rows', table.getFilteredSelectedRowModel().rows) //get filtered client-side selected rows
  // console.log('get grouped client-side selected rows', table.getGroupedSelectedRowModel().rows) //get grouped client-side selected rows

  const getAvatar = (params: Pick<userDataType, 'avatar'> & { fullName: string }) => {
    const { avatar, fullName } = params
    if (avatar) {
      return <CustomAvatar src={avatar} size={34} />
    } else {
      return <CustomAvatar size={34}>{getInitials(fullName as string)}</CustomAvatar>
    }
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='lg'
      scroll='body'
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <APILoader isLoading={isLoading} />
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 justify-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Assign Dealer to <span className='italic text-red-500'>{data?.name}</span> Property
      </DialogTitle>
      <form autoComplete='off' onReset={() => reset({ ...tableData })} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          {/* <Card>
            <CardHeader title='Filters' className='pbe-4' /> */}
          <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
            <CustomTextField
              select
              value={filters.pageSize}
              onChange={e => setFilters({ ...filters, pageSize: Number(e.target.value), page: 1 })}
              className='max-sm:is-full sm:is-[70px]'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>
            <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
              <DebouncedInput
                value={filters.search ?? ''}
                onChange={value => {
                  const newSearch = String(value)?.trim()
                  if (newSearch !== filters?.search?.trim())
                    setFilters({ ...filters, search: String(value)?.trim(), page: 1 })
                }}
                debounce={2000}
                placeholder='Search Dealer'
                className='max-sm:is-full'
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
            //       // table.setPageIndex(page - 1)
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
          {/* </Card> */}
        </DialogContent>
        <DialogActions className='pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' disabled={true} type='submit'>
            Submit
          </Button>
          <Button variant='contained' color='error' disabled={isLoading} onClick={handleClose}>
            Cancel
          </Button>
          {/* <Button variant='tonal' color='secondary' type='reset' disabled={isLoading}>
            Reset
          </Button> */}
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AssignDealerDialog
