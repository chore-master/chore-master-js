import DatetimeBlock from '@/components/DatetimeBlock'
import NumberBlock from '@/components/NumberBlock'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import ReferenceBlock from '@/components/ReferenceBlock'
import { useSidePanel } from '@/components/SidePanel'
import { NoWrapTableCell } from '@/components/Table'
import { financeTransferFlowTypes } from '@/constants'
import {
  Asset,
  CreateTransferFormInputs,
  Portfolio,
  Transaction,
  UpdateTransactionFormInputs,
  UpdateTransferFormInputs,
} from '@/types/finance'
import { OffsetPagination } from '@/types/global'
import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Decimal } from 'decimal.js'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

export default function TransactionRow({
  portfolio,
  transaction,
  index,
  transactionsPagination,
  timezone,
  assetReferenceToAssetMap,
  updateTransactionForm,
  createTransferForm,
  updateTransferForm,
  setEditingTransactionReference,
  setFocusedTransactionReference,
  setEditingTransferReference,
  deleteTransaction,
  deleteTransfer,
}: {
  portfolio: Portfolio | null
  transaction: Transaction
  index: number
  transactionsPagination: OffsetPagination
  timezone: any
  assetReferenceToAssetMap: Record<string, Asset>
  updateTransactionForm: UseFormReturn<UpdateTransactionFormInputs>
  createTransferForm: UseFormReturn<CreateTransferFormInputs>
  updateTransferForm: UseFormReturn<UpdateTransferFormInputs>
  setEditingTransactionReference: (reference: string) => void
  setFocusedTransactionReference: (reference: string) => void
  setEditingTransferReference: (reference: string) => void
  deleteTransaction: (transactionReference: string) => void
  deleteTransfer: (
    transactionReference: string,
    transferReference: string
  ) => void
}) {
  const sidePanel = useSidePanel()
  const [isOpen, setIsOpen] = React.useState(false)
  const settlementAsset =
    assetReferenceToAssetMap[portfolio?.settlement_asset_reference as string]

  const transactionSettlementAssetAmountChange = settlementAsset
    ? new Decimal(
        transaction.transfers.reduce(
          (acc, transfer) =>
            acc.plus(
              new Decimal(transfer.settlement_asset_amount_change ?? '0')
            ),
          new Decimal(0)
        )
      )
        .dividedBy(new Decimal(10 ** settlementAsset.decimals))
        .toNumber()
    : undefined

  React.useEffect(() => {
    if (transaction.transfers.length === 0) {
      setIsOpen(false)
    }
  }, [transaction])

  return (
    <React.Fragment>
      <TableRow
        hover={!isOpen}
        sx={(theme) => ({
          backgroundColor: isOpen ? theme.palette.action.hover : undefined,
        })}
      >
        <NoWrapTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            disabled={transaction.transfers.length === 0}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
          </IconButton>
        </NoWrapTableCell>
        <NoWrapTableCell align="right">
          <PlaceholderTypography>
            {transactionsPagination.count -
              transactionsPagination.offset -
              index}
          </PlaceholderTypography>
        </NoWrapTableCell>
        <NoWrapTableCell>
          <DatetimeBlock isoText={transaction.transacted_time} />
        </NoWrapTableCell>
        <NoWrapTableCell align="right">
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="flex-end"
          >
            {isOpen ? (
              <PlaceholderTypography>
                <NumberBlock
                  value={transactionSettlementAssetAmountChange}
                  fixedDecimals={settlementAsset?.decimals}
                  hasCommas
                  hasSign
                />
              </PlaceholderTypography>
            ) : (
              <Typography variant="body2">
                <NumberBlock
                  value={transactionSettlementAssetAmountChange}
                  fixedDecimals={settlementAsset?.decimals}
                  hasCommas
                  hasSign
                />
              </Typography>
            )}
            <ReferenceBlock
              label={settlementAsset?.name}
              foreignValue
              disabled={isOpen}
            />
          </Stack>
        </NoWrapTableCell>
        <NoWrapTableCell colSpan={3}>
          {isOpen ? (
            <PlaceholderTypography>
              {transaction.transfers.length} 筆
            </PlaceholderTypography>
          ) : (
            <Typography variant="body2">
              {transaction.transfers.length} 筆
            </Typography>
          )}
        </NoWrapTableCell>
        <NoWrapTableCell>
          {transaction.remark || (
            <PlaceholderTypography>無</PlaceholderTypography>
          )}
        </NoWrapTableCell>
        <NoWrapTableCell>
          {transaction.chain_id || (
            <PlaceholderTypography>無</PlaceholderTypography>
          )}
        </NoWrapTableCell>
        <NoWrapTableCell>
          {transaction.tx_hash || (
            <PlaceholderTypography>無</PlaceholderTypography>
          )}
        </NoWrapTableCell>
        <NoWrapTableCell>
          <ReferenceBlock label={transaction.reference} primaryKey monospace />
        </NoWrapTableCell>
        <NoWrapTableCell align="right">
          <IconButton
            size="small"
            onClick={() => {
              createTransferForm.reset({
                flow_type: '',
                asset_amount_change: '',
                asset_reference: '',
                settlement_asset_amount_change: '',
                remark: '',
              })
              setFocusedTransactionReference(transaction.reference)
              sidePanel.open('createTransfer')
            }}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              updateTransactionForm.reset({
                transacted_time: timezone
                  .getLocalString(transaction.transacted_time)
                  .slice(0, -5),
                chain_id: transaction.chain_id,
                tx_hash: transaction.tx_hash,
                remark: transaction.remark,
              })
              setEditingTransactionReference(transaction.reference)
              sidePanel.open('updateTransaction')
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => deleteTransaction(transaction.reference)}
          >
            <DeleteIcon />
          </IconButton>
        </NoWrapTableCell>
      </TableRow>
      {isOpen &&
        transaction.transfers.map((transfer) => {
          const asset = assetReferenceToAssetMap[transfer.asset_reference]
          let settlementAssetAmountChange: string | undefined
          let assetAmountChange: string | undefined
          if (transfer.settlement_asset_amount_change && settlementAsset) {
            settlementAssetAmountChange = new Decimal(
              transfer.settlement_asset_amount_change
            )
              .dividedBy(new Decimal(10 ** settlementAsset.decimals))
              .toFixed()
          }
          if (asset) {
            assetAmountChange = new Decimal(transfer.asset_amount_change)
              .dividedBy(new Decimal(10 ** asset.decimals))
              .toFixed()
          }
          return (
            <TableRow
              key={transfer.reference}
              sx={(theme) => ({
                backgroundColor: theme.palette.action.selected,
              })}
            >
              <NoWrapTableCell />
              <NoWrapTableCell />
              <NoWrapTableCell />
              <NoWrapTableCell align="right">
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <span>
                    <NumberBlock
                      value={settlementAssetAmountChange}
                      fixedDecimals={settlementAsset?.decimals}
                      hasCommas
                      hasSign
                    />
                  </span>
                  <ReferenceBlock label={settlementAsset?.name} foreignValue />
                </Stack>
              </NoWrapTableCell>
              <NoWrapTableCell align="right">
                <NumberBlock
                  value={assetAmountChange}
                  fixedDecimals={asset.decimals}
                  hasCommas
                  hasSign
                />
              </NoWrapTableCell>
              <NoWrapTableCell>
                <ReferenceBlock label={asset.name} foreignValue />
              </NoWrapTableCell>
              <NoWrapTableCell>
                <ReferenceBlock
                  label={
                    financeTransferFlowTypes.find(
                      (flowType) => flowType.value === transfer.flow_type
                    )?.label
                  }
                />
              </NoWrapTableCell>
              <NoWrapTableCell colSpan={3}>
                {transfer.remark || (
                  <PlaceholderTypography>無</PlaceholderTypography>
                )}
              </NoWrapTableCell>
              <NoWrapTableCell>
                <ReferenceBlock
                  label={transfer.reference}
                  primaryKey
                  monospace
                />
              </NoWrapTableCell>
              <NoWrapTableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => {
                    updateTransferForm.reset({
                      flow_type: transfer.flow_type,
                      asset_amount_change: assetAmountChange,
                      asset_reference: transfer.asset_reference,
                      settlement_asset_amount_change:
                        settlementAssetAmountChange,
                      remark: transfer.remark,
                    })
                    setFocusedTransactionReference(transaction.reference)
                    setEditingTransferReference(transfer.reference)
                    sidePanel.open('updateTransfer')
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    setFocusedTransactionReference(transaction.reference)
                    deleteTransfer(transaction.reference, transfer.reference)
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </NoWrapTableCell>
            </TableRow>
          )
        })}
    </React.Fragment>
  )
}
