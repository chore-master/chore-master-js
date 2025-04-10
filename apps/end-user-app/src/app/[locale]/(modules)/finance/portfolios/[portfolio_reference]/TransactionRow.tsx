import DatetimeBlock from '@/components/DatetimeBlock'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import ReferenceBlock from '@/components/ReferenceBlock'
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
import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TableRow from '@mui/material/TableRow'
import { Decimal } from 'decimal.js'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

export default function TransactionRow({
  portfolio,
  transaction,
  index,
  transactionsCount,
  transactionsPage,
  transactionsRowsPerPage,
  timezone,
  assetReferenceToAssetMap,
  updateTransactionForm,
  createTransferForm,
  updateTransferForm,
  setEditingTransactionReference,
  setFocusedTransactionReference,
  setIsCreateTransferDrawerOpen,
  setEditingTransferReference,
  deleteTransaction,
  deleteTransfer,
}: {
  portfolio: Portfolio | null
  transaction: Transaction
  index: number
  transactionsCount: number
  transactionsPage: number
  transactionsRowsPerPage: number
  timezone: any
  assetReferenceToAssetMap: Record<string, Asset>
  updateTransactionForm: UseFormReturn<UpdateTransactionFormInputs>
  createTransferForm: UseFormReturn<CreateTransferFormInputs>
  updateTransferForm: UseFormReturn<UpdateTransferFormInputs>
  setEditingTransactionReference: (reference: string) => void
  setFocusedTransactionReference: (reference: string) => void
  setIsCreateTransferDrawerOpen: (isOpen: boolean) => void
  setEditingTransferReference: (reference: string) => void
  deleteTransaction: (transactionReference: string) => void
  deleteTransfer: (
    transactionReference: string,
    transferReference: string
  ) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const settlementAsset =
    assetReferenceToAssetMap[portfolio?.settlement_asset_reference as string]

  const transactionSettlementAssetAmountChange = settlementAsset
    ? new Decimal(
        transaction.transfers.reduce(
          (acc, transfer) =>
            acc + (transfer.settlement_asset_amount_change ?? 0),
          0
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
            {transactionsCount -
              transactionsPage * transactionsRowsPerPage -
              index}
          </PlaceholderTypography>
        </NoWrapTableCell>
        <NoWrapTableCell>
          <DatetimeBlock isoText={transaction.transacted_time} />
        </NoWrapTableCell>
        <NoWrapTableCell align="right">
          {transactionSettlementAssetAmountChange ? (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="flex-end"
            >
              <PlaceholderTypography>
                {transactionSettlementAssetAmountChange}
              </PlaceholderTypography>
              <ReferenceBlock label={settlementAsset?.name} foreignValue />
            </Stack>
          ) : (
            <PlaceholderTypography>N/A</PlaceholderTypography>
          )}
        </NoWrapTableCell>
        <NoWrapTableCell align="right">
          <PlaceholderTypography>N/A</PlaceholderTypography>
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
                asset_amount_change: 0,
                asset_reference: '',
                settlement_asset_amount_change: 0,
                remark: '',
              })
              setFocusedTransactionReference(transaction.reference)
              setIsCreateTransferDrawerOpen(true)
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
          let settlementAssetAmountChange: number | undefined
          let assetAmountChange: number | undefined
          if (transfer.settlement_asset_amount_change && settlementAsset) {
            settlementAssetAmountChange = new Decimal(
              transfer.settlement_asset_amount_change
            )
              .dividedBy(new Decimal(10 ** settlementAsset.decimals))
              .toNumber()
          }
          if (asset) {
            assetAmountChange = new Decimal(transfer.asset_amount_change)
              .dividedBy(new Decimal(10 ** asset.decimals))
              .toNumber()
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
              <NoWrapTableCell>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  {settlementAssetAmountChange ? (
                    <span>{settlementAssetAmountChange}</span>
                  ) : (
                    <PlaceholderTypography>0</PlaceholderTypography>
                  )}
                  <ReferenceBlock label={settlementAsset?.name} foreignValue />
                </Stack>
              </NoWrapTableCell>
              <NoWrapTableCell>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <ReferenceBlock
                    label={
                      financeTransferFlowTypes.find(
                        (flowType) => flowType.value === transfer.flow_type
                      )?.label
                    }
                  />
                  <span>{assetAmountChange}</span>
                  <ReferenceBlock label={asset.name} foreignValue />
                </Stack>
              </NoWrapTableCell>
              <NoWrapTableCell>
                {transfer.remark || (
                  <PlaceholderTypography>無</PlaceholderTypography>
                )}
              </NoWrapTableCell>
              <NoWrapTableCell>
                <PlaceholderTypography>N/A</PlaceholderTypography>
              </NoWrapTableCell>
              <NoWrapTableCell>
                <PlaceholderTypography>N/A</PlaceholderTypography>
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
