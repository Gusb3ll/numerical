import 'katex/dist/katex.min.css'
import { MathJax } from 'better-react-mathjax'
import { useState } from 'react'
import { BlockMath } from 'react-katex'
import { toast } from 'sonner'

import { NotoSansMath } from '@/utils'

const NewtonDividedScene = () => {
  const [pointCount, setPointCount] = useState(1)
  const [startX, setStartX] = useState(0)
  const [xValues, setXValues] = useState<number[]>(
    Array.from({ length: pointCount }, () => 0),
  )
  const [fxValues, setFxValues] = useState<number[]>(
    Array.from({ length: pointCount }, () => 0),
  )
  const [steps, setSteps] = useState<string[]>([])

  const recursive = (xValues: number[], fx: number[]) => {
    const n = xValues.length
    const temp1 = Array.from({ length: n }, () => Array(n).fill(0))

    for (let i = 0; i < n; i++) {
      temp1[i][0] = fx[i]
    }

    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        temp1[i][j] =
          (temp1[i + 1][j - 1] - temp1[i][j - 1]) /
          (xValues[i + j] - xValues[i])
      }
    }

    return temp1[0]
  }

  const calculateNewtonDivided = () => {
    const stepsArray = []
    const n = xValues.length
    const selectedX = xValues.map(i => xValues[i])
    const selectedFx = fxValues.map(i => fxValues[i])

    if (n < 2) {
      return toast.error('Please input at least 2 points')
    }

    const temp = recursive(selectedX, selectedFx)

    const temp99 = temp.map((c, idx) => `X${idx} = ${c}`).join(',')
    stepsArray.push(`\\text{Value: } ${temp99}`)

    let result = temp[0]
    let temp2 = 1
    let resultLatex = `${temp[0]}`

    for (let i = 1; i < n; i++) {
      temp2 *= startX - xValues[i - 1]
      result += temp[i] * temp2
      resultLatex += ` + (${temp[i]}) \\cdot (${startX} - ${selectedX[i - 1]})`
    }
    stepsArray.push(`Fx(${startX}) = ${resultLatex}`)
    stepsArray.push(`\\text{Result: } Fx(${startX}) = ${result}`)

    setSteps(stepsArray)
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
                onClick={() => calculateNewtonDivided()}
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

export default NewtonDividedScene
