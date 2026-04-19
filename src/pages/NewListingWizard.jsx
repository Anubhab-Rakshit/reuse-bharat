import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Clock, AlertCircle,
  Image, X, Upload, RefreshCw, Check, ChevronDown
} from 'lucide-react';
import api from '../lib/api';
import './NewListingWizard.css';

export default function NewListingWizard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [formData, setFormData] = useState({
    module: 'Annapurna',
    title: '',
    description: '',
    category: '',
    quantity: '',
    location: '',
    timeLimit: '',
    isUrgent: false,
    image: '',
  });

  const moduleColors = {
    Annapurna: '#E6A93C',
    Aushadh: '#3DAF72',
    Samagri: '#E84B35'
  };

  const categories = {
    Annapurna: ['Cooked Meals', 'Packaged', 'Raw Materials', 'Beverages', 'Snacks'],
    Aushadh: ['Medicine', 'Equipment', 'First Aid'],
    Samagri: ['Books', 'Equipment', 'Stationery', 'Other']
  };

  const placeholders = {
    Annapurna: {
      title: 'e.g., Rajma Chawal',
      description: 'What\'s being donated? Freshly cooked, packaged…',
      location: 'e.g., North Mess, Block B',
      timeLimit: 'e.g., 6:00 PM today',
      quantity: 'e.g., 40 plates'
    },
    Aushadh: {
      title: 'e.g., Paracetamol 500mg',
      description: 'Dosage, expiry, condition…',
      location: 'e.g., Room 204, Hostel C',
      timeLimit: 'e.g., Collect by Friday',
      quantity: 'e.g., 20 strips'
    },
    Samagri: {
      title: 'e.g., Engineering Drawing Set',
      description: 'Condition, edition, any missing parts…',
      location: 'e.g., Library entrance',
      timeLimit: 'e.g., Available till Sunday',
      quantity: 'e.g., 1 full set'
    }
  };

  const ph = placeholders[formData.module];
  const moduleDataAttr = formData.module;
  const accentColor = moduleColors[formData.module];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const switchModule = (mod) => {
    setFormData(prev => ({ ...prev, module: mod, category: '' }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    setUploadDone(false);
    setUploadProgress(0);
    setError('');

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 15, 85));
      }, 200);

      const result = await api.uploadImage(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setFormData(prev => ({ ...prev, image: result.url }));

      setTimeout(() => {
        setUploading(false);
        setUploadDone(true);
        setUploadProgress(0);
      }, 500);
    } catch (err) {
      setError('Image upload failed. You can still post without an image.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setUploadDone(false);
    setImageFileName('');
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.createListing({
        ...formData,
        donor: '680e5c5b1234567890000001',
        status: 'Active'
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="listing-wizard" data-module={moduleDataAttr}>
      <div className="wizard-bg-text">दान</div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="wizard-header">
        <h1>Post New Listing</h1>
        <p>Share what you want to donate with the community</p>
      </div>

      <div className="wizard-form-card">
        {/* Module Selector */}
        <div className="module-selector">
          {['Annapurna', 'Aushadh', 'Samagri'].map(mod => (
            <button
              key={mod}
              type="button"
              className={`module-btn ${formData.module === mod ? 'active' : ''}`}
              style={{ '--mod-color': moduleColors[mod] }}
              onClick={() => switchModule(mod)}
            >
              {mod}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="listing-form">

          {/* Image Upload */}
          <div className="form-group">
            <label><Image size={14} /> Photo</label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />

            {uploading ? (
              <div className="upload-zone upload-zone--progress">
                <div className="upload-icon-badge" style={{ '--accent': accentColor }}>
                  <Upload size={20} />
                </div>
                <div className="upload-progress-wrap">
                  <div className="upload-progress-bar">
                    <div
                      className="upload-progress-fill"
                      style={{ width: `${uploadProgress}%`, background: accentColor }}
                    />
                  </div>
                  <span className="upload-progress-label">Uploading… {uploadProgress}%</span>
                </div>
              </div>
            ) : imagePreview ? (
              <div className={`upload-zone upload-zone--preview ${uploadDone ? 'upload-zone--done' : ''}`}>
                <img src={imagePreview} alt="Preview" className="upload-preview-img" />
                <div className="upload-preview-overlay">
                  <span className="upload-preview-filename">{imageFileName}</span>
                  <div className="upload-preview-actions">
                    <button type="button" className="upload-action-btn upload-action-btn--change" onClick={triggerFileInput}>
                      <RefreshCw size={12} /> Change
                    </button>
                    <button type="button" className="upload-action-btn upload-action-btn--remove" onClick={removeImage}>
                      <X size={12} /> Remove
                    </button>
                  </div>
                </div>
                {uploadDone && (
                  <div className="upload-check-badge">
                    <Check size={14} strokeWidth={2.5} />
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`upload-zone ${dragging ? 'upload-zone--dragging' : ''}`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onClick={triggerFileInput}
              >
                <div className="upload-icon-badge" style={{ '--accent': accentColor }}>
                  <Upload size={22} />
                </div>
                <div className="upload-cta">
                  <span className="upload-cta-strong" style={{ color: accentColor }}>Click to upload</span>
                  <span className="upload-cta-or"> or drag and drop</span>
                </div>
                <div className="upload-format-pills">
                  {['JPG', 'PNG', 'WebP'].map(f => (
                    <span key={f} className="upload-fmt-pill">{f}</span>
                  ))}
                  <span className="upload-fmt-pill upload-fmt-pill--limit" style={{ borderColor: `${accentColor}33`, color: `${accentColor}99` }}>Max 5MB</span>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={ph.title}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={ph.description}
              rows={3}
            />
          </div>

          {/* Category + Quantity */}
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <div className="select-wrapper">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="custom-select"
                  style={{ '--select-accent': accentColor }}
                  required
                >
                  <option value="" disabled>Select category</option>
                  {categories[formData.module].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder={ph.quantity}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label><MapPin size={14} /> Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={ph.location}
              required
            />
          </div>

          {/* Pickup Time */}
          <div className="form-group">
            <label><Clock size={14} /> Pickup by</label>
            <input
              type="text"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleChange}
              placeholder={ph.timeLimit}
            />
          </div>

          {/* Urgent */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isUrgent"
                checked={formData.isUrgent}
                onChange={handleChange}
              />
              <AlertCircle size={14} />
              Mark as Urgent
            </label>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading || uploading}>
            {loading ? 'Posting…' : 'Post Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}