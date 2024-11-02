/* eslint-disable @typescript-eslint/no-explicit-any */
import { MathJax } from 'better-react-mathjax'
import { evaluate } from 'mathjs'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { BlockMath } from 'react-katex'
import PlotType from 'react-plotly.js'

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
}) as typeof PlotType

const Simpson = () => {
  const [func, setFunc] = useState('')
  const [n, setN] = useState(1)
  const [xStart, setXStart] = useState(0)
  const [xEnd, setXEnd] = useState(0)
  const [steps, setSteps] = useState<string[]>([])
  const [areaChart, setAreaChart] = useState<any>()
  const [lineChart, setLineChart] = useState<any>()
  const [xNValues, setXNValues] = useState<number[]>([])

  const onCalculate = () => {
    const stepsArray = []
    const xNValuesArray = []

    if (!func) {
      return
    }

    const f = (x: number) => evaluate(func, { x })

    const h = (xEnd - xStart) / n

    stepsArray.push(`h = \\frac{${xEnd} - ${xStart}}${n} = ${h}`)

    for (let i = 0; i <= n; i++) {
      const xVal = xStart + i * h

      stepsArray.push(`x{${i}} = ${xVal.toFixed(4)}`)
      xNValuesArray.push(+xVal.toFixed(4))
    }

    const area = (h / 3) * (f(xStart) + 4 * f(xStart + h) + f(xEnd))

    stepsArray.push(
      `F(x) = \\frac{h}{3} \\cdot (f(a) + 4f(x{1}) + f(b)) = \\frac{${h}}{3} \\cdot (${f(xStart)} + 4 \\cdot ${f(xStart + h)} + ${f(xEnd)}) = ${area.toFixed(6)}`,
    )

    setXNValues(xNValuesArray)
    setSteps(stepsArray)
    setArea()
    setLine()
  }

  const setLine = () => {
    const xValues = []
    const yValues = []

    for (const x of xNValues) {
      xValues.push(x)
      yValues.push(evaluate(func, { x }))
    }

    const data = {
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'green' },
      line: { color: 'red' },
    }

    setLineChart(data)
  }

  const setArea = () => {
    const xFill = [xStart, xStart, xStart + (xEnd - xStart) / 2, xEnd, xEnd]
    const yFill = [
      0,
      evaluate(func, { x: xStart }),
      evaluate(func, {
        x: (xStart + xEnd) / 2,
      }),
      evaluate(func, { x: xEnd }),
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
        <div className="flex flex-col gap-4 px-2">
          <div className="ml-3 flex flex-row items-center gap-1">
            <MathJax>{'`f(x) = `'}</MathJax>
            <input
              required
              type="text"
              className="border p-2"
              value={func}
              onChange={e => setFunc(e.currentTarget.value)}
            />
          </div>
          <div className="ml-8 flex flex-row items-center gap-1">
            <MathJax>{'`N = `'}</MathJax>
            <input
              required
              type="number"
              className="border p-2"
              min="1"
              step="1"
              value={n}
              onChange={e => setN(+e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-row items-center gap-1">
            <MathJax>{'`X_(Start) = `'}</MathJax>
            <input
              required
              type="number"
              className="border p-2"
              min="1"
              step="1"
              value={xStart}
              onChange={e => setXStart(+e.currentTarget.value)}
            />
          </div>
          <div className="ml-2 flex flex-row items-center gap-1">
            <MathJax>{'`X_(End) = `'}</MathJax>
            <input
              required
              type="number"
              className="border p-2"
              min="1"
              step="1"
              value={xEnd}
              onChange={e => setXEnd(+e.currentTarget.value)}
            />
          </div>
          <button
            className="max-w-[300px] rounded-lg bg-gray-400 p-2 text-white transition-all hover:bg-gray-500"
            onClick={() => onCalculate()}
          >
            Calculate
          </button>
        </div>
      </div>
      {steps.length > 0 && (
        <>
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
          </div>
          <div className="box-shadow-default m-8 my-4 rounded-[12px] p-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <BlockMath>{step}</BlockMath>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default Simpson
