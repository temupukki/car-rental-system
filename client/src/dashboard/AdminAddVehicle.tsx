import React from 'react';
import { AddVehicleForm } from '../components/AddVehicleForm';
import { useTheme } from '../components/ThemeContext';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminAddVehicle: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleVehicleAdded = (vehicle: any) => {
    toast.success('🚗 Vehicle Added Successfully!', {
      description: `${vehicle.name} has been added to the fleet.`,
      duration: 5000,
      action: {
        label: 'View All',
        onClick: () => navigate('/admin/vehicles')
      }
    });
  };

  const handleNavigateBack = () => {
    toast.info('Navigating back...', {
      duration: 2000,
    });
    navigate(-1);
  };

  const handleViewAllVehicles = () => {
    toast.loading('Loading vehicles...', {
      duration: 1000,
    });
    setTimeout(() => {
      navigate('/admin/vehicles');
    }, 1000);
  };

  const handleManageOrders = () => {
    toast.loading('Loading orders...', {
      duration: 1000,
    });
    setTimeout(() => {
      navigate('/admin/orders');
    }, 1000);
  };

  return (
    <div className={`
      min-h-screen transition-all duration-500
      ${theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
        : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
      }
    `}>
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNavigateBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className={`
                  text-3xl font-bold
                  ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                `}>
                  Admin Dashboard
                </h1>
                <p className={`
                  mt-1
                  ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                `}>
                  Manage your vehicle fleet
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleViewAllVehicles}
              >
                View All Vehicles
              </Button>
              <Button
                onClick={handleManageOrders}
              >
                Manage Orders
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <AddVehicleForm onVehicleAdded={handleVehicleAdded} />
      </div>
    </div>
  );
};

export default AdminAddVehicle;