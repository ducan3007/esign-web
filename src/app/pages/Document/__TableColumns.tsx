import { actions } from '@esign-web/redux/document'
import { Box, TableRow } from '@mui/material'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import MButton, { IconButton } from 'src/app/components/Button'
import { TableBodyCell, TableHeadCell } from 'src/app/components/Table'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useNavigate } from 'react-router-dom'

export const Columns = {
  file: {
    data_field: ['name'],
    label: 'File',
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            backgroundColor: 'var(--gray2)',
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
      const open = props.open
      const setOpen = props.setOpen
      const level = props.row.level
      const clone_count = props.row.number_of_clone
      const isLevel0AndHaveClone = level === 0 && clone_count > 0
      const isLevel0AndNoClone = level === 0 && clone_count === 0
      const isLevel1 = level !== 0

      const FileInfo = (props: any) => {
        return (
          <Box sx={{ display: 'flex', padding: '5px', paddingBottom: '25px' }}>
            <img
              src={props.thumbnail}
              style={{
                height: '250px',
                maxWidth: '220px',
                objectFit: 'contain',
              }}
              alt="thumbnail"
            />
            <Box>
              <span>{props.name}</span>
            </Box>
          </Box>
        )
      }

      return (
        <TableBodyCell _sx={{ backgroundColor: 'var(--gray2)', padding: 0, minWidth: '200px', position: 'sticky', left: 0, zIndex: 10 }} key={key}>
          {isLevel0AndHaveClone && (
            <Box sx={{ display: 'flex' }}>
              <FileInfo name={props.row?.name} thumbnail={props.row.thumbnail} />
              <MButton
                disableRipple
                sx={{
                  position: 'absolute',
                  bottom: '0',
                  width: '100%',
                  borderRadius: '0rem',
                  backgroundColor: 'var(--color-gray2)',
                  padding: '0',
                  ':hover': { opacity: 0.8 },
                }}
                onClick={() => {
                  setOpen(!open)
                }}
              >
                {!open && <span>Show more</span>}
                {open && <span>{clone_count} documents</span>}
              </MButton>
            </Box>
          )}
          {isLevel0AndNoClone && <FileInfo name={props.row?.name} thumbnail={props.row.thumbnail} />}
          {isLevel1 && props.row.name}
        </TableBodyCell>
      )
    },
  },
  // size: {
  //   data_field: ['size'],
  //   id: 'size',
  //   label: 'Size',
  //   renderHeader: (props: any) => {
  //     return <TableHeadCell key={nanoid()}>{props.label}</TableHeadCell>;
  //   },
  //   renderCell: (props: any) => {
  //     const key = nanoid();
  //     return <TableBodyCell key={key}>{props.row.size}</TableBodyCell>;
  //   },
  // },
  cid_sha: {
    data_field: ['cid', 'hash256'],
    label: 'CID / SHA256',
    renderHeader: (props: any) => {
      return <TableHeadCell key={nanoid()}>{props.label}</TableHeadCell>
    },
    renderCell: (props: any) => {
      const key = nanoid()
      const level = props.row.level
      const cid = `CID: ${hashEllipsis(props.row.cid)}`
      const hash256 = `HASH: ${hashEllipsis(props.row.hash256)}`
      const orginial_hash_256 = `HASH: ${hashEllipsis(props.row.orginial_hash_256)}`
      return (
        <TableBodyCell key={key}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{cid} </span> <br />
            <IconButton disableRipple>
              <ContentCopyIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{hash256} </span>
            <IconButton>
              <ContentCopyIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span> {orginial_hash_256} </span>
            <IconButton>
              <ContentCopyIcon />
            </IconButton>
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
      return <TableHeadCell key={nanoid()}>{props.label}</TableHeadCell>
    },
    renderCell: (props: any) => {
      const key = nanoid()
      return <TableBodyCell key={key}>{props.row.signer}</TableBodyCell>
    },
  },
  status: {
    data_field: ['status'],
    id: 'status',
    label: 'Status',
    renderHeader: (props: any) => {
      return <TableHeadCell key={nanoid()}>{props.label}</TableHeadCell>
    },
    renderCell: (props: any) => {
      const key = nanoid()
      return <TableBodyCell key={key}>{props.row.status}</TableBodyCell>
    },
  },

  owner: {
    data_field: ['owner'],
    id: 'owner',
    label: 'Owner',
    renderHeader: (props: any) => {
      return <TableHeadCell key={nanoid()}>{props.label}</TableHeadCell>
    },
    renderCell: (props: any) => {
      const key = nanoid()
      return <TableBodyCell key={key}>{props.row?.user?.email}</TableBodyCell>
    },
  },
  // group: {
  //   data_field: ['group'],
  //   id: 'group',
  //   label: 'Group',
  //   renderHeader: (props: any) => {
  //     return <TableHeadCell key={nanoid()}>{props.label}</TableHeadCell>;
  //   },
  //   renderCell: (props: any) => {
  //     const key = nanoid();
  //     return <TableBodyCell key={key}>{props.row?.group?.name}</TableBodyCell>;
  //   },
  // },
  action: {
    data_field: ['action'],
    id: 'action',
    label: 'Action',
    renderHeader: (props: any) => {
      return (
        <TableHeadCell
          _sx={{
            minWidth: '100px',
            width: '100px',
            backgroundColor: 'var(--gray2)',
            right: 0,
            zIndex: 10,
          }}
          key={nanoid()}
        >
          {props.label}
        </TableHeadCell>
      )
    },
    renderCell: (props: any) => {
      const dispatch = useDispatch()
      const navigate = props.navigate
      const [loading, setLoading] = useState(false)
      const key = nanoid()
      const level = props.row.level
      // const EvenHanlder = props.EvenHanlder;
      const document_id = props.row.id

      const EvenHanlder = {
        download: () => {},
        clone: (document_id: string, setLoading: any) => {
          console.log('>>Clone', { document_id: document_id })
          dispatch(actions.cloneDocument({ documentId: document_id, setLoading: setLoading }))
        },
        delete: () => {},
        sign: () => {
          navigate(`/document/sign?id=${document_id}`)
        },
        get_info: () => {},
      }

      return (
        <TableBodyCell _sx={{ minWidth: '100px', width: '100px', backgroundColor: 'var(--gray2)', position: 'sticky', right: 0 }} key={key}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <IconButton>
              <span>Download</span>
            </IconButton>
            {level === 0 && (
              <IconButton
                onClick={() => {
                  setLoading(true)
                  EvenHanlder.clone(document_id, setLoading)
                }}
                disabled={loading}
              >
                <span>Clone</span>
              </IconButton>
            )}
            <IconButton
              disabled={loading}
              sx={{
                backgroundColor: 'var(--error)',
              }}
            >
              <span>Delete</span>
            </IconButton>
            <IconButton
              onClick={() => {
                EvenHanlder.sign()
              }}
            >
              <span>Sign</span>
            </IconButton>
            <IconButton>
              <span>Get Info</span>
            </IconButton>
          </Box>
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
  const child_props = row.child

  const Component = (
    <TableRow sx={{ ...props.sx }}>
      {Object.keys(Columns).map((key) => {
        const column = Columns[key as keyof typeof Columns]
        return column.renderCell({ row, setOpen, open, navigate })
      })}
    </TableRow>
  )

  if (!child_props) {
    return Component
  }

  return (
    <>
      {Component}
      {Object.keys(child_props).map((key) => {
        return (
          <TableRowExpandable
            key={nanoid()}
            row={child_props[key as keyof typeof child_props]}
            sx={{
              backgroundColor: 'var(--gray2)',
              display: open ? 'table-row' : 'none',
              opacity: open ? 1 : 0,
            }}
          />
        )
      })}
    </>
  )
}
