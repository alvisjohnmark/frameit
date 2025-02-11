import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

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
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const canvasWidth = 600;
    const canvasHeight = 800;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Background Color
    if (ctx) {
      ctx.fillStyle = "#f8f5e6";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Load Images
      const imgElements = images.map((src) => {
        const img = new Image();
        if (src) {
          img.src = src;
        }
        return img;
      });

      Promise.all(
        imgElements.map(
          (img) =>
            new Promise((resolve) => {
              img.onload = resolve;
            })
        )
      ).then(() => {
       
        const imgWidth = 300; 
        const imgHeight = 200; 

       
        const xOffset = (canvasWidth - imgWidth) / 2;

        imgElements.forEach((img, i) => {
          const yOffset = 50 + i * (imgHeight + 20); 
          ctx.drawImage(img, xOffset, yOffset, imgWidth, imgHeight); 
        });

        // Add text at the bottom
        ctx.fillStyle = "#a39fd1";
        ctx.font = "bold 40px cursive";
        ctx.textAlign = "center";
        ctx.fillText("FrameIt", canvasWidth / 2, canvasHeight - 50);

        // Convert to image and download
        const link = document.createElement("a");
        link.download = "FrameIt_Collage.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };
  return (
    <section className="bg-gradient-to-br from-[#f8f5e6] to-[#fff] min-h-screen flex flex-col items-center justify-center gap-8 p-5">
      <h1 className="text-4xl font-bold text-[#ffb3ba] font-[cursive] tracking-wide">
        FrameIt
      </h1>
      <div className="flex gap-8 p-8 rounded-3xl backdrop-blur-sm">
        <div className="flex flex-col items-center gap-6">
          <div className="border-8 border-[#a8d8ea] rounded-xl overflow-hidden">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/png"
              mirrored={true}
              className="object-cover"
            />
          </div>
          {countdown !== null && (
            <p className="text-4xl mt-2 font-bold text-[#a39fd1] animate-pulse">
              {countdown}
            </p>
          )}
          <button
            className="mt-2 bg-[#a8e6cf] text-[#556b6d] px-8 py-4 text-xl rounded-md shadow-lg cursor-pointer font-semibold"
            onClick={startCaptureSequence}
            disabled={countdown !== null}
          >
            {countdown !== null ? "Capturing..." : "Capture Moment"}
          </button>
        </div>
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-lg font-semibold text-[#556b6d]">Preview</h1>
          <div className="grid grid-cols-1 gap-6 p-4 rounded-2xl min-h-40 w-56 items-center justify-center ">
            {images.length > 0 ? (
              images.map((src, index) => (
                <img
                  key={index}
                  src={src || undefined}
                  alt={`Captured ${index}`}
                  className="w-48 h-36 border-4 border-[#ffb3ba] rounded-xl shadow-md hover:scale-102 transition-transform duration-200 object-cover"
                />
              ))
            ) : (
              <p className="text-[#a39fd1] text-lg text-center font-semibold">
                No Images Yet
              </p>
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            {images.length === 3 && (
              <div className="flex gap-4">
                <button
                  className="bg-[#a39fd1] hover:bg-[#8f8bbd] text-white px-6 py-3 rounded-full shadow-lg cursor-pointer font-medium"
                  onClick={downloadImages}
                >
                  Download Collage
                </button>
                <button
                  className="bg-[#ff8b94] hover:bg-[#ff7984] text-white px-6 py-3 rounded-full shadow-lg cursor-pointer font-medium"
                  onClick={resetImages}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
