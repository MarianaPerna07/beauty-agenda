// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useAuth, AuthProvider } from "./AuthContext";
import LoginPage from "./pages/auth/Login";
import AdminPage from "./pages/auth/Admin";
import DashboardPage from "./pages/Dashboard";
import SettingsPage from "./pages/Settings";
import PrivateLayout from "./layouts/PrivateLayout";
import ClientsPage from "./pages/Clients";

function AppRoutes() {
    const { token, expiresAt } = useAuth();

    return (
        <Switch>
            <Route exact path="/">
                {token ? <Redirect to="/admin" /> : <Redirect to="/login" />}
            </Route>

            <Route path="/login">
                {token ? <Redirect to="/admin" /> : <LoginPage />}
            </Route>

            <Route path="/admin">
                {token ? <AdminPage /> : <Redirect to="/login" />}
            </Route>

            <PrivateLayout path="/dashboard">
                {token ? <DashboardPage /> : <Redirect to="/login" />}
            </PrivateLayout>

            <PrivateLayout path="/clients">
                {token ? <ClientsPage /> : <Redirect to="/login" />}
            </PrivateLayout>

            <PrivateLayout path="/settings">
                {token ? <SettingsPage /> : <Redirect to="/login" />}
            </PrivateLayout>
        </Switch>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}
