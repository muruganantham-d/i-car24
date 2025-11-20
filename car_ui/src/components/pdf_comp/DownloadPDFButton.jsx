import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import ReportPDF from './ReportPDF';


const DownloadPDFButton = ({ data, fileName, className = '', onError }) => {
  const [processedData, setProcessedData] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!data) return;
    setIsReady(false);
    const processData = async () => {
      if (data.photos && data.photos.length > 0) {
        try {
          const photosWithBase64 = await Promise.all(
            data.photos.map(async (photoName) => {
              const res = await fetch(`http://localhost:4000/uploads/${photoName}`);
              if (!res.ok) throw new Error(`Fetch failed for ${photoName}`);
              const blob = await res.blob();
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
              });
              return { name: photoName, base64: reader.result.split(',')[1], mimeType: blob.type || 'image/jpeg' };
            })
          );
          setProcessedData({ ...data, photos: photosWithBase64 });
        } catch (err) {
          console.error('Image processing error:', err);
          toast.error('Some images couldn\'t load; PDF will generate without them.');
          if (onError) onError(err);
          setProcessedData({ ...data, photos: [] }); // Fallback: Empty photos array
        }
      } else {
        setProcessedData(data);
      }
      setIsReady(true);
    };
    processData();
  }, [data]);

  if (!isReady) {
    return (
      <button disabled className={`bg-gray-400 text-white px-12 py-5 rounded-full text-xl font-bold shadow-xl flex items-center gap-4 mx-auto opacity-50 ${className}`}>
        <Download className="w-8 h-8" /> Preparing PDF...
      </button>
    );
  }

  return (
    <PDFDownloadLink document={<ReportPDF data={processedData} />} fileName={fileName}>
      {({ loading, error }) => (
        <button
          disabled={loading || error}
          className={`bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-full text-xl font-bold shadow-xl flex items-center gap-4 mx-auto disabled:opacity-50 ${className}`}
        >
          <Download className="w-8 h-8" /> {loading ? 'Generating PDF...' : 'Download Report'}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default DownloadPDFButton;