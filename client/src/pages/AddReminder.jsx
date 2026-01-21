import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Clock, Save } from 'lucide-react';
import { MOCK_VEHICLES } from '../data/mock';

export function AddReminder() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vehicleId: MOCK_VEHICLES[0]?.id || '',
        type: 'DATE', // 'DATE' or 'MILEAGE'
        dueDate: '',
        dueMileage: '',
        note: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Creating Reminder:', formData);
        // TODO: API Call
        navigate('/');
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
                    <h1 className="text-2xl font-bold text-gray-900">Set Reminder</h1>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    {/* Vehicle Selection */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Vehicle</label>
                        <select
                            name="vehicleId"
                            value={formData.vehicleId}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        >
                            {MOCK_VEHICLES.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.year} {v.make} {v.model}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: 'DATE' }))}
                            className={`flex items-center justify-center gap-2 rounded-lg border p-4 transition-all ${formData.type === 'DATE'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <Calendar size={20} />
                            <span className="font-medium">By Date</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: 'MILEAGE' }))}
                            className={`flex items-center justify-center gap-2 rounded-lg border p-4 transition-all ${formData.type === 'MILEAGE'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <Clock size={20} />
                            <span className="font-medium">By Mileage</span>
                        </button>
                    </div>

                    {/* Dynamic Inputs */}
                    {formData.type === 'DATE' ? (
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                required
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Due Mileage</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="dueMileage"
                                    required
                                    placeholder="e.g. 50000"
                                    value={formData.dueMileage}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 p-2.5 pr-10 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-gray-500 sm:text-sm">mi</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Note */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Note / Reminder Text</label>
                        <input
                            type="text"
                            name="note"
                            required
                            placeholder="e.g. Oil Change, Registration Renewal"
                            value={formData.note}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
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
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            <Save size={18} />
                            Save Reminder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
