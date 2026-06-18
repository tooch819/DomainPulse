import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Mail, Link as LinkIcon, ExternalLink, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfileData({
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone || ''
        });
        setLinkedAccounts(res.data.linkedAccounts);
      } catch (error) {
        console.error('Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', profileData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  const handleLinkRegistrar = async (registrar) => {
    try {
      await api.post('/profile/link-registrar', {
        registrar,
        apiKey: 'mock_key_' + Math.random().toString(36).substring(7),
        apiSecret: 'mock_secret'
      });
      // Refresh accounts
      const res = await api.get('/profile');
      setLinkedAccounts(res.data.linkedAccounts);
    } catch (error) {
      console.error('Linking failed', error);
    }
  };

  return (
    <div className="profile-page">
      <h1>Account Settings</h1>
      
      <div className="profile-grid">
        <section className="profile-section card">
          <div className="section-header">
            <User size={20} className="text-primary" />
            <h3>Personal Information</h3>
          </div>
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={16} />
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon disabled">
                <Mail size={16} />
                <input type="email" value={profileData.email} disabled />
              </div>
              <span className="helper-text">Email is verified via Internet Identity</span>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-with-icon">
                <Phone size={16} />
                <input 
                  type="tel" 
                  value={profileData.phone} 
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        </section>

        <section className="profile-section card">
          <div className="section-header">
            <LinkIcon size={20} className="text-secondary" />
            <h3>Registrar Connections</h3>
          </div>
          <p className="section-desc">Link your registrar accounts to automatically sync and appraise your domains.</p>
          
          <div className="registrar-list">
            {['GoDaddy', 'Domainify'].map((name) => {
              const account = linkedAccounts.find(a => a.registrar === name);
              return (
                <div key={name} className="registrar-item card glass">
                  <div className="registrar-info">
                    <strong>{name}</strong>
                    {account ? (
                      <span className="status text-success"><CheckCircle2 size={14} /> Connected</span>
                    ) : (
                      <span className="status text-muted"><AlertCircle size={14} /> Not Linked</span>
                    )}
                  </div>
                  {account ? (
                    <button className="btn btn-outline btn-sm">Disconnect</button>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleLinkRegistrar(name)}>
                      Connect <ExternalLink size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="security-box card mt-4">
            <Shield size={24} className="text-primary" />
            <div>
              <h4>Encrypted Storage</h4>
              <p>Your API keys are encrypted at rest and never shared with third parties.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
