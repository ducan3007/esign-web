import { Box, SxProps, TableCell, TableRow } from '@mui/material';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import MButton from 'src/app/components/Button';

export const TableHeadCell = (props: { _sx?: SxProps; children: any }) => {
  return (
    <TableBodyCell
      _sx={{
        fontWeight: 'bold',
        color: 'var(--dark4)',
        fontSize: '1.9rem',
        padding: '0.75rem 1rem 1.25rem 1rem',
        borderBottom: 'none',
        // border: '2px solid var(--dark)',
        width: '150px',
        minWidth: '150px',
        // overflow: 'hidden',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        ...props._sx,
      }}
    >
      {props.children}
    </TableBodyCell>
  );
};

export const TableBodyCell = (props: { _sx?: SxProps; children: any }) => {
  return (
    <TableCell
      sx={{
        color: 'var(--dark3)',
        fontSize: '1.4rem',
        padding: '0.75rem 1rem 0.75rem 1rem',
        borderBottom: 'none',
        width: '150px',
        minWidth: '150px',
        overflow: 'hidden',
        // border: '1px solid var(--dark)',
        ...props._sx,
      }}
    >
      {props.children}
    </TableCell>
  );
};
