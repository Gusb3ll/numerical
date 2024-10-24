import 'katex/dist/katex.min.css'
import { MathJax } from 'better-react-mathjax'
import { det } from 'mathjs'
import { useState } from 'react'
import { BlockMath } from 'react-katex'

import { NotoSansMath } from '@/utils'

const CramerScene = () => {
  const [dimension, setDimension] = useState(3)
  const [matrixEqual, setMatrixEqual] = useState<number[]>(
    Array.from({ length: dimension }, () => 0),
  )
  const [data, setData] = useState<
    { detALatex: string; detAiLatex: string; resultLatex: string }[]
  >([])

  const [matrix, setMatrix] = useState<number[][]>(
    Array.from({ length: dimension }, () =>
      Array.from({ length: dimension }, () => 0),
    ),
  )

  const replace = (matrix: number[][], matrixEqual: number[], col: number) => {
    const newMatrix = matrix.map(row => [...row])
    for (let i = 0; i < newMatrix.length; i++) {
      newMatrix[col][i] = matrixEqual[i]
    }

    return newMatrix
  }

  const calculateCramer = (
    dim: number,
    matrix: number[][],
    matrixEqual: number[],
  ) => {
    const determinant = det(matrix)
    const result = []

    for (let i = 0; i < dim; i++) {
      const replacedMatrix = replace(matrix, matrixEqual, i)

      const detAi = det(replacedMatrix)
      const res = detAi / determinant

      const detALatex = `\\text{det (A)} = ${determinant.toFixed(2)}`
      const detAiLatex = `\\text{det}(A_{${i + 1}}) = ${detAi.toFixed(2)}`
      const resultLatex = `X_{${i + 1}} = \\frac{\\text{det}(A_{${i + 1}})}{\\text{det}(A)} = \\frac{${detAi.toFixed(2)}}{${determinant.toFixed(2)}} = ${res.toFixed(2)}`

      result.push({
        detALatex,
        detAiLatex,
        resultLatex,
      })
    }

    setData(result)
  }

  return (
    <>
      <div className="box-shadow-default m-8 my-4 rounded-[12px] p-4">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-row items-center gap-4">
            <h1 className="text-xl font-bold">Matrix Size</h1>
            <input
              required
              type="number"
              value={dimension}
              min={2}
              className={`border p-2 ${NotoSansMath.className}`}
              onChange={e => {
                const currentMatrix = matrix
                const newMatrix = Array.from(
                  { length: +e.currentTarget.value },
                  (_, i) =>
                    Array.from(
                      { length: +e.currentTarget.value },
                      (_, j) => currentMatrix[i]?.[j] ?? 0,
                    ),
                )
                setMatrix(newMatrix)

                setDimension(+e.currentTarget.value)
              }}
            />
            <button
              className="rounded-md bg-green-200 px-4 py-2 transition-all hover:bg-green-300"
              onClick={() => calculateCramer(dimension, matrix, matrixEqual)}
            >
              Calculate
            </button>
          </div>
          <div className="grid-cols-max grid w-full grid-flow-col gap-4">
            {Array.from({ length: dimension }, (_, i) => (
              <div key={i} className="flex w-full flex-col gap-2">
                {Array.from({ length: dimension }, (_, j) => (
                  <input
                    key={j}
                    type="number"
                    className={`w-full border p-2 ${NotoSansMath.className}`}
                    value={matrix[i][j]}
                    onChange={e => {
                      const newMatrix = [...matrix]
                      newMatrix[i][j] = parseFloat(e.currentTarget.value)
                      setMatrix(newMatrix)
                    }}
                  />
                ))}
              </div>
            ))}
            <div className="flex flex-col justify-between py-2">
              {Array.from({ length: dimension }, (_, i) => (
                <MathJax inline dynamic key={i}>
                  {'`X_$`'.replaceAll('$', (i + 1).toString())}
                </MathJax>
              ))}
            </div>
            <div className="flex flex-col justify-center py-2">
              <MathJax inline dynamic>
                {'`=`'}
              </MathJax>
            </div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: dimension }, (_, i) => (
                <input
                  key={i}
                  type="number"
                  className={`w-full border p-2 ${NotoSansMath.className}`}
                  value={matrixEqual[i]}
                  onChange={e => {
                    const newResult = [...matrixEqual]
                    newResult[i] = +e.currentTarget.value
                    setMatrixEqual(newResult)
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {data.length > 0 && (
        <div className="box-shadow-default m-8 my-4 rounded-[12px] p-4">
          {data.map((res, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div>
                <BlockMath>{res.detALatex}</BlockMath>
                <BlockMath>{res.detAiLatex}</BlockMath>
                <div className="pl-4">
                  <BlockMath>{res.resultLatex}</BlockMath>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default CramerScene
