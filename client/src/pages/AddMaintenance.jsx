import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Briefcase } from 'lucide-react';
import { ShopMaintenanceForm } from '../components/forms/ShopMaintenanceForm';
import { SelfMaintenanceForm } from '../components/forms/SelfMaintenanceForm';

import api from '../services/api';

export function AddMaintenance() {
    const { id } = useParams(); // Vehicle ID (in real app)
    const navigate = useNavigate();
    const [type, setType] = useState('SHOP'); // 'SHOP' or 'SELF'

    const handleSubmit = async (data) => {
        try {
            console.log('Submitting Maintenance:', { vehicleId: id, ...data });
            await api.post('/maintenance', { vehicleId: id, ...data });
            navigate(`/vehicles/${id}`);
        } catch (error) {
            console.error("Failed to log maintenance", error);
            const message = error.response?.data?.error || "Failed to log maintenance";
            alert(message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto max-w-3xl">
                <header className="mb-6 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Log Maintenance</h1>
                        <p className="text-sm text-gray-500">Vehicle ID: {id}</p>
                    </div>
                </header>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    {/* Type Toggle */}
                    <div className="mb-8 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-1.5">
                        <button
                            onClick={() => setType('SHOP')}
                            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${type === 'SHOP'
                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Briefcase size={18} />
                            Shop Service
                        </button>
                        <button
                            onClick={() => setType('SELF')}
                            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${type === 'SELF'
                                ? 'bg-white text-green-600 shadow-sm ring-1 ring-gray-200'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Wrench size={18} />
                            DIY / Self
                        </button>
                    </div>

                    {/* Forms */}
                    {type === 'SHOP' ? (
                        <ShopMaintenanceForm
                            onSubmit={handleSubmit}
                            onCancel={() => navigate(-1)}
                        />
                    ) : (
                        <SelfMaintenanceForm
                            onSubmit={handleSubmit}
                            onCancel={() => navigate(-1)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
