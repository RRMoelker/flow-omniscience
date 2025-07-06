import React, { useEffect, useRef } from 'react';

interface CameraControllerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface CameraState {
  zoom: number;
  panX: number;
  panY: number;
}

const CameraController: React.FC<CameraControllerProps> = ({ 
  containerRef
}) => {
  const cameraRef = useRef<CameraState>({
    zoom: 1,
    panX: 0,
    panY: 0
  });
  const isPanningRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Direct DOM manipulation - NO React state changes
  const applyTransform = (zoom: number, panX: number, panY: number) => {
    if (containerRef.current) {
      const svg = containerRef.current.querySelector('svg');
      if (svg) {
        svg.style.transform = `scale(${zoom}) translate(${panX}px, ${panY}px)`;
        svg.style.transformOrigin = 'center';
      }
    }
  };

  const zoomIn = () => {
    cameraRef.current.zoom = Math.min(cameraRef.current.zoom * 1.2, 3);
    applyTransform(cameraRef.current.zoom, cameraRef.current.panX, cameraRef.current.panY);
    updateZoomDisplay();
  };

  const zoomOut = () => {
    cameraRef.current.zoom = Math.max(cameraRef.current.zoom / 1.2, 0.3);
    applyTransform(cameraRef.current.zoom, cameraRef.current.panX, cameraRef.current.panY);
    updateZoomDisplay();
  };

  const resetCamera = () => {
    cameraRef.current = {
      zoom: 1,
      panX: 0,
      panY: 0
    };
    applyTransform(1, 0, 0);
    updateZoomDisplay();
  };

  const viewAll = () => {
    if (containerRef.current) {
      const svg = containerRef.current.querySelector('svg');
      if (svg) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        
        // Calculate the scale to fit the entire diagram
        const scaleX = (containerRect.width - 40) / svgRect.width;
        const scaleY = (containerRect.height - 40) / svgRect.height;
        const scale = Math.min(scaleX, scaleY, 1);
        
        // Center the diagram
        const scaledWidth = svgRect.width * scale;
        const scaledHeight = svgRect.height * scale;
        const panX = (containerRect.width - scaledWidth) / 2;
        const panY = (containerRect.height - scaledHeight) / 2;
        
        cameraRef.current = {
          zoom: scale,
          panX: panX,
          panY: panY
        };
        applyTransform(scale, panX, panY);
        updateZoomDisplay();
      }
    }
  };

  const updateZoomDisplay = () => {
    const zoomLevel = document.querySelector('.zoom-level');
    if (zoomLevel) {
      zoomLevel.textContent = `${Math.round(cameraRef.current.zoom * 100)}%`;
    }
  };

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
  }, [zoomIn, zoomOut]);

  // Pan functionality with direct DOM manipulation only
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Only pan if clicking on the background (not on nodes or widgets)
      const target = e.target as Element;
      if (target.tagName === 'svg' || target.closest('g.node') === null) {
        isPanningRef.current = true;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        container.style.cursor = 'grabbing';
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isPanningRef.current) {
        const deltaX = e.clientX - lastMousePosRef.current.x;
        const deltaY = e.clientY - lastMousePosRef.current.y;
        
        cameraRef.current.panX += deltaX;
        cameraRef.current.panY += deltaY;
        
        // Apply transform directly to DOM for smooth performance
        applyTransform(cameraRef.current.zoom, cameraRef.current.panX, cameraRef.current.panY);
        
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
      }
    };

    const handleMouseUp = () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        container.style.cursor = 'grab';
      }
    };

    const handleMouseLeave = () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        container.style.cursor = 'grab';
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
  }, [containerRef]);

  return (
    <div className="zoom-controls">
      <button onClick={zoomIn} className="zoom-btn">+</button>
      <span className="zoom-level">{Math.round(cameraRef.current.zoom * 100)}%</span>
      <button onClick={zoomOut} className="zoom-btn">-</button>
      <button onClick={resetCamera} className="zoom-btn">Reset</button>
      <button onClick={viewAll} className="zoom-btn view-all-btn">View All</button>
    </div>
  );
};

export default CameraController; 