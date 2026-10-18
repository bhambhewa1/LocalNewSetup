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
import type { leadDataType, leadListingType } from '@/types/lead'

// Component Imports
import TableFilters from './TableFilters'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { toast } from 'react-toastify'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { Auth, leadAPI, userAPI } from '@/API/API'
import useMutateList from '@/hooks/useMutateList'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux-store'
import { countryTypes } from '@/types/apps/countryTypes'
import APILoader from '@/components/loader/APILoader'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import AddEditLeadDialog from '@/components/dialogs/edit-lead-dialog'
import CustomIconButton from '@/@core/components/mui/IconButton'
import useQueryList from '@/hooks/useQueryList'
import type { userDataType } from '@/types/user'
import { leadStatus, RoleType } from '@/utils/constants'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const leadDummyData = {
  firstname: '',
  lastname: '',
  mobileNo: '',
  email: '',
  address: '',
  leadStatus: ''
}

type UsersTypeWithAction = Omit<leadListingType, 'fullName'> & {
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
  pending: 'error',
  warm: 'success',
  hot: 'warning',
  cold: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper<UsersTypeWithAction>()

const LeadListTable = ({
  filters,
  setFilters,
  tableData
}: {
  filters: { leadStatus: string; search: string; pageSize: number; page: number }
  setFilters: (filters: { leadStatus: string; search: string; pageSize: number; page: number }) => void
  tableData?: any
}) => {
  // States
  const [isLoading, setIsLoading] = useState(false)
  // const { countriesList } = useSelector((state: RootState) => state.countriesList)
  const role = useSelector((state: RootState) => state?.loggedUserReducer.role)
  const reactMutation = useMutateList()

  const iconButtonProps = (children: React.ReactNode, disabled?: string): IconButtonProps => ({
    disabled: Boolean(disabled),
    children
  })

  const getLeadListing = {
    ModuleName: 'Talecaller',
    ApiData: {
      url: userAPI.getUserListing,
      configParam: { params: { pageSize: 999999999, page: 1, role: RoleType.TALECALLER } }
    }
  }
  const { data, isLoading: queryLoading, isFetched, isError, error, refetch } = useQueryList(getLeadListing)

  const handleAssignedConsultant = async (leadId: string, assignedTo?: string) => {
    setIsLoading(true)
    const payloadData = {
      ModuleName: 'Lead',
      ApiData: {
        method: HttpVerb.PUT,
        url: leadAPI.assign_talecaller + `/${leadId}`,
        payload: {},
        contentType: 'application/json',
        configParam: { params: { assignedTo } }
      },
      ItemId: leadId
    }
    try {
      await reactMutation.mutateAsync(payloadData)
      toast.success('Lead assigned successfully!')
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
      // columnHelper.accessor('leadType', {
      //   header: 'Lead Type',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-2'>
      //       <Icon
      //         className={userLeadTypeObj[row?.original?.leadType]?.icon}
      //         sx={{ color: `var(--mui-palette-${userLeadTypeObj[row.original.leadType].color}-main)` }}
      //       />
      //       <Typography className='capitalize' color='text.primary'>
      //         {row.original.leadType}
      //       </Typography>
      //     </div>
      //   )
      // }),
      columnHelper.accessor('leadStatus', {
        header: 'Lead Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {row?.original?.leadStatus && (
              <Chip
                variant='tonal'
                label={leadStatus.find(item => item.key === row?.original?.leadStatus)?.label}
                size='small'
                color={
                  leadStatus.find(item => item.key === row?.original?.leadStatus)?.color as
                    | 'primary'
                    | 'secondary'
                    | 'error'
                    | 'warning'
                    | 'info'
                    | 'success'
                    | 'default'
                    | undefined
                }
                className='capitalize'
              />
            )}
          </div>
        )
      }),
      columnHelper.accessor(
        row => `${row?.assignedTo?.firstname || ''} ${row?.assignedTo?.lastname || ''}`.trim(), // Compute the full name
        {
          id: 'assignedTo', // Use a unique id for this column
          header: 'Assigned Talecaller',
          cell: ({ row, getValue }) => (
            <Typography color='text.primary' className='font-medium'>
              {getValue()}
            </Typography>
          )
        }
      ),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <OptionMenu
              // icon='tabler-user-plus'
              icon={
                <Tooltip title='Assign Lead'>
                  <i className='tabler-user-plus' />
                </Tooltip>
              }
              iconButtonProps={{ size: 'small' }}
              iconClassName='text-textSecondary'
              options={(data?.data ?? []).map((Talecaller: userDataType) => ({
                text: `${Talecaller?.firstname} ${Talecaller?.lastname}`,
                menuItemProps: {
                  onClick: () => {
                    handleAssignedConsultant(row.original._id, Talecaller._id)
                  }
                }
              }))}
            />
            <Link href={`/lead/edit/${row?.original?._id}`} className='flex'>
              <Tooltip title='Edit details'>
                <IconButton>
                  <i className='tabler-edit text-lg text-textSecondary' />
                </IconButton>
              </Tooltip>
            </Link>
          </div>
        )
      })

      // ...(isAdminRole
      //   ? [
      //       columnHelper.accessor('consultantName', {
      //         header: 'Consultant Name',
      //         cell: ({ row }) => (
      //           <Typography className='capitalize' color='text.primary'>
      //             {row.original.consultantName}
      //           </Typography>
      //         )
      //       })
      //     ]
      //   : []),
      // columnHelper.accessor('action', {
      //   header: 'Action',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-2'>
      //       {isAdminRole ? (
      //         <>
      //           <OptionMenu
      //             // icon='tabler-user-plus'
      //             icon={
      //               <Tooltip title='Assign Consultant'>
      //                 <i className='tabler-user-plus' />
      //               </Tooltip>
      //             }
      //             iconButtonProps={{ size: 'small' }}
      //             iconClassName='text-textSecondary'
      //             options={consultantList.map(consultant => ({
      //               text: consultant?.consultantName,
      //               menuItemProps: {
      //                 onClick: () => {
      //                   handleAssignedConsultant(row.original._id, consultant?._id)
      //                 }
      //               }
      //             }))}
      //           />
      //           <Link href={`/lead/view/${row?.original?._id}`} className='flex'>
      //             <Tooltip title='View details'>
      //               <IconButton>
      //                 <i className='tabler-eye text-2xl' />
      //               </IconButton>
      //             </Tooltip>
      //           </Link>
      //         </>
      //       ) : (
      //         <Link href={`/lead/edit/${row?.original?._id}`} className='flex'>
      //           <Tooltip title='Edit details'>
      //             <IconButton>
      //               <i className='tabler-edit text-lg text-textSecondary' />
      //             </IconButton>
      //           </Tooltip>
      //         </Link>
      //       )}
      //     </div>
      //   ),
      //   enableSorting: false
      // })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableData, data]
  )

  const table = useReactTable({
    data: tableData?.data ?? ([] as leadDataType[]),
    columns,
    pageCount: tableData?.totalPages ?? 0, // total number of pages
    manualPagination: true,
    autoResetPageIndex: false, // Prevent auto-reset of page index
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      pagination: {
        pageIndex: filters.page - 1, // Convert 1-based index to 0-based index
        pageSize: filters.pageSize // number of entries on a page
      }
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
    getCoreRowModel: getCoreRowModel()
  })

  const getAvatar = (params: Pick<leadDataType, 'avatar'> & { fullName: string }) => {
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
      <TableFilters filters={filters} setFilters={setFilters} />
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
            placeholder='Search Lead'
            className='max-sm:is-full'
          />
          {role === RoleType.MANAGER_STAFF && (
            <OpenDialogOnElementClick
              element={CustomIconButton}
              elementProps={{
                // disabled: isLoading,
                variant: 'contained',
                color: 'primary',
                startIcon: <i className='tabler-plus' />,
                className: 'max-sm:is-full text-sm px-4 ',
                children: 'Add New Lead'
              }}
              dialog={AddEditLeadDialog}
              dialogProps={{ data: leadDummyData }}
            />
          )}
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
        //     onChange={(_, page) => setFilters({ ...filters, page: page })}
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

export default LeadListTable
