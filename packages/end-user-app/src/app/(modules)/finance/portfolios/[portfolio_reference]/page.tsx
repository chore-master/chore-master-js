'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleContainer,
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import ReferenceBlock from '@/components/ReferenceBlock'
import { Portfolio, UpdatePortfolioFormInputs } from '@/types/finance'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import RefreshIcon from '@mui/icons-material/Refresh'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import MuiLink from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export default function Page() {
  const [tabValue, setTabValue] = React.useState<string>('overview')
  const { enqueueNotification } = useNotification()
  const { portfolio_reference }: { portfolio_reference: string } = useParams()
  const router = useRouter()

  // Portfolio
  const [portfolio, setPortfolio] = React.useState<Portfolio | null>(null)
  const [isFetchingPortfolio, setIsFetchingPortfolio] = React.useState(false)
  const updatePortfolioForm = useForm<UpdatePortfolioFormInputs>({
    mode: 'all',
  })

  const fetchPortfolio = React.useCallback(async () => {
    setIsFetchingPortfolio(true)
    await choreMasterAPIAgent.get(
      `/v1/finance/portfolios/${portfolio_reference}`,
      {
        params: {},
        onError: () => {
          enqueueNotification(`Unable to fetch portfolio now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async ({ data }: { data: Portfolio }) => {
          setPortfolio(data)
          updatePortfolioForm.reset({
            name: data.name,
            description: data.description,
          })
        },
      }
    )
    setIsFetchingPortfolio(false)
  }, [portfolio_reference])

  const handleSubmitUpdatePortfolioForm: SubmitHandler<
    UpdatePortfolioFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      `/v1/finance/portfolios/${portfolio_reference}`,
      data,
      {
        onError: () => {
          enqueueNotification(`Unable to update portfolio now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchPortfolio()
        },
      }
    )
  }

  const deletePortfolio = React.useCallback(
    async (portfolioReference: string) => {
      const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
      if (!isConfirmed) {
        return
      }
      await choreMasterAPIAgent.delete(
        `/v1/finance/portfolios/${portfolioReference}`,
        {
          onError: () => {
            enqueueNotification(`Unable to delete portfolio now.`, 'error')
          },
          onFail: ({ message }: { message: string }) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            router.push('/finance/portfolios')
          },
        }
      )
    },
    []
  )

  React.useEffect(() => {
    fetchPortfolio()
  }, [])

  return (
    <TabContext value={tabValue}>
      <Box sx={{ p: 2 }}>
        <Breadcrumbs>
          <MuiLink
            component={Link}
            underline="hover"
            color="inherit"
            href="/finance/portfolios"
          >
            投資組合
          </MuiLink>
          {portfolio && (
            <ReferenceBlock label={portfolio.reference} primaryKey monospace />
          )}
        </Breadcrumbs>
      </Box>

      <ModuleFunction sx={{ pb: 0 }}>
        <ModuleFunctionHeader
          title={portfolio?.name}
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={() => {
                    fetchPortfolio()
                  }}
                  disabled={isFetchingPortfolio}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
          ]}
        />
      </ModuleFunction>

      <ModuleContainer stickyTop>
        <ModuleFunction sx={{ p: 0, px: 3 }}>
          <Box sx={{ mx: 2, mt: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              variant="scrollable"
              scrollButtons={false}
              onChange={(event: React.SyntheticEvent, newValue: string) => {
                setTabValue(newValue)
              }}
            >
              <Tab label="總覽" value="overview" />
              <Tab label="交易紀錄" value="ledger" />
              <Tab label="設定" value="settings" />
            </TabList>
          </Box>
        </ModuleFunction>
      </ModuleContainer>

      <TabPanel value="overview" sx={{ p: 0 }}>
        <ModuleFunction>
          <ModuleFunctionBody loading={isFetchingPortfolio}>
            <List>
              <ListSubheader>說明</ListSubheader>
              <ListItem>
                {portfolio?.description ? (
                  <ListItemText primary={portfolio?.description} />
                ) : (
                  <PlaceholderTypography>無</PlaceholderTypography>
                )}
              </ListItem>
            </List>
          </ModuleFunctionBody>
        </ModuleFunction>
      </TabPanel>

      <TabPanel value="ledger" sx={{ p: 0 }}>
        <ModuleFunction>
          <ModuleFunctionBody>
            <PlaceholderTypography>目前沒有交易紀錄</PlaceholderTypography>
          </ModuleFunctionBody>
        </ModuleFunction>
      </TabPanel>

      <TabPanel value="settings" sx={{ p: 0 }}>
        <ModuleFunction>
          <ModuleFunctionHeader subtitle="基本資訊" />
          <ModuleFunctionBody loading={isFetchingPortfolio}>
            <Stack
              component="form"
              spacing={3}
              p={2}
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <FormControl>
                <Controller
                  name="name"
                  control={updatePortfolioForm.control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="名稱"
                      variant="filled"
                    />
                  )}
                  rules={{ required: '必填' }}
                />
              </FormControl>
              <FormControl>
                <Controller
                  name="description"
                  control={updatePortfolioForm.control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="描述"
                      variant="filled"
                      multiline
                      rows={5}
                    />
                  )}
                />
              </FormControl>
              <AutoLoadingButton
                type="submit"
                variant="contained"
                disabled={
                  !updatePortfolioForm.formState.isDirty ||
                  !updatePortfolioForm.formState.isValid
                }
                onClick={updatePortfolioForm.handleSubmit(
                  handleSubmitUpdatePortfolioForm
                )}
              >
                儲存
              </AutoLoadingButton>
            </Stack>
          </ModuleFunctionBody>
        </ModuleFunction>

        <ModuleFunction>
          <ModuleFunctionHeader subtitle="進階" />
          <ModuleFunctionBody>
            <Stack
              component="form"
              spacing={3}
              p={2}
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <AutoLoadingButton
                variant="contained"
                color="error"
                onClick={async () => {
                  await deletePortfolio(portfolio_reference)
                }}
              >
                刪除
              </AutoLoadingButton>
            </Stack>
          </ModuleFunctionBody>
        </ModuleFunction>
      </TabPanel>
    </TabContext>
  )
}
