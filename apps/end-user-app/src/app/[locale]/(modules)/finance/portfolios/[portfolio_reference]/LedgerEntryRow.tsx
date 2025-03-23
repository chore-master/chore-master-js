import React from 'react'

import DatetimeBlock from '@/components/DatetimeBlock'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import ReferenceBlock from '@/components/ReferenceBlock'
import { NoWrapTableCell } from '@/components/Table'
import {
  financeLedgerEntryEntryTypes,
  financeLedgerEntrySourceTypes,
} from '@/constants'
import {
  Asset,
  CreateLedgerEntryFormInputs,
  Instrument,
  LedgerEntry,
  UpdateLedgerEntryFormInputs,
} from '@/types/finance'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import TableRow from '@mui/material/TableRow'
import { Decimal } from 'decimal.js'
import { UseFormReturn } from 'react-hook-form'

export default function LedgerEntryRow({
  ledgerEntry,
  index,
  ledgerEntriesPage,
  ledgerEntriesRowsPerPage,
  timezone,
  assetReferenceToAssetMap,
  instrumentReferenceToInstrumentMap,
  setIsCreateLedgerEntryDrawerOpen,
  setEditingLedgerEntryReference,
  deleteLedgerEntry,
  createLedgerEntryForm,
  updateLedgerEntryForm,
}: {
  ledgerEntry: LedgerEntry
  index: number
  ledgerEntriesPage: number
  ledgerEntriesRowsPerPage: number
  timezone: any
  assetReferenceToAssetMap: Record<string, Asset>
  instrumentReferenceToInstrumentMap: Record<string, Instrument>
  setIsCreateLedgerEntryDrawerOpen: (isOpen: boolean) => void
  setEditingLedgerEntryReference: (reference: string) => void
  deleteLedgerEntry: (reference: string) => void
  createLedgerEntryForm: UseFormReturn<CreateLedgerEntryFormInputs>
  updateLedgerEntryForm: UseFormReturn<UpdateLedgerEntryFormInputs>
}) {
  const settlement_asset =
    assetReferenceToAssetMap[ledgerEntry.settlement_asset_reference]
  let settlement_amount_change: number | undefined
  if (settlement_asset) {
    settlement_amount_change = new Decimal(ledgerEntry.settlement_amount_change)
      .dividedBy(new Decimal(10 ** settlement_asset.decimals))
      .toNumber()
  }
  let instrument: Instrument | undefined
  let quantity_change: number | undefined
  let fill_px: number | undefined
  if (ledgerEntry.instrument_reference) {
    instrument =
      instrumentReferenceToInstrumentMap[ledgerEntry.instrument_reference]
    if (instrument) {
      quantity_change = new Decimal(ledgerEntry.quantity_change as number)
        .dividedBy(new Decimal(10 ** instrument.quantity_decimals))
        .toNumber()

      fill_px = new Decimal(ledgerEntry.fill_px as number)
        .dividedBy(new Decimal(10 ** instrument.px_decimals))
        .toNumber()
    }
  }

  return (
    <React.Fragment>
      <TableRow hover>
        <NoWrapTableCell align="right">
          <PlaceholderTypography>
            {ledgerEntriesPage * ledgerEntriesRowsPerPage + index + 1}
          </PlaceholderTypography>
        </NoWrapTableCell>
        <NoWrapTableCell>
          <DatetimeBlock isoText={ledgerEntry.entry_time} />
        </NoWrapTableCell>
        <NoWrapTableCell>
          <ReferenceBlock
            label={
              financeLedgerEntryEntryTypes.find(
                (entryType) => entryType.value === ledgerEntry.entry_type
              )?.label
            }
          />
        </NoWrapTableCell>
        <NoWrapTableCell>{settlement_amount_change}</NoWrapTableCell>
        <NoWrapTableCell>
          <ReferenceBlock label={settlement_asset?.name} foreignValue />
        </NoWrapTableCell>
        <NoWrapTableCell>
          {quantity_change === undefined ? (
            <PlaceholderTypography>N/A</PlaceholderTypography>
          ) : (
            quantity_change
          )}
        </NoWrapTableCell>
        <NoWrapTableCell>
          {instrument ? (
            <ReferenceBlock label={instrument.name} foreignValue />
          ) : (
            <PlaceholderTypography>N/A</PlaceholderTypography>
          )}
        </NoWrapTableCell>
        <NoWrapTableCell>
          {fill_px === undefined ? (
            <PlaceholderTypography>N/A</PlaceholderTypography>
          ) : (
            fill_px
          )}
        </NoWrapTableCell>
        <NoWrapTableCell>
          {ledgerEntry.remark || (
            <PlaceholderTypography>無</PlaceholderTypography>
          )}
        </NoWrapTableCell>
        <NoWrapTableCell>
          <ReferenceBlock
            label={
              financeLedgerEntrySourceTypes.find(
                (sourceType) => sourceType.value === ledgerEntry.source_type
              )?.label
            }
          />
        </NoWrapTableCell>
        <NoWrapTableCell>
          <ReferenceBlock label={ledgerEntry.reference} primaryKey monospace />
        </NoWrapTableCell>
        <NoWrapTableCell align="right">
          <IconButton
            size="small"
            onClick={() => {
              createLedgerEntryForm.reset({
                parent_ledger_entry_reference: ledgerEntry.reference,
                entry_time: timezone
                  .getLocalString(ledgerEntry.entry_time)
                  .slice(0, -5),
              })
              setIsCreateLedgerEntryDrawerOpen(true)
            }}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              updateLedgerEntryForm.reset({
                parent_ledger_entry_reference:
                  ledgerEntry.parent_ledger_entry_reference,
                entry_time: timezone
                  .getLocalString(ledgerEntry.entry_time)
                  .slice(0, -5),
                entry_type: ledgerEntry.entry_type,
                settlement_amount_change: settlement_amount_change,
                settlement_asset_reference:
                  ledgerEntry.settlement_asset_reference,
                quantity_change: quantity_change,
                instrument_reference: ledgerEntry.instrument_reference ?? '',
                fill_px: fill_px,
                remark: ledgerEntry.remark ?? '',
              })
              setEditingLedgerEntryReference(ledgerEntry.reference)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => deleteLedgerEntry(ledgerEntry.reference)}
          >
            <DeleteIcon />
          </IconButton>
        </NoWrapTableCell>
      </TableRow>
    </React.Fragment>
  )
}
