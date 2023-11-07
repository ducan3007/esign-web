import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Menu,
  Typography
} from '@mui/material'
import * as _ from 'lodash'
import { useEffect, useState } from 'react'

import { Toast, baseApi } from '@esign-web/libs/utils'
import { selectors } from '@esign-web/redux/auth'
import { selectors as selectorsCert } from '@esign-web/redux/certificate'
import { selectors as selectorsDocument } from '@esign-web/redux/document'
import { selectors as walletSelectors } from '@esign-web/redux/wallet'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'
import ClassIcon from '@mui/icons-material/Class'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import WalletIcon from '@mui/icons-material/Wallet'
import { ethers } from 'ethers'
import FileSaver from 'file-saver'
import { SET_WALLET_ADDRESS } from 'libs/redux/auth/src/lib/constants'
import { ENABLE_SAVE_DRAFT } from 'libs/redux/document/src/lib/constants'
import { SET_CONTRACT_ABI } from 'libs/redux/wallet/src/lib/constants'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MButton from 'src/app/components/Button'
import AlertDialog from 'src/app/components/Dialog'
import { MTooltip } from 'src/app/components/Tooltip'
import { headerTitles } from 'src/app/routes'
import Coinbase from 'src/assets/coinbase.svg'
import MetamaskIcon from 'src/assets/metamask.svg'
import Walletconnect from 'src/assets/walletconnect.svg'
import { DefaultHeader } from './__DefaultHeader'

