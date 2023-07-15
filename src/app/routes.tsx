import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import InsertChartOutlinedOutlinedIcon from '@mui/icons-material/InsertChartOutlinedOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AccountSettingsPage } from './pages/Account';
import { CeritificatePage } from './pages/Certificate';
import { DashboardPage } from './pages/Dashboard';
import { DocumentPage } from './pages/Document';
import { HomePage } from './pages/Home';
import { LogPage } from './pages/Log';
import { LoginPage } from './pages/Login';
import { SignaturePage } from './pages/Signature';
import { SignupPage } from './pages/Signup';
import { UMSPage } from './pages/UMS';
import { WalletPage } from './pages/Wallet';

export interface RouteObject {
  path: string;
  isPublish?: boolean;
  layout?: any;
  component: any;
}

export const dashboardPaths = [
  { to: '/dashboard',         name: 'Dashboard',          icon: InsertChartOutlinedOutlinedIcon },
  { to: '/document',          name: 'Documents',          icon: FolderCopyOutlinedIcon },
  { to: '/signatures',        name: 'Signatures',         icon: KeyOutlinedIcon },
  { to: '/certificate',       name: 'Certificates',       icon: CardMembershipOutlinedIcon },
  { to: '/wallet',            name: 'Wallets Address',    icon: WalletOutlinedIcon },
  { to: '/ums',               name: 'Organization',       icon: BusinessOutlinedIcon },
  { to: '/logs',              name: 'Logs',               icon: RestoreOutlinedIcon },
  { to: '/account-setting',   name: 'Account Settings',   icon: SettingsOutlinedIcon },
];

export const paths = {
  home:           '/',
  dashboard:      '/dashboard',
  login:          '/login',
  signup:         '/signup',
  document:       '/document',
  ums:            '/ums',
  logs:           '/logs',
  accountSetting: '/account-setting',
  wallet:         '/wallet',
  signatures:     '/signatures',
  certificate:    '/certificate',
};

const appRoutes: RouteObject[] = [
  { path: paths.login,          layout: null,            component: LoginPage },
  { path: paths.signup,         layout: null,            component: SignupPage },
  { path: paths.home,           layout: null,            component: HomePage },
  { path: paths.dashboard,      layout: DashboardLayout, component: DashboardPage },
  { path: paths.document,       layout: DashboardLayout, component: DocumentPage },
  { path: paths.wallet,         layout: DashboardLayout, component: WalletPage },
  { path: paths.ums,            layout: DashboardLayout, component: UMSPage },
  { path: paths.logs,           layout: DashboardLayout, component: LogPage },
  { path: paths.accountSetting, layout: DashboardLayout, component: AccountSettingsPage },
  { path: paths.signatures,     layout: DashboardLayout, component: SignaturePage },
  { path: paths.certificate,    layout: DashboardLayout, component: CeritificatePage },

];

export { appRoutes };
