'use client'

import GoogleDriveExplorer from '@/components/GoogleDriveExplorer'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useEndUser } from '@/utils/auth'
import getConfig from '@/utils/config'
import { useNotification } from '@/utils/notification'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
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
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type GoogleInputs = {
  drive_root_folder_id: string
}

const { CHORE_MASTER_API_HOST } = getConfig()

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [driveFolderIdInputAnchorEl, setDriveFolderIdInputAnchorEl] =
    React.useState<null | HTMLElement>(null)
  const { sync: syncEndUser } = useEndUser()
  const [isGoogleDriveExplorerModalOpen, setIsGoogleDriveExplorerModalOpen] =
    React.useState(false)
  const googleIntegrationForm = useForm<GoogleInputs>()

  React.useEffect(() => {
    fetchGoogleIntegration()
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

  const fetchGoogleIntegration = () => {
    choreMasterAPIAgent.get('/v1/account_center/integrations/google', {
      params: {},
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
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

  const onSubmitGoogleIntegrationForm: SubmitHandler<GoogleInputs> = async (
    data
  ) => {
    await choreMasterAPIAgent.patch(
      '/v1/account_center/integrations/google',
      data,
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchGoogleIntegration()
          syncEndUser()
          enqueueNotification('掛載完成。', 'success')
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