export const DashboardHeader = () => {
  const localtion = window.location.pathname
  const authState = useSelector(selectors.getAuthState)
  const isSaveDraftEnabled = useSelector(selectorsDocument.getDraftEnabled)
  const documentDetail = useSelector(selectorsDocument.getDocumentDetail) || ({} as any)
  const certDetail = useSelector(selectorsCert.getCertDetail) || ({} as any)
  const signatures = useSelector(selectorsDocument.getSignatures)
  const signers2 = useSelector(selectorsDocument.getSigners2)
  const dashBoardObject = _.find(headerTitles, (o) => o.to === localtion)

  const certABI = useSelector(walletSelectors.getCertABI)

  const [isDownloading, setDownloading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')
  const type = searchParams.get('type')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null)
  const open2 = Boolean(anchorEl2)

  useEffect(() => {
    ;(async () => {
      try {
        if (window.ethereum) {
          let request = await window.ethereum.request({ method: 'eth_requestAccounts' })
          dispatch({
            type: SET_WALLET_ADDRESS,
            payload: {
              provider: 'metamask',
              address: request,
            },
          })
        }
      } catch (error) {}
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const abi = await baseApi.get('/v1/contract/abi/')
        console.log('>> abi', abi.data)
        dispatch({
          type: SET_CONTRACT_ABI,
          payload: abi.data,
        })
      } catch (error) {}
    })()
  }, [])

  const handleSaveDraft = async () => {
    if (documentDetail.status === 'NEW' || documentDetail.status === 'ON_DRAFT') {
      try {
        const payload = {
          signatures: signatures,
          signers: signers2,
        }
        console.log('>> payload', payload)
        await baseApi.post('/document/save-draft', {
          id: documentId,
          data: payload,
        })
        dispatch({
          type: ENABLE_SAVE_DRAFT,
          payload: true,
        })
        Toast({ message: 'Documnent Saved !', type: 'success' })
      } catch (error) {}
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [openWalletModal1, setOpenWalletModal1] = useState(false)

  const connected = authState.isConnected

  const handleClick2 = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      if (!connected) {
        return setOpenWalletModal(true)
      }

      if (connected) {
        const _event = event.currentTarget
        setAnchorEl2(_event)
      }
    } catch (error) {
      console.log('>>>>> error', error)
    }
  }

  const handleOpen = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClose2 = () => {
    setAnchorEl2(null)
  }

  const handleSignout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    window.location.href = '/login'
  }

  const downloadDocument = async (id, name) => {
    if (isDownloading) return
    let url = process.env.NX_SERVER_URL + '/file/save/' + id
    let fileName = `${name}.pdf`
    setDownloading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((response) => {
        response.blob().then((blob) => {
          FileSaver.saveAs(blob, fileName)
          setDownloading(false)
        })
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const DownloadDocumentButton = (
    <>
      {documentDetail?.scan_status === 'infected' && (
        <AlertDialog
          title="Are you sure you want to download this file, it may contain virus?"
          content=""
          callBack={async () => {
            await downloadDocument(documentDetail.id, documentDetail.name)
          }}
        >
          <MButton
            sx={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: '0px 12px 12px 0px',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--gray3)',
              borderLeftWidth: '0px',
              padding: '7px 12px',
              cursor: isDownloading ? 'not-allowed' : 'pointer',
            }}
          >
            {!isDownloading && (
              <FileDownloadOutlinedIcon
                sx={{
                  fontSize: '31px',
                  color: 'var(--dark)',
                }}
              />
            )}
            {isDownloading && (
              <CircularProgress
                size={31}
                sx={{
                  color: 'var(--blue3)',
                }}
              />
            )}
          </MButton>
        </AlertDialog>
      )}
      {documentDetail?.scan_status !== 'infected' && (
        <MButton
          onClick={async () => {
            await downloadDocument(documentDetail.id, documentDetail.name)
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '0px 12px 12px 0px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--gray3)',
            borderLeftWidth: '0px',
            padding: '5px 12px',
            cursor: isDownloading ? 'not-allowed' : 'pointer',
          }}
        >
          {!isDownloading && (
            <FileDownloadOutlinedIcon
              sx={{
                fontSize: '31px',
                color: 'var(--dark)',
              }}
            />
          )}
          {isDownloading && (
            <CircularProgress
              size={31}
              sx={{
                color: 'var(--blue3)',
              }}
            />
          )}
        </MButton>
      )}
    </>
  )

  const DocumentStatus = {
    ON_DRAFT: (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <MButton
          onClick={handleSaveDraft}
          sx={{
            padding: '9px 12px',
            borderRadius: '12px 0px 0px 12px',
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
              fontSize: '24px',
              color: isSaveDraftEnabled ? 'var(--green12)' : 'var(--dark)',
            }}
          />
          <Typography
            sx={{
              fontSize: '1.8rem',
              color: isSaveDraftEnabled ? 'var(--green12)' : 'var(--dark)',
              letterSpacing: '1px',
              fontWeight: 'bold',
            }}
          >
            Save Draft
          </Typography>
        </MButton>
        {DownloadDocumentButton}
      </Box>
    ),
    NEW: (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <MButton
          onClick={handleSaveDraft}
          sx={{
            padding: '9px 12px',
            borderRadius: '12px 0px 0px 12px',
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
              fontSize: '24px',
              color: isSaveDraftEnabled ? 'var(--green12)' : 'var(--dark)',
            }}
          />
          <Typography
            sx={{
              fontSize: '1.8rem',
              color: isSaveDraftEnabled ? 'var(--green12)' : 'var(--dark)',
              letterSpacing: '1px',
              fontWeight: 'bold',
            }}
          >
            Save Draft
          </Typography>
        </MButton>
        {DownloadDocumentButton}
      </Box>
    ),
    READY_TO_SIGN: (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <MButton
          onClick={handleSaveDraft}
          sx={{
            padding: '8px 12px',
            borderRadius: '12px 0px 0px 12px',
            backgroundColor: 'var(--green14)',
            border: '1px solid var(--green12)',
            display: 'flex',
            gap: '12px',
            '&:hover': {
              opacity: '1 !important',
            },
          }}
        >
          <CheckCircleTwoToneIcon
            sx={{
              fontSize: '28px',
              color: 'var( --green12)',
            }}
          />
          <Typography
            sx={{
              fontSize: '1.9rem',
              color: 'var(--green12)',
              letterSpacing: '1px',
              fontWeight: 'bold',
            }}
          >
            Ready to Sign
          </Typography>
        </MButton>
        {DownloadDocumentButton}
      </Box>
    ),
    SIGNED: (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <MButton
          onClick={handleSaveDraft}
          sx={{
            padding: '10px 12px',
            borderRadius: '12px 0px 0px 12px',
            backgroundColor: 'var(--green14)',
            border: '1px solid var(--green12)',
            display: 'flex',
            gap: '12px',
            '&:hover': {
              opacity: '1 !important',
            },
          }}
        >
          <CheckCircleTwoToneIcon
            sx={{
              fontSize: '28px',
              color: 'var( --green12)',
            }}
          />
          <Typography
            sx={{
              fontSize: '1.9rem',
              color: 'var(--green12)',
              letterSpacing: '1px',
              fontWeight: 'bold',
            }}
          >
            Completed
          </Typography>
        </MButton>
        {DownloadDocumentButton}
      </Box>
    ),
    COMPLETED: (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <MButton
          onClick={handleSaveDraft}
          sx={{
            padding: '8px 12px',
            borderRadius: '12px 0px 0px 12px',
            backgroundColor: 'var(--green14)',
            border: '1px solid var(--green12)',
            display: 'flex',
            gap: '12px',
            '&:hover': {
              opacity: '1 !important',
            },
          }}
        >
          <CheckCircleTwoToneIcon
            sx={{
              fontSize: '28px',
              color: 'var( --green12)',
            }}
          />
          <Typography
            sx={{
              fontSize: '1.9rem',
              color: 'var(--green12)',
              letterSpacing: '1px',
              fontWeight: 'bold',
            }}
          >
            Completed
          </Typography>
        </MButton>
        {DownloadDocumentButton}
      </Box>
    ),
  }

  const isRevoked = certDetail?.status === 'REVOKED'
  const isIssued = certDetail?.status === 'ISSUED'

  console.log('certDetail',certDetail)

  const Certificate = {
    TEMPLATE: (
      <Box sx={{ display: 'flex' }}>
        <MButton
          onClick={() => {
            if (certDetail.tx_hash) return
            setOpenWalletModal1(true)
          }}
          sx={{
            padding: '10px 12px',
            borderRadius: '12px 0px 0px 12px',
            backgroundColor: Object.keys(certDetail).length === 0 ? 'var(--white)' : certDetail.tx_hash ? 'var(--green14)' : 'var(--orange07)',
            display: 'flex',
            gap: '12px',
            '&:hover': {
              opacity: '1 !important',
            },
            border: '1px solid var(--gray3)',
            textAlign: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          <MTooltip
            letterSpacing="1px"
            background="var(--dark3)"
            color="white"
            title={
              <>
                {certDetail.tx_hash && <Typography sx={{ fontSize: '1.5rem', color: 'var(--white)' }}>TX Hash: {certDetail.tx_hash}</Typography>}
                {!certDetail.tx_hash && (
                  <Typography sx={{ fontSize: '1.5rem', color: 'var(--white)' }}>Upload the certificate to Blockchain Network</Typography>
                )}
              </>
            }
          >
            <Box>
              {Object.keys(certDetail).length === 0 && <CircularProgress />}
              {certDetail.tx_hash && Object.keys(certDetail).length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <CheckCircleTwoToneIcon sx={{ fontSize: '28px', color: 'var( --green12)' }} />
                  <Typography
                    sx={{
                      fontSize: '1.9rem',
                      color: 'var(--green12)',
                      letterSpacing: '1px',
                      fontWeight: 'bold',
                    }}
                  >
                    Signed
                  </Typography>
                </Box>
              )}
              {!certDetail.tx_hash && Object.keys(certDetail).length > 0 && (
                <Typography
                  sx={{
                    fontSize: '1.9rem',
                    color: 'var(--white)',
                    letterSpacing: '1px',
                    fontWeight: 'bold',
                  }}
                >
                  Sign Template
                </Typography>
              )}
            </Box>
          </MTooltip>
        </MButton>
        <MButton
          onClick={async () => {
            await downloadDocument(certDetail?.id, certDetail?.name)
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '0px 12px 12px 0px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--gray3)',
            borderLeftWidth: '0px',
            padding: '5px 12px',
            cursor: isDownloading ? 'not-allowed' : 'pointer',
          }}
        >
          {!isDownloading && <FileDownloadOutlinedIcon sx={{ fontSize: '31px', color: 'var(--dark)' }} />}
          {isDownloading && <CircularProgress size={31} sx={{ color: 'var(--blue3)' }} />}
        </MButton>
      </Box>
    ),
    CERTIFICANT: (
      <Box sx={{ display: 'flex' }}>
        <MButton
          sx={{
            padding: '10px 12px',
            borderRadius: '12px 0px 0px 12px',
            backgroundColor: isRevoked ? 'var(--red1111)' : 'var(--green14)',
            border: '1px solid var(--gray3)',
            display: 'flex',
            gap: '12px',
            '&:hover': {
              opacity: '1 !important',
            },
          }}
        >
          <CheckCircleTwoToneIcon sx={{ fontSize: '28px', color: isRevoked ? 'var(--red1)' : 'var( --green12)' }} />
          <Typography
            sx={{
              fontSize: '1.9rem',
              color: isRevoked ? 'var(--red1)' : 'var(--green12)',
              letterSpacing: '1px',
              fontWeight: 'bold',
            }}
          >
            {isIssued && 'Issued'}
            {isRevoked && 'Revoked'}
          </Typography>
        </MButton>
        <MButton
          onClick={async () => {
            await downloadDocument(certDetail?.id, certDetail?.certificate?.name)
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '0px 12px 12px 0px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--gray3)',
            borderLeftWidth: '0px',
            padding: '5px 12px',
            cursor: isDownloading ? 'not-allowed' : 'pointer',
          }}
        >
          {!isDownloading && <FileDownloadOutlinedIcon sx={{ fontSize: '31px', color: 'var(--dark)' }} />}
          {isDownloading && <CircularProgress size={31} sx={{ color: 'var(--blue3)' }} />}
        </MButton>
      </Box>
    ),
  }

  const Profile = {
    profile: (
      <Box
        key={1}
        onClick={() => {
          navigate('/account-setting')
        }}
        sx={{
          padding: '10px 16px',
          display: 'flex',
          borderRadius: '12px',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          ':hover': {
            backgroundColor: 'var(--sx1)',
          },
          transition: 'background 0.3s ease 0s',
        }}
      >
        <PersonOutlinedIcon
          sx={{
            fontSize: '28px',
            color: 'var(--dark)',
            fontWeight: 'bold',
          }}
        />
        <Typography
          sx={{
            fontSize: '1.65rem',
            color: 'var(--dark)',
            fontWeight: 'bold',
          }}
        >
          Profile
        </Typography>
      </Box>
    ),
    setting: (
      <Box
        key={2}
        sx={{
          padding: '10px 16px',
          display: 'flex',
          borderRadius: '12px',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          ':hover': {
            backgroundColor: 'var(--sx1)',
          },
          transition: 'background 0.3s ease 0s',
        }}
      >
        <SettingsOutlinedIcon
          sx={{
            fontSize: '28px',
            color: 'var(--dark)',
            fontWeight: 'bold',
          }}
        />
        <Typography
          sx={{
            fontSize: '1.65rem',
            color: 'var(--dark)',
            fontWeight: 'bold',
          }}
        >
          Settings
        </Typography>
      </Box>
    ),
    logout: (
      <Box
        key={3}
        onClick={handleSignout}
        sx={{
          padding: '10px 16px',
          display: 'flex',
          borderRadius: '12px',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          ':hover': {
            backgroundColor: 'var(--sx1)',
          },
          transition: 'background 0.3s ease 0s',
        }}
      >
        <LogoutOutlinedIcon
          sx={{
            fontSize: '28px',
            color: 'var(--dark)',
            fontWeight: 'bold',
          }}
        />
        <Typography
          sx={{
            fontSize: '1.65rem',
            color: 'var(--dark)',
            fontWeight: 'bold',
          }}
        >
          Sign out
        </Typography>
      </Box>
    ),
  }

  const SignTemplateByWallet = async () => {
    if (certDetail.tx_hash) {
      return
    }
    try {
      if (window.ethereum && authState.isConnected) {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any)
        const signer = provider.getSigner()
        const contractWithSigner = new ethers.Contract(certABI.address, certABI.abi, signer)
        let sha = certDetail.buffer.data
        const tx = await contractWithSigner.createCert(sha)
        const recepeit = await tx.wait()

        console.log('>>>>> recepeit', recepeit)

        if (recepeit.events[0] && recepeit.events[0].args && recepeit.events[0].args[1])
          await baseApi.post('/v1/contract/cert/tx', {
            type: 'CERT_TEMPLATE',
            id: certDetail.id,
            tx_hash: recepeit.transactionHash,
            creator: recepeit.events[0].args[1],
          })
        await new Promise((resolve) => setTimeout(resolve, 2000))
        window.location.reload()
      }
    } catch (error) {
      console.log('>>>>> error', error)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '8.75rem', justifyContent: 'flex-end', borderBottom: '1px solid var(--border-gray)' }}>
      {/* Avatar */}
      <DefaultHeader title={dashBoardObject?.name} to={dashBoardObject?.to} />

      <Box sx={{ width: 'fit-content', paddingRight: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/*

             __________________________________________________Download Certificate_______________________________________________ 
         
         */}
        {localtion === '/document/sign' && DocumentStatus[`${documentDetail.status}`]}

        {localtion === '/certificate/sign' && type === 'template' && Certificate['TEMPLATE']}

        {localtion === '/certificate/sign' && type !== 'template' && Certificate['CERTIFICANT']}

        {/* 
       
            _______________________________________________ Connect Wallet _____________________________________________________ 
        
        */}

        {authState.data?.is_registered && (
          <Box sx={{ display: 'flex', marginRight: '35px' }}>
            <MButton
              // disabled
              onClick={handleClick2}
              sx={{
                width: 'max-content',
                borderRadius: '12px 0px 0px 12px',
                backgroundColor: 'var(--white)',
                border: '1px solid var(--gray3)',
                padding: connected ? '10px 35px' : '8px 16px',
                display: 'flex',
                gap: connected ? '10px' : '14px',
              }}
            >
              {connected && (
                <>
                  <img src={MetamaskIcon} alt="metamask" width="26px" height="26px" />
                  <Typography
                    sx={{
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      letterSpacing: '2px',
                      color: 'black',
                    }}
                  >
                    METAMASK
                  </Typography>
                </>
              )}
              {!connected && (
                <>
                  <WalletIcon sx={{ fontSize: '29px', color: 'var(--dark)' }} />

                  <Typography sx={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--dark)' }}>Connect Wallet</Typography>
                </>
              )}
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
                padding: '5px 12px',
              }}
            >
              <AccountCircleOutlinedIcon
                sx={{
                  fontSize: '31px',
                  color: 'var(--dark)',
                }}
              />
            </MButton>

            {/* ---------------------------------------------- wallet ------------------------------------------ */}
            <Menu
              anchorEl={anchorEl2}
              id="account-menu"
              open={open2}
              onClose={handleClose2}
              onClick={handleClose2}
              sx={{
                '& .MuiPaper-root': {
                  minWidth: '350px',
                  minHeight: '200px',
                  marginTop: '10px',
                  boxShadow: 'var(--shadow99)',
                  borderRadius: '12px',
                  padding: '20px 0px',
                },
              }}
              transformOrigin={{ horizontal: 'center', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', padding: '0px 20px', gap: '10px' }}>
                {Object.keys(Walletslist).map((key) => {
                  return Walletslist[key]
                })}
              </Box>
            </Menu>

            {/* ----------------- login ---------------- */}
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              sx={{
                '& .MuiPaper-root': {
                  marginTop: '10px',
                  boxShadow: 'var(--shadow99)',
                  borderRadius: '12px',
                  width: '275px',
                  height: 'fit-content',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', padding: '15px 9px', gap: '14px' }}>
                {Object.keys(Profile).map((key) => {
                  return Profile[key]
                })}
              </Box>
            </Menu>
          </Box>
        )}
        {!authState.data?.is_registered && (
          <MButton
            onClick={() => {
              window.location.href = '/login'
            }}
            sx={{
              display: 'flex',
              marginLeft: '10px',
              marginRight: '30px',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: '12px 12px 12px 12px',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--gray3)',
              padding: '8px 15px',
              gap: '15px',
            }}
          >
            <AccountCircleOutlinedIcon
              sx={{
                fontSize: '31px',
                color: 'var(--dark)',
              }}
            />
            <Typography
              sx={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: 'var(--dark)',
              }}
            >
              Get Started
            </Typography>
          </MButton>
        )}
      </Box>

      {/* 
      
        ______________________________________________________ Dialog 2 ______________________________________________________ 
          
      */}
      <Dialog
        onClose={() => {
          setOpenWalletModal1(false)
        }}
        open={openWalletModal1}
        /* prettier-ignore */
        sx={{ '& .MuiDialog-paper': { width: 650, height: 436, position: 'absolute', top: '200px', maxWidth: 'none', maxHeight: 'none', borderRadius: '15px', boxShadow: 'none', }, '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }}}
      >
        <Typography sx={{ fontSize: '2.4rem', color: 'var(--dark2)', fontWeight: 'bold', textAlign: 'center', margin: '10px 20px' }}>
          Sign Certificate Template
        </Typography>
        <Box sx={{ marginTop: '20px', marginLeft: '20px' }}>
          <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark2)', fontWeight: 'bold' }}>File name</Typography>
          <Typography sx={{ fontSize: '1.4rem' }}>{certDetail.name}</Typography>
        </Box>
        <Box sx={{ marginTop: '20px', marginLeft: '20px' }}>
          <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark2)', fontWeight: 'bold' }}>File hash</Typography>
          <Typography sx={{ fontSize: '1.4rem' }}>{certDetail.hash256}</Typography>
        </Box>

        <MButton
          onClick={SignTemplateByWallet}
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translate(-50%, 0)',
            backgroundColor: 'var(--blue3)',
            width: '90%',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: 'var(--white)',
              letterSpacing: '1px',
            }}
          >
            Confirm & Sign
          </Typography>
        </MButton>
      </Dialog>

      {/*  
          
       ______________________________________________________ Dialog 1 ______________________________________________________ 
      
      */}
      <Dialog
        onClose={() => {
          setOpenWalletModal(false)
        }}
        open={openWalletModal}
        /* prettier-ignore */
        sx={{ '& .MuiDialog-paper': { width: 550, height: 556, position: 'absolute', top: '100px', maxWidth: 'none', maxHeight: 'none', borderRadius: '15px', boxShadow: 'none', }, '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }, }}
      >
        <DialogContent sx={{ overflow: 'hidden' }}>
          <Typography sx={{ fontSize: '2.4rem', color: 'var(--dark2)', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
            Connect your wallet
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <span style={{ fontSize: '1.6rem', color: 'var(--dark2)', marginTop: '10px' }}>
              If you don't have a wallet, you can follow the instructions to install one.
            </span>
            {/* prettier-ignore */}
            <a href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.6rem', color: 'var(--blue3)', fontWeight: 'bold', textDecoration: 'none', }} >
              Learn more
            </a>
          </Box>
          <Divider sx={{ marginTop: '20px', marginBottom: '10px' }} />
          <Box sx={{ marginTop: '10px' }}>
            <Box
              onClick={async () => {
                try {
                  if (window.ethereum) {
                    let request = await window.ethereum.request({ method: 'eth_requestAccounts' })
                    dispatch({
                      type: SET_WALLET_ADDRESS,
                      payload: {
                        provider: 'metamask',
                        connected: true,
                        address: request,
                      },
                    })

                    await new Promise((resolve) => {
                      setOpenWalletModal(false)
                      resolve(true)
                    })
                  }
                } catch (error: any) {
                  console.log('>>>>> error', error)
                  if (error.code === -32002) {
                    console.log('Already prompted')
                  }
                }
              }}
              key={1}
              // prettier-ignore
              sx={{ padding: '10px 24px', display: 'flex', borderRadius: '12px', alignItems: 'center', gap: '14px', cursor: 'pointer', marginBottom: '10px', ':hover': { backgroundColor: 'var(--sx1)', }, }}
            >
              <img src={MetamaskIcon} alt="metamask" width="29px" height="29px" />
              <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark)', fontWeight: 'bold' }}>MetaMask</Typography>
            </Box>

            {/* ____________________________________ Coin Base ________________________________ */}
            {/* prettier-ignore */}
            <Box key={2} sx={{ padding: '10px 24px', display: 'flex', borderRadius: '12px', alignItems: 'center', gap: '14px', cursor: 'pointer', marginBottom: '10px', ':hover': { backgroundColor: 'var(--sx1)', }, }}
            >
              <img src={Coinbase} alt="metamask" width="29px" height="29px" />
              <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark)', fontWeight: 'bold', letterSpacing: '1px' }}>Coinbase Wallet</Typography>
            </Box>
            {/* ______________________________________Wallet Connect _________________________ */}
            <Box
              key={3}
              sx={{
                padding: '1px 16px',
                display: 'flex',
                borderRadius: '12px',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                marginBottom: '10px',
                ':hover': { backgroundColor: 'var(--sx1)' },
              }}
            >
              <img src={Walletconnect} alt="metamask" width="48px" height="48px" />
              <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark)', fontWeight: 'bold', letterSpacing: '1px' }}>WalletConnect</Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

const Walletslist = {
  connected: (
    <Box
      key={1}
      sx={{
        padding: '10px 24px',
        display: 'flex',
        borderRadius: '12px',
        alignItems: 'center',
        backgroundColor: 'var(--green14)',
        gap: '12px',
      }}
    >
      <img src={MetamaskIcon} alt="metamask" width="29px" height="29px" />
      <Typography sx={{ fontSize: '1.4rem', color: 'var(--dark)' }}>
        You're connected to <b>MetaMask</b>
      </Typography>
    </Box>
  ),
  coinbase: (
    <Box
      key={2}
      sx={{
        padding: '10px 24px',
        display: 'flex',
        borderRadius: '12px',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid var(--gray3)',
        cursor: 'not-allowed',
        ':hover': {
          opacity: '0.8 !important',
        },
      }}
    >
      <img src={Coinbase} alt="metamask" width="29px" height="29px" />
      <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark)', fontWeight: 'bold', letterSpacing: '1px' }}>Coinbase Wallet</Typography>
    </Box>
  ),
  walletconnect: (
    <Box
      key={3}
      sx={{
        padding: '1px 16px',
        display: 'flex',
        borderRadius: '12px',
        alignItems: 'center',
        gap: '3px',
        border: '1px solid var(--gray3)',
        cursor: 'not-allowed',
        ':hover': {
          opacity: '0.8 !important',
        },
      }}
    >
      <img src={Walletconnect} alt="metamask" width="48px" height="48px" />
      <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark)', fontWeight: 'bold', letterSpacing: '1px' }}>WalletConnect</Typography>
    </Box>
  ),
}
