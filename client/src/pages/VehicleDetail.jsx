import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, History, Wrench, Settings, Trash2, Edit2 } from 'lucide-react';

import { getVehicleDetails, deleteVehicle, deleteMaintenance } from '../services/api';

export function VehicleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getVehicleDetails(id)
            .then(res => {
                setVehicle(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch vehicle", err);
                setLoading(false);
            });
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this vehicle and all its records?')) {
            try {
                await deleteVehicle(id);
                navigate('/');
            } catch (error) {
                console.error('Failed to delete vehicle', error);
                alert('Failed to delete vehicle');
            }
        }
    };

    const handleDeleteMaintenance = async (recordId) => {
        if (window.confirm('Are you sure you want to delete this maintenance record?')) {
            try {
                await deleteMaintenance(recordId);
                // Refresh data
                const res = await getVehicleDetails(id);
                setVehicle(res.data);
            } catch (error) {
                console.error('Failed to delete maintenance record', error);
                alert('Failed to delete record');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!vehicle) return <div className="p-8 text-center">Vehicle not found</div>;

    // Use real history from API if available (via relation), else fall back or empty
    const history = vehicle.records || [];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-6 shadow-sm sm:px-6">
                <div className="mx-auto max-w-3xl">
                    <button
                        onClick={() => navigate('/')}
                        className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
                    >
                        <ArrowLeft size={16} />
                        Back to Garage
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
                            <p className="font-mono text-sm text-gray-500">VIN: {vehicle.vin}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => alert('Settings coming soon!')}
                                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                title="Vehicle Settings"
                            >
                                <Settings size={20} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Delete Vehicle"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <div className="rounded-lg bg-blue-50 px-4 py-2">
                            <p className="text-xs font-semibold uppercase text-blue-600">Odometer</p>
                            <p className="text-lg font-bold text-blue-900">{vehicle.currentMileage.toLocaleString()} mi</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto mt-8 max-w-3xl px-4 sm:px-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                        <History size={20} className="text-gray-500" />
                        Maintenance History
                    </h2>
                    <button
                        onClick={() => navigate(`/vehicles/${id}/add-maintenance`)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95"
                    >
                        <Plus size={16} />
                        Log Service
                    </button>
                </div>

                <div className="space-y-4">
                    {history.map((record) => (
                        <div key={record.id} className="relative flex gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md">
                            <div className={`mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full ${record.type === 'SELF' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                <Wrench size={18} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="font-semibold text-gray-900">{record.description}</h3>
                                    <span className="font-mono text-sm font-medium text-gray-600">${(record.totalCost || 0).toFixed(2)}</span>
                                </div>
                                <div className="mt-1 flex gap-3 text-sm text-gray-500">
                                    <span>{new Date(record.date).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{record.mileage.toLocaleString()} mi</span>
                                    <span>•</span>
                                    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${record.type === 'SELF' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                        {record.type}
                                    </span>
                                </div>
                                {record.shopDetails?.shopName && (
                                    <p className="mt-2 text-xs text-gray-400">Performed at {record.shopDetails.shopName}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => navigate(`/maintenance/${record.id}/edit`)}
                                    className="rounded-full p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    title="Edit Record"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteMaintenance(record.id)}
                                    className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="Delete Record"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
