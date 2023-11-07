import { baseApi, getRandomColor } from '@esign-web/libs/utils'
import { selectors as AuthSelector } from '@esign-web/redux/auth'
import { Box, InputBase, Paper, Skeleton, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useState, useTransition } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IconPDFImage } from 'src/app/components/Icons/pdf'
import './styles.scss'
import { Columns1, TableRowExpandable } from './Column'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'

import { nanoid } from 'nanoid'

const LogPage = () => {
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
        const logs = await baseApi.get('/v1/user/log' + `?limit=${limit}&offset=${offset}`)

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
                meta_data: log.user.meta_data,
              },
              feature: log.feature,
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

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px ' }}>
        <Box sx={{ flex: '1', height: '47px', margin: '0px 0px 10px 5px' }}>
          <Box
            sx={{
              border: '1px solid var(--gray3)',
              borderRadius: '7px',
              height: '100%',
              width: '50%',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '8px',
              gap: '15px',
            }}
          >
            <SearchSharpIcon sx={{ fontSize: '34px', color: 'var(--dark3)' }} />
            <InputBase
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/logs?q=${e.currentTarget.value}`)
                }
              }}
              sx={{
                width: '100%',
                height: '100%',
                fontSize: '1.85rem',
                paddingRight: '30px',
                color: 'var(--dark3)',
                '& .MuiInputBase-input': {
                  '&::placeholder': {
                    color: 'var(--dark3) !important',
                    fontSize: '1.85rem !important',
                    opacity: 0.9,
                  },
                },

                // border: '1px solid var(--gray3)',
              }}
              placeholder="Search documents, hash, tags"
            ></InputBase>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      >
        <TableContainer
          sx={{
            width: isSidebarOpen ? 'calc(100vw - 82px)' : 'calc(100vw - 240px)',
            height: 'calc(85vh)',
            position: 'relative',
            transition: 'width 0.6s',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '10px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'var(--gray4)',
              borderRadius: '50px',
              border: '1px solid var(--white)',
            },
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

export default LogPage
