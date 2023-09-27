import { baseApi, getRandomColor } from '@esign-web/libs/utils'
import { selectors as AuthSelector } from '@esign-web/redux/auth'
import { Box, Paper, Skeleton, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useState, useTransition } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IconPDFImage } from 'src/app/components/Icons/pdf'
import './styles.scss'
import { Columns1, TableRowExpandable } from './Column'
import { nanoid } from 'nanoid'
const DashboardPage = () => {
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()
  const [history, setHistory] = useState(Array(10).fill({}))
  const [failed, setFailed] = useState(true)
  const [show, setShow] = useState(true)
  const [log, setLog] = useState<any>([])

  const isSidebarOpen = useSelector(AuthSelector.getSidebarState)

  useEffect(() => {
    ;(async () => {
      try {
        let limit = 9
        let offset = 0
        const [docs, logs] = await Promise.all([
          baseApi.get('/document/recently-viewed'),
          baseApi.get('/user/log' + `?limit=${limit}&offset=${offset}`),
        ])

        if (docs.status === 200) {
          setHistory(docs.data)
          setFailed(false)
        }

        console.log('logs', logs)

        if (logs.status === 200 && logs.data) {
          let color = getRandomColor()
          let temp = logs.data.map((log: any) => {
            return {
              id: log.id,
              user: {
                user_name: log.user.first_name + ' ' + log.user.last_name,
                user_email: log.user.email,
                user_avatar: log.user.avatar_url,
                user_id: log.user.id,
              },
              meta_data: JSON.parse(log.meta_data || ''),
              date: moment(log.createdAt).format('ll'),
              time: moment(log.createdAt).format('LT'),
              action: log.action_type,
              description: log.action,
              color: color,
            }
          })

          console.log('temp', temp)

          setLog(temp)
        }
      } catch (error) {
        console.log('error', error)
      }
    })()
  }, [])

  useEffect(() => {
    startTransition(() => {
      if (isSidebarOpen) {
        setShow(false)
        setTimeout(() => {
          setShow(true)
        }, 300)
      } else {
        setShow(false)
        setTimeout(() => {
          setShow(true)
        }, 300)
      }
    })
  }, [isSidebarOpen])

  console.log('log', log)

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
      }}
    >
      <Typography
        sx={{
          color: 'var(--dark)',
          fontWeight: 'bold',
          fontSize: '2.1rem',
          marginBottom: '10px',
          marginTop: '10px',
          marginLeft: '10px',
        }}
      >
        Suggested
      </Typography>

      <Box
        sx={{
          height: '240px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            flexDirection: 'row',
            overflow: 'hidden',
            flexWrap: 'wrap',
            gridGap: '15px',
            padding: '12px',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {history.map((doc: any) => {
            if (!doc) return null
            return (
              <Box
                key={nanoid()}
                onClick={() => {
                  if (!failed) navigate(`/document/sign?id=${doc.id}`)
                }}
                sx={{
                  display: show ? 'block' : 'none',
                  flex: '1 1 250px',
                  minWidth: '250px',
                  borderRadius: '13px',
                  backgroundColor: 'var(--ac)',
                  boxShadow: 'var(--shadow3)',
                  maxWidth: '300px',
                  height: '220px',
                  cursor: 'pointer',
                  ':hover': {
                    backgroundColor: 'var(--lightaa)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  animation: '0.8s ease 0s 1 normal forwards running krSvVP',
                  // border: '1px solid var(--dark2)',
                }}
              >
                {failed && <Skeleton sx={{ transform: 'scale(1.0)', borderRadius: '11px' }} animation="wave" width={'100%'} height={220} />}
                <Box
                  sx={{
                    display: 'flex',
                    aignItems: 'center',
                    alignContent: 'center',
                    paddingLeft: '18px',
                    gap: '7px',
                    paddingTop: '4px',
                  }}
                >
                  <IconPDFImage style={{ marginTop: '5px' }} />
                  <Typography
                    sx={{
                      color: 'var(--dark2)',
                      fontSize: '1.34rem',
                      padding: '5px 10px 0px 8px',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      letterSpacing: '1px',
                    }}
                  >
                    {doc?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    padding: '10px 10px 0px 10px',
                  }}
                >
                  <img
                    src={doc.thumbnail}
                    alt=""
                    style={{
                      width: '100%',
                      height: '148px',
                      borderRadius: '4px',
                      objectFit: 'cover',
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    color: 'var(--dark3)',
                    paddingLeft: '15px',
                    marginTop: '2px',
                    fontSize: '1.2rem',
                  }}
                >
                  {moment(doc.timeStamp).calendar()}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>

      <Typography
        sx={{
          color: 'var(--dark2)',
          fontWeight: 'bold',
          fontSize: '2.1rem',
          marginBottom: '10px',
          marginTop: '20px',
          marginLeft: '10px',
        }}
      >
        Activity
      </Typography>

      <Box
        sx={{
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      >
        <TableContainer
          sx={{
            width: isSidebarOpen ? 'calc(100vw - 82px)' : 'calc(100vw - 240px)',
            // border: '1px solid var(--gray3)',
            height: 'calc(100vh - 269px - 203px)',
            position: 'relative',
            transition: 'width 0.6s',
            overflow: 'auto',
          }}
          id="activity-table"
        >
          <Table>
            <TableHead>
              <TableRow>
                {Columns1.map((column: (typeof Columns1)[0]) => {
                  return column.renderHeader(column)
                })}
              </TableRow>
            </TableHead>
            <TableBody sx={{ transition: 'all 0.8s' }}>
              {log.length > 0 &&
                log.map((row: any, index: number) => {
                  return <TableRowExpandable key={index} row={row} />
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default DashboardPage
