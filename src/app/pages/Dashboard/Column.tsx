import { Avatar, Box, TableRow, Typography } from '@mui/material'
import { nanoid } from 'nanoid'
import { useNavigate } from 'react-router-dom'
import { TableBodyCell, TableHeadCell } from 'src/app/components/Table'

export const Fields = {
  id: {
    data_field: 'id',
    label: 'ID',

    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'white',
            left: 0,
            position: 'sticky',
            zIndex: 11,
            maxWidth: '80px',
            width: '80px',
            height: '54px',
            color: 'var(--gray9999)',
            fontSize: '1.8rem',
            paddingBottom: '10px',
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
  },
  user: {
    data_field: 'user',
    label: 'User',
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'white',
            left: 0,
            position: 'sticky',
            zIndex: 11,
            maxWidth: '320px',
            width: '320px',
            color: 'var(--gray9999)',
            fontSize: '1.8rem',
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
    renderCell: (props: any) => {
      const user = props.row.user
      const meta_data = JSON.parse(user.meta_data || '')
      return (
        <TableBodyCell
          key={nanoid()}
          _sx={{
            padding: 0,
            maxWidth: '320px',
            width: '320px',
            textOverflow: 'ellipsis',
            wordWrap: 'break-word',
            whiteSpace: 'nowrap',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <Box>
              <Avatar
                sx={{
                  color: 'var(--white)',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginLeft: '5px',
                  backgroundColor: meta_data?.color || props.row.color.toString(),
                }}
              >
                {user.user_name.toUpperCase().charAt(0)}
              </Avatar>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  color: 'var(--dark3)',
                  fontSize: '1.6rem',
                  textOverflow: 'ellipsis',
                  wordWrap: 'break-word',
                  whiteSpace: 'nowrap',
                  letterSpacing: '1px',
                }}
              >
                {user.user_name}
              </Typography>
              <Box
                sx={{
                  maxWidth: '250px',
                }}
              >
                <Typography
                  sx={{
                    borderRadius: '5px',
                    color: 'var(--dark3)',
                    fontSize: '1.4rem',
                    textOverflow: 'ellipsis',
                    wordWrap: 'break-word',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.user_email}
                </Typography>
              </Box>
            </Box>
          </Box>
        </TableBodyCell>
      )
    },
  },
  date: {
    data_field: 'date',
    label: 'Date',
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'white',
            left: 0,
            position: 'sticky',
            zIndex: 11,
            maxWidth: '150px',
            width: '150px',
            color: 'var(--gray9999)',
            fontSize: '1.8rem',
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
  },
  time: {
    data_field: 'time',
    label: 'Time',
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'white',
            left: 0,
            position: 'sticky',
            zIndex: 11,
            maxWidth: '150px',
            width: '150px',
            color: 'var(--gray9999)',
            fontSize: '1.8rem',
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
  },
  action: {
    label: 'Action',
    data_field: 'action',
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'white',
            left: 0,
            position: 'sticky',
            zIndex: 11,
            maxWidth: '200px',
            width: '200px',
            color: 'var(--gray9999)',
            fontSize: '1.8rem',
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
    renderCell: (props: any) => {
      const map = {
        CREATE_DOCUMENT: (
          <Typography
            sx={{
              fontSize: '1.5rem',
              color: 'var(--dark3)',
              padding: '2px 7px 2px 7px',
              borderRadius: '6px',
              fontWeight: 'bold',
              backgroundColor: 'var(--green8)',
              width: 'fit-content',
            }}
          >
            Create Document
          </Typography>
        ),
        SIGN_DOCUMENT: (
          <Typography
            sx={{
              fontSize: '1.5rem',
              color: 'var(--dark3)',
              padding: '2px 7px 2px 7px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: 'var(--yellow8)',
              width: 'fit-content',
            }}
          >
            Sign Document
          </Typography>
        ),
        CREATE_CERTIFICATE: (
          <Typography
            sx={{
              fontSize: '1.5rem',
              color: 'var(--dark3)',
              padding: '2px 7px 2px 7px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: 'var(--green44)',
              width: 'fit-content',
            }}
          >
            Create Certificate
          </Typography>
        ),
        SIGN_CERTIFICATE: (
          <Typography
            sx={{
              fontSize: '1.5rem',
              color: 'var(--dark3)',
              padding: '2px 7px 2px 7px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: 'var(--yellow8)',
              width: 'fit-content',
            }}
          >
            Issue Certificate
          </Typography>
        ),
        REVOKE_CERTIFICATE: (
          <Typography
            sx={{
              fontSize: '1.5rem',
              color: 'var(--dark3)',
              padding: '2px 7px 2px 7px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: 'var(--yellow8)',
              width: 'fit-content',
            }}
          >
            Revoke Certificate
          </Typography>
        ),
        INVITE_SIGNER: (
          <Typography
            sx={{
              fontSize: '1.5rem',
              color: 'var(--dark3)',
              padding: '2px 7px 2px 7px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: 'var(--green8)',
              width: 'fit-content',
            }}
          >
            Request to sign
          </Typography>
        ),
        SIGN_BY_WALLLET: (
          <Typography
            sx={{
              fontSize: '1.5rem',
              color: 'var(--dark3)',
              padding: '2px 7px 2px 7px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: 'var(--orange222)',
              width: 'fit-content',
            }}
          >
            Sign by Metamask
          </Typography>
        ),
        SIGN_BY_WALLET: (
          <Typography
            sx={{
              fontSize: '1.5rem',
              color: 'var(--dark3)',
              padding: '2px 7px 2px 7px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: 'var(--orange222)',
              width: 'fit-content',
            }}
          >
            Sign by Metamask
          </Typography>
        ),
      }[props.row.action]
      const row = props.row
      return (
        <TableBodyCell
          _sx={{
            height: '55px',
          }}
          key={nanoid()}
        >
          {map}
        </TableBodyCell>
      )
    },
  },
  description: {
    data_field: 'description',
    label: 'Description',
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'white',
            left: 0,
            position: 'sticky',
            zIndex: 11,
            color: 'var(--gray9999)',
            fontSize: '1.8rem',
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
    renderCell: (props: any) => {
      const user = props.row.user
      const meta_data = props.row.meta_data
      console.log('DESCRIBE: ', props.row)
      if (props.row.feature === 'DOCUMENT') {
        return (
          <TableBodyCell
            _sx={{
              height: '65px',
              fontSize: '1.6rem',
              color: 'var(--dark)',
            }}
            key={nanoid()}
          >
            <Typography
              sx={{
                color: 'var(--dark3)',
                fontSize: '1.6rem',
              }}
            >
              <b>{user.user_name}</b> {props.row.description}{' '}
              <a
                href={'/document/sign?id=' + meta_data.document_id}
                style={{
                  color: 'var(--blue3)',
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                }}
              >
                {meta_data.document_name}
              </a>
            </Typography>
          </TableBodyCell>
        )
      }
      if (props.row.feature === 'CERTIFICATE') {
        let isCreateCert = props.row.action === 'CREATE_CERTIFICATE'
        let link = '/certificate/detail?id=' + meta_data.document_id
        if (!isCreateCert) {
          link = '/certificate/sign?id=' + meta_data.document_id
        }
        return (
          <TableBodyCell
            _sx={{
              height: '65px',
              fontSize: '1.6rem',
              color: 'var(--dark)',
            }}
            key={nanoid()}
          >
            <Typography
              sx={{
                color: 'var(--dark3)',
                fontSize: '1.6rem',
              }}
            >
              <b>{user.user_name}</b> {props.row.description}{' '}
              <a
                href={link}
                style={{
                  color: 'var(--blue3)',
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                }}
              >
                {isCreateCert && meta_data.document_name}
                {!isCreateCert && meta_data.certifier}
              </a>
            </Typography>
          </TableBodyCell>
        )
      }
      if (props.row.feature === 'SIGN_BY_WALLET') {
        let link = '/certificate/detail?id=' + meta_data.document_id
        return (
          <TableBodyCell
            _sx={{
              height: '65px',
              fontSize: '1.6rem',
              color: 'var(--dark)',
            }}
            key={nanoid()}
          >
            <Typography
              sx={{
                color: 'var(--dark3)',
                fontSize: '1.6rem',
              }}
            >
              <b>{user.user_name}</b> {props.row.description}{' '}
              <a
                href={link}
                style={{
                  color: 'var(--blue3)',
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                }}
              >
                {meta_data?.tx_hash}
              </a>
            </Typography>
          </TableBodyCell>
        )
      }
      if (props.row.feature === 'SIGN_CERT_WALLET') {
        let link = '/certificate/sign?id=' + meta_data.document_id
        return (
          <TableBodyCell
            _sx={{
              height: '65px',
              fontSize: '1.6rem',
              color: 'var(--dark)',
            }}
            key={nanoid()}
          >
            <Typography
              sx={{
                color: 'var(--dark3)',
                fontSize: '1.6rem',
              }}
            >
              <b>{user.user_name}</b> {props.row.description}{' '}
              <a
                href={link}
                style={{
                  color: 'var(--blue3)',
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                }}
              >
                {meta_data?.tx_hash}
              </a>
            </Typography>
          </TableBodyCell>
        )
      }
      return (
        <TableBodyCell
          _sx={{
            height: '65px',
            fontSize: '1.6rem',
            color: 'var(--dark)',
          }}
          key={nanoid()}
        >
          <></>
        </TableBodyCell>
      )
    },
  },
}

export const Columns1: {
  renderHeader: any
  renderCell: any
}[] = Object.keys(Fields).map((key) => {
  const field: any = Fields[key as keyof typeof Fields]
  return {
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'white',
            left: 0,
            position: 'sticky',
            zIndex: 11,
            color: 'var(--gray9999)',
            fontSize: '1.8rem',
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
    renderCell: (props: any) => {
      return (
        <TableBodyCell
          _sx={{
            height: '65px',
            fontSize: '1.6rem',
            color: 'var(--dark)',
          }}
          key={nanoid()}
        >
          {props.row[field.data_field]}
        </TableBodyCell>
      )
    },
    ...field,
  }
})

function hashEllipsis(hash: string) {
  if (!hash) return hash
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`
}

export const TableRowExpandable = (props: any) => {
  const navigate = useNavigate()
  const { row } = props

  if (!row) return null
  return (
    <TableRow
      sx={{
        borderBottom: '1px solid var(--gray99999)',
        ...props.sx,
      }}
    >
      {Columns1.map((column) => {
        return column.renderCell({ row, navigate })
      })}
    </TableRow>
  )
}
