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
import { GraphicalArgs, GraphicalResponse, graphical } from '@/services/root'
import { NotoSansMath } from '@/utils'

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
}) as typeof PlotType

const GraphicalScene: React.FC = () => {
  const [func, setFunc] = useState<string>('')
  const [data, setData] = useState<{ x: number[]; fx: number[] }>()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<GraphicalArgs>()
  const graphicalMutation = useMutation({
    mutationFn: (args: GraphicalArgs) => graphical(args),
  })

  const onSubmit: SubmitHandler<GraphicalArgs> = async args => {
    try {
      const res = await graphicalMutation.mutateAsync(args)

      setData({
        x: res.map(i => i.x),
        fx: res.map(i => i.fx),
      })
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const columnHelper = createColumnHelper<GraphicalResponse[0]>()
  const columns = [
    columnHelper.accessor('i', {
      cell: info => info.getValue(),
      header: 'Iteration',
    }),
    columnHelper.accessor('x', {
      cell: info => info.getValue(),
      header: (<MathJax>{'`x`'}</MathJax>) as unknown as string,
    }),
    columnHelper.accessor('fx', {
      cell: info => info.getValue(),
      header: (<MathJax>{'`f(x)`'}</MathJax>) as unknown as string,
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
              x: data.x,
              y: data.fx,
              type: 'scatter',
              mode: 'lines+markers',
              line: { color: 'cyan' },
              marker: { color: 'red' },
            },
          ]}
          layout={{ autosize: true, title: 'Graph' }}
          config={{ responsive: true }}
          className="h-[600px] w-full"
        />
      ) : (
        <></>
      )}
      {graphicalMutation.data ? (
        <div className="col-span-2 mt-8 h-full w-full overflow-x-auto">
          <DataTable columns={columns} data={graphicalMutation.data} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default GraphicalScene
