'use client'

// React Imports
import React, { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { Pagination, Tooltip, type IconButtonProps } from '@mui/material'

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
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { userDataType, userListingType } from '@/types/user'

// Component Imports
import TableFilters from './TableFilters'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { toast } from 'react-toastify'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { Auth, userAPI } from '@/API/API'
import useMutateList from '@/hooks/useMutateList'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux-store'
import { countryTypes } from '@/types/apps/countryTypes'
import APILoader from '@/components/loader/APILoader'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import AddEditLeadDialog from '@/components/dialogs/edit-lead-dialog'
import CustomIconButton from '@/@core/components/mui/IconButton'
import AddEditUserDialog from '@/components/dialogs/edit-user-dialog'
import AlertDialog from '@/components/dialogs/alert-dialog'
import { RoleType, showUserStatus, UserStatus } from '@/utils/constants'
import MultiDeleteDialog from '@/components/dialogs/multidelete-confirmation'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const userDummyData = {
  firstname: '',
  lastname: '',
  mobileNo: '',
  email: '',
  role: RoleType.MANAGER_STAFF,
  password: ''
}

type UsersTypeWithAction = Omit<userListingType, 'fullName'> & {
  fullName: string // Computed field
  action?: string
}

type UserLeadType = {
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
const userLeadTypeObj: UserLeadType = {
  // lead: { icon: 'tabler-waterpolo', color: 'error' },
  lead: { icon: 'tabler-user', color: 'error' },
  candidate: { icon: 'tabler-waterpolo', color: 'success' },
  student: { icon: 'tabler-school', color: 'info' },
  maintainer: { icon: 'tabler-chart-pie', color: 'success' },
  subscriber: { icon: 'tabler-user-check', color: 'primary' }
}

const userStatusObj: UserStatusType = {
  [UserStatus.ACTIVE]: 'success',
  [UserStatus.INACTIVE]: 'warning'
}

// Column Definitions
const columnHelper = createColumnHelper<UsersTypeWithAction>()

const UserListTable = ({
  filters,
  setFilters,
  tableData
}: {
  filters: { search: string; pageSize: number; page: number }
  setFilters: (filters: { search: string; pageSize: number; page: number }) => void
  tableData?: any
}) => {
  // States
  const [isLoading, setIsLoading] = useState(false)
  // const { countriesList } = useSelector((state: RootState) => state.countriesList)
  const reactMutation = useMutateList()

  const iconButtonProps = (children: React.ReactNode, disabled?: string): IconButtonProps => ({
    disabled: Boolean(disabled),
    children
  })

  const handleConfirmDelete = async (e: string, deleteId: string) => {
    setIsLoading(true)
    const deleteUser = {
      ModuleName: RoleType.MANAGER_STAFF,
      ApiData: {
        method: HttpVerb.DELETE,
        url: userAPI.deleteUser + `/${deleteId}`,
        payload: { status: e }
      },
      ItemId: deleteId
    }
    try {
      await reactMutation.mutateAsync(deleteUser)
      toast.success(`Staff Manager deleted successfully!`)
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
    () => [
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
      columnHelper.accessor('mobileNo', {
        header: 'Mobile Number',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.mobileNo}
          </Typography>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.email}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {row?.original?.status && (
              <Chip
                variant='tonal'
                label={showUserStatus[row?.original?.status]}
                size='small'
                color={userStatusObj[row?.original?.status]}
                className='capitalize'
              />
            )}
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {/* <OpenDialogOnElementClick
              element={IconButton}
              elementProps={iconButtonProps(<i className='tabler-eye text-lg text-textSecondary' />)}
              dialog={AddEditUserDialog}
              dialogProps={{ data: { ...userDummyData, ...row?.original } }}
            /> */}
            <OpenDialogOnElementClick
              // element={IconButton}
              // elementProps={iconButtonProps(<i className='tabler-edit text-lg text-textSecondary' />)}
              element={CustomIconButton}
              elementProps={{
                // disabled: isLoading,
                size: 'small',
                color: 'secondary',
                children: (
                  <Tooltip title=''>
                    <i className='tabler-edit text-lg' />
                  </Tooltip>
                )
              }}
              dialog={AddEditUserDialog}
              dialogProps={{ data: { ...userDummyData, ...row?.original } }}
            />
            <OpenDialogOnElementClick
              // element={IconButton}
              // elementProps={iconButtonProps(<i className='tabler-trash text-lg text-textSecondary' />)}
              element={CustomIconButton}
              elementProps={{
                disabled: row?.original?.status !== UserStatus.ACTIVE,
                size: 'small',
                color: 'secondary',
                children: (
                  <Tooltip title=''>
                    <i className='tabler-trash text-lg' />
                  </Tooltip>
                )
              }}
              dialog={MultiDeleteDialog}
              dialogProps={{
                iconName: 'tabler-trash',
                message: 'Are you sure you want to delete this STAFF MANAGER?',
                handleConfirm: (e: string) => handleConfirmDelete(e, row?.original?._id)
              }}
            />
          </div>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableData]
  )

  const table = useReactTable({
    data: tableData?.data ?? ([] as userDataType[]),
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    // state: {
    //   rowSelection,
    //   globalFilter
    // },
    // initialState: {
    //   pagination: {
    //     pageSize: 10
    //   }
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
    globalFilterFn: fuzzyFilter,
    // onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    // onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel()
    // getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // getFacetedRowModel: getFacetedRowModel(),
    // getFacetedUniqueValues: getFacetedUniqueValues(),
    // getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const getAvatar = (params: Pick<userDataType, 'avatar'> & { fullName: string }) => {
    const { avatar, fullName } = params
    if (avatar) {
      return <CustomAvatar src={avatar} size={34} />
    } else {
      return <CustomAvatar size={34}>{getInitials(fullName as string)}</CustomAvatar>
    }
  }

  return (
    <Card>
      <APILoader isLoading={isLoading} />
      <CardHeader title='Filters' className='pbe-4' />
      {/* <TableFilters filters={filters} setFilters={setFilters} /> */}
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
            placeholder='Search Staff Manager'
            className='max-sm:is-full'
          />
          <OpenDialogOnElementClick
            element={CustomIconButton}
            elementProps={{
              // disabled: isLoading,
              variant: 'contained',
              color: 'primary',
              startIcon: <i className='tabler-plus' />,
              className: 'max-sm:is-full text-sm px-4 ',
              children: 'Add New Staff Manager'
            }}
            dialog={AddEditUserDialog}
            dialogProps={{ data: userDummyData }}
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

export default UserListTable
