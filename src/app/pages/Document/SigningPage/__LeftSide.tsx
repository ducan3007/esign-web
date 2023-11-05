import { selectors as authSelectors } from '@esign-web/redux/auth'
import { selectors } from '@esign-web/redux/document'
import { selectors as walletSelectors } from '@esign-web/redux/wallet'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { Box, Divider, Typography } from '@mui/material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import axios from 'axios'
import { ethers } from 'ethers'
import moment from 'moment'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import MButton from 'src/app/components/Button'
import { MTooltip } from 'src/app/components/Tooltip'
import MetamaskIcon from 'src/assets/metamask.svg'
import './styles.scss'
import { Toast, baseApi } from '@esign-web/libs/utils'
import { nanoid } from 'nanoid'

export const RenderLeftSideComplete = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')
  const docABI = useSelector(walletSelectors.getDocumentABI)
  const documentDetail = useSelector(selectors.getDocumentDetail)
  const signStatus = useSelector(selectors.getSignStatus)
  const signers2 = useSelector(selectors.getSigners2)
  const authState = useSelector(authSelectors.getAuthState)

  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleSignByWallet = async () => {
    try {
      let res = await axios.get(process.env.NX_SERVER_URL + '/v1/contract/sha256/' + documentId)
      if (window.ethereum && authState.isConnected && res.data.data && authState.data?.email) {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any)
        const signer = provider.getSigner()
        const contractWithSigner = new ethers.Contract(docABI.address, docABI.abi, signer)
        const tx = await contractWithSigner.signDocument(res.data.data, authState.data?.email)
        const recepeit = await tx.wait()
        await new Promise((resolve) => setTimeout(resolve, 2000))
        window.location.reload()
      }
    } catch (error: any) {
      if (error.data && error.data.data && error.data.data.reason) {
        if (error.data.data.reason === 'D404') {
          await baseApi.get('document/sign2/' + documentId)
          Toast({ message: 'Please wait and try again!', type: 'error' })
        }
        if (error.data.data.reason === 'D406') {
          Toast({ message: 'Invalid signing address!', type: 'error' })
        }
      }

      console.log('error', error)
    }
  }

  console.log('documentDetail', documentDetail)

  const isDisabled = false

  const DetailTab = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '9px' }}>
          <Typography
            sx={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: 'var(--orange)',
            }}
          >
            Status
          </Typography>
          {documentDetail?.status !== 'COMPLETED' && documentDetail?.status !== 'SIGNED' && (
            <Typography
              sx={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--yellow111)',
                padding: '5px 10px',
                borderRadius: '5px',
                backgroundColor: 'var(--yellow8)',
              }}
            >
              Out for signature
            </Typography>
          )}

          {(documentDetail?.status === 'COMPLETED' || documentDetail?.status === 'SIGNED') && (
            <Typography
              sx={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--green16)',
                padding: '5px 10px',
                borderRadius: '5px',
                backgroundColor: 'var(--green15)',
              }}
            >
              Completed
            </Typography>
          )}
        </Box>
        <Box sx={{ padding: '9px 9px 9px 12px' }}>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography sx={{ fontSize: '1.4rem', color: 'var(--dark5)', fontWeight: 'bold' }}>Created on:</Typography>
            <Typography sx={{ fontSize: '1.4rem', color: 'var(--blue3)', fontWeight: 'bold' }}>
              {moment(documentDetail?.createdAt).format('ll')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: '10px', marginTop: '19px' }}>
            <Typography sx={{ fontSize: '1.4rem', color: 'var(--dark5)', fontWeight: 'bold' }}>Original # :</Typography>
            <Typography
              sx={{
                fontSize: '1.4rem',
                color: 'var(--blue3)',
                textOverflow: 'ellipsis',
                wordWrap: 'break-word',
                whiteSpace: 'nowrap',
                width: '282px',
                fontWeight: 'bold',
              }}
            >
              {documentDetail?.hash256}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: '10px', marginTop: '19px' }}>
            <Typography sx={{ fontSize: '1.4rem', color: 'var(--dark5)', fontWeight: 'bold' }}>Completed # :</Typography>
            <Typography
              sx={{
                fontSize: '1.4rem',
                color: 'var(--blue3)',
                textOverflow: 'ellipsis',
                wordWrap: 'break-word',
                whiteSpace: 'nowrap',
                width: '260px',
                fontWeight: 'bold',
              }}
            >
              {documentDetail?.final_hash256}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: '25px 5px 0px 5px',
          height: '100%',
        }}
      >
        <Typography
          sx={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: 'var(--orange2)',
          }}
        >
          Signees
        </Typography>
        <Box
          sx={{
            height: 'calc(100vh - 45rem)',
            marginTop: '10px',
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'var(--color-gray1)', borderRadius: '10px', border: '1px solid var(--white)' },
          }}
        >
          {documentDetail.document_signer?.map((signer, index) => {
            const isMeandSigned = signer['is_signed'] && signer.user.email === authState.data?.email

            if (signer.user.email !== authState.data?.email) {
              return
            }

            return (
              <MTooltip
                key={nanoid()}
                title={
                  <>
                    {signer.signed_by_wallet_status === 'success' && (
                      <Box>
                        <Typography sx={{ fontSize: '1.4rem', color: 'var(--white)' }}>Tx: {signer.tx_hash}</Typography>
                        <Typography sx={{ fontSize: '1.4rem', color: 'var(--white)' }}>
                          Timestamp: {`${moment(signer.tx_timestamp).format('L')} - ${moment(signer.tx_timestamp).format('LTS')}`}
                        </Typography>
                      </Box>
                    )}
                    {signer.signed_by_wallet_status !== 'success' && signer.is_signed && (
                      <Box>
                        <Typography sx={{ fontSize: '1.4rem', color: 'var(--white)' }}>
                          Timestamp: {`${moment(signer.signedAt).format('L')} - ${moment(signer.signedAt).format('LTS')}`}
                        </Typography>
                      </Box>
                    )}
                    {signer.signed_by_wallet_status !== 'success' && !signer.is_signed && (
                      <Box>
                        <Typography sx={{ fontSize: '1.4rem', color: 'var(--white)' }}>Not yet signed</Typography>
                      </Box>
                    )}
                  </>
                }
                fontWeight="500"
                letterSpacing="1px"
                background="var(--dark3)"
                placement="right"
                color="white"
              >
                <Box
                  sx={{
                    marginBottom: '10px',
                    width: '100%',
                    height: '100px',
                    display: 'flex',
                    backgroundColor: isMeandSigned ? '#dbefe3' : 'white',
                    borderRadius: '12px',
                    position: 'relative',
                  }}
                >
                  <Box sx={{ alignSelf: 'center', marginBottom: '10px' }}>
                    {!signer['is_signed'] && (
                      <Box
                        sx={{
                          borderRadius: '50%',
                          width: '15px',
                          height: '15px',
                          backgroundColor: 'var(--gray999)',
                          marginLeft: '5px',
                          marginRight: '15px',
                        }}
                      ></Box>
                    )}

                    {signer['is_signed'] && (
                      <CheckCircleRoundedIcon
                        sx={{
                          fontSize: '2rem',
                          color: signer.signed_by_wallet_status === 'success' ? 'var(--orange)' : 'var(--green3)',
                          marginTop: '5px',
                          marginLeft: '5px',
                          marginRight: '15px',
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ flex: 1, flexDirection: 'column', display: 'flex', alignSelf: 'center', gap: '2px' }}>
                    <Box sx={{ display: 'flex', gap: '5px' }}>
                      <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark3)', fontWeight: 'bold' }}>
                        {signer?.user?.first_name} {signer?.user?.last_name}
                      </Typography>
                      {signer?.user?.email === authState.data?.email && (
                        <Typography sx={{ fontSize: '1.6rem', color: 'var(--orange)', fontWeight: 'bold' }}>(Me)</Typography>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        textOverflow: 'ellipsis',
                        opacity: 0.8,
                        wordWrap: 'break-word',
                        whiteSpace: 'nowrap',
                        width: '250px',
                      }}
                    >
                      {signer?.user?.email}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      alignSelf: 'center',
                      marginBottom: '10px',
                      alignItems: 'center',
                      position: 'absolute',
                      right: '0px',
                      zIndex: 10,
                    }}
                  >
                    {signer['is_signed'] && signer.signed_by_wallet_status !== 'success' && (
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          color: 'var(--green16)',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          backgroundColor: 'var(--green15)',
                          marginRight: '15px',
                        }}
                      >
                        Completed
                      </Typography>
                    )}

                    {!signer['is_signed'] && (
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          color: 'var(--yellow111)',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          backgroundColor: 'var(--yellow8)',
                        }}
                      >
                        Out for signature
                      </Typography>
                    )}

                    {signer.signed_by_wallet_status === 'success' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 20,
                          bottom: -30,
                          display: 'flex',
                          flexDirection: 'column',
                          alignContent: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                          gap: '3px',
                        }}
                      >
                        <img
                          src={MetamaskIcon}
                          style={{
                            opacity: 0.66,
                          }}
                          alt="metamask"
                          width="35px"
                          height="35px"
                        />
                        <Typography
                          sx={{
                            fontSize: '10px',
                            padding: '1px 4px',
                            borderRadius: '2px',
                            fontWeight: 'bold',
                            color: 'var(--green16)',
                            backgroundColor: 'var(--green15)',
                            opacity: 1,
                          }}
                        >
                          Success
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </MTooltip>
            )
          })}
          {documentDetail.document_signer?.map((signer, index) => {
            const isMeandSigned = signer['is_signed'] && signer.user.email === authState.data?.email

            if (signer.user.email === authState.data?.email) {
              return
            }

            return (
              <MTooltip
                key={nanoid()}
                title={
                  <>
                    {signer.signed_by_wallet_status === 'success' && (
                      <Box>
                        <Typography sx={{ fontSize: '1.2rem', color: 'var(--white)' }}>Tx: {signer.tx_hash}</Typography>
                        <Typography sx={{ fontSize: '1.2rem', color: 'var(--white)' }}>
                          Timestamp: {`${moment(signer.tx_timestamp).format('L')} - ${moment(signer.tx_timestamp).format('LTS')}`}
                        </Typography>
                      </Box>
                    )}
                    {signer.signed_by_wallet_status !== 'success' && signer.is_signed && (
                      <Box>
                        <Typography sx={{ fontSize: '1.2rem', color: 'var(--white)' }}>
                          Timestamp: {`${moment(signer.signedAt).format('L')} - ${moment(signer.signedAt).format('LTS')}`}
                        </Typography>
                      </Box>
                    )}
                    {signer.signed_by_wallet_status !== 'success' && !signer.is_signed && (
                      <Box>
                        <Typography sx={{ fontSize: '1.2rem', color: 'var(--white)' }}>Not yet signed</Typography>
                      </Box>
                    )}
                  </>
                }
                fontWeight="500"
                letterSpacing="1px"
                background="var(--dark3)"
                placement="right"
                color="white"
              >
                <Box
                  key={index}
                  sx={{
                    marginBottom: '10px',
                    width: '100%',
                    height: '100px',
                    display: 'flex',
                    backgroundColor: isMeandSigned ? '#dbefe3' : 'white',
                    borderRadius: '12px',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      alignSelf: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    {!signer['is_signed'] && (
                      <Box
                        sx={{
                          borderRadius: '50%',
                          width: '15px',
                          height: '15px',
                          backgroundColor: 'var(--gray999)',
                          marginLeft: '5px',
                          marginRight: '15px',
                        }}
                      ></Box>
                    )}

                    {signer['is_signed'] && (
                      <CheckCircleRoundedIcon
                        sx={{
                          fontSize: '2rem',
                          color: signer.signed_by_wallet_status === 'success' ? 'var(--orange)' : 'var(--green3)',
                          marginTop: '5px',
                          marginLeft: '5px',
                          marginRight: '15px',
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ flex: 1, flexDirection: 'column', display: 'flex', alignSelf: 'center', gap: '2px' }}>
                    <Box sx={{ display: 'flex', gap: '5px' }}>
                      <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark3)', fontWeight: 'bold' }}>
                        {signer?.user?.first_name} {signer?.user?.last_name}
                      </Typography>
                      {signer?.user?.email === authState.data?.email && (
                        <Typography sx={{ fontSize: '1.6rem', color: 'var(--orange)', fontWeight: 'bold' }}>(Me)</Typography>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        textOverflow: 'ellipsis',
                        opacity: 0.8,
                        wordWrap: 'break-word',
                        whiteSpace: 'nowrap',
                        width: '250px',
                      }}
                    >
                      {signer?.user?.email}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      alignSelf: 'center',
                      marginBottom: '10px',
                      alignItems: 'center',
                      position: 'absolute',
                      right: '0px',
                      zIndex: 10,
                    }}
                  >
                    {signer['is_signed'] && signer.signed_by_wallet_status !== 'success' && (
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          color: 'var(--green16)',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          backgroundColor: 'var(--green15)',
                          marginRight: '15px',
                        }}
                      >
                        Completed
                      </Typography>
                    )}

                    {!signer['is_signed'] && (
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          color: 'var(--yellow111)',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          backgroundColor: 'var(--yellow8)',
                        }}
                      >
                        Out for signature
                      </Typography>
                    )}

                    {signer.signed_by_wallet_status === 'success' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 20,
                          bottom: -30,
                          display: 'flex',
                          flexDirection: 'column',
                          alignContent: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                          gap: '3px',
                        }}
                      >
                        <img
                          src={MetamaskIcon}
                          style={{
                            opacity: 0.66,
                          }}
                          alt="metamask"
                          width="35px"
                          height="35px"
                        />
                        <Typography
                          sx={{
                            fontSize: '10px',
                            padding: '1px 4px',
                            borderRadius: '2px',
                            fontWeight: 'bold',
                            color: 'var(--green16)',
                            backgroundColor: 'var(--green15)',
                            opacity: 1,
                          }}
                        >
                          Success
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </MTooltip>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
  const ActivityTab = (
    <>
      <Timeline>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Eat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Code</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>Sleep</TimelineContent>
        </TimelineItem>
      </Timeline>
    </>
  )

  return (
    <Box
      sx={{
        width: '400px',
        height: 'calc(100vh - 9rem)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: 'var(--blue3)', height: '3px', borderRadius: '5px' } }}
          sx={{
            '& .MuiTabs-flexContainer': {
              '& > :first-of-type': {
                borderRight: '1px solid var(--color-gray2)',
              },
            },
          }}
        >
          <Tab
            sx={{ width: '50%' }}
            label={<Typography sx={{ textTransform: 'none', fontSize: '1.57rem', fontWeight: 'bold', color: 'var(--blue3)' }}> Details </Typography>}
            id="tab-0"
          />
          <Tab
            sx={{ width: '50%' }}
            label={<Typography sx={{ textTransform: 'none', fontSize: '1.57rem', fontWeight: 'bold', color: 'var(--blue3)' }}> Activity </Typography>}
            id="tab-1"
          />
        </Tabs>
      </Box>

      <Box
        sx={{
          flex: 1,
        }}
      >
        {/* ------------------------ Detail ---------------------------- */}

        <CustomTabPanel value={value} index={0}>
          {DetailTab}
        </CustomTabPanel>

        {/* ----------------------------- Activity ---------------------------- */}

        <CustomTabPanel value={value} index={1}>
          <Box
            sx={{
              height: 'calc(80vh)',
              width: '100%',
              overflowY: 'auto',
            }}
          >
            {ActivityTab}
          </Box>
        </CustomTabPanel>
      </Box>

      {signStatus.signed_by_wallet_status !== 'success' && (
        <Box sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer', padding: '8px' }}>
          <MTooltip
            title={'Sign the Document By Metamask '}
            fontWeight="500"
            fontSize="1.4rem"
            letterSpacing="1px"
            background="var(--dark3)"
            color="white"
            placement="top"
          >
            <>
              <Divider sx={{ marginBottom: '10px' }} />
              <MButton
                onClick={handleSignByWallet}
                sx={{
                  display: 'flex',
                  gap: '15px',
                  width: '100%',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  marginTop: '1px',
                  backgroundColor: isDisabled ? '#DDDDDD' : 'var(--blue3)',
                  borderRadius: '5px',
                  transition: 'all 0.4s ease-in-out',
                }}
                disabled={isDisabled}
              >
                <Typography sx={{ color: 'var(--white)', fontWeight: 'bold', fontSize: '1.7rem', letterSpacing: '1px' }}>Sign by</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={MetamaskIcon} alt="metamask" width="29px" height="27px" />
                  <Typography sx={{ color: 'var(--white)', letterSpacing: '2px', fontWeight: 'bold', fontSize: '1.7rem' }}>METAMASK</Typography>
                </Box>
              </MButton>
            </>
          </MTooltip>
        </Box>
      )}
    </Box>
  )
}
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-${index}`}
      {...other}
      style={{
        height: '100%',
      }}
    >
      {value === index && children}
    </div>
  )
}
