import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './theme.css';
import './print.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from './theme';
import { Layout } from './app/Layout';
import { CustomersPage } from './pages/CustomersPage';
import { ServicesPage } from './pages/ServicesPage';
import { InvoicesListPage } from './pages/InvoicesListPage';
import { InvoicePage } from './pages/InvoicePage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<SettingsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="invoices" element={<InvoicesListPage />} />
            <Route path="invoice/:invoiceId" element={<InvoicePage />} />
            <Route path="help" element={<HelpPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
