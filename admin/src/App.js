// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useAuth, AuthProvider } from "./AuthContext";
import LoginPage from "./pages/auth/Login";
import AdminPage from "./pages/auth/Admin";
import DashboardPage from "./pages/Dashboard";
import SettingsPage from "./pages/Settings";
import PrivateLayout from "./layouts/PrivateLayout";

function AppRoutes() {
    const { token, expiresAt } = useAuth();

    return (
        <Switch>
            <Route exact path="/">
                {token ? <Redirect to="/admin" /> : <Redirect to="/login" />}
            </Route>

            <Route path="/login">
                {/* If already logged in, go straight to /admin */}
                {token ? <Redirect to="/admin" /> : <LoginPage />}
            </Route>

            <Route path="/admin">
                {/* Admin is protected, so redirect if not logged in */}
                {token ? <AdminPage /> : <Redirect to="/login" />}
            </Route>

            <Route path="/dashboard">
                <DashboardPage />
            </Route>

            <Route path="/settings">
                <SettingsPage />
            </Route>
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
