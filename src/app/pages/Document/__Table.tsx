import { selectors as AuthSelector } from '@esign-web/redux/auth'
import { actions, selectors } from '@esign-web/redux/document'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SearchIcon from '@mui/icons-material/Search'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import { Box, InputBase, Pagination, PaginationItem, Paper, Skeleton, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material'
import { nanoid } from 'nanoid'
import { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TableBodyCell } from 'src/app/components/Table'
import { Columns, TableRowExpandable } from './__TableColumns'
import './styles.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'

export const DocumentTable = (props: any) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const textSearch = searchParams.get('q')
  const [isPending, startTransition] = useTransition()
  const uploadingDocuments = useSelector(selectors.getUploadingDocuments)
  const isSidebarOpen = useSelector(AuthSelector.getSidebarState)
  const documents = useSelector(selectors.getDocuments) || {}
  const total = useSelector(selectors.getTotal)

  const loadingDocuments = useSelector(selectors.getLoadingDocuments)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    dispatch(
      actions.documentGetAll({
        limit: limit,
        offset: page,
        search: textSearch,
      })
    )
  }, [textSearch, page])

  console.log('documents', documents)
  console.log('documents', useSelector(selectors.getDocuments))
  console.log('textSearch', textSearch)

  return (
    <Box sx={{ width: '100%', position: 'relative', overflowX: 'auto', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px ' }}>
        <Box sx={{ flex: '1', height: '47px' }}>
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
                  navigate(`/document?q=${e.currentTarget.value}`)
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
          position: 'absolute',
          zIndex: 1000,
          top: 10,
          right: 0,
        }}
      >
        {documents && Object.keys(documents).length > 0 && (
          <Pagination
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '& .MuiPaginationItem-root': {
                color: 'var(--dark)',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              },
            }}
            onChange={(e, page) => {
              console.log('page', page)
              setPage(page)
            }}
            renderItem={(item) => (
              <PaginationItem
                sx={{
                  '&.Mui-selected': {
                    color: 'var(--orange)',
                  },
                }}
                slots={{
                  previous: () => {
                    return <ArrowBackIcon sx={{ fontSize: '2rem' }} />
                  },
                  next: () => {
                    return <ArrowForwardIcon sx={{ fontSize: '2rem' }} />
                  },
                }}
                {...item}
              />
            )}
            variant="text"
            shape="rounded"
            size="large"
            count={Math.ceil(total / limit) > 0 ? Math.ceil(total / limit) : Math.ceil(total / limit) === 0 && total > 0 ? 1 : 0}
            page={page}
          />
        )}
      </Box>

      <TableContainer
        sx={{
          width: isSidebarOpen ? 'calc(100vw - 72px)' : 'calc(100vw - 228px)',
          border: '1px solid var(--gray3)',
          height: 'calc(100vh - 153px)',
          position: 'relative',
          transition: 'width 0.6s',
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
        id="document-table"
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(Columns).map((key) => {
                const column = Columns[key as keyof typeof Columns]
                return column.renderHeader(column)
              })}
            </TableRow>
          </TableHead>

          <TableBody sx={{ transition: 'all 0.3s' }}>
            {/* ------------------ Main Table ------------------- */}
            {Object.keys(documents).length > 0 &&
              Object.keys(documents).map((key) => {
                const row = documents[key as keyof typeof documents]
                return <TableRowExpandable key={key} row={row} />
              })}

            {loadingDocuments &&
              [...Array(5)].map((_, index) => {
                return (
                  <TableRow key={nanoid()}>
                    {Object.keys(Columns).map((key) => {
                      return (
                        <TableBodyCell key={nanoid()} _sx={{ height: '100px' }}>
                          <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '20px' }} animation="wave" height="157px" />
                        </TableBodyCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            {/* ------------------ Loading ------------------- */}
          </TableBody>
        </Table>
      </TableContainer>
      {!loadingDocuments && documents && total === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '45%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <SearchIcon sx={{ fontSize: '6rem', color: 'var(--orange)', fontWeight: 'bold' }} />
          <span style={{ color: 'var(--orange)', fontSize: '2rem', fontWeight: 'bold' }}>No Documents Found !</span>
        </Box>
      )}
    </Box>
  )
}
