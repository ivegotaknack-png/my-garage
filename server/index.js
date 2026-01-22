const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// GET /api/vehicles
app.get('/api/vehicles', async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
});

// GET /api/vehicles/:id
app.get('/api/vehicles/:id', async (req, res) => {
    try {
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: req.params.id },
            include: {
                records: {
                    include: {
                        shopDetails: true,
                        selfDetails: true
                    },
                    orderBy: { date: 'desc' }
                },
                reminders: true
            }
        });
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vehicle' });
    }
});

// POST /api/vehicles
app.post('/api/vehicles', async (req, res) => {
    try {
        const { year, make, model, vin, licensePlate, currentMileage } = req.body;
        const vehicle = await prisma.vehicle.create({
            data: {
                year: parseInt(year),
                make,
                model,
                vin,
                licensePlate,
                currentMileage: parseInt(currentMileage) || 0,
                // Ensure user exists
                user: {
                    connectOrCreate: {
                        where: { email: 'demo@example.com' },
                        create: { email: 'demo@example.com', name: 'Demo User' }
                    }
                }
            }
        });
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
});
// POST /api/maintenance
app.post('/api/maintenance', async (req, res) => {
    try {
        const { vehicleId, date, type, mileage, description, totalCost, notes, shopName, laborHours, diyNotes, parts } = req.body;

        // Validate and Parse Inputs
        const parsedMileage = parseInt(mileage);
        const parsedCost = parseFloat(totalCost);
        const parsedLabor = laborHours ? parseFloat(laborHours) : 0;

        console.log('Processing Maintenance:', { vehicleId, type, parsedMileage, parsedCost });

        if (isNaN(parsedMileage)) throw new Error(`Invalid Mileage: ${mileage}`);
        if (isNaN(parsedCost)) throw new Error(`Invalid Cost: ${totalCost}`);

        const record = await prisma.maintenanceRecord.create({
            data: {
                vehicleId,
                date: new Date(date),
                type,
                mileage: parsedMileage,
                description,
                totalCost: parsedCost,
                notes,
                // Nested writes for specific types
                shopDetails: type === 'SHOP' ? {
                    create: { shopName }
                } : undefined,
                selfDetails: type === 'SELF' ? {
                    create: {
                        laborHours: parsedLabor,
                        diyNotes,
                        parts: {
                            create: (parts || []).map(p => ({
                                partName: p.partName,
                                partNumber: p.partNumber,
                                cost: parseFloat(p.cost),
                                quantity: parseInt(p.quantity)
                            }))
                        }
                    }
                } : undefined
            }
        });

        // Update vehicle mileage if this record is higher
        const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
        if (vehicle && parseInt(mileage) > vehicle.currentMileage) {
            await prisma.vehicle.update({
                where: { id: vehicleId },
                data: { currentMileage: parseInt(mileage) }
            });
        }

        res.json(record);
    } catch (error) {
        console.error('Maintenance Log Error:', error);
        res.status(500).json({ error: `Failed to create record: ${error.message}` });
    }
});

// GET /api/maintenance/:id
app.get('/api/maintenance/:id', async (req, res) => {
    try {
        const record = await prisma.maintenanceRecord.findUnique({
            where: { id: req.params.id },
            include: {
                shopDetails: true,
                selfDetails: {
                    include: { parts: true }
                }
            }
        });
        if (!record) return res.status(404).json({ error: 'Record not found' });
        res.json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch record' });
    }
});

// PUT /api/maintenance/:id
app.put('/api/maintenance/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { date, type, mileage, description, totalCost, notes, shopName, laborHours, diyNotes, parts } = req.body;

        // Clean up basic types
        const parsedMileage = parseInt(mileage);
        const parsedCost = parseFloat(totalCost);
        const parsedLabor = laborHours ? parseFloat(laborHours) : 0;

        // First, delete existing details to avoid conflicts or complex upserts
        await prisma.shopMaintenanceDetail.deleteMany({ where: { recordId: id } });
        await prisma.selfMaintenanceDetail.deleteMany({ where: { recordId: id } });
        // Start transaction if needed (implicit here is fine for sqlite usually, but careful with atomicity)

        const record = await prisma.maintenanceRecord.update({
            where: { id },
            data: {
                date: new Date(date),
                type,
                mileage: parsedMileage,
                description,
                totalCost: parsedCost,
                notes,
                shopDetails: type === 'SHOP' ? {
                    create: { shopName }
                } : undefined,
                selfDetails: type === 'SELF' ? {
                    create: {
                        laborHours: parsedLabor,
                        diyNotes,
                        parts: {
                            create: (parts || []).map(p => ({
                                partName: p.partName,
                                partNumber: p.partNumber,
                                cost: parseFloat(p.cost),
                                quantity: parseInt(p.quantity)
                            }))
                        }
                    }
                } : undefined
            }
        });

        res.json(record);
    } catch (error) {
        console.error('Maintenance Update Error:', error);
        res.status(500).json({ error: `Failed to update value: ${error.message}` });
    }
});

// GET /api/reminders
app.get('/api/reminders', async (req, res) => {
    try {
        const reminders = await prisma.reminder.findMany({
            include: {
                vehicle: {
                    select: {
                        year: true,
                        make: true,
                        model: true
                    }
                }
            },
            orderBy: { dueDate: 'asc' }
        });
        // Flatten vehicle name for frontend convenience
        const results = reminders.map(r => ({
            ...r,
            vehicleName: `${r.vehicle.year} ${r.vehicle.make} ${r.vehicle.model}`
        }));
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
});

// GET /api/reminders/:id
app.get('/api/reminders/:id', async (req, res) => {
    try {
        const reminder = await prisma.reminder.findUnique({
            where: { id: req.params.id }
        });
        if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
        res.json(reminder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch reminder' });
    }
});

// POST /api/reminders
app.post('/api/reminders', async (req, res) => {
    try {
        const { vehicleId, type, dueDate, dueMileage, note } = req.body;
        const reminder = await prisma.reminder.create({
            data: {
                vehicleId,
                type,
                dueDate: dueDate ? new Date(dueDate) : null,
                dueMileage: dueMileage ? parseInt(dueMileage) : null,
                note
            }
        });
        res.json(reminder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create reminder' });
    }
});

// PUT /api/reminders/:id
app.put('/api/reminders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { type, dueDate, dueMileage, note } = req.body;
        const reminder = await prisma.reminder.update({
            where: { id },
            data: {
                type,
                dueDate: dueDate ? new Date(dueDate) : null,
                dueMileage: dueMileage ? parseInt(dueMileage) : null,
                note
            }
        });
        res.json(reminder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update reminder' });
    }
});

// DELETE /api/vehicles/:id
app.delete('/api/vehicles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Delete related records first if not using cascade in Prisma (SQLite needs help sometimes)
        await prisma.maintenanceRecord.deleteMany({ where: { vehicleId: id } });
        await prisma.reminder.deleteMany({ where: { vehicleId: id } });
        await prisma.vehicle.delete({ where: { id } });
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
});

// DELETE /api/maintenance/:id
app.delete('/api/maintenance/:id', async (req, res) => {
    try {
        await prisma.maintenanceRecord.delete({ where: { id: req.params.id } });
        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

// DELETE /api/reminders/:id
app.delete('/api/reminders/:id', async (req, res) => {
    try {
        await prisma.reminder.delete({ where: { id: req.params.id } });
        res.json({ message: 'Reminder deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete reminder' });
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
    console.error('Server failed to start:', error);
});

// Keep-alive heartbeat to prevent premature exit if event loop drains
setInterval(() => {
    // Heartbeat
}, 60000);
