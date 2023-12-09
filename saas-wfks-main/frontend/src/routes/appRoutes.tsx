import React from "react"
import { RouteType } from "./config";
import SecuritySettingLayout from "../pages/securitySetting/SecuritySettingLayout"
import ExceptionUrlPage from "../pages/securitySetting/ExceptionUrlPage"
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ExceptionIpPage from "../pages/securitySetting/ExceptionIpPage";
import DomainSettingPage from "../pages/domainSetting/DomainSettingPage";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import SubjectIcon from '@mui/icons-material/Subject';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DashboardPage from "../pages/dashboard/DashboardPage";
import SecurityLogPage from "../pages/securityLog/SecurityLogPage";
import BlockedIpPage from "../pages/securitySetting/BlockedIpPage";
import SqlInjectionPage from "../pages/securityDetailSetting/SqlInjectionPage";
import UrlRegxPage from "../pages/securityDetailSetting/UrlRegxPage";
import XssPage from "../pages/securityDetailSetting/XssPage";
import UpDownloadPage from "../pages/securityDetailSetting/UpDownloadPage";
import EvasionPage from "../pages/securityDetailSetting/EvasionPage";
import AccessControlPage from "../pages/securityDetailSetting/AccessControlPage";
import RequestFloodPage from "../pages/securityDetailSetting/RequestFloodPage";
import CredentialStuffingPage from "../pages/securityDetailSetting/CredentialStuffingPage";
import CookieProtectionPage from "../pages/securityDetailSetting/CookieProtectionPage";
import ShellCodePage from "../pages/securityDetailSetting/ShellCodePage";
import SignUp from "../pages/auth/SignUp";
import SignIn from "../pages/auth/SignIn";
import DirectoryListingPage from "../pages/securityDetailSetting/DirectoryListingPage";
import BufferOverflowPage from "../pages/securityDetailSetting/BufferOverflowPage";
import DetailPolicyWrapper from "../pages/securityDetailSetting/component/DetailPolicyWrapper";
import AdminDashBoardPage from "../pages/admin/AdminDashboardPage";
import UserManagementPage from "../pages/admin/UserManagementPage"; 

const appUserRoutes: RouteType[] = [
    {
        state: "signin",
        element: <SignIn />
    },
    {
        path: "/users/signup",
        state: "signup",
        element: <SignUp />
    },
    {
        path: "/users/signin",
        state: "signin",
        element: <SignIn />
    }
]

const appCustomerRoutes: RouteType[] = [
    {
        index: true,
        path: "/customers/dashboard",
        element: <DashboardPage />,
        state: "dashboard",
        sidebarProps: {
            displayText: "대시보드",
            icon: <SpaceDashboardIcon />
        }
    },
    {
        index: true,
        path: "/customers/security-logs",
        element: <SecurityLogPage />,
        state: "security-logs",
        sidebarProps: {
            displayText: "보안로그",
            icon: <SubjectIcon />
        }
    },
    {
        index: false,
        path: "/customers/security-settings",
        element: <SecuritySettingLayout />,
        state: "security-settings",
        sidebarProps: {
            displayText: "보안 설정 관리",
            icon: <AdminPanelSettingsIcon />
        },
        child: [
            {
                path: "/customers/security-settings/exception-urls",
                element: <ExceptionUrlPage />,
                state: "security-settings.exception-urls",
                sidebarProps: {
                    displayText: "적용/예외 URL 관리"
                }
            },
            {
                path: "/customers/security-settings/exception-ips",
                element: <ExceptionIpPage />,
                state: "security-settings.exception-ips",
                sidebarProps: {
                    displayText: "적용/예외 IP 관리"
                }
            },
            {
                path: "/customers/security-settings/blocked-ips",
                element: <BlockedIpPage />,
                state: "security-settings.blocked-ips",
                sidebarProps: {
                    displayText: "차단 IP 관리"
                }
            },
            {
                path: "/customers/security-settings/policy-details",
                element: <DetailPolicyWrapper children={<SqlInjectionPage name={"SQL-Injection"}></SqlInjectionPage>}></DetailPolicyWrapper>,
                state: "security-settings.policy-details.sql-injection",
                sidebarProps: {
                    displayText: "정책 상세 관리"
                },
            }
        ]
    },
    {
        path: "/customers/domain-settings",
        element: <DomainSettingPage />,
        state: "domain-settings",
        sidebarProps: {
            displayText: "도메인 설정 관리",
            icon: <ManageAccountsIcon />
        }
    }
]


