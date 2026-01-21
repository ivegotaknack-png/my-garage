import React, { useState } from 'react';
import { Calendar, Clock, FileText, Plus, Trash2, Box } from 'lucide-react';

export function SelfMaintenanceForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        mileage: '',
        laborHours: '',
        diyNotes: '',
        parts: [{ id: Date.now(), partName: '', partNumber: '', cost: '', quantity: 1 }]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePartChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            parts: prev.parts.map(p => p.id === id ? { ...p, [field]: value } : p)
        }));
    };

    const addPart = () => {
        setFormData(prev => ({
            ...prev,
            parts: [...prev.parts, { id: Date.now(), partName: '', partNumber: '', cost: '', quantity: 1 }]
        }));
    };

    const removePart = (id) => {
        setFormData(prev => ({
            ...prev,
            parts: prev.parts.filter(p => p.id !== id)
        }));
    };

    const calculateTotal = () => {
        return formData.parts.reduce((sum, part) => {
            return sum + ((parseFloat(part.cost) || 0) * (parseInt(part.quantity) || 0));
        }, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            type: 'SELF',
            totalCost: calculateTotal()
        });
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

                {/* Service Description */}
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Service Description</label>
                    <input
                        type="text"
                        name="description"
                        required
                        placeholder="e.g. Oil Change"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Labor Hours */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Labor Hours</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="laborHours"
                            step="0.5"
                            min="0"
                            placeholder="e.g. 1.5"
                            value={formData.laborHours}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 p-2.5 pl-10 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <Clock className="pointer-events-none absolute left-3 top-3 text-gray-400" size={18} />
                    </div>
                </div>
            </div>

            {/* Parts Section */}
            <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-medium text-gray-900">
                        <Box size={18} className="text-gray-500" />
                        Parts Used
                    </h3>
                    <button
                        type="button"
                        onClick={addPart}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        + Add Part
                    </button>
                </div>

                <div className="space-y-3">
                    {formData.parts.map((part) => (
                        <div key={part.id} className="grid grid-cols-12 gap-2">
                            <div className="col-span-12 sm:col-span-5">
                                <input
                                    type="text"
                                    placeholder="Part Name"
                                    value={part.partName}
                                    onChange={(e) => handlePartChange(part.id, 'partName', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-3">
                                <input
                                    type="text"
                                    placeholder="Part #"
                                    value={part.partNumber}
                                    onChange={(e) => handlePartChange(part.id, 'partNumber', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="col-span-5 sm:col-span-2">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Cost"
                                    value={part.cost}
                                    onChange={(e) => handlePartChange(part.id, 'cost', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="relative col-span-5 sm:col-span-1">
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Qty"
                                    value={part.quantity}
                                    onChange={(e) => handlePartChange(part.id, 'quantity', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="col-span-2 flex items-center justify-center sm:col-span-1">
                                {formData.parts.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePart(part.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-end border-t border-gray-200 pt-3">
                    <p className="text-sm font-medium text-gray-600">Total Parts Cost: <span className="text-gray-900">${calculateTotal().toFixed(2)}</span></p>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">DIY Notes / Tutorial Link</label>
                <textarea
                    name="diyNotes"
                    rows="3"
                    placeholder="Steps taken, difficulties, or link to YouTube video..."
                    value={formData.diyNotes}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 p-2.5 shadow-sm ring-1 ring-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
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
                    className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                >
                    Save Log
                </button>
            </div>
        </form>
    );
}
