import { selectors } from '@esign-web/redux/document'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { Box, Divider, Typography } from '@mui/material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import moment from 'moment'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import MButton from 'src/app/components/Button'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

import './styles.scss'

export const RenderLeftSideComplete = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')
  const documentDetail = useSelector(selectors.getDocumentDetail)
  const signers2 = useSelector(selectors.getSigners2)

  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const handleSignByWallet = () => {}
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
          <Typography sx={{ fontSize: '1.7rem', fontWeight: 'bold', color: 'var(--dark2)' }}>Status</Typography>
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
            fontSize: '1.7rem',
            fontWeight: 'bold',
            color: 'var(--dark2)',
          }}
        >
          Signees
        </Typography>
        <Box
          sx={{
            height: 'calc(100vh - 43rem)',
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'var(--color-gray1)', borderRadius: '10px', border: '1px solid var(--white)' },
          }}
        >
          {Object.keys(signers2).map((key, index) => {
            const signer = signers2[key]

            return (
              <Box
                sx={{
                  marginBottom: '10px',
                  width: '100%',
                  height: '100px',
                  display: 'flex',
                }}
              >
                <Box
                  sx={{
                    alignSelf: 'center',
                    marginBottom: '10px',
                    // padding: '10px 25px 10px 6px',
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
                        color: 'var(--green3)',
                        marginTop: '5px',
                        marginLeft: '5px',
                        marginRight: '15px',
                      }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    flexDirection: 'column',
                    display: 'flex',
                    alignSelf: 'center',
                    gap: '2px',
                  }}
                >
                  <Typography sx={{ fontSize: '1.6rem' }}>
                    {signer?.firstName} {signer?.lastName}
                  </Typography>
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
                    {signer.email}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    alignSelf: 'center',
                    marginBottom: '10px',
                    alignItems: 'center',
                  }}
                >
                  {signer['is_signed'] && (
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
                </Box>
              </Box>
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

      <Box sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer', padding: '9px' }}>
        <Divider sx={{ marginBottom: '13px' }} />
        <MButton
          onClick={handleSignByWallet}
          sx={{
            display: 'flex',
            gap: '5px',
            width: '100%',
            backgroundColor: isDisabled ? '#DDDDDD' : 'var(--blue3)',
            borderRadius: '5px',
            transition: 'all 0.4s ease-in-out',
          }}
          disabled={isDisabled}
        >
          <Typography
            sx={{
              color: 'var(--white)',
              fontWeight: 'bold',
              letterSpacing: '0.1rem',
              fontSize: '1.5rem',
            }}
          >
            Sign by
          </Typography>
          <Typography
            sx={{
              color: 'var(--white)',
              fontWeight: 'bold',
              letterSpacing: '0.1rem',
              fontSize: '1.5rem',
            }}
          >
            My Wallet
          </Typography>
        </MButton>
      </Box>
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
