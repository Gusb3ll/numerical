import { useMutation } from '@tanstack/react-query'
import { MathJax } from 'better-react-mathjax'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { AxisOptions, Chart as ChartType } from 'react-charts'

import { BisectionResult, bisection } from '@/services/root'
import { NotoSansMath } from '@/utils'

type Series = {
  label: string
  data: BisectionResult[]
}

const Chart = dynamic(() => import('react-charts').then(mod => mod.Chart), {
  ssr: false,
}) as typeof ChartType

const BisectionScene: React.FC = () => {
  const data: Series[] = [
    {
      label: 'React Charts',
      data: [
        {
          i: 0,
          xm: 1,
          error: 1,
          xl: 1,
          xr: 1,
        },
        {
          i: 1,
          xm: 2,
          error: 1,
          xl: 1,
          xr: 1,
        },
        {
          i: 2,
          xm: 4,
          error: 1,
          xl: 1,
          xr: 1,
        },
      ],
    },
  ]

  const [func, setFunc] = useState<string | null>(null)

  const bisectionMutation = useMutation({
    mutationFn: () => bisection({ func: func!, xl: 0, xr: 2, error: 0.00001 }),
  })

  const onCalculate = async () => {
    const result = await bisectionMutation.mutateAsync()

    console.log(result)
  }

  const primaryAxis = useMemo(
    (): AxisOptions<BisectionResult> => ({
      getValue: datum => datum.i,
    }),
    [],
  )
  const secondaryAxes = useMemo(
    (): AxisOptions<BisectionResult>[] => [
      {
        getValue: datum => datum.xm,
      },
    ],
    [],
  )

  return (
    <div className="box-shadow-example mx-auto my-4 flex h-[90dvh] w-[97dvw] flex-grow flex-row justify-between rounded-[12px] p-4">
      <div className="flex flex-col gap-8">
        <form action="">
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-row items-center gap-1">
              <MathJax>{'`f(x) = `'}</MathJax>
              <input
                type="text"
                className={`border p-2 ${NotoSansMath.className}`}
                onChange={e => setFunc(e.currentTarget.value)}
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
                className={`border p-2 ${NotoSansMath.className}`}
              />
            </div>
            <div className="ml-3 flex flex-row items-center gap-1">
              <MathJax>{'`X_R = `'}</MathJax>
              <input
                type="number"
                className={`border p-2 ${NotoSansMath.className}`}
              />
            </div>
          </div>
          <button onClick={() => onCalculate()}>Calculate</button>
        </form>
      </div>
      <div className="h-[60%] w-[60%]">
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </div>
    </div>
  )
}

export default BisectionScene
