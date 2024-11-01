/* eslint-disable @typescript-eslint/no-explicit-any */
import 'katex/dist/katex.min.css'
import { useMutation } from '@tanstack/react-query'
import { MathJax } from 'better-react-mathjax'
import { evaluate } from 'mathjs'
import { useState } from 'react'
import { BlockMath } from 'react-katex'
import { toast } from 'sonner'

import { randomIntegration } from '@/services/integration'
import { NotoSansMath } from '@/utils'

const CompositeSimpsonScene = () => {
  const [func, setFunc] = useState<string>('')
  const [xStart, setXStart] = useState<number>(0)
  const [xEnd, setXEnd] = useState<number>(0)
  const [n, setN] = useState<number>(1)
  const [steps, setSteps] = useState<string[]>([])

  const calculateSimpson = () => {
    const stepsArray = []
    const h = (xEnd - xStart) / n
    const hTmp = h / 2
    let area = 0
    const f = (x: number) => evaluate(func, { x })

    area += f(xStart) + f(xEnd)

    for (let i = 1; i <= n * 2 - 1; i++) {
      const x = xStart + i * hTmp // Current x position
      if (i % 2 === 0) {
        console.log('even ', (area += 2 * f(x)))
      } else {
        console.log(' odd', (area += 4 * f(x)))
      }
      console.log(x)
    }

    area *= hTmp / 3

    stepsArray.push(
      `F(x) = \\frac{h}{3} \\cdot \\left(f(a) + f(b) + 4 \\sum_{i=1}^{N-1} f(x_{i}) + 2 \\sum_{i=2}^{N-2} f(x_{i}) \\right)`,
    )
    stepsArray.push(`h = \\frac{${xEnd} - ${xStart}}{${n}} = ${hTmp}`)
    stepsArray.push(`!Tip\\frac{${h}}2 = ${hTmp}`)
    stepsArray.push(
      `F(x) = \\frac{${hTmp}}{3} \\cdot \\left(${f(xStart)} + ${f(xEnd)} + 4 \\cdot \\sum_{i=1}^{${n - 1}} f(x_{i}) + 2 \\cdot \\sum_{i=2}^{${n - 2}} f(x_{i}) \\right) = ${area}`,
    )

    setSteps(stepsArray)
  }

  const randomIntegrationMutation = useMutation({
    mutationFn: () => randomIntegration(),
  })
  const onRandom = async () => {
    try {
      const res = await randomIntegrationMutation.mutateAsync()

      setFunc(res.func)
      setXStart(res.xStart)
      setXEnd(res.xEnd)
      setN(res.n)
    } catch (e) {
      toast.error((e as Error).message)
    }
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
                  value={func}
                  onChange={e => setFunc(e.currentTarget.value)}
                />
              </div>
              <div className="-ml-3 flex flex-row items-center gap-1">
                <MathJax>{'`X_(Start) = `'}</MathJax>
                <input
                  type="number"
                  step=".000001"
                  className={`border p-2 ${NotoSansMath.className}`}
                  value={xStart}
                  onChange={e => setXStart(parseFloat(e.currentTarget.value))}
                />
              </div>
              <div className="-ml-1 flex flex-row items-center gap-1">
                <MathJax>{'`X_(End) = `'}</MathJax>
                <input
                  type="number"
                  step=".000001"
                  className={`border p-2 ${NotoSansMath.className}`}
                  value={xEnd}
                  onChange={e => setXEnd(parseFloat(e.currentTarget.value))}
                />
              </div>
              <div className="ml-5 flex flex-row items-center gap-1">
                <MathJax>{'`N = `'}</MathJax>
                <input
                  type="number"
                  step="1"
                  className={`border p-2 ${NotoSansMath.className}`}
                  value={n}
                  onChange={e => setN(parseInt(e.currentTarget.value))}
                />
              </div>
            </div>
            <button
              className="mt-2 rounded-md bg-teal-400 px-24 py-2 transition-all hover:bg-teal-500"
              onClick={() => onRandom()}
            >
              Random
            </button>
            <button
              className="mt-2 flex items-center justify-center rounded-lg bg-gray-400 px-24 py-2 text-white transition-all hover:bg-gray-500 active:bg-gray-600"
              onClick={() => calculateSimpson()}
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

export default CompositeSimpsonScene
