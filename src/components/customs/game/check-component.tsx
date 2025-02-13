"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const CameraCheck = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraActive(true);
      } catch (error: unknown) {
        console.error("can't load camera", error);
        setErrorMessage(
          "Can't load camera, please allow camera access or check camera status!"
        );
      }
    }
    initCamera();

    const localVideo = videoRef.current;
    // clean up: stop camera stream when component unmounts
    return () => {
      if (localVideo && localVideo.srcObject) {
        const tracks = (localVideo.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl mb-6 font-bold">Camera Check</h1>
      {errorMessage ? (
        <p className="text-red-500 mb-4">{errorMessage}</p>
      ) : (
        <>
          <video
            ref={videoRef}
            width={400}
            height={400}
            className="border rounded mb-4"
          />
          {cameraActive ? (
            <div className="flex gap-4">
              <Button onClick={() => router.push("/")}>Back</Button>
              <Button onClick={() => router.push("/game")}>Start</Button>
            </div>
          ) : (
            <p>Opening...</p>
          )}
        </>
      )}
    </div>
  );
};
