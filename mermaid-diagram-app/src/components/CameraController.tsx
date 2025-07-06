import React, { useEffect, useState, useRef } from 'react';

interface CameraControllerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onTransformChange: (transform: string) => void;
}

interface CameraState {
  zoom: number;
  panX: number;
  panY: number;
}

const CameraController: React.FC<CameraControllerProps> = ({ 
  containerRef, 
  onTransformChange 
}) => {
  const [camera, setCamera] = useState<CameraState>({
    zoom: 1,
    panX: 0,
    panY: 0
  });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const panRef = useRef({ x: 0, y: 0 });

  const zoomIn = () => {
    setCamera(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 3)
    }));
  };

  const zoomOut = () => {
    setCamera(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 0.3)
    }));
  };

  const resetCamera = () => {
    setCamera({
      zoom: 1,
      panX: 0,
      panY: 0
    });
    panRef.current = { x: 0, y: 0 };
    applyTransform(1, 0, 0);
  };

  const viewAll = () => {
    if (containerRef.current) {
      const svg = containerRef.current.querySelector('svg');
      if (svg) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        
        // Calculate the scale to fit the entire diagram
        const scaleX = (containerRect.width - 40) / svgRect.width; // Account for padding
        const scaleY = (containerRect.height - 40) / svgRect.height; // Account for padding
        const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%
        
        // Center the diagram
        const scaledWidth = svgRect.width * scale;
        const scaledHeight = svgRect.height * scale;
        const panX = (containerRect.width - scaledWidth) / 2;
        const panY = (containerRect.height - scaledHeight) / 2;
        
        setCamera({
          zoom: scale,
          panX: panX,
          panY: panY
        });
        panRef.current = { x: panX, y: panY };
        applyTransform(scale, panX, panY);
      }
    }
  };

  // Direct DOM manipulation for smooth panning
  const applyTransform = (zoom: number, panX: number, panY: number) => {
    if (containerRef.current) {
      const svg = containerRef.current.querySelector('svg');
      if (svg) {
        svg.style.transform = `scale(${zoom}) translate(${panX}px, ${panY}px)`;
        svg.style.transformOrigin = 'center';
      }
    }
  };

  // Apply camera transform (for zoom changes)
  useEffect(() => {
    const transform = `scale(${camera.zoom}) translate(${camera.panX}px, ${camera.panY}px)`;
    onTransformChange(transform);
  }, [camera, onTransformChange]);

  // Mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn();
        } else {
          zoomOut();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);

  // Optimized pan functionality with direct DOM manipulation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Only pan if clicking on the background (not on nodes or widgets)
      const target = e.target as Element;
      if (target.tagName === 'svg' || target.closest('g.node') === null) {
        setIsPanning(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
        container.style.cursor = 'grabbing';
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;
        
        // Update pan position directly without React state
        panRef.current.x += deltaX;
        panRef.current.y += deltaY;
        
        // Apply transform directly to DOM for smooth performance
        applyTransform(camera.zoom, panRef.current.x, panRef.current.y);
        
        setLastMousePos({ x: e.clientX, y: e.clientY });
        e.preventDefault();
      }
    };

    const handleMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
        container.style.cursor = 'grab';
        
        // Update React state after panning is done
        setCamera(prev => ({
          ...prev,
          panX: panRef.current.x,
          panY: panRef.current.y
        }));
      }
    };

    const handleMouseLeave = () => {
      if (isPanning) {
        setIsPanning(false);
        container.style.cursor = 'grab';
        
        // Update React state after panning is done
        setCamera(prev => ({
          ...prev,
          panX: panRef.current.x,
          panY: panRef.current.y
        }));
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isPanning, lastMousePos, camera.zoom]);

  return (
    <div className="zoom-controls">
      <button onClick={zoomIn} className="zoom-btn">+</button>
      <span className="zoom-level">{Math.round(camera.zoom * 100)}%</span>
      <button onClick={zoomOut} className="zoom-btn">-</button>
      <button onClick={resetCamera} className="zoom-btn">Reset</button>
      <button onClick={viewAll} className="zoom-btn view-all-btn">View All</button>
    </div>
  );
};

export default CameraController; 