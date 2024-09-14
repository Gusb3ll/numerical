/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

import { Inter } from '@/utils'

export type DataTableProps<Data extends object> = {
  data: Data[]
  columns: ColumnDef<Data, any>[]
}

export function DataTable<Data extends object>({
  data,
  columns,
}: DataTableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  })

  return (
    <>
      <table
        className={`w-full text-left text-sm rtl:text-right ${Inter.className}`}
      >
        <thead className="bg-gray-200 text-xs uppercase">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} className="px-6 py-3">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map(cell => {
                return (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between px-4">
        <button
          onClick={() => table.previousPage()}
          // isDisabled={!table.getCanPreviousPage()}
        >
          {/* <ChevronLeftIcon h="6" w="6" /> */}
          Prev
        </button>

        <p className="text-md text-center">
          Page <span>{table.getState().pagination.pageIndex + 1}</span> of{' '}
          <span>{table.getPageCount().toLocaleString()}</span>
        </p>

        <button
          onClick={() => table.nextPage()}
          // isDisabled={!table.getCanNextPage()}
        >
          Next
          {/* <ChevronRightIcon h="6" w="6" /> */}
        </button>
      </div>
    </>
  )
}
