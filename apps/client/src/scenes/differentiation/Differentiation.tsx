import 'katex/dist/katex.min.css'
import { evaluate } from 'mathjs'
import { useState } from 'react'
import { BlockMath } from 'react-katex'
import { toast } from 'sonner'

import { NotoSansMath } from '@/utils'

enum OrderOption {
  FIRST = 1,
  SECOND = 2,
}

enum ErrorOption {
  O_H = 1,
  O_H2 = 2,
  O_H4 = 3,
}

enum DirectionOption {
  FORWARD = 1,
  BACKWARD = 2,
  CENTERED = 3,
}

const DifferentiationeScene = () => {
  const [func, setFunc] = useState('')
  const [x, setX] = useState(0)
  const [h, setH] = useState(0)
  const [order, setOrder] = useState<OrderOption>(OrderOption.FIRST)
  const [error, setError] = useState<ErrorOption>(ErrorOption.O_H)
  const [direction, setDirection] = useState<DirectionOption>(
    DirectionOption.FORWARD,
  )

  const [steps, setSteps] = useState<string[]>([])

  const calculateDiff = () => {
    const stepsArray = []

    try {
      const f = (x: number) => evaluate(func, { x })
      if (order === OrderOption.FIRST) {
        if (error === ErrorOption.O_H) {
          if (direction === DirectionOption.BACKWARD) {
            const res = (f(x) - f(x - h)) / h
            stepsArray.push(`f'(x) = \\frac{f(x + h) - f(x)}{h}`)
            stepsArray.push(`f'(${x}) = \\frac{f(${x} + ${h}) - f(${x})}{${h}}`)
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          } else if (direction === DirectionOption.FORWARD) {
            const res = (f(x + h) - f(x)) / h
            stepsArray.push(`{f'(x)} = \\frac{f(x_i + 1) - f(x)}{h}`)
            stepsArray.push(
              `{f'(${x})} = \\frac{f(${x} + ${h}) - f(${x})}{${h}}`,
            )
            stepsArray.push(`f'(${x}) =  ${res}`)

            setSteps(stepsArray)
          } else if (direction === DirectionOption.CENTERED) {
            const res = (f(x + h) - f(x - h)) / (2 * h)
            stepsArray.push(`f'(x) = \\frac{f(x + h) - f(x - h)}{2h}`)
            stepsArray.push(
              `f'(${x}) = \\frac{f(${x} + ${h}) - f(${x} - ${h})}{2(${h})}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          }
        } else if (error === ErrorOption.O_H2) {
          if (direction === DirectionOption.BACKWARD) {
            const res = (3 * f(x) - 4 * f(x - h) + f(x - 2 * h)) / (2 * h)
            stepsArray.push(`f'(x) = \\frac{3f(x) - 4f(x - h) + f(x - 2h)}{2h}`)
            stepsArray.push(
              `f'(${x}) = \\frac{3f(${x}) - 4f(${x} - ${h}) + f(${x} - 2${h})}{2(${h})}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          } else if (direction === DirectionOption.FORWARD) {
            const res = (-f(x + 2 * h) + 4 * f(x + h) - 3 * f(x)) / (2 * h)
            stepsArray.push(
              `f'(x) = \\frac{-f(x + 2h) + 4f(x + h) - 3f(x)}{2h}`,
            )
            stepsArray.push(
              `f'(${x}) = \\frac{-f(${x} + 2${h}) + 4f(${x} + ${h}) - 3f(${x})}{2(${h})}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          } else if (direction === DirectionOption.CENTERED) {
            const res =
              (-f(x + 2 * h) + 8 * f(x + h) - 8 * f(x - h) + f(x - 2 * h)) /
              (12 * h)

            stepsArray.push(
              `f'(x) = \\frac{-f(x + 2h) + 8f(x + h) - 8f(x - h) + f(x - 2h)}{12h}`,
            )
            stepsArray.push(
              `f'(${x}) = \\frac{-f(${x} + 2(${h})) + 8f(${x} + ${h}) - 8f(${x} - ${h}) + f(${x} - 2(${h}))}{12(${h})}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          }
        } else if (error === ErrorOption.O_H4) {
          if (direction === DirectionOption.BACKWARD) {
            const res =
              (3 * f(x) -
                14 * f(x - h) +
                26 * f(x - 2 * h) -
                24 * f(x - 3 * h) +
                11 * f(x - 4 * h) -
                2 * f(x - 5 * h)) /
              Math.pow(h, 4)
            stepsArray.push(
              `f'(x) = \\frac{3f(x) - 14f(x - h) + 26f(x - 2h) - 24f(x - 3h) + 11f(x - 4h) - 2f(x - 5h)}{h^4}`,
            )
            stepsArray.push(
              `f'(${x}) = \\frac{3f(${x}) - 14f(${x} - ${h}) + 26f(${x} - 2(${h})) - 24f(${x} - 3(${h})) + 11f(${x} - 4(${h})) - 2f(${x} - 5(${h}))}{(${h})^4}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          } else if (direction === DirectionOption.FORWARD) {
            const res =
              (-2 * f(x + 5 * h) +
                11 * f(x + 4 * h) -
                24 * f(x + 3 * h) +
                26 * f(x + 2 * h) -
                14 * f(x + h) +
                3 * f(x)) /
              Math.pow(h, 4)
            stepsArray.push(
              `f'(x) = \\frac{-2f(x + 5h) + 11f(x + 4h) - 24f(x + 3h) + 26f(x + 2h) - 14f(x + h) + 3f(x)}{h^4}`,
            )
            stepsArray.push(
              `f'(${x}) = \\frac{-2f(${x} + 5(${h})) + 11f(${x} + 4(${h})) - 24f(${x} + 3(${h})) + 26f(${x} + 2(${h})) - 14f(${x} + ${h}) + 3f(${x})}{(${h})^4}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          } else if (direction === DirectionOption.CENTERED) {
            const res =
              (-f(x + 3 * h) +
                12 * f(x + 2 * h) -
                39 * f(x + h) +
                56 * f(x) -
                39 * f(x - h) +
                12 * f(x - 2 * h) +
                -f(x - 3 * h)) /
              (6 * Math.pow(h, 4))
            stepsArray.push(
              `f'(x) = \\frac{-f(x + 3h) + 12f(x + 2h) - 39f(x + h) + 56f(x) - 39f(x - h) + 12f(x - 2h) - f(x - 3h)}{6h^4}`,
            )
            stepsArray.push(
              `f'(${x}) = \\frac{-f(${x} + 3(${h})) + 12f(${x} + 2(${h})) - 39f(${x} + ${h}) + 56f(${x}) - 39f(${x} - ${h}) + 12f(${x} - 2(${h})) - f(${x} - 3(${h}))}{6(${h})^4}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          }
        }
      } else if (order === OrderOption.SECOND) {
        if (error === ErrorOption.O_H) {
          if (direction === DirectionOption.BACKWARD) {
            const res = (f(x) - 2 * f(x - h) + f(x - 2 * h)) / Math.pow(h, 2)
            stepsArray.push(`f'(x) = \\frac{f(x) - 2f(x - h) + f(x - 2h)}{h^2}`)
            stepsArray.push(
              `f'(${x}) = \\frac{f(${x}) - 2f(${x} - (${h})) + f(${x} - 2(${h}))}{(${h})^2}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          } else if (direction === DirectionOption.FORWARD) {
            const res = (f(x + 2 * h) - 2 * f(x + h) + f(x)) / Math.pow(h, 2)
            stepsArray.push(`f'(x) = \\frac{f(x + 2h) - 2f(x + h) + f(x)}{h^2}`)
            stepsArray.push(
              `f'(${x}) = \\frac{f(${x} + 2(${h})) - 2f(${x} + (${h})) + f(${x})}{(${h})^2}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          } else if (direction === DirectionOption.CENTERED) {
            const res = (f(x + h) - 2 * f(x) + f(x - h)) / Math.pow(h, 2)
            stepsArray.push(`f'(x) = \\frac{f(x + h) - 2f(x) + f(x - h)}{h^2}`)
            stepsArray.push(
              `f'(${x}) = \\frac{f(${x} + ${h}) - 2f(${x}) + f(${x} - ${h})}{(${h})^2}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          }
        } else if (error === ErrorOption.O_H2) {
          if (direction === DirectionOption.BACKWARD) {
            const res =
              (2 * f(x) - 5 * f(x - h) + 4 * f(x - 2 * h) - f(x - 3 * h)) /
              Math.pow(h, 2)
            stepsArray.push(
              `f'(x) = \\frac{2f(x) - 5f(x - h) + 4f(x - 2h) - f(x - 3h)}{h^2}`,
            )
            stepsArray.push(
              `f'(${x}) = \\frac{2f(${x}) - 5f(${x} - ${h}) + 4f(${x} - 2(${h})) - f(${x} - 3(${h}))}{(${h})^2}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          } else if (direction === DirectionOption.FORWARD) {
            const res =
              (-f(x + 3 * h) + 4 * f(x + 2 * h) - 5 * f(x + h) + 2 * f(x)) /
              Math.pow(h, 2)
            stepsArray.push(
              `f'(x) = \\frac{-f(x + 3h) + 4f(x + 2h) - 5f(x + h) + 2f(x)}{h^2}`,
            )
            stepsArray.push(
              `f'(${x}) = \\frac{-f(${x} + 3(${h})) + 4f(${x} + 2(${h})) - 5f(${x} + (${h})) + 2f(${x})}{(${h})^2}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          } else if (direction === DirectionOption.CENTERED) {
            const res = (f(x + h) - 2 * f(x) + f(x - h)) / Math.pow(h, 2)
            stepsArray.push(`f'(x) = \\frac{f(x + h) - 2f(x) + f(x - h)}{h^2}`)
            stepsArray.push(
              `f'(${x}) = \\frac{f(${x} + ${h}) - 2f(${x}) + f(${x} - ${h})}{(${h})^2}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)
            setSteps(stepsArray)
          }
        } else if (error === ErrorOption.O_H4) {
          if (direction === DirectionOption.BACKWARD) {
            const res =
              (f(x) -
                4 * f(x - h) +
                6 * f(x - 2 * h) -
                4 * f(x - 3 * h) +
                f(x - 4 * h)) /
              Math.pow(h, 4)
            stepsArray.push(
              `f^{(4)}(x) = \\frac{f(x) - 4f(x - h) + 6f(x - 2h) - 4f(x - 3h) + f(x - 4h)}{h^4}`,
            )
            stepsArray.push(
              `f^{(4)}(${x}) = \\frac{f(${x}) - 4f(${x} - ${h}) + 6f(${x} - 2 \\cdot ${h}) - 4f(${x} - 3 \\cdot ${h}) + f(${x} - 4 \\cdot ${h})}{(${h})^4}`,
            )
            stepsArray.push(`f^{(4)}(${x}) = ${res}`)
            setSteps(stepsArray)
          } else if (direction === DirectionOption.FORWARD) {
            const res =
              (f(x + 4 * h) -
                4 * f(x + 3 * h) +
                6 * f(x + 2 * h) -
                4 * f(x + h) +
                f(x)) /
              Math.pow(h, 4)
            stepsArray.push(
              `f'(x) = \\frac{f(x + 4h) - 4f(x + 3h) + 6f(x + 2h) - 4f(x + h) + f(x)}{h^4}`,
            )
            stepsArray.push(
              `f'(${x}) = \\frac{f(${x} + 4 \\cdot ${h}) - 4f(${x} + 3 \\cdot ${h}) + 6f(${x} + 2 \\cdot ${h}) - 4f(${x} + ${h}) + f(${x})}{(${h})^4}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          } else if (direction === DirectionOption.CENTERED) {
            const res =
              (f(x + 2 * h) - 2 * f(x) + f(x - 2 * h)) / Math.pow(h, 4)
            stepsArray.push(
              `f'(x) = \\frac{f(x + 2h) - 2f(x) + f(x - 2h)}{h^4}`,
            )
            stepsArray.push(
              `f'(${x}) = \\frac{f(${x} + 2 \\cdot ${h}) - 2f(${x}) + f(${x} - 2 \\cdot ${h})}{(${h})^4}`,
            )
            stepsArray.push(`f'(${x}) = ${res}`)

            setSteps(stepsArray)
          }
        }
      }
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
              <h1 className="text-xl font-bold">Order: </h1>
              <select
                className="border-0 border-b-2 border-gray-600 bg-transparent px-0 py-2"
                defaultValue={order}
                onChange={e => setOrder(+e.currentTarget.value)}
              >
                <option defaultValue={OrderOption.FIRST}>First</option>
                <option defaultValue={OrderOption.SECOND}>Second</option>
              </select>
            </div>
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-xl font-bold">Error: </h1>
              <select
                className="border-0 border-b-2 border-gray-600 bg-transparent px-0 py-2"
                defaultValue={error}
                onChange={e => setError(+e.currentTarget.value)}
              >
                <option value={ErrorOption.O_H}>O(h)</option>
                <option value={ErrorOption.O_H2}>O(h^2)</option>
                <option value={ErrorOption.O_H4}>O(h^4)</option>
              </select>
            </div>
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-xl font-bold">Direction: </h1>
              <select
                className="border-0 border-b-2 border-gray-600 bg-transparent px-0 py-2"
                defaultValue={direction}
                onChange={e => setDirection(+e.currentTarget.value)}
              >
                <option value={DirectionOption.FORWARD}>Forward</option>
                <option value={DirectionOption.BACKWARD}>Backward</option>
                <option value={DirectionOption.CENTERED}>Centered</option>
              </select>
              <button
                className="ml-4 rounded-md bg-green-200 px-4 py-2 transition-all hover:bg-green-300"
                onClick={() => calculateDiff()}
              >
                Calculate
              </button>
            </div>
          </div>
          <div className="flex flex-row gap-8">
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-xl font-medium">
                <BlockMath math={`F(x): `} />
              </h1>
              <input
                required
                type="string"
                className={`border p-2 ${NotoSansMath.className}`}
                defaultValue={func}
                onChange={e => setFunc(e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-xl font-bold">
                <BlockMath math={`X: `} />
              </h1>
              <input
                required
                type="number"
                className={`border p-2 ${NotoSansMath.className}`}
                defaultValue={x}
                onChange={e => setX(+e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-xl font-bold">
                <BlockMath math={`H: `} />
              </h1>
              <input
                required
                type="number"
                className={`border p-2 ${NotoSansMath.className}`}
                defaultValue={x}
                onChange={e => setH(+e.currentTarget.value)}
              />
            </div>
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

export default DifferentiationeScene
