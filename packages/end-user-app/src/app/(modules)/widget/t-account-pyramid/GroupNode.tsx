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
  const rowOffset = data.title ? 1 : 0
  const nodeWrapperPadding = 10
  const rowHeight = 32

  return (
    <div>
      <table
        style={{ borderCollapse: 'collapse', display: 'grid', width: '100%' }}
      >
        {data.title && (
          <caption
            style={{
              borderBottom: '1px solid black',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              height: rowHeight,
              lineHeight: `${rowHeight}px`,
            }}
          >
            {data.title}
          </caption>
        )}
        <tbody style={{ display: 'table' }}>
          {data.pairs.map((pair, index) => (
            <tr
              key={`${pair.borrowAssetSymbol}->${pair.lendAssetSymbol}`}
              style={{ height: rowHeight }}
            >
              <td style={{ borderRight: '1px solid black', width: '50%' }}>
                {pair.borrowAssetSymbol && (
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={pair.borrowAssetSymbol}
                    style={{
                      top:
                        (rowOffset + index + 0.5) * rowHeight +
                        nodeWrapperPadding,
                    }}
                  />
                )}
                {pair.borrowAssetSymbol && (
                  <div
                    style={{
                      backgroundColor: '#eee',
                      margin: 4,
                      border: '1px solid black',
                    }}
                  >
                    {pair.borrowAssetSymbol}
                  </div>
                )}
              </td>
              <td style={{ borderLeft: '1px solid black', width: '50%' }}>
                {pair.lendAssetSymbol && (
                  <div
                    style={{
                      backgroundColor: '#eee',
                      margin: 4,
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
                        (rowOffset + index + 0.5) * rowHeight +
                        nodeWrapperPadding,
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
