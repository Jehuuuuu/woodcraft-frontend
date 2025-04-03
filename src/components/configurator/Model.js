"use client"
import React, { useState, useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber"
import { useGLTF, Html } from "@react-three/drei"
import { Vector3 } from "three"
import { SyncLoader } from "react-spinners";
export default function Model({ material, modelUrl, ...props }) {
    const [isLoading, setIsLoading] = useState(true);
    const defaultModelUrl = "/assets/3d/sample_model.glb";  
    useGLTF.preload(defaultModelUrl);
    // Use a proxy URL for external models to avoid CORS issues
    const proxyUrl = modelUrl ? `/api/proxy-model?url=${encodeURIComponent(modelUrl)}` : defaultModelUrl;
    
    const { scene } = useGLTF(proxyUrl, true, undefined, () => {
      setIsLoading(false);
    });
    
    const { camera } = useThree();
    
    useEffect(() => {
      setIsLoading(true);
      camera.position.set(5, 5, 5);
      camera.lookAt(new Vector3(0, 0, 0));
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }, [camera, modelUrl]);
    
    const clonedScene = useMemo(() => {
      const cloned = scene.clone();
      // Apply material color changes
      cloned.traverse((node) => {
        if (node.isMesh) {
          if (material === "oak") node.material.color.set("#b38b6d");
          else if (material === "walnut") node.material.color.set("#5c4033");
          else if (material === "maple") node.material.color.set("#e8d4ad");
          else if (material === "mahogany") node.material.color.set("#C04000");
          else if (material === "pine") node.material.color.set("#d9c7a0");
          
          // Apply scaling based on dimensions if they exist
          if (props.width && props.height && props.thickness) {
            // Normalize dimensions to reasonable scale factors
            const baseSize = 30; // baseline size in cm
            const scaleX = props.width / baseSize;
            const scaleY = props.height / baseSize;
            const scaleZ = props.thickness / baseSize;
            
            // Apply non-uniform scaling to the mesh
            node.scale.set(scaleX, scaleY, scaleZ);
          }
        }
      });
      return cloned;
    }, [scene, material, props.width, props.height, props.thickness]);
  
    if (isLoading) {
      return (
        <Html center>
          <div className="w-full h-full flex items-center justify-center">
            <SyncLoader
              color="#8B4513"
              loading={true}
              size={12}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </Html>
      );
    }
  
    return <primitive object={clonedScene} {...props} />;
  }
  