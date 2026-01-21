import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../services/api';

export function AddVehicle() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        year: new Date().getFullYear(),
        make: '',
        model: '',
        vin: '',
        licensePlate: '',
        currentMileage: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convert mileage/year to numbers
            const payload = {
                ...formData,
                year: parseInt(formData.year),
                currentMileage: parseInt(formData.currentMileage) || 0,
                userId: 'demo-user-123'
            };

            await api.post('/vehicles', payload);
            navigate('/');
        } catch (error) {
            console.error('Failed to save vehicle', error);
            alert('Failed to save vehicle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto max-w-2xl">
                <header className="mb-6 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Year</label>
                            <input
                                type="number"
                                name="year"
                                required
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Make</label>
                            <input
                                type="text"
                                name="make"
                                required
                                placeholder="e.g. Toyota"
                                value={formData.make}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">Model</label>
                            <input
                                type="text"
                                name="model"
                                required
                                placeholder="e.g. Camry SE"
                                value={formData.model}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Current Mileage</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="currentMileage"
                                    required
                                    min="0"
                                    value={formData.currentMileage}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 p-2.5 pr-10 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-gray-500 sm:text-sm">mi</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">License Plate</label>
                            <input
                                type="text"
                                name="licensePlate"
                                placeholder="ABC-123"
                                value={formData.licensePlate}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">VIN (Optional)</label>
                            <input
                                type="text"
                                name="vin"
                                placeholder="17-character VIN"
                                value={formData.vin}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Save Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
