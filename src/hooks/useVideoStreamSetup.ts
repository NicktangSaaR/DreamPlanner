import { useRef, useEffect, useState } from "react";

interface VideoStreamConfig {
  onStreamInitialized?: (stream: MediaStream) => void;
  onStreamError?: (error: Error) => void;
}

export const useVideoStreamSetup = ({ 
  onStreamInitialized, 
  onStreamError 
}: VideoStreamConfig) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  const mountedRef = useRef(true);

  const stopStream = () => {
    if (streamRef.current) {
      console.log("Stopping existing stream tracks");
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track:`, {
          label: track.label,
          enabled: track.enabled,
          readyState: track.readyState
        });
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsInitialized(false);
  };

  const initializeStream = async () => {
    if (!mountedRef.current) {
      console.log("Component not mounted, skipping initialization");
      return;
    }

    try {
      // 确保先停止任何现有的流
      stopStream();

      console.log("Requesting new media stream...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      if (!mountedRef.current) {
        console.log("Component unmounted during stream initialization, cleaning up");
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      console.log("Media stream obtained successfully:", {
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        await new Promise<void>((resolve) => {
          if (!videoRef.current) return;
          videoRef.current.onloadedmetadata = () => resolve();
        });

        if (!mountedRef.current) {
          console.log("Component unmounted during video setup, cleaning up");
          stopStream();
          return;
        }

        await videoRef.current.play();
        console.log("Video playback started successfully");
        setIsInitialized(true);
        onStreamInitialized?.(stream);
      }
    } catch (error) {
      console.error("Stream initialization error:", error);
      let errorMessage = "无法访问摄像头或麦克风";
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = "请在浏览器设置中允许访问摄像头和麦克风，然后刷新页面重试";
            break;
          case 'NotFoundError':
            errorMessage = "未找到摄像头或麦克风设备，请确保设备已正确连接";
            break;
          case 'NotReadableError':
            errorMessage = "无法访问摄像头或麦克风，请确认没有其他应用正在使用这些设备";
            break;
          default:
            errorMessage = "设备访问出错，请确保设备正常工作并刷新页面重试";
        }
      }
      
      const finalError = new Error(errorMessage);
      onStreamError?.(finalError);
      throw finalError;
    }
  };

  const retryInitialization = async () => {
    if (initializationAttempts < 3) {
      console.log(`Retrying stream initialization (attempt ${initializationAttempts + 1}/3)...`);
      setInitializationAttempts(prev => prev + 1);
      try {
        await initializeStream();
      } catch (error) {
        console.error(`Initialization retry ${initializationAttempts + 1} failed:`, error);
        if (initializationAttempts < 2) {
          setTimeout(retryInitialization, 1000);
        }
      }
    }
  };

  useEffect(() => {
    console.log("Setting up video stream");
    mountedRef.current = true;

    const init = async () => {
      if (mountedRef.current) {
        try {
          await initializeStream();
        } catch (error) {
          console.error("Failed to initialize stream:", error);
          retryInitialization();
        }
      }
    };

    init();

    return () => {
      console.log("Cleaning up video stream on unmount");
      mountedRef.current = false;
      stopStream();
    };
  }, []);

  return {
    videoRef,
    isInitialized,
    initializeStream,
    retryInitialization,
    stopStream
  };
};