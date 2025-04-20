import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import FolderIcon from '@mui/icons-material/Folder'
import SearchIcon from '@mui/icons-material/Search'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

type SearchInputs = {
  query: string
}

type GoogleDriveFolderOption = {
  id: string
  name: string
}

// eslint-disable-next-line react/display-name
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
    const { enqueueNotification } = useNotification()
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
      const folderNameQuery = searchForm.getValues().query || ''
      await choreMasterAPIAgent.get(
        '/v1/account_center/integrations/google/drive/folders',
        {
          params: {
            parent_folder: folderNameQuery === '' ? 'root' : null,
            folder_name_query: folderNameQuery,
            page_token: googleDriveFolderOptionsNextPageToken,
          },
          onFail: ({ message }: any) => {
            enqueueNotification(message, 'error')
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
        <Stack sx={{ flex: '1 0 0px', height: '100%' }}>
          <Controller
            name="query"
            control={searchForm.control}
            defaultValue=""
            render={({ field }) => (
              <Box
                sx={{
                  p: 2,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  bgcolor: 'background.paper',
                }}
              >
                <FormControl variant="standard" fullWidth>
                  <InputLabel>搜尋資料夾名稱</InputLabel>
                  <Input
                    {...field}
                    autoComplete="off"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => fetchGoogleDriveFolderOptionsPage()}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>
            )}
          />

          {isLoadingGoogleDriveFolderOptions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
              <CircularProgress />
            </Box>
          ) : googleDriveFolderOptions.length === 0 ? (
            <Typography sx={{ p: 2 }}>
              {searchForm.getValues().query
                ? `找不到名稱含有「${searchForm.getValues().query}」的資料夾。`
                : `找不到任何資料夾。`}
            </Typography>
          ) : (
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
          )}
        </Stack>
      </Box>
    )
  }
)
