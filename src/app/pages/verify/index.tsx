import { Box, Button, Fade, InputBase, Menu, MenuItem, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import MButton from 'src/app/components/Button'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Toast, baseApi } from '@esign-web/libs/utils'
import { useDispatch } from 'react-redux'
import { BACKDROP_OFF, TOOGLE_BACKDROP } from 'libs/redux/auth/src/lib/constants'
import { AddressVerifyPage, EmailVerifyPage } from './Email'
import { set } from 'lodash'
import { DocumentVerifyPage } from './Document'

const VerifyPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') || 'document'

  const dispatch = useDispatch()
  async function updateFile() {}

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelectItem = (item: any) => {
    console.log(item)
  }

  const PlaceHoder = {
    document: 'Search Document hash',
    email: 'Search Email',
    address: 'Search Address',
    cert: 'Search Certificate hash',
    certTemplate: 'Search Certificatet template hash',
  }[type]

  const Options = {
    document: 'Document',
    email: 'Email',
    address: 'Address',
    cert: 'Certificate',
    certTemplate: 'Certificate Template',
  }

  const Option = Options[type]

  const [state, setState] = useState<any>()
  const [load, setLoad] = useState(false)
  const [error, setError] = useState<any>()

  useEffect(() => {
    ;(async () => {
      if (!query.trim()) return
      try {
        const res = await baseApi.post('/v1/user/verify', {
          type: searchParams.get('type') || 'document',
          query: searchParams.get('q') || '',
        })
        const data = res.data

        if (!data || data.length === 0) {
          setError('No data available, please try again')
          setState([])
          return
        }

        console.log('data', data)
        setState(data)
        setError(null)
      } catch (error) {
        setError('Please try again')
      }
    })()
  }, [type, query, load])

  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.value = query || ''
    }
  }, [query])

  const Content = {
    email: <EmailVerifyPage state={state} />,
    address: <AddressVerifyPage state={state} />,
    document: <DocumentVerifyPage state={state} />,
  }[type]

  const uploadRef = useRef<HTMLInputElement>(null)

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      Toast({
        message: (
          <div style={{ paddingLeft: '10px' }}>
            <div>File type is not supported</div> <div>Please upload PDF file.</div>
          </div>
        ),
        type: 'error',
      })
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'hash')
    let hash = await baseApi.post('/document/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    console.log('hash', hash.data)
    if (hash.data) {
      navigate(`/verify?type=${type}&q=${hash.data}`)
    }
    uploadRef.current!.value = ''
  }

  return (
    <Fade in>
      <Box id="verify-page" sx={{ flex: 1, width: '100%', padding: '5px 5px 0px 5px', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', marginBottom: '10px ', gap: '10px' }}>
          <Box>
            <MButton
              sx={{
                backgroundColor: 'var(--blue3)',
                border: '1px solid var(--gray3)',
                borderRadius: '8px',
                alignItems: 'center',
                gap: '4px',
              }}
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <Typography sx={{ fontSize: '1.7rem', color: 'var(--white)', fontWeight: 'bold' }}>{Option}</Typography>
              <KeyboardArrowDownIcon sx={{ fontSize: '2.5rem', color: 'var(--white)' }} />
            </MButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{
                '& .MuiPaper-root': {
                  minWidth: '180px',
                  minHeight: '150px',
                  marginTop: '10px',
                  boxShadow: 'var(--shadow99)',
                  borderRadius: '12px',
                  padding: '10px 0px',
                },
              }}
            >
              {['document', 'email', 'address', 'cert', 'certTemplate'].map((item) => {
                return (
                  <MenuItem
                    key={item}
                    onClick={() => {
                      navigate(`/verify?type=${item}&q=${query}`)
                      handleClose()
                      setLoad(!load)
                    }}
                  >
                    <Typography sx={{ fontSize: '1.7rem', color: 'var(--dark2)' }}>{Options[item]}</Typography>
                  </MenuItem>
                )
              })}
            </Menu>
          </Box>

          <Box
            sx={{
              border: '1px solid var(--gray3)',
              borderRadius: '7px',
              width: '50%',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '8px',
              gap: '15px',
            }}
          >
            <InputBase
              inputRef={ref}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // encode query
                  let encodedQuery = encodeURIComponent(e.currentTarget.value)
                  navigate(`/verify?type=${type}&q=${encodedQuery}`)
                  setLoad(!load)
                }
              }}
              onBlur={(e) => {
                if (!e.currentTarget.value.trim()) return
                let encodedQuery = encodeURIComponent(e.currentTarget.value)
                navigate(`/verify?type=${type}&q=${encodedQuery}`)
                setLoad(!load)
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
                    letterSpacing: '0.5px',
                    opacity: 0.7,
                  },
                },

                // border: '1px solid var(--gray3)',
              }}
              placeholder={PlaceHoder}
            ></InputBase>
          </Box>

          <MButton
            onClick={() => {
              const ele = document.getElementById('upload_document1')
              if (ele) {
                ele.click()
              }
            }}
            sx={{
              backgroundColor: 'var(--orange1)',
              borderRadius: '8px',
              padding: '5px 10px',
              gap: '4px',
            }}
          >
            <FileUploadIcon
              sx={{
                fontSize: '2rem',
                color: 'var(--white)',
              }}
            />
            <Typography
              sx={{
                fontSize: '1.6rem',
                color: 'var(--white)',
                fontWeight: 'bold',
              }}
            >
              Upload
            </Typography>
          </MButton>
        </Box>
        <input id="upload_document1" type="file" ref={uploadRef} onChange={onChangeFile} accept="application/pdf" style={{ display: 'none' }} />

        <Typography
          sx={{
            marginTop: '20px',
            fontSize: '1.8rem',
            color: 'var(--red1)',
            fontWeight: 'bold',
          }}
        >
          {error}
        </Typography>

        <Box
          id="content"
          sx={{
            overflowY: 'auto',
            height: 'calc(100vh - 180px)',
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
        >
          {Content}
        </Box>
      </Box>
    </Fade>
  )
}

export default VerifyPage
