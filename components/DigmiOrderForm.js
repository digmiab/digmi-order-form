'use client';

import React, { useState } from 'react';
import { Mail, Plus, Minus, X } from 'lucide-react';

const DigmiOrderForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    orgNumber: '',
    contactPerson: '',
    phone: '',
    email: '',
    addresses: [''],
    hardwareChoice: '',
    leaseDuration: '',
    installationNeeded: false,
    additionalRequests: '',
  });

  const [products, setProducts] = useState([
    { id: 'tablet-standard', name: 'Digmi Tablet Standard', quantity: 0 },
    { id: 'tablet-pro', name: 'Digmi Tablet Pro', quantity: 0 },
    { id: 'tv-43-hb', name: 'Digmi TV 43" Hanging Black Case', quantity: 0 },
    { id: 'tv-43-hw', name: 'Digmi TV 43" Hanging White Case', quantity: 0 },
    { id: 'tv-55-hb', name: 'Digmi TV 55" Hanging Black Case', quantity: 0 },
    { id: 'tv-55-hw', name: 'Digmi TV 55" Hanging White Case', quantity: 0 },
    { id: 'tv-65-hb', name: 'Digmi TV 65" Hanging Black Case', quantity: 0 },
    { id: 'tv-65-hw', name: 'Digmi TV 65" Hanging White Case', quantity: 0 },
    { id: 'tv-43-wb', name: 'Digmi TV 43" Wallmounted Black Case', quantity: 0 },
    { id: 'tv-43-ww', name: 'Digmi TV 43" Wallmounted White Case', quantity: 0 },
    { id: 'tv-55-wb', name: 'Digmi TV 55" Wallmounted Black Case', quantity: 0 },
    { id: 'tv-55-ww', name: 'Digmi TV 55" Wallmounted White Case', quantity: 0 },
    { id: 'tv-65-wb', name: 'Digmi TV 65" Wallmounted Black Case', quantity: 0 },
    { id: 'tv-65-ww', name: 'Digmi TV 65" Wallmounted White Case', quantity: 0 },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, '']
    }));
  };

  const handleAddressChange = (index, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index] = value;
    setFormData(prev => ({
      ...prev,
      addresses: newAddresses
    }));
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      addresses: newAddresses
    }));
  };

  const handleQuantityChange = (id, change) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, quantity: Math.max(0, product.quantity + change) }
        : product
    ));
  };

  const handleSubmit = async () => {
    try {
      // Calculate totals
      const totalProducts = products.filter(p => p.quantity > 0);
      const totalTablets = totalProducts
        .filter(p => p.name.includes('Tablet'))
        .reduce((sum, p) => sum + p.quantity, 0);
      const totalTVs = totalProducts
        .filter(p => p.name.includes('TV'))
        .reduce((sum, p) => sum + p.quantity, 0);
  
      // Format email content
      const emailContent = {
        to: ['order@digmi.se', formData.email], // Updated email addresses
        from: 'noreply@digmi.se',
        subject: `New Digmi Order - ${formData.companyName}`,
        text: `
          New Order from ${formData.companyName}
          
          Company Details:
          Organization Number: ${formData.orgNumber}
          Contact Person: ${formData.contactPerson}
          Phone: ${formData.phone}
          Email: ${formData.email}
          
          Addresses:
          ${formData.addresses.join('\n')}
          
          Products Ordered:
          ${totalProducts.map(p => `- ${p.name}: ${p.quantity}`).join('\n')}
          
          Total Licenses Required:
          Tablets: ${totalTablets}
          TV Screens: ${totalTVs}
          
          Hardware Choice: ${formData.hardwareChoice}
          ${formData.hardwareChoice === 'lease' ? `Lease Duration: ${formData.leaseDuration} months` : ''}
          Installation Needed: ${formData.installationNeeded ? 'Yes' : 'No'}
          
          Additional Requests:
          ${formData.additionalRequests || 'None'}
        `
      };
  
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailContent),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
  
      // Reset form after successful submission
      setFormData({
        companyName: '',
        orgNumber: '',
        contactPerson: '',
        phone: '',
        email: '',
        addresses: [''],
        hardwareChoice: '',
        leaseDuration: '',
        installationNeeded: false,
        additionalRequests: '',
      });
  
      // Reset products
      setProducts(products.map(p => ({ ...p, quantity: 0 })));
  
      // Show success message
      alert('Order submitted successfully! Confirmation emails have been sent.');
  
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Digmi Marketing Order Form</h1>

        {/* Company Information */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="companyName"
              placeholder="Salon/Company Name"
              value={formData.companyName}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="orgNumber"
              placeholder="Organisation Number"
              value={formData.orgNumber}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="contactPerson"
              placeholder="Contact Person"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Addresses</h3>
          {formData.addresses.map((address, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              {index > 0 && (
                <div
                  onClick={() => handleRemoveAddress(index)}
                  className="p-2 text-red-500 cursor-pointer"
                >
                  <X size={20} />
                </div>
              )}
            </div>
          ))}
          <div
            onClick={handleAddAddress}
            className="flex items-center gap-2 text-blue-500 cursor-pointer"
          >
            <Plus size={20} /> Add Another Address
          </div>
        </div>

        {/* Products */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                <span>{product.name}</span>
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => handleQuantityChange(product.id, -1)}
                    className="p-1 text-gray-500 cursor-pointer"
                  >
                    <Minus size={16} />
                  </div>
                  <span className="w-8 text-center">{product.quantity}</span>
                  <div
                    onClick={() => handleQuantityChange(product.id, 1)}
                    className="p-1 text-gray-500 cursor-pointer"
                  >
                    <Plus size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware Options */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Hardware Options</h3>
          <div className="space-y-4">
            <select
              onChange={(e) => setFormData(prev => ({ ...prev, hardwareChoice: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose payment option</option>
              <option value="upfront">Upfront Payment</option>
              <option value="lease">Hardware Leasing</option>
            </select>

            {formData.hardwareChoice === 'lease' && (
              <select
                onChange={(e) => setFormData(prev => ({ ...prev, leaseDuration: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="">Select lease duration</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
              </select>
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.installationNeeded}
                onChange={(e) => setFormData(prev => ({ ...prev, installationNeeded: e.target.checked }))}
                className="rounded"
              />
              Hardware installation assistance needed
            </label>
          </div>
        </div>

        {/* Additional Requests */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Additional Requests</h3>
          <textarea
            name="additionalRequests"
            value={formData.additionalRequests}
            onChange={handleInputChange}
            className="w-full p-2 border rounded h-32"
            placeholder="Any specific requirements or notes..."
          />
        </div>

        {/* Submit Button */}
        <div
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 p-3 rounded cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Mail size={20} />
          Submit Order
        </div>
      </div>
    </div>
  );
};

export default DigmiOrderForm;