'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useEndUser } from '@/utils/auth'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FolderIcon from '@mui/icons-material/Folder'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'

type GoogleDriveFolderOption = {
  id: string
  name: string
}

type GoogleInputs = {
  drive_root_folder: GoogleDriveFolderOption
}

type SinoTradeInputs = {
  accounts: {
    name: string
    api_key: string
    secret_key: string
  }[]
}

function PopperComponent({ children, ...other }: any) {
  return (
    <Popper {...other}>
      {/* test */}
      {children}
      {/* teeest */}
    </Popper>
  )
}

const ListboxComponent = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props
  return (
    <List ref={ref} dense {...other}>
      <ListItem>
        <Input fullWidth placeholder="搜尋資料夾名稱" />
      </ListItem>
      {children}
      <ListItem>test</ListItem>
    </List>
  )
})

export default function Page() {
  const { sync: syncEndUser } = useEndUser()
  const [
    isGoogleDriveFolderAutocompleteOpen,
    setIsGoogleDriveFolderAutocompleteOpen,
  ] = React.useState(false)
  const [
    isLoadingGoogleDriveFolderOptions,
    setIsLoadingGoogleDriveFolderOptions,
  ] = React.useState(false)
  const [
    googleDriveFolderOptionsNextPageToken,
    setGoogleDriveFolderOptionsNextPageToken,
  ] = React.useState()
  const [googleDriveFolderOptions, setGoogleDriveFolderOptions] =
    React.useState<readonly GoogleDriveFolderOption[]>([])
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

  React.useEffect(() => {
    if (isGoogleDriveFolderAutocompleteOpen === true) {
      fetchGoogleDriveFolderOptionsPage()
    }
  }, [isGoogleDriveFolderAutocompleteOpen])

  const fetchGoogleIntegration = () => {
    choreMasterAPIAgent.get('/v1/account_center/integrations/google', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        if (data?.drive?.root_folder_id) {
          googleIntegrationForm.reset({
            drive_root_folder: { id: data.drive.root_folder_id },
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

  const fetchGoogleDriveFolderOptionsPage = async () => {
    setIsLoadingGoogleDriveFolderOptions(true)
    await choreMasterAPIAgent.get(
      '/v1/account_center/integrations/google/drive/folders',
      {
        params: {
          parent_folder: 'root',
          page_token: googleDriveFolderOptionsNextPageToken,
        },
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: async ({ data }: any) => {
          setGoogleDriveFolderOptions(data.list)
          setGoogleDriveFolderOptionsNextPageToken(
            data.metadata.next_page_token
          )
        },
      }
    )
    setIsLoadingGoogleDriveFolderOptions(false)
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
        <ModuleFunctionHeader title="Google 服務整合" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Typography mb={3}>
              Chore Master 使用您的 Google Drive 及 Spreadsheet
              來儲存資料狀態，您必須完成此設定才能使用完整服務。
            </Typography>
            <Stack component="form" spacing={3} autoComplete="off">
              <FormControl>
                {/* <Controller
                  name="drive_root_folder_id_old"
                  control={googleIntegrationForm.control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="掛載至 Google Drive 資料夾 ID"
                      variant="standard"
                    />
                  )}
                  rules={{ required: '必填' }}
                /> */}
                <Controller
                  name="drive_root_folder"
                  control={googleIntegrationForm.control}
                  defaultValue={{ id: '', name: '' }}
                  rules={{ required: '必填' }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      value={value}
                      onChange={(event, newValue) => {
                        onChange(newValue)
                      }}
                      // {...field}
                      // PopperComponent={PopperComponent}
                      ListboxComponent={ListboxComponent}
                      noOptionsText="無資料夾"
                      loadingText="載入中..."
                      // disableCloseOnSelect
                      // selectOnFocus
                      disableClearable
                      handleHomeEndKeys
                      freeSolo
                      open={isGoogleDriveFolderAutocompleteOpen}
                      onOpen={() => {
                        setIsGoogleDriveFolderAutocompleteOpen(true)
                      }}
                      onClose={() => {
                        setIsGoogleDriveFolderAutocompleteOpen(false)
                      }}
                      options={googleDriveFolderOptions}
                      getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                          return option
                        }
                        return option.id
                      }}
                      renderOption={(props, option) => {
                        const { key, ...optionProps } = props
                        return (
                          <ListItem key={key} {...optionProps}>
                            <ListItemIcon>
                              <FolderIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={option.name}
                              secondary={option.id}
                            />
                          </ListItem>
                        )
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      loading={isLoadingGoogleDriveFolderOptions}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Google Drive 資料夾 ID"
                          variant="standard"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {isLoadingGoogleDriveFolderOptions ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              </FormControl>
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
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="識別名稱"
                              variant="standard"
                            />
                          )}
                          rules={{ required: '必填' }}
                        />
                        <Controller
                          control={sinoTradeIntegrationForm.control}
                          name={`accounts.${index}.api_key`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="API Key"
                              variant="standard"
                            />
                          )}
                          rules={{ required: '必填' }}
                        />
                        <Controller
                          control={sinoTradeIntegrationForm.control}
                          name={`accounts.${index}.secret_key`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="Secret Key"
                              variant="standard"
                            />
                          )}
                          rules={{ required: '必填' }}
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
    </React.Fragment>
  )
}
