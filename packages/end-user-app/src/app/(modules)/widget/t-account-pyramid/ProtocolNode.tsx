import type { Node, NodeProps } from '@xyflow/react'
import { Handle, Position } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

export type ProtocolNodeProps = Node<
  {
    title?: string
    pairs: {
      borrowAssetSymbol?: string
      lendAssetSymbol?: string
    }[]
  },
  'group'
>

export default function ProtocolNode({ data }: NodeProps<ProtocolNodeProps>) {
  const nodePadding = 10
  const rowContentHeight = 32

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
                  <div
                    style={{
                      position: 'relative',
                      backgroundColor: '#eee',
                      margin: 4,
                      padding: 4,
                      border: '0px solid black',
                    }}
                  >
                    <Handle
                      type="target"
                      position={Position.Left}
                      id={pair.borrowAssetSymbol}
                      style={{
                        top: '50%',
                        left: -1,
                      }}
                    />
                    {pair.borrowAssetSymbol}
                  </div>
                )}
              </td>
              <td>
                {pair.lendAssetSymbol && (
                  <div
                    style={{
                      position: 'relative',
                      backgroundColor: '#eee',
                      margin: 4,
                      padding: 4,
                      border: '0px solid black',
                    }}
                  >
                    {pair.lendAssetSymbol}
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={pair.lendAssetSymbol}
                      style={{
                        top: '50%',
                        right: -1,
                      }}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
