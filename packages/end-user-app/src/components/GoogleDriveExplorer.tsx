import choreMasterAPIAgent from '@/utils/apiAgent'
import FolderIcon from '@mui/icons-material/Folder'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import LinearProgress from '@mui/material/LinearProgress'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

type SearchInputs = {
  query: string
}

type GoogleDriveFolderOption = {
  id: string
  name: string
}

export default React.forwardRef(
  (
    {
      onSelected,
      sx,
    }: {
      onSelected: (folderId: string) => void
      sx?: React.CSSProperties
    },
    ref
  ) => {
    const searchForm = useForm<SearchInputs>()
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

    const fetchGoogleDriveFolderOptionsPage = async () => {
      setIsLoadingGoogleDriveFolderOptions(true)
      await choreMasterAPIAgent.get(
        '/v1/account_center/integrations/google/drive/folders',
        {
          params: {
            //   parent_folder: 'root',
            query: searchForm.getValues().query,
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

    React.useEffect(() => {
      fetchGoogleDriveFolderOptionsPage()
    }, [])

    return (
      <Box
        ref={ref}
        sx={{
          maxWidth: '100%',
          maxHeight: '100%',
          bgcolor: 'background.paper',
          overflowY: 'auto',
          ...sx,
        }}
      >
        {isLoadingGoogleDriveFolderOptions && <LinearProgress />}
        <Stack spacing={3} sx={{ flex: '1 0 0px', height: '100%' }}>
          <FormControl
            sx={{
              p: 2,
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bgcolor: 'background.paper',
            }}
          >
            <Controller
              name="query"
              control={searchForm.control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="搜尋資料夾名稱"
                  variant="standard"
                  autoComplete="off"
                />
              )}
            />
          </FormControl>

          <List dense>
            {googleDriveFolderOptions.map((option) => (
              <ListItemButton
                key={option.id}
                onClick={() => onSelected(option.id)}
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary={option.name} secondary={option.id} />
              </ListItemButton>
            ))}
          </List>
        </Stack>
      </Box>
    )
  }
)
