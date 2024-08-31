'use client'

import GoogleDriveExplorer from '@/components/GoogleDriveExplorer'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useEndUser } from '@/utils/auth'
import getConfig from '@/utils/config'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import React from 'react'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'

type CoreInputs = {
  relational_database_origin: string
}

type GoogleInputs = {
  drive_root_folder_id: string
}

type SinoTradeInputs = {
  accounts: {
    name: string
    api_key: string
    secret_key: string
  }[]
}

const { CHORE_MASTER_API_HOST } = getConfig()

// function PopperComponent({ children, ...other }: any) {
//   return (
//     <Popper {...other}>
//       {/* test */}
//       {children}
//       {/* teeest */}
//     </Popper>
//   )
// }

// const ListboxComponent = React.forwardRef<
//   HTMLUListElement,
//   React.HTMLAttributes<HTMLElement>
// >(function ListboxComponent(props, ref) {
//   const { children, ...other } = props
//   return (
//     <List ref={ref} dense {...other}>
//       <ListItem>
//         <Input fullWidth placeholder="搜尋資料夾名稱" />
//       </ListItem>
//       {children}
//       <ListItem>test</ListItem>
//     </List>
//   )
// })

export default function Page() {
  const [driveFolderIdInputAnchorEl, setDriveFolderIdInputAnchorEl] =
    React.useState<null | HTMLElement>(null)
  const { sync: syncEndUser } = useEndUser()
  const [isGoogleDriveExplorerModalOpen, setIsGoogleDriveExplorerModalOpen] =
    React.useState(false)
  const coreIntegrationForm = useForm<CoreInputs>()
  const googleIntegrationForm = useForm<GoogleInputs>()
  const sinoTradeIntegrationForm = useForm<SinoTradeInputs>()
  const sinoTradeIntegrationFormAccountFieldArray = useFieldArray({
    control: sinoTradeIntegrationForm.control,
    name: 'accounts',
  })

  React.useEffect(() => {
    fetchGoogleIntegration()
    fetchSinoTradeIntegration()
  }, [])

  const handleCloseGoogleDriveExplorerModal = () =>
    setIsGoogleDriveExplorerModalOpen(false)

  const handleOpenDriveFolderIdInputMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setDriveFolderIdInputAnchorEl(event.currentTarget)
  }

  const handleCloseDriveFolderIdInput = () => {
    setDriveFolderIdInputAnchorEl(null)
  }

  const fetchCoreIntegration = () => {
    choreMasterAPIAgent.get('/v1/account_center/integrations/core', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        if (data?.drive?.root_folder_id) {
          coreIntegrationForm.reset({
            relational_database_origin: data.relational_database?.origin,
          })
        }
      },
    })
  }

  const fetchGoogleIntegration = () => {
    choreMasterAPIAgent.get('/v1/account_center/integrations/google', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        if (data?.drive?.root_folder_id) {
          googleIntegrationForm.reset({
            drive_root_folder_id: data.drive.root_folder_id,
          })
        }
      },
    })
  }

  const fetchSinoTradeIntegration = () => {
    choreMasterAPIAgent.get('/v1/account_center/integrations/sino_trade', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        sinoTradeIntegrationForm.reset({
          accounts: Object.values(data?.account_map || {}),
        })
      },
    })
  }

  const onSubmitCoreIntegrationForm: SubmitHandler<CoreInputs> = async (
    data
  ) => {
    await choreMasterAPIAgent.patch(
      '/v1/account_center/integrations/core',
      data,
      {
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: () => {
          fetchCoreIntegration()
          syncEndUser()
          alert('掛載完成。')
        },
      }
    )
  }

  const onSubmitGoogleIntegrationForm: SubmitHandler<GoogleInputs> = async (
    data
  ) => {
    await choreMasterAPIAgent.patch(
      '/v1/account_center/integrations/google',
      data,
      {
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: () => {
          fetchGoogleIntegration()
          syncEndUser()
          alert('掛載完成。')
        },
      }
    )
  }

  const onSubmitSinoTradeIntegrationForm: SubmitHandler<
    SinoTradeInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      '/v1/account_center/integrations/sino_trade',
      data,
      {
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: () => {
          fetchSinoTradeIntegration()
          alert('儲存成功。')
        },
      }
    )
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="資料庫" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Typography mb={3}>
              Chore Master
              使用關聯式資料庫來儲存此帳戶產生的資料，您必須完成此設定才能使用完整服務。
            </Typography>
            <Stack component="form" spacing={3} autoComplete="off">
              <Controller
                control={coreIntegrationForm.control}
                name="relational_database_origin"
                defaultValue=""
                rules={{ required: '必填' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="連線字串"
                    variant="standard"
                  />
                )}
              />
              <LoadingButton
                variant="contained"
                onClick={coreIntegrationForm.handleSubmit(
                  onSubmitCoreIntegrationForm
                )}
                loading={coreIntegrationForm.formState.isSubmitting}
              >
                掛載
              </LoadingButton>
            </Stack>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader title="Google 服務整合" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Typography mb={3}>
              Chore Master 使用您的 Google Drive 及 Spreadsheet
              來儲存資料狀態，您必須完成此設定才能使用完整服務。
            </Typography>
            <Stack component="form" spacing={3} autoComplete="off">
              <Controller
                control={googleIntegrationForm.control}
                name="drive_root_folder_id"
                defaultValue=""
                rules={{ required: '必填' }}
                render={({ field }) => (
                  <FormControl variant="standard" required>
                    <InputLabel>掛載至 Google Drive 資料夾 ID</InputLabel>
                    <Input
                      {...field}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setIsGoogleDriveExplorerModalOpen(true)
                            }
                          >
                            <ManageSearchIcon />
                          </IconButton>
                          <IconButton
                            onClick={handleOpenDriveFolderIdInputMenu}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={driveFolderIdInputAnchorEl}
                            open={Boolean(driveFolderIdInputAnchorEl)}
                            onClose={handleCloseDriveFolderIdInput}
                            transformOrigin={{
                              horizontal: 'right',
                              vertical: 'top',
                            }}
                            anchorOrigin={{
                              horizontal: 'right',
                              vertical: 'bottom',
                            }}
                          >
                            <Link
                              href={`${CHORE_MASTER_API_HOST}/v1/account_center/integrations/google/drive/web_view_url?file_id=${googleIntegrationForm.getValues(
                                'drive_root_folder_id'
                              )}`}
                              passHref
                              legacyBehavior
                            >
                              <MenuItem
                                component="a"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleCloseDriveFolderIdInput}
                                disabled={
                                  !googleIntegrationForm.formState.isValid
                                }
                              >
                                <ListItemIcon>
                                  <OpenInNewIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>在雲端硬碟顯示</ListItemText>
                              </MenuItem>
                            </Link>
                          </Menu>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                )}
              />
              <LoadingButton
                variant="contained"
                onClick={googleIntegrationForm.handleSubmit(
                  onSubmitGoogleIntegrationForm
                )}
                loading={googleIntegrationForm.formState.isSubmitting}
              >
                掛載
              </LoadingButton>
            </Stack>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader title="永豐服務整合" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Typography mb={3}>用於匯入對帳單至 Chore Master。</Typography>
            <Stack spacing={3}>
              {sinoTradeIntegrationFormAccountFieldArray.fields.map(
                (field, index) => (
                  <Accordion key={field.id} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      {sinoTradeIntegrationForm.watch(
                        `accounts.${index}.name`
                      ) || '未命名'}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={1}>
                        <Controller
                          control={sinoTradeIntegrationForm.control}
                          name={`accounts.${index}.name`}
                          rules={{ required: '必填' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="識別名稱"
                              variant="standard"
                            />
                          )}
                        />
                        <Controller
                          control={sinoTradeIntegrationForm.control}
                          name={`accounts.${index}.api_key`}
                          rules={{ required: '必填' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="API Key"
                              variant="standard"
                            />
                          )}
                        />
                        <Controller
                          control={sinoTradeIntegrationForm.control}
                          name={`accounts.${index}.secret_key`}
                          rules={{ required: '必填' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="Secret Key"
                              variant="standard"
                            />
                          )}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() =>
                            sinoTradeIntegrationFormAccountFieldArray.remove(
                              index
                            )
                          }
                        >
                          刪除
                        </Button>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                )
              )}
              <Button
                variant="outlined"
                onClick={() =>
                  sinoTradeIntegrationFormAccountFieldArray.append({
                    name: '',
                    api_key: '',
                    secret_key: '',
                  })
                }
              >
                新增一筆
              </Button>
              <LoadingButton
                variant="contained"
                onClick={sinoTradeIntegrationForm.handleSubmit(
                  onSubmitSinoTradeIntegrationForm
                )}
                loading={sinoTradeIntegrationForm.formState.isSubmitting}
                disabled={
                  !sinoTradeIntegrationForm.formState.isDirty ||
                  !sinoTradeIntegrationForm.formState.isValid
                }
              >
                儲存
              </LoadingButton>
            </Stack>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>

      <Modal
        open={isGoogleDriveExplorerModalOpen}
        onClose={handleCloseGoogleDriveExplorerModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <GoogleDriveExplorer
          sx={{
            minWidth: '60vw',
            maxWidth: '80vw',
            maxHeight: '80vh',
          }}
          onSelected={(folderId) => {
            googleIntegrationForm.setValue('drive_root_folder_id', folderId)
            handleCloseGoogleDriveExplorerModal()
          }}
        />
      </Modal>
    </React.Fragment>
  )
}
