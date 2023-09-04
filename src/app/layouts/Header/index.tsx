import { Logout, PersonAdd, Settings } from '@mui/icons-material'
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import * as _ from 'lodash'
import { useState } from 'react'
import { headerTitles } from 'src/app/routes'
import { DefaultHeader } from './__DefaultHeader'
import { useDispatch, useSelector } from 'react-redux'
import { selectors } from '@esign-web/redux/auth'
import { selectors as selectorsDocument } from '@esign-web/redux/document'
import MButton from 'src/app/components/Button'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import WalletIcon from '@mui/icons-material/Wallet'
import ClassIcon from '@mui/icons-material/Class'
import { baseApi } from '@esign-web/libs/utils'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ENABLE_SAVE_DRAFT } from 'libs/redux/document/src/lib/constants'

export const DashboardHeader = () => {
  const localtion = window.location.pathname
  const authState = useSelector(selectors.getAuthState)
  const isSaveDraftEnabled = useSelector(selectorsDocument.getDraftEnabled)
  const dashBoardObject = _.find(headerTitles, (o) => o.to === localtion)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')

  const [isSaved, setSaveDraft] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleSaveDraft = async () => {
    try {
      await baseApi.post('/document/save-draft', {
        id: documentId,
        data: {},
      })
      dispatch({
        type: ENABLE_SAVE_DRAFT,
        payload: true,
      })
    } catch (error) {}
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  console.log('>>>>> dashBoardObject', localtion)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '8.75rem',
        justifyContent: 'flex-end',
        borderBottom: '1px solid var(--border-gray)',
      }}
    >
      {/* Avatar */}
      <DefaultHeader title={dashBoardObject?.name} to={dashBoardObject?.to} />

      <Box
        sx={{
          width: 'fit-content',
          paddingRight: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {localtion === '/document/sign' && (
          <MButton
            onClick={handleSaveDraft}
            sx={{
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: isSaveDraftEnabled ? 'var(--green11)' : 'var(--white)',
              border: isSaveDraftEnabled ? '1px solid var(--green11)' : '1px solid var(--gray3)',
              display: 'flex',
              gap: '12px',
              '&:hover': {
                opacity: '1 !important',
              },
            }}
          >
            <ClassIcon
              sx={{
                fontSize: '28px',
                color: isSaveDraftEnabled ? 'var(--green12)' : 'var(--dark)',
              }}
            />
            <Typography
              sx={{
                fontSize: '1.9rem',
                color: isSaveDraftEnabled ? 'var(--green12)' : 'var(--dark)',
                letterSpacing: '1px',
                fontWeight: 'bold',
              }}
            >
              Save Draft
            </Typography>
          </MButton>
        )}
        <Box
          sx={{
            display: 'flex',
            marginRight: '35px',
          }}
        >
          <MButton
            sx={{
              width: '240px',
              borderRadius: '12px 0px 0px 12px',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--gray3)',
              padding: '7px 6px',
              display: 'flex',
              gap: '15px',
            }}
          >
            <WalletIcon
              sx={{
                fontSize: '33px',
                color: 'var(--dark)',
              }}
            />
            <Typography
              sx={{
                fontSize: '2rem',
                fontWeight: 'bold',
                letterSpacing: '1px',
                color: 'var(--dark)',
              }}
            >
              Connect wallet
            </Typography>
          </MButton>
          <MButton
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: '0px 12px 12px 0px',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--gray3)',
              borderLeftWidth: '0px',
              padding: '7px 12px',
            }}
          >
            <AccountCircleOutlinedIcon
              sx={{
                fontSize: '33px',
                color: 'var(--dark)',
              }}
            />
          </MButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            sx={{
              '& .MuiPaper-root': {
                marginTop: '10px',
                boxShadow: 'none',
                border: '1px solid var(--color-gray1)',
                borderRadius: '12px',
                width: '300px',
                height: '500px',
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box></Box>
            </Box>
          </Menu>
        </Box>
      </Box>
    </Box>
  )
}
