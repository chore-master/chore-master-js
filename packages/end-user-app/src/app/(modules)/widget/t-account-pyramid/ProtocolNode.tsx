import type { Node, NodeProps } from '@xyflow/react'
import { Handle, Position } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

export type GroupNodeProps = Node<
  {
    title?: string
    pairs: {
      borrowAssetSymbol?: string
      lendAssetSymbol?: string
    }[]
  },
  'group'
>

export default function GroupNode({ data }: NodeProps<GroupNodeProps>) {
  const nodePadding = 10
  const rowContentHeight = 32
  const rowOffset = data.title ? rowContentHeight : 0

  return (
    <div style={{ padding: nodePadding, border: '1px solid black' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          minWidth: 128,
        }}
      >
        {data.title && (
          <caption
            style={{
              borderBottom: '1px solid black',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              height: rowContentHeight,
              lineHeight: `${rowContentHeight}px`,
            }}
          >
            {data.title}
          </caption>
        )}
        <colgroup>
          <col style={{ borderRight: '1px solid black', width: '50%' }} />
          <col style={{ borderLeft: '1px solid black', width: '50%' }} />
        </colgroup>
        <tbody>
          {data.pairs.map((pair, index) => (
            <tr
              key={`${pair.borrowAssetSymbol}->${pair.lendAssetSymbol}`}
              style={{ height: rowContentHeight }}
            >
              <td>
                {pair.borrowAssetSymbol && (
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={pair.borrowAssetSymbol}
                    style={{
                      top:
                        rowOffset +
                        (index + 0.5) *
                          (rowContentHeight + 4 * 2 + 4 * 2 + 1 * 2) +
                        nodePadding,
                    }}
                  />
                )}
                {pair.borrowAssetSymbol && (
                  <div
                    style={{
                      backgroundColor: '#eee',
                      margin: 4,
                      padding: 4,
                      border: '1px solid black',
                    }}
                  >
                    {pair.borrowAssetSymbol}
                  </div>
                )}
              </td>
              <td>
                {pair.lendAssetSymbol && (
                  <div
                    style={{
                      backgroundColor: '#eee',
                      margin: 4,
                      padding: 4,
                      border: '1px solid black',
                    }}
                  >
                    {pair.lendAssetSymbol}
                  </div>
                )}
                {pair.lendAssetSymbol && (
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={pair.lendAssetSymbol}
                    style={{
                      top:
                        rowOffset +
                        (index + 0.5) *
                          (rowContentHeight + 4 * 2 + 4 * 2 + 1 * 2) +
                        nodePadding,
                    }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
