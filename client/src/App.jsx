import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { AddVehicle } from './pages/AddVehicle';
import { VehicleDetail } from './pages/VehicleDetail';
import { AddMaintenance } from './pages/AddMaintenance';
import { EditMaintenance } from './pages/EditMaintenance';
import { AddReminder } from './pages/AddReminder';
import { EditReminder } from './pages/EditReminder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/vehicles/:id/add-maintenance" element={<AddMaintenance />} />
        <Route path="/maintenance/:id/edit" element={<EditMaintenance />} />
        <Route path="/add-reminder" element={<AddReminder />} />
        <Route path="/reminders/:id/edit" element={<EditReminder />} />
      </Routes>
    </Router>
  );
}

export default App;
