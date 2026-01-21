import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Bell } from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';
import { ReminderList } from '../components/ReminderList';
import { getVehicles } from '../services/api';
import { MOCK_REMINDERS } from '../data/mock';

export function Dashboard() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    // Defensive fallback if MOCK_REMINDERS import fails or is undefined
    const [reminders, setReminders] = useState(MOCK_REMINDERS || []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getVehicles()
            .then(res => {
                setVehicles(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch vehicles", err);
                setLoading(false);
            });
    }, []);

    const handleVehicleClick = (v) => {
        navigate(`/vehicles/${v.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Garage</h1>
                    <p className="text-gray-500">Manage your family fleet</p>
                </div>
                <button
                    onClick={() => navigate('/add-vehicle')}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Add Vehicle</span>
                </button>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Vehicles List (2/3 width on large screens) */}
                <div className="lg:col-span-2">
                    <h2 className="mb-4 text-lg font-bold text-gray-900">Vehicles</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {vehicles.map((vehicle) => (
                            <VehicleCard
                                key={vehicle.id}
                                vehicle={vehicle}
                                onClick={handleVehicleClick}
                                onEdit={(v) => console.log('Edit', v)}
                            />
                        ))}

                        {/* Empty State / Add Helper */}
                        {vehicles.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-12 text-center">
                                <div className="mb-4 rounded-full bg-gray-100 p-4 text-gray-400">
                                    <Plus size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No vehicles yet</h3>
                                <p className="text-gray-500">Add your first car to start tracking maintenance.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reminders Sidebar (1/3 width) */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                            <Bell size={20} className="text-orange-500" />
                            Upcoming
                        </h2>
                    </div>
                    <ReminderList reminders={reminders} />
                </div>
            </div>
        </div>
    );
}
