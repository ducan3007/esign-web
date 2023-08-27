import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import InsertChartOutlinedOutlinedIcon from '@mui/icons-material/InsertChartOutlinedOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';

// const DashboardLayout = React.lazy(() => import('./layouts/DashboardLayout'));
import DashboardLayout from './layouts/DashboardLayout';
// const AccountSettingsPage = React.lazy(() => import('./pages/Account'));
import AccountSettingsPage from './pages/Account';
// const CeritificatePage = React.lazy(() => import('./pages/Certificate'));
import CeritificatePage from './pages/Certificate';
// const DashboardPage = React.lazy(() => import('./pages/Dashboard'));
import DashboardPage from './pages/Dashboard';
// const DocumentPage = React.lazy(() => import('./pages/Document'));
import DocumentPage from './pages/Document';
// const HomePage = React.lazy(() => import('./pages/Home'));
import HomePage from './pages/Home';
// const LogPage = React.lazy(() => import('./pages/Log'));
import LogPage from './pages/Log';
// const LoginPage = React.lazy(() => import('./pages/Login'));
import LoginPage from './pages/Login';
// const SignaturePage = React.lazy(() => import('./pages/Signature'));
import SignaturePage from './pages/Signature';
// const SignupPage = React.lazy(() => import('./pages/Signup'));
import SignupPage from './pages/Signup';
// const UMSPage = React.lazy(() => import('./pages/UMS'));
import UMSPage from './pages/UMS';
// const WalletPage = React.lazy(() => import('./pages/Wallet'));
import { NotFoundPage } from './pages/404NotFound';
import { DocumentDetail } from './pages/Document/DocumentDetail';
import WalletPage from './pages/Wallet';
import { DocumentSignningPage } from './pages/Document/SigningPage';

export interface RouteObject {
  path: string;
  isPublish?: boolean;
  layout?: any;
  component: any;
  protected?: boolean;
}

export const dashboardPaths = [
  { to: '/dashboard',             name: 'Dashboard',          icon: InsertChartOutlinedOutlinedIcon },
  { to: '/document',              name: 'Documents',          icon: FolderCopyOutlinedIcon },
  { to: '/signatures',            name: 'Signatures',         icon: KeyOutlinedIcon },
  { to: '/certificate',           name: 'Certificates',       icon: CardMembershipOutlinedIcon },
  { to: '/wallet',                name: 'Wallets Address',    icon: WalletOutlinedIcon },
  { to: '/ums',                   name: 'Organization',       icon: BusinessOutlinedIcon },
  { to: '/logs',                  name: 'Logs',               icon: RestoreOutlinedIcon },
  { to: '/account-setting',       name: 'Account Settings',   icon: SettingsOutlinedIcon },
];

export const headerTitles = [
  { to: '/dashboard',             name: 'Dashboard',               },
  { to: '/document',              name: 'Documents',               },
  { to: '/signatures',            name: 'Signatures',              },
  { to: '/certificate',           name: 'Certificates',            },
  { to: '/wallet',                name: 'Wallets Address',         },
  { to: '/ums',                   name: 'Organization',            },
  { to: '/logs',                  name: 'Logs',                    },
  { to: '/account-setting',       name: 'Account Settings',        },
  { to: '/document/info',         name: 'Document Detail',         },
  { to: '/document/sign',         name: 'Document Signning Page',  },
];

export const paths = {
  home:                           '/',
  dashboard:                      '/dashboard',
  login:                          '/login',
  signup:                         '/signup',
  document:                       '/document',
  document_detail:                '/document/info',
  document_sign:                  '/document/sign',
  ums:                            '/ums',
  logs:                           '/logs',
  accountSetting:                 '/account-setting',
  wallet:                         '/wallet',
  signatures:                     '/signatures',
  certificate:                    '/certificate',
  notFound:                       '/*',
};

const appRoutes: RouteObject[] = [
  { path: paths.login,            layout: null,               component: LoginPage                                      },
  { path: paths.signup,           layout: null,               component: SignupPage                                     },
  { path: paths.home,             layout: null,               component: HomePage                                       },
  { path: paths.notFound,         layout: null,               component: NotFoundPage,                                  },
  { path: paths.dashboard,        layout: DashboardLayout,    component: DashboardPage,              protected: true    },
  { path: paths.document,         layout: DashboardLayout,    component: DocumentPage,               protected: true    },
  { path: paths.wallet,           layout: DashboardLayout,    component: WalletPage,                 protected: true    },
  { path: paths.ums,              layout: DashboardLayout,    component: UMSPage,                    protected: true    },
  { path: paths.logs,             layout: DashboardLayout,    component: LogPage,                    protected: true    },
  { path: paths.accountSetting,   layout: DashboardLayout,    component: AccountSettingsPage,        protected: true    },
  { path: paths.signatures,       layout: DashboardLayout,    component: SignaturePage,              protected: true    },
  { path: paths.certificate,      layout: DashboardLayout,    component: CeritificatePage,           protected: true    },
  { path: paths.document_detail,  layout: DashboardLayout,    component: DocumentDetail,             protected: true    },
  { path: paths.document_sign,    layout: DashboardLayout,    component: DocumentSignningPage,       protected: true    },
];

export { appRoutes };
