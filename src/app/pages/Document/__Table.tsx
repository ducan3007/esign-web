import { selectors as AuthSelector } from '@esign-web/redux/auth';
import { actions, selectors } from '@esign-web/redux/document';
import {
  Box,
  Divider,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useEffect, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TableBodyCell } from 'src/app/components/Table';
import { Columns, TableRowExpandable } from './__TableColumns';
import SearchIcon from '@mui/icons-material/Search';
import './styles.scss';
import { nanoid } from 'nanoid';

export const DocumentTable = (props: any) => {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const uploadingDocuments = useSelector(selectors.getUploadingDocuments);
  const isSidebarOpen = useSelector(AuthSelector.getSidebarState);
  const { documents = null, totals = 0 as number } = useSelector(selectors.getDocuments);

  const loadingDocuments = useSelector(selectors.getLoadingDocuments);

  useEffect(() => {
    dispatch(
      actions.documentGetAll({
        limit: 20,
        offset: 0,
      })
    );
  }, []);

  return (
    <Box sx={{ width: '100%', position: 'relative', overflowX: 'auto', overflowY: 'auto' }}>
      <TableContainer
        sx={{
          width: isSidebarOpen ? 'calc(100vw - 120px)' : 'calc(100vw - 270px)',
          height: 'calc(100vh - 210px)',
          position: 'relative',
          transition: 'width 0.8s',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '5px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'var(--orange)',
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
                const column = Columns[key as keyof typeof Columns];
                return column.renderHeader(column);
              })}
            </TableRow>
          </TableHead>

          <TableBody sx={{ transition: 'all 0.8s' }}>
            {/* {data.map((row, index) => {
              return <TableRowExpandable key={index} row={row} />;
            })} */}

            {/* ------------------ Main Table ------------------- */}
            {documents !== null &&
              Object.keys(documents).map((key) => {
                const row = documents[key as keyof typeof documents];
                return <TableRowExpandable key={key} row={row} />;
              })}
            {/* ------------------ Main Table ------------------- */}

            {/* ------------------ Loading ------------------- */}
            {documents === null &&
              [...Array(8)].map((_, index) => {
                return (
                  <TableRow key={nanoid()}>
                    {Object.keys(Columns).map((key) => {
                      return (
                        <TableBodyCell key={nanoid()} _sx={{ height: '100px' }}>
                          <Skeleton animation="wave" height="100px" />
                        </TableBodyCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            {/* ------------------ Loading ------------------- */}
          </TableBody>
        </Table>
      </TableContainer>
      {!loadingDocuments && documents && Object.keys(documents).length === 0 && (
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
      {documents && Object.keys(documents).length > 0 && (
        <TablePagination
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={10}
          rowsPerPage={5}
          page={1}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
        />
      )}
    </Box>
  );
};
