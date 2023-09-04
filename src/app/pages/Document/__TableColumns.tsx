import { actions } from '@esign-web/redux/document'
import { Box, TableRow, Typography } from '@mui/material'
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
            // maxWidth: '100px',
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
          <Box sx={{ display: 'flex', padding: '5px', paddingBottom: '25px' }}>
            <img
              src={props.thumbnail}
              style={{
                height: '300px',
                maxWidth: '220px',
                objectFit: 'contain',
              }}
              alt="thumbnail"
            />
            <Box>
              <Typography
                sx={{
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                  color: 'var(--dark)',
                }}
              >
                {props.name}
              </Typography>
            </Box>
          </Box>
        )
      }

      return (
        <TableBodyCell _sx={{ maxWidth: '280px', padding: 0, minWidth: '200px' }} key={key}>
          <Box sx={{ display: 'flex' }}>
            <FileInfo name={props.row?.name} thumbnail={props.row.thumbnail} />
          </Box>
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
  // action: {
  //   data_field: ['action'],
  //   id: 'action',
  //   label: 'Action',
  //   renderHeader: (props: any) => {
  //     return (
  //       <TableHeadCell
  //         _sx={{
  //           minWidth: '100px',
  //           width: '100px',
  //           backgroundColor: 'var(--gray2)',
  //           right: 0,
  //           zIndex: 10,
  //         }}
  //         key={nanoid()}
  //       >
  //         {props.label}
  //       </TableHeadCell>
  //     )
  //   },
  //   renderCell: (props: any) => {
  //     const dispatch = useDispatch()
  //     const navigate = props.navigate
  //     const [loading, setLoading] = useState(false)
  //     const key = nanoid()
  //     const level = props.row.level
  //     // const EvenHanlder = props.EvenHanlder;
  //     const document_id = props.row.id

  //     const EvenHanlder = {
  //       download: () => {},
  //       clone: (document_id: string, setLoading: any) => {
  //         console.log('>>Clone', { document_id: document_id })
  //         dispatch(actions.cloneDocument({ documentId: document_id, setLoading: setLoading }))
  //       },
  //       delete: () => {},
  //       sign: () => {
  //         navigate(`/document/sign?id=${document_id}`)
  //       },
  //       get_info: () => {},
  //     }

  //     return (
  //       <TableBodyCell _sx={{ minWidth: '100px', width: '100px' }} key={key}>
  //         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
  //           <IconButton>
  //             <span>Download</span>
  //           </IconButton>
  //           {level === 0 && (
  //             <IconButton
  //               onClick={() => {
  //                 setLoading(true)
  //                 EvenHanlder.clone(document_id, setLoading)
  //               }}
  //               disabled={loading}
  //             >
  //               <span>Clone</span>
  //             </IconButton>
  //           )}
  //           <IconButton
  //             disabled={loading}
  //             sx={{
  //               backgroundColor: 'var(--error)',
  //             }}
  //           >
  //             <span>Delete</span>
  //           </IconButton>
  //           <IconButton
  //             onClick={() => {
  //               EvenHanlder.sign()
  //             }}
  //           >
  //             <span>Sign</span>
  //           </IconButton>
  //           <IconButton>
  //             <span>Get Info</span>
  //           </IconButton>
  //         </Box>
  //       </TableBodyCell>
  //     )
  //   },
  // },
}

function hashEllipsis(hash: string) {
  if (!hash) return hash
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`
}

export const TableRowExpandable = (props: any) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { row } = props
  // const child_props = row.child

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

  // return (
  //   <>
  //     {Component}
  //     {Object.keys(child_props).map((key) => {
  //       return (
  //         <TableRowExpandable
  //           key={nanoid()}
  //           row={child_props[key as keyof typeof child_props]}
  //           sx={{
  //             display: open ? 'table-row' : 'none',
  //             opacity: open ? 1 : 0,
  //           }}
  //         />
  //       )
  //     })}
  //   </>
  // )
}
