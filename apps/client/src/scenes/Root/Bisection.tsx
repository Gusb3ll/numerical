import { useMutation } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { MathJax } from 'better-react-mathjax'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import PlotType from 'react-plotly.js'
import { PuffLoader } from 'react-spinners'
import { toast } from 'sonner'

import { DataTable } from '@/components/DataTable'
import {
  BisectionArgs,
  BisectionResponse,
  bisection,
  getRandomFunc,
} from '@/services/root'
import { NotoSansMath } from '@/utils'

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
}) as typeof PlotType

const BisectionScene: React.FC = () => {
  const [func, setFunc] = useState<string>('')
  const [data, setData] = useState<{ xm: number[]; fxm: number[] }>()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<BisectionArgs>()
  const bisectionMutation = useMutation({
    mutationFn: (args: BisectionArgs) => bisection(args),
  })
  const randomFuncMutation = useMutation({
    mutationFn: () => getRandomFunc('BISECTION'),
  })

  const onSubmit: SubmitHandler<BisectionArgs> = async args => {
    try {
      const res = await bisectionMutation.mutateAsync(args)

      const xm = res.map(i => i.xm).sort((a, b) => a - b)
      const fxm = res.map(i => i.fxm).sort((a, b) => a - b)

      setData({ xm, fxm })
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const onRandom = async () => {
    try {
      const res = await randomFuncMutation.mutateAsync()

      setFunc(res.func)
      setValue('func', res.func)
      setValue('xl', res.xl)
      setValue('xr', res.xr)
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const isLoading = isSubmitting || randomFuncMutation.isPending

  const columnHelper = createColumnHelper<BisectionResponse[0]>()
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
    <div className="box-shadow-default m-8 my-4 rounded-[12px] p-4">
      <div className="grid h-full grid-flow-row grid-cols-1 place-content-center gap-4 md:h-[40dvh] md:grid-cols-2">
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
                value={func}
                onChange={e => {
                  setFunc(e.currentTarget.value)
                  setValue('func', e.currentTarget.value)
                }}
              />
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
            disabled={isLoading}
            type="button"
            className={`mt-2 flex items-center justify-center rounded-lg bg-teal-400 px-24 py-2 text-white transition-all hover:bg-teal-500 active:bg-gray-600 ${isLoading ? 'cursor-not-allowed' : ''}`}
            onClick={() => onRandom()}
          >
            {isLoading ? <PuffLoader size={24} color="#FFFFFF" /> : 'Random'}
          </button>
          <button
            disabled={isLoading}
            type="submit"
            className={`mt-2 flex items-center justify-center rounded-lg bg-gray-400 px-24 py-2 text-white transition-all hover:bg-gray-500 active:bg-gray-600 ${isLoading ? 'cursor-not-allowed' : ''}`}
          >
            {isLoading ? <PuffLoader size={24} color="#FFFFFF" /> : 'Calculate'}
          </button>
        </form>
        <div className="self-center py-4 text-start text-3xl">
          <MathJax inline dynamic>
            {'`f(x) = $`'.replaceAll('$', func ? func : '')}
          </MathJax>
        </div>
      </div>
      {data ? (
        <Plot
          data={[
            {
              x: data.xm,
              y: data.fxm,
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: 'red',
                size: 5,
              },
              line: {
                color: 'green',
                width: 1,
              },
            },
          ]}
          layout={{
            autosize: true,
            dragmode: 'pan',
            title: 'Bisection Graph',
          }}
          config={{
            responsive: true,
            scrollZoom: true,
          }}
          className="h-[600px] w-full"
        />
      ) : (
        <></>
      )}
      {bisectionMutation.data ? (
        <div className="col-span-2 mt-8 h-full w-full overflow-x-auto">
          <DataTable columns={columns} data={bisectionMutation.data} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default BisectionScene
