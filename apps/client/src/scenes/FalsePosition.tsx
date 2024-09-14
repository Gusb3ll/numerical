import { useMutation } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { MathJax } from 'better-react-mathjax'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { AxisOptions, Chart as ChartType } from 'react-charts'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PuffLoader } from 'react-spinners'
import { toast } from 'sonner'

import { DataTable } from '@/components/DataTable'
import {
  FalsePositionArgs,
  FalsePositionResponse,
  falsePosition,
} from '@/services/root'
import { NotoSansMath } from '@/utils'

type Series = {
  label: string
  data: { i: number; v: number }[]
}

const Chart = dynamic(() => import('react-charts').then(mod => mod.Chart), {
  ssr: false,
}) as typeof ChartType

const FalsePositionScene: React.FC = () => {
  const [func, setFunc] = useState<string>('')
  const [data, setData] = useState<Series[]>([
    {
      label: (<MathJax>{'`X_m`'}</MathJax>) as unknown as string,
      data: [{ i: 0, v: 0 }],
    },
    {
      label: 'Error',
      data: [{ i: 0, v: 0 }],
    },
  ])

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<FalsePositionArgs>()
  const falsePositionMutation = useMutation({
    mutationFn: (args: FalsePositionArgs) => falsePosition(args),
  })

  const onSubmit: SubmitHandler<FalsePositionArgs> = async args => {
    try {
      const res = await falsePositionMutation.mutateAsync(args)

      setData([
        {
          label: (<MathJax>{'`X_m`'}</MathJax>) as unknown as string,
          data: res.map(r => ({ i: r.i, v: r.xm })),
        },
        {
          label: 'Error',
          data: res.map(r => ({ i: r.i, v: r.error })),
        },
      ])
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const primaryAxis = useMemo(
    (): AxisOptions<Series['data'][0]> => ({
      getValue: datum => datum.i,
      formatters: {
        tooltip: (value: unknown) => `Iteration: ${value}`,
      },
    }),
    [],
  )
  const secondaryAxes = useMemo(
    (): AxisOptions<Series['data'][0]>[] => [
      {
        getValue: datum => datum.v,
        formatters: {
          tooltip: (value: unknown) => (
            <MathJax>{'`$`'.replaceAll('$', value as string)}</MathJax>
          ),
        },
      },
    ],
    [],
  )

  const columnHelper = createColumnHelper<FalsePositionResponse[0]>()
  const columns = [
    columnHelper.accessor('i', {
      cell: info => info.getValue(),
      header: 'Iteration',
    }),
    columnHelper.accessor('xl', {
      cell: info => info.getValue(),
      header: (<MathJax>{'`X_L`'}</MathJax>) as unknown as string,
    }),
    columnHelper.accessor('xr', {
      cell: info => info.getValue(),
      header: (<MathJax>{'`X_R`'}</MathJax>) as unknown as string,
    }),
    columnHelper.accessor('xm', {
      cell: info => info.getValue(),
      header: (<MathJax>{'`X_m`'}</MathJax>) as unknown as string,
    }),
    columnHelper.accessor('error', {
      cell: info => info.getValue(),
      header: 'Error',
    }),
  ]

  return (
    <div className="box-shadow-example m-8 my-4 rounded-[12px] p-4">
      <div className="grid h-[40dvh] grid-flow-row grid-cols-2 place-content-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center"
        >
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-row items-center gap-1">
              <MathJax>{'`f(x) = `'}</MathJax>
              <input
                required
                type="text"
                className={`border p-2 ${NotoSansMath.className}`}
                onChange={e => {
                  setFunc(e.currentTarget.value)
                  setValue('func', e.currentTarget.value)
                }}
              />
            </div>
            <div className="py-4">
              <MathJax>
                {'`f(x) = $`'.replaceAll('$', func ? func : '')}
              </MathJax>
            </div>
            <div className="ml-3 flex flex-row items-center gap-1">
              <MathJax>{'`X_L = `'}</MathJax>
              <input
                type="number"
                step=".000001"
                className={`border p-2 ${NotoSansMath.className}`}
                {...register('xl', { required: true })}
              />
            </div>
            <div className="ml-3 flex flex-row items-center gap-1">
              <MathJax>{'`X_R = `'}</MathJax>
              <input
                type="number"
                step=".000001"
                className={`border p-2 ${NotoSansMath.className}`}
                {...register('xr', { required: true })}
              />
            </div>
            <div className="ml-1.5 flex flex-row items-center gap-1">
              <MathJax>{'`Err = `'}</MathJax>
              <input
                type="number"
                step=".000001"
                className={`border p-2 ${NotoSansMath.className}`}
                defaultValue="0.00001"
                {...register('error', { required: true })}
              />
            </div>
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className={`mt-2 flex items-center justify-center rounded-lg bg-gray-400 px-24 py-2 text-white transition-all hover:bg-gray-500 active:bg-gray-600 ${isSubmitting ? 'cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <PuffLoader size={24} color="#FFFFFF" />
            ) : (
              'Calculate'
            )}
          </button>
        </form>
        <div className="h-full w-full">
          <Chart
            options={{
              data,
              primaryAxis,
              secondaryAxes,
            }}
          />
        </div>
      </div>

      {falsePositionMutation.data ? (
        <div className="col-span-2 mt-8 h-full w-full">
          <DataTable columns={columns} data={falsePositionMutation.data} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default FalsePositionScene
