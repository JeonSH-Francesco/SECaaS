import { ReactNode } from "react";
import { RouteType } from "./config";
import appRoutes from "./appRoutes";
import { Route } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import MainLayout from "../components/layout/MainLayout";
import DetailPolicyWrapper from "../pages/securityDetailSetting/component/DetailPolicyWrapper";
import SignIn from "../pages/auth/SignIn";
import AdminDashBoardPage from "../pages/admin/AdminDashboardPage";
import AdminMainLayout from "../components/layout/AdminMainLayout";
import UserManagementPage from "../pages/admin/UserManagementPage";
const generateRoute = (): ReactNode => {

    const users: RouteType[] = appRoutes.appUserRoutes;
    const customers: RouteType[] = appRoutes.appCustomerRoutes;
    const policyDetails: RouteType[] = appRoutes.appPolicyDetailRoutes;
    const admins: RouteType[] = appRoutes.appAdminRoutes;
    const token = localStorage.getItem('token');
    return [
        users.map((route, index) => (
            <Route path={route.path} element={route.element} />
        )),
        token ?
            <Route element={<MainLayout />}>
                {customers.map((route, index) => (
                    route.index ? (
                        <Route index path={route.path} element={
                            <PageWrapper state={route.state}>
                                {route.element}
                            </PageWrapper>} />
                    ) : (
                        <Route path={route.path} element={
                            <PageWrapper state={route.child ? undefined : route.state}>
                                {route.element}
                            </PageWrapper>
                        } key={index}>
                            {
                                route.child && route.child.map((route, index) => (
                                    <Route index path={route.path} element={
                                        <PageWrapper state={route.state}>
                                            {route.element}
                                        </PageWrapper>} />
                                )
                                )
                            }
                        </Route>
                    )
                ))}</Route>
            : <Route path='/users/signup' element={<SignIn />} />,
        token ? <Route element={<MainLayout />}>
            {policyDetails.map((route, index) => (
                <Route path={route.path} element={
                    <PageWrapper>
                        <DetailPolicyWrapper state={route.state}>
                            {route.element}
                        </DetailPolicyWrapper>
                    </PageWrapper>
                }></Route>
            ))}
        </Route>
            : <Route path='/users/signup' element={<SignIn />} />,

            token ? (
                <Route element={<AdminMainLayout />}>
                  {admins.map((route, index) => (
                    <Route path={route.path} element={
                      <PageWrapper>
                        {route.state === "pi5neer" ? (
                          route.element // Render the corresponding element for the "pi5neer" state
                        ) : null}
                      </PageWrapper>
                    } />
                  ))}
                  {/* Add a route for UserManagementPage */}
                  <Route path="/pi5neer/user-management" element={
                    <PageWrapper>
                      <UserManagementPage />
                    </PageWrapper>
                  } />
                </Route>
              ) : (
                <Route path='/users/signup' element={<SignIn />} />
              ),

    ]
}
export const routes: ReactNode = generateRoute(); 