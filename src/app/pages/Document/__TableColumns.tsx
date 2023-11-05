import { actions } from '@esign-web/redux/document'
import { Box, TableRow, Typography } from '@mui/material'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import MButton, { IconButton } from 'src/app/components/Button'
import { TableBodyCell, TableHeadCell } from 'src/app/components/Table'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

export const Columns = {
  file: {
    data_field: ['name'],
    label: 'File',
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'var(--ac)',
            left: 0,
            position: 'sticky',
            zIndex: 11,
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
    renderCell: (props: any) => {
      const key = nanoid()

      const FileInfo = (props: any) => {
        return (
          <Box sx={{ padding: '15px' }}>
            <Box>
              <Typography
                sx={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: 'var(--dark2)',
                }}
              >
                {props.name}
              </Typography>
              <Typography sx={{ fontSize: '1.2rem' }}>
                Sequence: <span style={{ fontSize: '1.2rem' }}>{props.sequence}</span>
              </Typography>
            </Box>
            <img
              src={props.thumbnail}
              style={{
                height: '270px',
                maxWidth: '180px',
                objectFit: 'contain',
                marginLeft: '20px',
              }}
              alt="thumbnail"
            />
          </Box>
        )
      }

      return (
        <TableBodyCell _sx={{ maxWidth: '220px', padding: 0, minWidth: '100px' }} key={key}>
          <Box sx={{ display: 'flex' }}>
            <FileInfo name={props.row?.name} thumbnail={props.row.thumbnail} sequence={props.row.sequence} />
          </Box>
        </TableBodyCell>
      )
    },
  },

  signer: {
    data_field: ['signers'],
    id: 'signer',
    label: 'Signers',
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'var(--ac)',
            left: 0,
            position: 'sticky',
            zIndex: 11,
            minWidth: '150px',
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
    renderCell: (props: any) => {
      const key = nanoid()
      const document_signers = props.row.document_signer
      if (document_signers.length === 0) {
        return (
          <TableBodyCell key={key}>
            <Typography
              sx={{
                fontSize: '1.6rem',
                color: 'var(--red11)',
                fontWeight: 'bold',
              }}
            >
              No Signers
            </Typography>
          </TableBodyCell>
        )
      }
      console.log('document_signers', document_signers)
      return (
        <TableBodyCell
          key={key}
          _sx={{
            maxWidth: '180px',
          }}
        >
          {Object.keys(document_signers).map((key, index) => {
            return (
              <Box
                sx={{
                  marginBottom: '5px',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1.8rem',
                    color: 'var(--dark2)',
                  }}
                >
                  {document_signers[key as keyof typeof document_signers].user.email}
                </Typography>
              </Box>
            )
          })}
        </TableBodyCell>
      )
    },
  },
  status: {
    data_field: ['status'],
    id: 'status',
    label: 'Status',
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'var(--ac)',
            left: 0,
            position: 'sticky',
            zIndex: 11,
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
    renderCell: (props: any) => {
      const key = nanoid()
      const map = {
        COMPLETED: (
          <Typography
            sx={{
              fontSize: '1.7rem',
              color: 'var(--dark3)',
              padding: '2px 7px 2px 7px',
              borderRadius: '6px',
              fontWeight: 'bold',
              backgroundColor: 'var(--green33)',
              width: 'fit-content',
            }}
          >
            Completed document
          </Typography>
        ),
        NEW: (
          <Typography
            sx={{
              fontSize: '1.7rem',
              color: 'var(--dark3)',
              padding: '2px 7px 2px 7px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: 'var(--yellow8)',
              width: 'fit-content',
            }}
          >
            New document
          </Typography>
        ),
        READY_TO_SIGN: (
          <Typography
            sx={{
              fontSize: '1.7rem',
              color: 'var(--dark3)',
              padding: '2px 7px 2px 7px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: 'var(--green8)',
              width: 'fit-content',
            }}
          >
            Ready to sign
          </Typography>
        ),
        ON_DRAFT: (
          <Typography
            sx={{
              fontSize: '1.7rem',
              color: 'var(--dark3)',
              padding: '2px 7px 2px 7px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: 'var(--yellow8)',
              width: 'fit-content',
            }}
          >
            On draft
          </Typography>
        ),
      }[props.row.status]

      return (
        <TableBodyCell
          _sx={{
            maxWidth: '100px',
          }}
          key={key}
        >
          {map}
        </TableBodyCell>
      )
    },
  },

  owner: {
    data_field: ['owner'],
    id: 'owner',
    label: 'Author',
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'var(--ac)',
            left: 0,
            position: 'sticky',
            zIndex: 11,
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
    renderCell: (props: any) => {
      const key = nanoid()
      return (
        <TableBodyCell _sx={{ maxWidth: '180px' }} key={key}>
          <Typography
            sx={{
              fontSize: '1.8rem',
              color: 'var(--dark2)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '1px',
            }}
          >
            {props.row?.user?.email}
          </Typography>
        </TableBodyCell>
      )
    },
  },

  last_modified: {
    data_field: ['updatedAt'],
    id: 'updatedAt',
    label: 'Modified',
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'var(--ac)',
            left: 0,
            position: 'sticky',
            zIndex: 11,
            maxWidth: '100px',
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
    renderCell: (props: any) => {
      const key = nanoid()
      return (
        <TableBodyCell _sx={{ maxWidth: '100px' }} key={key}>
          <Typography
            sx={{
              fontSize: '1.8rem',
              color: 'var(--dark2)',
            }}
          >
            {moment(props.row.updatedAt).format('L') + ' ' + moment(props.row.updatedAt).format('hh:mm A')}
          </Typography>
        </TableBodyCell>
      )
    },
  },
}

function hashEllipsis(hash: string) {
  if (!hash) return hash
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`
}

export const TableRowExpandable = (props: any) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { row } = props

  return (
    <TableRow
      onClick={() => {
        navigate(`/document/info?id=${row.id}`)
      }}
      sx={{ ...props.sx }}
    >
      {Object.keys(Columns).map((key) => {
        const column = Columns[key as keyof typeof Columns]
        return column.renderCell({ row, setOpen, open, navigate })
      })}
    </TableRow>
  )
}
