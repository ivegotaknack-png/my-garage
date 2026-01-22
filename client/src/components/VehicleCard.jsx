import React from 'react';
import { Car, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function VehicleCard({ vehicle, onEdit, onDelete, onClick }) {
    return (
        <div
            onClick={() => onClick && onClick(vehicle)}
            className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-blue-500/50 cursor-pointer"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                        <Car size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                            {vehicle.year} {vehicle.make}
                        </h3>
                        <p className="text-sm font-medium text-gray-600">{vehicle.model}</p>
                    </div>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); /* Menu logic */ }}
                    className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Mileage</p>
                    <p className="font-mono text-sm text-gray-700">{vehicle.currentMileage?.toLocaleString() ?? '---'} mi</p>
                </div>
                {vehicle.licensePlate && (
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold text-right">Plate</p>
                        <p className="font-mono text-sm text-gray-700 text-right">{vehicle.licensePlate}</p>
                    </div>
                )}
            </div>

            <div className="absolute top-5 right-12 hidden gap-2 group-hover:flex">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(vehicle); }}
                    className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                    title="Edit Vehicle"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(vehicle); }}
                    className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
                    title="Delete Vehicle"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
