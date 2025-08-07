import React from 'react';
import Typography from "@material-ui/core/Typography";
import { useAuth } from "../AuthContext";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

function SettingsPage() {

    const { token } = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (!token) {
            history.replace("/login");
        } 
    }, [token, history]);

    return (
        <Typography variant={"h6"} noWrap>
            Settings Page
        </Typography>
    );
}

export default SettingsPage;