const appPolicyDetailRoutes: RouteType[] = [
    {
        path: "/customers/security-settings/policy-details/sql-injection",
        element: <SqlInjectionPage name={"SQL-Injection"} />,
        state: "security-settings.policy-details.sql-injection",
        sidebarProps: {
            displayText: "SQL-Injection"
        }
    },
    {
        path: "/customers/security-settings/policy-details/url_regex",
        element: <UrlRegxPage name={"URL 정규식 검사"} />,
        state: "security-settings.policy-details.url_regex",
        sidebarProps: {
            displayText: "URL 정규식 검사"
        }
    },
    {
        path: "/customers/security-settings/policy-details/xss",
        element: <XssPage name={"XSS"} />,
        state: "security-settings.policy-details.xss",
        sidebarProps: {
            displayText: "XSS"
        }
    },
    {
        path: "/customers/security-settings/policy-details/directory_listing",
        element: <DirectoryListingPage name={"디렉토리 리스팅"} />,
        state: "security-settings.policy-details.directory_listing",
        sidebarProps: {
            displayText: "디렉토리 리스팅"
        }
    },
    {
        path: "/customers/security-settings/policy-details/shellcode",
        element: <ShellCodePage name={"쉘코드"} />,
        state: "security-settings.policy-details.shellcode",
        sidebarProps: {
            displayText: "쉘코드"
        }
    },
    {
        path: "/customers/security-settings/policy-details/up-download",
        element: <UpDownloadPage name={"업/다운로드 검사"} />,
        state: "security-settings.policy-details.up-download",
        sidebarProps: {
            displayText: "업/다운로드 검사"
        }
    },
    {
        path: "/customers/security-settings/policy-details/request-flood",
        element: <RequestFloodPage name={"과다 요청 제어"} />,
        state: "security-settings.policy-details.request-flood",
        sidebarProps: {
            displayText: "과다 요청 제어"
        }
    },
    {
        path: "/customers/security-settings/policy-details/access-control",
        element: <AccessControlPage name={"접근 제어"} />,
        state: "security-settings.policy-details.access-control",
        sidebarProps: {
            displayText: "접근 제어"
        }
    },
    {
        path: "/customers/security-settings/policy-details/evasion",
        element: <EvasionPage name={"검사 회피"} />,
        state: "security-settings.policy-details.evasion",
        sidebarProps: {
            displayText: "검사 회피"
        }
    },
    {
        path: "/customers/security-settings/policy-details/credential-stuffing",
        element: <CredentialStuffingPage name={"크리덴셜 스터프"} />,
        state: "security-settings.policy-details.credential-stuffing",
        sidebarProps: {
            displayText: "크리덴셜 스터프"
        }
    },
    {
        path: "/customers/security-settings/policy-details/cookie-protection",
        element: <CookieProtectionPage name={"쿠키 보호"} />,
        state: "security-settings.policy-details.cookie-protection",
        sidebarProps: {
            displayText: "쿠키 보호"
        }
    },
    {
        path: "/customers/security-settings/policy-details/buffer-overflow",
        element: <BufferOverflowPage name={"버퍼 오버 플로우"} />,
        state: "security-settings.policy-details.buffer-overflow",
        sidebarProps: {
            displayText: "버퍼 오버 플로우"
        }
    },

]

const appAdminRoutes: RouteType[] = [
    {
        state: "admin",
        element: <AdminDashBoardPage />
    },
    {
        path: "/pi5neer/dashboard",
        state: "pi5neer",
        element: <AdminDashBoardPage />,
        sidebarProps: {
            icon: <SpaceDashboardIcon />,
            displayText: "대시보드"
        }
    },
    {
        path: "/pi5neer/user-management", // Adjust the path as needed
        state: "pi5neer",
        element: <UserManagementPage />,
        sidebarProps: {
          displayText: "사용자 관리",
          icon: <AdminPanelSettingsIcon />
        }
    }
]


const appRoutes = {
    appUserRoutes: appUserRoutes,
    appCustomerRoutes: appCustomerRoutes,
    appPolicyDetailRoutes: appPolicyDetailRoutes,
    appAdminRoutes : appAdminRoutes
}

export default appRoutes;