import { AppShell, Container, Tabs, ActionIcon, Tooltip, Group, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconHelp, IconSun, IconMoon } from '@tabler/icons-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const getActiveTab = () => {
    if (location.pathname === '/') return 'settings';
    if (location.pathname.startsWith('/customers')) return 'customers';
    if (location.pathname.startsWith('/services')) return 'services';
    if (location.pathname.startsWith('/invoice')) return 'invoices';
    if (location.pathname.startsWith('/data')) return 'data';
    return 'settings';
  };

  const handleTabChange = (value: string | null) => {
    if (value === 'settings') navigate('/');
    else if (value === 'customers') navigate('/customers');
    else if (value === 'services') navigate('/services');
    else if (value === 'invoices') navigate('/invoices');
    else if (value === 'data') navigate('/data');
  };

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
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
              <Tabs.Tab value="data">Daten</Tabs.Tab>
              <Tabs.Tab value="settings">Stammdaten</Tabs.Tab>
              <Tabs.Tab value="customers">Kunden</Tabs.Tab>
              <Tabs.Tab value="services">Leistungen</Tabs.Tab>
              <Tabs.Tab value="invoices">Rechnungen</Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <Group gap="xs">
            <Tooltip label={computedColorScheme === 'dark' ? 'Heller Modus' : 'Dunkler Modus'} position="bottom">
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={toggleColorScheme}
                aria-label="Farbschema umschalten"
              >
                {computedColorScheme === 'dark' ? <IconSun size={24} /> : <IconMoon size={24} />}
              </ActionIcon>
            </Tooltip>

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
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
