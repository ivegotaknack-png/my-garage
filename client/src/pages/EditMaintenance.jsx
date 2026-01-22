import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Briefcase } from 'lucide-react';
import { ShopMaintenanceForm } from '../components/forms/ShopMaintenanceForm';
import { SelfMaintenanceForm } from '../components/forms/SelfMaintenanceForm';
import { getVehicleDetails, updateMaintenance } from '../services/api';

export function EditMaintenance() {
    const { id } = useParams(); // Record ID
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState('SHOP');
    const [initialData, setInitialData] = useState(null);
    const [vehicleId, setVehicleId] = useState(null);

    useEffect(() => {
        getMaintenanceDetail(id)
            .then(res => {
                const data = res.data;
                setType(data.type);
                setVehicleId(data.vehicleId);

                // Format for forms
                // Date needs to be YYYY-MM-DD for input[type=date]
                const formattedDate = new Date(data.date).toISOString().split('T')[0];

                const formInit = {
                    date: formattedDate,
                    mileage: data.mileage,
                    description: data.description,
                    totalCost: data.totalCost,
                    notes: data.notes || '',
                };

                if (data.type === 'SHOP') {
                    formInit.shopName = data.shopDetails?.shopName || '';
                } else {
                    formInit.laborHours = data.selfDetails?.laborHours || '';
                    formInit.diyNotes = data.selfDetails?.diyNotes || '';
                    formInit.parts = data.selfDetails?.parts || [];
                }

                setInitialData(formInit);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load maintenance record", err);
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (formData) => {
        try {
            await updateMaintenance(id, { ...formData, type });
            navigate(`/vehicles/${vehicleId}`);
        } catch (error) {
            console.error("Failed to update maintenance", error);
            alert("Failed to update maintenance");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

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
                        <h1 className="text-2xl font-bold text-gray-900">Edit Maintenance</h1>
                        <p className="text-sm text-gray-500">Record ID: {id}</p>
                    </div>
                </header>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <div className="mb-6 rounded-lg bg-blue-50 p-4 text-blue-800">
                        Editing <strong>{type === 'SHOP' ? 'Shop Service' : 'DIY / Self Record'}</strong>
                    </div>

                    {type === 'SHOP' ? (
                        <ShopMaintenanceForm
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            onCancel={() => navigate(-1)}
                            submitLabel="Save Changes"
                        />
                    ) : (
                        <SelfMaintenanceForm
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            onCancel={() => navigate(-1)}
                            submitLabel="Save Changes"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
