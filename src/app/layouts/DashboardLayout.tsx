import { Box } from '@mui/material';
import { DashboardHeader } from './Header';
import { Sidebar } from './Sidebar';
import { Overlay } from '../components/Overlay';
import { UploadStatusDialog } from '../components/UploadDialogStatus';

interface DashboardLayoutProps {
  children: any;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  // useUnSavedChangesWarning({ condition: true });
  return (
    <Box sx={{ display: 'flex', flexDirenction: 'row', width: '100vw', height: '100vh' }}>
      <Box sx={{ maxWidth: '23.25rem' }}>
        <Sidebar />
      </Box>
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DashboardHeader />
        {children}
      </Box>
      <UploadStatusDialog />
    </Box>
  );
};
