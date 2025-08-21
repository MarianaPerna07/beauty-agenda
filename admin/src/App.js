// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useAuth, AuthProvider } from "./AuthContext";
import LoginPage from "./pages/auth/Login";
import DashboardPage from "./pages/Dashboard";
import SettingsPage from "./pages/Settings";
import PrivateLayout from "./layouts/PrivateLayout";
import ClientsPage from "./pages/Clients";
import ChooseEsthetician from "./pages/ChooseEsthetician";

function AppRoutes() {
    const { token, selectedWorker } = useAuth();

    return (
        <Switch>
            <Route exact path="/">
                {!token
                    ? <Redirect to="/login" />
                    : (selectedWorker ? <Redirect to="/dashboard" /> : <Redirect to="/choose-esthetician" />)}
            </Route>

            <Route path="/login">
                {token
                    ? <Redirect to={selectedWorker ? "/dashboard" : "/choose-esthetician"} />
                    : <LoginPage />}
            </Route>

            <Route path="/choose-esthetician">
                {token ? <ChooseEsthetician /> : <Redirect to="/login" />}
            </Route>

            <PrivateLayout exact path="/dashboard">
                {token ? <DashboardPage /> : <Redirect to="/login" />}
            </PrivateLayout>

            <PrivateLayout exact path="/clients">
                {token ? <ClientsPage /> : <Redirect to="/login" />}
            </PrivateLayout>

            <PrivateLayout exact path="/settings">
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
