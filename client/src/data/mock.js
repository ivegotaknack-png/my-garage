export const MOCK_VEHICLES = [
    { id: '1', year: 2018, make: 'Toyota', model: 'Camry', currentMileage: 45230, licensePlate: 'ABC-123', vin: '...8899' },
    { id: '2', year: 2021, make: 'Ford', model: 'F-150', currentMileage: 12500, licensePlate: 'TRK-999', vin: '...1234' },
    { id: '3', year: 2015, make: 'Honda', model: 'Civic', currentMileage: 89000, licensePlate: 'XYZ-456', vin: '...4567' },
];

export const MOCK_HISTORY = [
    { id: '101', vehicleId: '1', date: '2023-10-15', type: 'SELF', description: 'Oil Change', mileage: 45200, cost: 35.50 },
    { id: '102', vehicleId: '1', date: '2023-06-01', type: 'SHOP', description: 'Tire Rotation', shopName: 'Discount Tire', mileage: 42000, cost: 0.00 },
    { id: '103', vehicleId: '1', date: '2023-01-20', type: 'SHOP', description: 'Brake Pad Replacement', shopName: 'Midas', mileage: 38000, cost: 250.00 },
];

export const MOCK_REMINDERS = [
    { id: '201', vehicleId: '1', vehicleName: '2018 Toyota Camry', type: 'DATE', dueDate: '2023-12-15', note: 'Oil Change Due' },
    { id: '202', vehicleId: '2', vehicleName: '2021 Ford F-150', type: 'MILEAGE', dueMileage: 13000, dueDate: '2024-01-20', note: 'Tire Rotation' },
];
