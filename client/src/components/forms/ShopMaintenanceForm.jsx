import React, { useState } from 'react';
import { Calendar, DollarSign, FileText, MapPin, Upload } from 'lucide-react';

export function ShopMaintenanceForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        shopName: '',
        description: '',
        totalCost: '',
        mileage: '',
        notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, type: 'SHOP' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                {/* Date */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Date of Service</label>
                    <div className="relative">
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 p-2.5 pl-10 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <Calendar className="pointer-events-none absolute left-3 top-3 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Mileage */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Mileage</label>
                    <input
                        type="number"
                        name="mileage"
                        required
                        placeholder="e.g. 45000"
                        value={formData.mileage}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Shop Name */}
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Shop / Graphic Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="shopName"
                            required
                            placeholder="e.g. Firestone Complete Auto Care"
                            value={formData.shopName}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 p-2.5 pl-10 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <MapPin className="pointer-events-none absolute left-3 top-3 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Service Description */}
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Service Description</label>
                    <input
                        type="text"
                        name="description"
                        required
                        placeholder="e.g. Oil Change & Tire Rotation"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Cost */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Total Cost</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="totalCost"
                            required
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.totalCost}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 p-2.5 pl-10 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <DollarSign className="pointer-events-none absolute left-3 top-3 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Receipt Upload (Mock) */}
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Receipt / Invoice</label>
                    <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100">
                        <Upload className="mb-2 text-gray-400" size={24} />
                        <p className="text-sm text-gray-500">Click to upload photo or PDF</p>
                    </div>
                </div>

                {/* Notes */}
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Additional Notes</label>
                    <textarea
                        name="notes"
                        rows="3"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                    Save Record
                </button>
            </div>
        </form>
    );
}
