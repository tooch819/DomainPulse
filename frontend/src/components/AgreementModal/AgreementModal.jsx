import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Download, CheckCircle, FileText, Shield, Loader2 } from 'lucide-react';
import './AgreementModal.css';

const AgreementModal = ({ onAccept }) => {
  const [activeTab, setActiveTab] = useState('tos');
  const [tosText, setTosText] = useState('');
  const [privacyText, setPrivacyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [tosChecked, setTosChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const [tosRes, privacyRes] = await Promise.all([
          api.get('/agreements/tos'),
          api.get('/agreements/privacy')
        ]);
        setTosText(tosRes.data.text);
        setPrivacyText(privacyRes.data.text);
      } catch (error) {
        console.error('Error fetching agreement texts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgreements();
  }, []);

  const handleAccept = async () => {
    if (!tosChecked || !privacyChecked) return;
    
    setIsSubmitting(true);
    try {
      await Promise.all([
        api.post('/auth/agreement', { type: 'TOS', accepted: true }),
        api.post('/auth/agreement', { type: 'PRIVACY', accepted: true })
      ]);
      onAccept();
    } catch (error) {
      console.error('Error submitting agreements', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content card">
          <div className="loading-state">
            <Loader2 className="animate-spin" size={48} />
            <p>Loading legal documents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <div className="modal-header">
          <h2>Terms & Legal Agreements</h2>
          <p>Please review and accept our terms to continue.</p>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'tos' ? 'active' : ''}`}
            onClick={() => setActiveTab('tos')}
          >
            <FileText size={18} /> Terms of Service
          </button>
          <button 
            className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <Shield size={18} /> Privacy Policy
          </button>
        </div>

        <div className="agreement-viewer">
          <pre className="agreement-text">
            {activeTab === 'tos' ? tosText : privacyText}
          </pre>
        </div>

        <div className="modal-actions">
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input 
                type="checkbox" 
                checked={tosChecked} 
                onChange={(e) => setTosChecked(e.target.checked)} 
              />
              <span>I accept the Terms of Service</span>
            </label>
            <label className="checkbox-item">
              <input 
                type="checkbox" 
                checked={privacyChecked} 
                onChange={(e) => setPrivacyChecked(e.target.checked)} 
              />
              <span>I accept the Privacy Policy</span>
            </label>
          </div>

          <div className="action-buttons">
            <button className="btn btn-outline" onClick={() => window.print()}>
              <Download size={18} /> Download/Print
            </button>
            <button 
              className={`btn btn-primary accept-btn ${tosChecked && privacyChecked ? 'pulse' : 'disabled'}`}
              disabled={!tosChecked || !privacyChecked || isSubmitting}
              onClick={handleAccept}
            >
              {isSubmitting ? 'Processing...' : 'I AGREE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
