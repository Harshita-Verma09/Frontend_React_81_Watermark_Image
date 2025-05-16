import React, { useRef, useState, useEffect } from 'react';

const WatermarkUploader = () => {
  const canvasRef = useRef(null);
  const [text, setText] = useState('');
  const [imageURL, setImageURL] = useState(null);
  const [previewURL, setPreviewURL] = useState(null); // For showing final image

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageURL(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const drawImageWithWatermark = (src, watermarkText) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 200;
      canvas.height = 200;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 200, 200);

      ctx.font = '16px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'center';
      ctx.fillText(watermarkText, canvas.width / 2, canvas.height - 10);

      // Set preview image
      const dataURL = canvas.toDataURL('image/png');
      setPreviewURL(dataURL);
    };

    img.src = src;
  };

  useEffect(() => {
    if (imageURL) {
      drawImageWithWatermark(imageURL, text);
    }
  }, [text, imageURL]);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = 'watermarked-image.png';
    link.href = previewURL;
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-semibold mb-6">Upload Image and Add Watermark</h2>

      <input
        type="file"
        accept=".png,.jpg,.jpeg"
        onChange={handleImageUpload}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-md"
      />
      
      <input
        type="text"
        placeholder="Enter watermark text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mb-6 px-4 py-2 border border-gray-300 rounded-md w-64"
      />

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {previewURL && (
        <div className="text-center mt-6">
          <h4 className="text-xl mb-4">Preview:</h4>
          <img src={previewURL} alt="Watermarked Preview" className="w-48 h-48 object-cover mb-4" />
          
          <button
            onClick={downloadImage}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Download Image
          </button>
        </div>
      )}
    </div>
  );
};

export default WatermarkUploader;
