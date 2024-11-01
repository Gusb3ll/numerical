import 'katex/dist/katex.min.css'
import { useMutation } from '@tanstack/react-query'
import { MathJax } from 'better-react-mathjax'
import { useState } from 'react'
import { BlockMath } from 'react-katex'
import { toast } from 'sonner'

import { randomInterpolation } from '@/services/inter'
import { NotoSansMath } from '@/utils'

const LagrangeScene = () => {
  const [pointCount, setPointCount] = useState(2)
  const [startX, setStartX] = useState(0)
  const [xValues, setXValues] = useState<number[]>(
    Array.from({ length: pointCount }, () => 0),
  )
  const [fxValues, setFxValues] = useState<number[]>(
    Array.from({ length: pointCount }, () => 0),
  )
  const [steps, setSteps] = useState<string[]>([])

  const calculateLagrange = () => {
    const selected = xValues
      .map((checked, i) => (checked ? i : null))
      .filter(i => i !== null)
    try {
      const stepsArray: string[] = []

      if (pointCount < 2) {
        return toast.error('Please input at least 2 points')
      }

      let result = 0
      for (let i = 0; i < selected.length; i++) {
        let temp = fxValues[selected[i]]
        const t1 = `f(x_{${selected[i]}}) = ${fxValues[selected[i]].toFixed(6)}`
        let t2 = `L_{${selected[i]}}(x) = ${fxValues[selected[i]].toFixed(6)}`
        for (let j = 0; j < selected.length; j++) {
          if (i !== j) {
            temp *=
              (startX - xValues[selected[j]]) /
              (xValues[selected[i]] - xValues[selected[j]])
            t2 += `\\left(\\frac{x - x_{${selected[j]}}}{x_{${selected[i]}} - x_{${selected[j]}}}\\right)`
          }
        }
        result += temp
        stepsArray.push(`${t1} \\cdot ${t2}`)
      }
      stepsArray.push(`\\text{Result: } L(${startX}) = ${result.toFixed(6)}`)

      setSteps(stepsArray)
    } catch {
      toast.error('Calculation Error, try again')
    }
  }

  const randomInterpolationMutation = useMutation({
    mutationFn: () => randomInterpolation(),
  })
  const onRandom = async () => {
    try {
      const res = await randomInterpolationMutation.mutateAsync()

      setPointCount(res.points)
      setXValues(res.x)
      setFxValues(res.fx)
    } catch (e) {
      toast.error((e as Error).message)
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
                className="ml-4 rounded-md bg-teal-400 px-4 py-2 transition-all hover:bg-teal-500"
                onClick={() => onRandom()}
              >
                Random
              </button>
              <button
                className="rounded-md bg-green-200 px-4 py-2 transition-all hover:bg-green-300"
                onClick={() => calculateLagrange()}
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

export default LagrangeScene
