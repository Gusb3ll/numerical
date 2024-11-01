import 'katex/dist/katex.min.css'
import { MathJax } from 'better-react-mathjax'
import { det } from 'mathjs'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { BlockMath } from 'react-katex'
import PlotType from 'react-plotly.js'
import { toast } from 'sonner'

import { NotoSansMath } from '@/utils'

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
}) as typeof PlotType

//TODO
const MultipleRegressionScene = () => {
  const [pointCount, setPointCount] = useState(3)
  const [startX, setStartX] = useState(0)
  const [xValues, setXValues] = useState<number[]>(
    Array.from({ length: pointCount }, () => 0),
  )
  const [fxValues, setFxValues] = useState<number[]>(
    Array.from({ length: pointCount }, () => 0),
  )
  const [steps, setSteps] = useState<string[]>([])
  const [dataChart, setDataChart] = useState<number>(0)
  const [predectionChart, setPredectionChart] = useState<number[]>([])

  const calculateRegression = () => {
    try {
      const stepsArray = []
      const m = parseInt('1')
      const matrixSize = m + 1
      const matrix = Array.from({ length: matrixSize }, () =>
        Array(matrixSize).fill(0),
      )
      const matrixB = Array(matrixSize).fill(0)

      for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
          matrix[i][j] = xValues.reduce((acc, x) => acc + Math.pow(x, i + j), 0)
        }
        matrixB[i] = xValues.reduce(
          (acc, x, index) => acc + fxValues[index] * Math.pow(x, i),
          0,
        )
      }

      const detA = det(matrix)

      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const solutions: any[] = []

      const matrixLatex = `\\begin{bmatrix} ${matrix.map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`
      const constantsLatex = `\\begin{bmatrix} ${matrixB.join(' & ')} \\end{bmatrix}`

      stepsArray.push(`\\text{Matrix : } ${matrixLatex}`)
      stepsArray.push(`\\text{Matrix B : } ${constantsLatex}`)

      for (let i = 0; i < matrixSize; i++) {
        const modify = matrix.map(row => [...row])
        for (let j = 0; j < matrixSize; j++) {
          modify[j][i] = matrixB[j]
        }
        const detAi = det(modify)
        solutions.push(detAi / detA)

        stepsArray.push(
          `a_${i} = \\frac{\\text{det}(a_{${i}})}{\\text{det}(A)} = \\frac{${detAi}}{${detA}} = ${solutions[i]}`,
        )
      }

      solutions.forEach((solution, i) => {
        stepsArray.push(`a_${i} = ${solution.toFixed(6)}`)
      })

      let result
      for (let i = 0; i < m; i++) {
        stepsArray.push(`f(x) = a${i} + a${i + 1} \\cdot x`)
      }
      for (let i = 0; i < solutions.length; i++) {
        result = solutions[0] + solutions[1] * startX
        setDataChart(result)
      }
      stepsArray.push(`f(${startX}) = ${result}`)

      setSteps(stepsArray)

      const lineYValues = xValues.map(x => {
        let y = solutions[0]
        if (m >= 1) {
          y += solutions[1] * x // Using only a linear model a0 + a1*x
        }

        return y
      })

      setPredectionChart(lineYValues)
    } catch {
      toast.error('Calculation Error, try again')
    }
  }

  return (
    <>
      <div className="box-shadow-default m-8 my-4 rounded-[12px] p-4">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-row gap-8">
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-xl font-bold">Number of Points: </h1>
              <input
                required
                type="number"
                value={pointCount}
                min={1}
                step={1}
                className={`border p-2 ${NotoSansMath.className}`}
                onChange={e => setPointCount(+e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <h1 className="flex flex-row gap-2 text-xl font-bold">
                <MathJax>{'`X`'}</MathJax> Value:{' '}
              </h1>
              <input
                required
                type="number"
                value={startX}
                min={0}
                className={`border p-2 ${NotoSansMath.className}`}
                onChange={e => setStartX(+e.currentTarget.value)}
              />
              <button
                className="ml-4 rounded-md bg-green-200 px-4 py-2 transition-all hover:bg-green-300"
                onClick={() => calculateRegression()}
              >
                Calculate
              </button>
            </div>
          </div>
          {Array.from({ length: pointCount }, (_, i) => (
            <div key={i} className="flex flex-row items-center gap-4">
              <h1 className="text-xl font-medium">
                <BlockMath math={`X_${i}`} />
              </h1>
              <input
                required
                type="number"
                className={`border p-2 ${NotoSansMath.className}`}
                value={xValues[i]}
                onChange={e => {
                  const newValues = [...xValues]
                  newValues[i] = +e.currentTarget.value
                  setXValues(newValues)
                }}
              />
              <input
                required
                type="number"
                className={`border p-2 ${NotoSansMath.className}`}
                value={fxValues[i]}
                onChange={e => {
                  const newValues = [...fxValues]
                  newValues[i] = +e.currentTarget.value
                  setFxValues(newValues)
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {steps.length > 0 && (
        <div className="box-shadow-default m-8 my-4 rounded-[12px] p-4">
          <Plot
            data={[
              {
                type: 'scatter',
                mode: 'markers',
                x: xValues,
                y: fxValues,
                marker: { color: 'red', size: 8 },
                name: 'Point',
              },
              {
                type: 'scatter',
                mode: 'lines',
                x: xValues,
                y: predectionChart,
                line: { color: 'orange' },
                name: 'Regression Line',
              },
              {
                type: 'scatter',
                mode: 'markers',
                x: [startX],
                y: [dataChart],
                marker: { color: 'blue', size: 12 },
                name: `Predicted Point f(${startX})`,
              },
            ]}
            layout={{
              title: 'Least-Squares Regression Plot',
              xaxis: { title: 'X' },
              yaxis: { title: 'f(X)' },
            }}
            config={{
              responsive: true,
              scrollZoom: true,
            }}
            className="h-[600px] w-full"
          />
          <hr />
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

export default MultipleRegressionScene
