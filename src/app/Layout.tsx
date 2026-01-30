import { AppShell, Container, Tabs, ActionIcon, Tooltip } from '@mantine/core';
import { IconHelp } from '@tabler/icons-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname === '/') return 'settings';
    if (location.pathname.startsWith('/customers')) return 'customers';
    if (location.pathname.startsWith('/services')) return 'services';
    if (location.pathname.startsWith('/invoice')) return 'invoice';
    return 'settings';
  };

  const handleTabChange = (value: string | null) => {
    if (value === 'settings') navigate('/');
    else if (value === 'customers') navigate('/customers');
    else if (value === 'services') navigate('/services');
    else if (value === 'invoice') navigate('/invoice');
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container
          size="lg"
          h="100%"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Tabs value={getActiveTab()} onChange={handleTabChange} variant="outline">
            <Tabs.List>
              <Tabs.Tab value="settings">Einstellungen</Tabs.Tab>
              <Tabs.Tab value="customers">Kunden</Tabs.Tab>
              <Tabs.Tab value="services">Leistungen</Tabs.Tab>
              <Tabs.Tab value="invoice">Rechnung</Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <Tooltip label="Hilfe & Anleitung" position="bottom">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => navigate('/help')}
              aria-label="Hilfe"
            >
              <IconHelp size={24} />
            </ActionIcon>
          </Tooltip>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
