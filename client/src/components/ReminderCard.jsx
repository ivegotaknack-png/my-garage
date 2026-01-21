import React from 'react';
import { Bell, Calendar, Clock, CheckCircle } from 'lucide-react';

export function ReminderCard({ reminder, onComplete, onDelete }) {
    const isOverdue = new Date(reminder.dueDate) < new Date();

    return (
        <div className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-md ${isOverdue ? 'border-red-100 bg-red-50' : 'border-gray-100 bg-white'}`}>
            <div className={`mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                <Bell size={20} />
            </div>

            <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{reminder.note}</h3>
                <p className="text-sm text-gray-600">
                    {reminder.vehicleName}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs font-medium">
                    <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                        <Calendar size={14} />
                        {new Date(reminder.dueDate).toLocaleDateString()}
                    </div>
                    {reminder.dueMileage && (
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <Clock size={14} />
                            {reminder.dueMileage.toLocaleString()} mi
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={() => onComplete(reminder.id)}
                className="opacity-0 transition-opacity group-hover:opacity-100 rounded-full p-2 text-gray-400 hover:bg-green-50 hover:text-green-600"
                title="Mark as Done"
            >
                <CheckCircle size={20} />
            </button>
        </div>
    );
}
