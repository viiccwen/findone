"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/game-store";
import * as tf from "@tensorflow/tfjs";
import { Button } from "@/components/ui/button";

export const Game = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const {
    duration,
    round,
    target,
    targets,
    reset,
    setTarget,
    nextRound,
    addScore,
  } = useGameStore();

  // choose random target
  const chooseRandomTarget = () => {
    const random = targets[Math.floor(Math.random() * targets.length)];
    setTarget(random);
  };

  // init camera
  const initCamera = async () => {
    if (navigator.mediaDevices.getUserMedia && videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  };

  // load MobileNet model
  const loadModel = async () => {
    const loadedModel = await tf.loadGraphModel(
      "https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/4",
      { fromTFHub: true }
    );
    setModel(loadedModel);
  };

  // image classification
  const classifyFrame = async () => {
    if (!model || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // drawing the screen on canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const input = tf.browser
      .fromPixels(imageData)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(255.0)
      .expandDims();

    // model inference
    const predictions = (await model.predict(input)) as tf.Tensor;
    const predictionArray = predictions.dataSync();

    // according to the output of MobileNet to classify the label
    // suppose we have implemented mapPredictionToLabel(predictionArray)
    const predictedLabel = mapPredictionToLabel(predictionArray);

    // check if the predicted label contains the target label (case-insensitive)
    if (predictedLabel.toLowerCase().includes(target.toLowerCase())) {
      addScore();
      // go to next round when round < 5
      if (round < 5) {
        nextRound();
        chooseRandomTarget();
      } else {
        // game over, go to result page
        router.push("/result");
      }
    }

    tf.dispose([input, predictions]);
  };

  // todo: implement this function, we firstly return a fake label (might be use preset class label list)
  const mapPredictionToLabel = (
    predictionArray:
      | Uint8Array<ArrayBufferLike>
      | Float32Array<ArrayBufferLike>
      | Int32Array<ArrayBufferLike>
  ): string => {
    // assume the first class is 'phone'
    if (predictionArray)
      return "phone";
    else return "pencil";
  };

  const handleRestart = () => {
    reset();
    router.push("/");
  };

  useEffect(() => {
    // init camera, load model, choose random target
    initCamera();
    loadModel();
    chooseRandomTarget();
    setTimeLeft(duration);

    // set interval for countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // time's up, then go to result page
          router.push("/result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // detect continuously (per 500ms)
    const classifyInterval = setInterval(() => {
      classifyFrame();
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(classifyInterval);
    };
  }, [model]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl my-4">
        Round {round} - Find {target}
      </h2>
      <p className="mb-4">time： {timeLeft}s</p>
      <video ref={videoRef} width={640} height={480} className="border mb-4" />

      {/* canvas are used for model inference, so in hidden mode */}
      <canvas ref={canvasRef} width={640} height={480} className="hidden" />
      
      <Button onClick={handleRestart}>Back</Button>
    </div>
  );
};
