import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faLeaf,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faImage,
  faEye,
  faMedkit
} from '@fortawesome/free-solid-svg-icons';
import config from '../config.js';

const PlantDiseaseDetection = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [error, setError] = useState(null);
  const [plantName, setPlantName] = useState('');
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setError(null);
        setResultImage(null);
        setDiseaseInfo(null);

        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError(t('pages.plantDiseaseDetection.supportedFormats'));
      }
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      setResultImage(null);
      setDiseaseInfo(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload and analyze image
  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t('pages.plantDiseaseDetection.noImageError'));
      return;
    }
    if (!plantName.trim()) {
      setError(t('pages.plantDiseaseDetection.noPlantError'));
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      // Append file with plant name as filename (lowercase, underscores + .png)
      const filename = plantName.trim().toLowerCase().replace(/\s+/g, '_') + '.png';
      formData.append('image', selectedFile, filename);
      formData.append('plantName', plantName.trim());

      // Replace with your backend upload endpoint
      const response = await fetch(config.API_URLS.UPLOAD_DISEASE_IMAGE, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t('pages.plantDiseaseDetection.uploadError'));
      }

      const result = await response.json();

      if (result.success) {
        const timestamp = new Date().getTime();
        // Use the resultImagePath returned by the server with the plant name
        setResultImage(config.API_URLS.DISEASE_IMAGE_RESULT(result.resultImagePath) + `?t=${timestamp}`);

        setDiseaseInfo(result.diseaseInfo || {
          name: t('pages.plantDiseaseDetection.analysisResult'),
          description: t('pages.plantDiseaseDetection.analysisResult'),
          treatment: t('pages.plantDiseaseDetection.recommendedTreatment'),
          confidence: result.confidence || 'N/A'
        });

        setPlantName('');
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setError(result.message || t('pages.plantDiseaseDetection.analysisError'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(t('pages.plantDiseaseDetection.analysisError'));
    } finally {
      setIsUploading(false);
    }
  };

  // Reset all states
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultImage(null);
    setDiseaseInfo(null);
    setError(null);
    setPlantName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faLeaf} className="text-2xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('pages.plantDiseaseDetection.title')}</h1>
          <p className="text-gray-600">{t('pages.plantDiseaseDetection.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faUpload} className="mr-2 text-green-600" />
              {t('pages.plantDiseaseDetection.uploadSection')}
            </h2>

            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${previewUrl
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt={t('pages.plantDiseaseDetection.uploadSection')}
                    className="max-h-48 mx-auto rounded-lg shadow-md"
                  />
                  <div className="text-sm text-gray-600">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />
                    {t('pages.plantDiseaseDetection.analysisResult')}: {selectedFile?.name}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-400" />
                  <div>
                    <p className="text-gray-600">{t('pages.plantDiseaseDetection.dragDrop')}</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      {t('pages.plantDiseaseDetection.clickBrowse')}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">{t('pages.plantDiseaseDetection.supportedFormats')}</p>
                </div>
              )}
            </div>

            {/* File Input Hidden */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Plant Name Input */}
            {/* Plant Name Select Dropdown */}
            <select
              value={plantName}
              onChange={e => setPlantName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            >
              <option value="">{t('pages.plantDiseaseDetection.selectPlant')}</option>
              <option value="tea">{t('pages.plantDiseaseDetection.tea')}</option>
              <option value="tomato">{t('pages.plantDiseaseDetection.tomato')}</option>
            </select>


            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !plantName.trim() || isUploading}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isUploading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    {t('pages.plantDiseaseDetection.analyzing')}
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    {t('pages.plantDiseaseDetection.detectDisease')}
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('pages.plantDiseaseDetection.reset')}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-red-800">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  {error}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faEye} className="mr-2 text-blue-600" />
              {t('pages.plantDiseaseDetection.detectionResults')}
            </h2>

            {!resultImage && !diseaseInfo ? (
              <div className="text-center py-12 text-gray-500">
                <FontAwesomeIcon icon={faLeaf} className="text-4xl mb-4 opacity-50" />
                <p>{t('pages.plantDiseaseDetection.uploadPrompt')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {resultImage && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">{t('pages.plantDiseaseDetection.analysisResult')}</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={resultImage}
                        alt={t('pages.plantDiseaseDetection.detectionResults')}
                        className="w-full h-auto"
                        onError={() => setError(t('pages.plantDiseaseDetection.failedToLoadResult'))}
                      />
                    </div>
                  </div>
                )}

                {diseaseInfo && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FontAwesomeIcon icon={faMedkit} className="mr-2 text-blue-600" />
                      {t('pages.plantDiseaseDetection.diseaseInfo')}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800">{t('pages.plantDiseaseDetection.detectedCondition')}</h4>
                        <p className="text-gray-700">{diseaseInfo.name}</p>
                      </div>

                      {diseaseInfo.confidence && (
                        <div>
                          <h4 className="font-medium text-gray-800">{t('pages.plantDiseaseDetection.confidenceLevel')}</h4>
                          <p className="text-gray-700">{diseaseInfo.confidence}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium text-gray-800">{t('pages.plantDiseaseDetection.description')}</h4>
                        <p className="text-gray-700">{diseaseInfo.description}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800">{t('pages.plantDiseaseDetection.recommendedTreatment')}</h4>
                        <p className="text-gray-700">{diseaseInfo.treatment}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('pages.plantDiseaseDetection.howItWorks')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faUpload} className="text-green-600" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">{t('pages.plantDiseaseDetection.step1')}</h4>
              <p className="text-sm text-gray-600">{t('pages.plantDiseaseDetection.step1Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faEye} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">{t('pages.plantDiseaseDetection.step2')}</h4>
              <p className="text-sm text-gray-600">{t('pages.plantDiseaseDetection.step2Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faMedkit} className="text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">{t('pages.plantDiseaseDetection.step3')}</h4>
              <p className="text-sm text-gray-600">{t('pages.plantDiseaseDetection.step3Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDiseaseDetection;
