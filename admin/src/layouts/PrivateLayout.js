import React from 'react';
import styled from 'styled-components';
import { StylesProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import {
    Root,
    getHeader,
    getContent,
    getDrawerSidebar,
    getSidebarContent,
    getFooter,
    getSidebarTrigger,
    getFixedScheme,
} from '@mui-treasury/layout';

import SharedFooter from "./SharedFooter";
import PrivateContent from "./PrivateContent";
import PrivateNavContent from "./PrivateNavContent";
import PrivateHeader from "./PrivateHeader";
import PrivateNavHeader from "./PrivateNavHeader";

const Header = getHeader(styled);
const Content = getContent(styled);
const DrawerSidebar = getDrawerSidebar(styled);
const SidebarContent = getSidebarContent(styled);
const Footer = getFooter(styled);
const SidebarTrigger = getSidebarTrigger(styled);

const fixedScheme = getFixedScheme();

const PrivateLayout = ({children}) => {
    return (
        <StylesProvider injectFirst>
            <CssBaseline />
            <Root scheme={fixedScheme}>
                {({ state: { sidebar } }) => (
                    <div className="flex flex-col h-screen overflow-hidden">
                        <Header style={{ 
                          backgroundColor: '#F5F1E9', 
                          boxShadow: 'none', 
                          borderBottom: 'none',
                          minHeight: '48px'
                        }}>
                            <Toolbar style={{ minHeight: '48px', padding: '0 16px' }}>
                                <SidebarTrigger sidebarId="primarySidebar" />
                            </Toolbar>
                        </Header>

                        <DrawerSidebar 
                            sidebarId="primarySidebar"
                            PaperProps={{
                                style: { 
                                   width: '260px',
                                   height: '100%',
                                   backgroundColor: '#F5F1E9',
                                   borderRight: '1px solid rgba(192, 160, 128, 0.1)',
                                }
                            }}
                        >
                            <SidebarContent>
                                <PrivateNavHeader collapsed={sidebar.primarySidebar.collapsed} />
                                <PrivateNavContent />
                            </SidebarContent>
                        </DrawerSidebar>

                        <Content>
                            <main className="flex-1 overflow-auto">
                                <PrivateContent>{children}</PrivateContent>
                            </main>
                        </Content>

                        <Footer>
                            <SharedFooter />
                        </Footer>
                    </div>
                )}
            </Root>
        </StylesProvider>
    );
};

export default PrivateLayout;
