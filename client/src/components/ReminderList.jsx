import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReminderCard } from './ReminderCard';

export function ReminderList({ reminders }) {
    const navigate = useNavigate();
    if (!reminders || reminders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center">
                <p className="text-sm text-gray-500">No active reminders.</p>
                <button
                    onClick={() => navigate('/add-reminder')}
                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    + Add Reminder
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {reminders.map((reminder) => (
                <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onComplete={(id) => console.log('Complete:', id)}
                />
            ))}
        </div>
    );
}
