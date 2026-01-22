import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Save, Trash2 } from 'lucide-react';
import { getReminderDetail, updateReminder, deleteReminder } from '../services/api';

export function EditReminder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        vehicleId: '',
        type: 'DATE',
        dueDate: '',
        dueMileage: '',
        note: ''
    });
    const [vehicleName, setVehicleName] = useState('');

    useEffect(() => {
        getReminderDetail(id)
            .then(res => {
                const data = res.data;
                setFormData({
                    vehicleId: data.vehicleId,
                    type: data.type,
                    dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '',
                    dueMileage: data.dueMileage || '',
                    note: data.note
                });
                // We'd ideally fetch vehicle name too, but let's just show ID or skip for now to keep it simple
                // or assume the user knows which vehicle this reminder is for.
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch reminder", err);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateReminder(id, formData);
            navigate('/');
        } catch (error) {
            console.error('Failed to update reminder', error);
            alert('Failed to save reminder');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this reminder?')) {
            try {
                await deleteReminder(id);
                navigate('/');
            } catch (error) {
                console.error('Failed to delete reminder', error);
                alert('Failed to delete reminder');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto max-w-2xl">
                <header className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Reminder</h1>
                    </div>

                    <button
                        onClick={handleDelete}
                        className="rounded-full p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                        title="Delete Reminder"
                    >
                        <Trash2 size={24} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    {/* Read-only info */}
                    <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                        Editing reminder for Vehicle ID: <span className="font-mono font-semibold">{formData.vehicleId}</span>
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
                            disabled={saving}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
