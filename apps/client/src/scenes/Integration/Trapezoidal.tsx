/* eslint-disable @typescript-eslint/no-explicit-any */
import 'katex/dist/katex.min.css'
import { MathJax } from 'better-react-mathjax'
import { evaluate } from 'mathjs'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { BlockMath } from 'react-katex'
import PlotType from 'react-plotly.js'

import { NotoSansMath } from '@/utils'

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
}) as typeof PlotType

const TrapezoidalScene = () => {
  const [func, setFunc] = useState<string>('')
  const [xStart, setXStart] = useState<number>(0)
  const [xEnd, setXEnd] = useState<number>(0)
  const [steps, setSteps] = useState<string[]>([])

  const [lineChart, setLineChart] = useState<any>()
  const [areaChart, setAreaChart] = useState<any>()

  const calculateTrapezoidal = () => {
    const stepsArray = []
    const h = (xEnd - xStart) / 2

    const f = (x: number) => {
      return evaluate(func, { x })
    }

    const area = h * (f(xStart) + f(xEnd))
    stepsArray.push(`f(x_{0}) = f(${xStart}) = ${f(xStart)}`)
    stepsArray.push(`f(x_{1}) = f(${xEnd}) = ${f(xEnd)}`)
    stepsArray.push(
      `F(x) = \\frac{h}{2} \\cdot (f(a) + f(b)) = {${h}} \\cdot (${f(xStart)} + ${f(xEnd)}) = ${area}`,
    )

    setSteps(stepsArray)
    setLine()
    setArea()
  }

  const setLine = () => {
    const xValues = []
    const yValues = []

    for (let x = xStart - 1; x <= xEnd + 1; x += 0.1) {
      xValues.push(x)
      yValues.push(evaluate(func, { x }))
    }

    const data = {
      x: xValues,
      y: yValues,
      mode: 'lines',
      line: { color: 'blue' },
    }
    setLineChart(data)
  }

  const setArea = () => {
    const xFill = [xStart, xEnd, xEnd, xStart]
    const yFill = [
      0,
      Number.isNaN(parseFloat(evaluate(func, { x: xStart })))
        ? 0
        : parseFloat(evaluate(func, { x: xStart })),
      Number.isNaN(parseFloat(evaluate(func, { x: xEnd })))
        ? 0
        : parseFloat(evaluate(func, { x: xEnd })),
      0,
    ]

    const data = {
      x: xFill,
      y: yFill,
      fill: 'tozeroy',
      mode: 'lines',
      fillcolor: 'rgba(0, 100, 255, 0.3)',
      line: { color: 'rgba(0, 100, 255, 0)' },
    }
    setAreaChart(data)
  }

  return (
    <>
      <div className="box-shadow-default m-8 my-4 rounded-[12px] p-4">
        <div className="grid h-full grid-flow-row grid-cols-1 place-content-center gap-4 md:h-[40dvh] md:grid-cols-2">
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-2 p-4">
              <div className="flex flex-row items-center gap-1">
                <MathJax>{'`f(x) = `'}</MathJax>
                <input
                  required
                  type="text"
                  className={`border p-2 ${NotoSansMath.className}`}
                  onChange={e => {
                    setFunc(e.currentTarget.value)
                  }}
                />
              </div>
              <div className="-ml-3 flex flex-row items-center gap-1">
                <MathJax>{'`X_(Start) = `'}</MathJax>
                <input
                  type="number"
                  step=".000001"
                  className={`border p-2 ${NotoSansMath.className}`}
                  defaultValue={xStart}
                  onChange={e => {
                    setXStart(parseFloat(e.currentTarget.value))
                  }}
                />
              </div>
              <div className="-ml-1 flex flex-row items-center gap-1">
                <MathJax>{'`X_(End) = `'}</MathJax>
                <input
                  type="number"
                  step=".000001"
                  className={`border p-2 ${NotoSansMath.className}`}
                  defaultValue={xEnd}
                  onChange={e => {
                    setXEnd(parseFloat(e.currentTarget.value))
                  }}
                />
              </div>
            </div>
            <button
              className="mt-2 flex items-center justify-center rounded-lg bg-gray-400 px-24 py-2 text-white transition-all hover:bg-gray-500 active:bg-gray-600"
              onClick={() => calculateTrapezoidal()}
            >
              Calculate
            </button>
          </div>
          <div className="self-center py-4 text-start text-3xl">
            <MathJax inline dynamic>
              {'`f(x) = $`'.replaceAll('$', func ? func : '')}
            </MathJax>
          </div>
        </div>
      </div>
      {steps.length > 0 && (
        <div className="box-shadow-default m-8 my-4 rounded-[12px] p-4">
          <Plot
            data={[lineChart, areaChart]}
            layout={{
              xaxis: { title: 'x' },
              yaxis: { title: 'f(x)' },
              showlegend: false,
            }}
            config={{
              responsive: true,
              scrollZoom: true,
            }}
            className="h-[600px] w-full"
          />
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <BlockMath>{step}</BlockMath>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default TrapezoidalScene
