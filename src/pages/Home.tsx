import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";

const Home = () => {
  const webcamRef = useRef<Webcam>(null);
  const [images, setImages] = useState<(string | null)[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [captureIndex, setCaptureIndex] = useState(0);
  const countdownSequences = [
    [3, 2, 1],
    [5, 4, 3, 2, 1],
    [5, 4, 3, 2, 1],
  ];

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImages((prev) => [...prev, imageSrc]);
    }
  };

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      captureImage();
      if (captureIndex < countdownSequences.length - 1) {
        setTimeout(() => {
          setCaptureIndex((prev) => prev + 1);
          setCountdown(countdownSequences[captureIndex + 1][0]);
        }, 1000);
      }
    }
  }, [countdown]);

  const startCaptureSequence = () => {
    setImages([]);
    setCaptureIndex(0);
    setCountdown(countdownSequences[0][0]);
  };

  const resetImages = () => {
    setImages([]);
    setCountdown(null);
  };

  const downloadImages = () => {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.gap = "15px"; // Better spacing
    container.style.padding = "20px";
    container.style.backgroundColor = "white";

    images.forEach((src) => {
      const img = document.createElement("img");
      if (src) img.src = src;
      img.style.width = "400px"; // Adjusted size
      img.style.height = "400px"; // Perfect square
      img.style.borderRadius = "15px"; // Smooth edges
      img.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
      img.style.objectFit = "cover"; // Ensures full image display
      container.appendChild(img);
    });

    // Watermark
    const watermark = document.createElement("div");
    watermark.innerText = "FrameIt";
    watermark.style.position = "absolute";
    watermark.style.bottom = "10px";
    watermark.style.left = "10px";
    watermark.style.color = "rgba(0, 0, 0, 0.7)";
    watermark.style.fontSize = "18px";
    watermark.style.fontWeight = "bold";
    watermark.style.fontFamily = "Arial, sans-serif";
    container.appendChild(watermark);

    document.body.appendChild(container);

    html2canvas(container).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "frameit.png";
      link.click();
      document.body.removeChild(container);
    });
  };

  return (
    <section className="bg-[#ede8d0] min-h-screen flex flex-col items-center justify-center gap-6 p-5">
      <h1 className="text-3xl font-bold italic">FrameIt</h1>
      <div className="flex">
        <div className="flex flex-col items-center">
          <div className="border-4 border-gray-700 rounded-md overflow-hidden">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/png"
              mirrored={false}
            />
          </div>
          {countdown !== null && (
            <p className="text-3xl mt-2 font-bold">{countdown}</p>
          )}
          <button
            className="mt-4 bg-green-600 text-white px-6 py-3 text-lg rounded-lg shadow-lg"
            onClick={startCaptureSequence}
            disabled={countdown !== null}
          >
            {countdown !== null ? "Capturing..." : "Capture"}
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-1 gap-4">
            {images.map((src, index) => (
              <img
                key={index}
                src={src || ""}
                alt={`Captured ${index}`}
                className="w-45 h-35  border-2 border-gray-700 rounded-lg shadow-md"
              />
            ))}
          </div>
          {images.length === 3 && (
            <div className="flex gap-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
                onClick={downloadImages}
              >
                Download Collage
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg"
                onClick={resetImages}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
