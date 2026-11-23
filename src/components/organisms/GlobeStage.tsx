import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { PulseEvent } from '@/features/events/schema';
import { TOPIC_REGISTRY } from '@/features/news/topics';
import { RotateCw, ZoomIn, ZoomOut, Compass, MousePointer } from 'lucide-react';
import { InfoTooltip } from '@/components/atoms/InfoTooltip';
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';
import * as topojson from 'topojson-client';
import worldAtlasData from 'world-atlas/land-110m.json';

export interface GlobeStageProps {
  events: PulseEvent[];
  selectedEvent: PulseEvent | null;
  onSelectEvent: (event: PulseEvent) => void;
  hoursWindow: number;
}

export const GlobeStage: React.FC<GlobeStageProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  hoursWindow,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rotation angles: [yaw (longitude), pitch (latitude)]
  const [yaw, setYaw] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(15);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isMouseSteer, setIsMouseSteer] = useState<boolean>(true);
  const [hoveredEvent, setHoveredEvent] = useState<PulseEvent | null>(null);

  // Interaction refs
  const isDraggingRef = useRef<boolean>(false);
  const isHoveringRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoverSteerRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const radarAngleRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Extract land GeoJSON once from TopoJSON
  const landGeoJson = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return topojson.feature(worldAtlasData as any, (worldAtlasData as any).objects.land);
  }, []);

  const graticuleGeoJson = useMemo(() => {
    return geoGraticule10();
  }, []);

  const baseRadius = 175;
  const canvasSize = 460;
  const currentRadius = baseRadius * zoom;

  // Trackball drag
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      setYaw((prev) => (prev + dx * 0.5) % 360);
      setPitch((prev) => Math.max(-65, Math.min(65, prev - dy * 0.5)));
      return;
    }

    // Mouse direction steering calculation
    isHoveringRef.current = true;
    const relX = (e.clientX - cx) / (rect.width / 2); // -1 (left) to +1 (right)
    const relY = (e.clientY - cy) / (rect.height / 2); // -1 (top) to +1 (bottom)

    // Dead zone in center for stability
    const deadZone = 0.15;
    const vx = Math.abs(relX) > deadZone ? Math.sign(relX) * Math.pow(Math.abs(relX) - deadZone, 1.2) : 0;
    const vy = Math.abs(relY) > deadZone ? Math.sign(relY) * Math.pow(Math.abs(relY) - deadZone, 1.2) : 0;

    hoverSteerRef.current = { vx, vy };

    // Marker hover hit-test
    const mouseCanvasX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseCanvasY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const projection = geoOrthographic()
      .scale(currentRadius)
      .translate([canvasSize / 2, canvasSize / 2])
      .rotate([-yaw, -pitch, 0])
      .clipAngle(90);

    let foundMarker: PulseEvent | null = null;
    for (const event of events) {
      const coords = projection([event.lng, event.lat]);
      if (coords) {
        const dist = Math.hypot(coords[0] - mouseCanvasX, coords[1] - mouseCanvasY);
        if (dist <= Math.max(10, event.severity * 3.5 + 4)) {
          foundMarker = event;
          break;
        }
      }
    }
    setHoveredEvent(foundMarker);
  }, [currentRadius, yaw, pitch, events]);

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    isHoveringRef.current = false;
    hoverSteerRef.current = { vx: 0, vy: 0 };
    setHoveredEvent(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseCanvasX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseCanvasY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const projection = geoOrthographic()
      .scale(currentRadius)
      .translate([canvasSize / 2, canvasSize / 2])
      .rotate([-yaw, -pitch, 0])
      .clipAngle(90);

    for (const event of events) {
      const coords = projection([event.lng, event.lat]);
      if (coords) {
        const dist = Math.hypot(coords[0] - mouseCanvasX, coords[1] - mouseCanvasY);
        if (dist <= Math.max(12, event.severity * 3.5 + 4)) {
          onSelectEvent(event);
          return;
        }
      }
    }
  };

  // Center on selected event if specified
  useEffect(() => {
    if (selectedEvent) {
      // Smoothly orient toward selected event
      setYaw(selectedEvent.lng);
      setPitch(Math.max(-50, Math.min(50, selectedEvent.lat)));
    }
  }, [selectedEvent]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localYaw = yaw;
    let localPitch = pitch;

    const render = () => {
      radarAngleRef.current = (radarAngleRef.current + 0.02) % (Math.PI * 2);

      // Handle hover steering vs slow planetary drift
      if (!isDraggingRef.current) {
        if (isMouseSteer && isHoveringRef.current && (Math.abs(hoverSteerRef.current.vx) > 0 || Math.abs(hoverSteerRef.current.vy) > 0)) {
          // Steer in the direction of the hovered mouse
          localYaw = (localYaw + hoverSteerRef.current.vx * 0.4) % 360;
          localPitch = Math.max(-65, Math.min(65, localPitch - hoverSteerRef.current.vy * 0.25));
          setYaw(localYaw);
          setPitch(localPitch);
        } else if (isAutoRotate) {
          // Slow, majestic planetary drift (0.07 deg per tick)
          localYaw = (localYaw + 0.07) % 360;
          setYaw(localYaw);
        }
      }

      ctx.clearRect(0, 0, canvasSize, canvasSize);

      const center = canvasSize / 2;
      const radius = currentRadius;

      // 1. Atmosphere Radial Glow Ring
      const atmoGrad = ctx.createRadialGradient(center, center, radius * 0.85, center, center, radius * 1.12);
      atmoGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      atmoGrad.addColorStop(0.88, 'rgba(6, 182, 212, 0.12)');
      atmoGrad.addColorStop(0.96, 'rgba(6, 182, 212, 0.28)');
      atmoGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.beginPath();
      ctx.arc(center, center, radius * 1.12, 0, Math.PI * 2);
      ctx.fillStyle = atmoGrad;
      ctx.fill();

      // 2. Base Ocean Sphere (Radial Depth Gradient)
      const oceanGrad = ctx.createRadialGradient(center - radius * 0.25, center - radius * 0.25, radius * 0.1, center, center, radius);
      oceanGrad.addColorStop(0, '#151E2E');
      oceanGrad.addColorStop(0.65, '#0E1422');
      oceanGrad.addColorStop(1, '#090D16');

      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = oceanGrad;
      ctx.fill();
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = '#1F293D';
      ctx.stroke();
      ctx.clip(); // Clip everything to sphere boundary

      // 3. Setup d3-geo Orthographic Projection
      const projection = geoOrthographic()
        .scale(radius)
        .translate([center, center])
        .rotate([-localYaw, -localPitch, 0])
        .clipAngle(90);

      const pathGenerator = geoPath(projection, ctx);

      // 4. Render Graticules (Latitude & Longitude Grid Lines)
      ctx.beginPath();
      pathGenerator(graticuleGeoJson);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(31, 41, 61, 0.6)';
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Render Continents & Landmasses (Natural Earth 110m Geometry)
      ctx.beginPath();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pathGenerator(landGeoJson as any);
      ctx.fillStyle = '#1C263B'; // Professional high-contrast dark continent fill
      ctx.fill();
      ctx.lineWidth = 0.85;
      ctx.strokeStyle = '#2D3D5A'; // Crisp glowing coastline borders
      ctx.stroke();

      // 6. Rotating Radar Sweep Beam
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(radarAngleRef.current);
      const beamGrad = ctx.createLinearGradient(0, 0, radius, radius * 0.6);
      beamGrad.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
      beamGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, 0, Math.PI / 3.5);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();
      ctx.restore();

      ctx.restore(); // End sphere clipping

      // 7. Render Event Markers onto Front Face
      for (const event of events) {
        const coords = projection([event.lng, event.lat]);
        if (!coords) continue; // Behind sphere horizon

        const [px, py] = coords;
        const topicConfig = TOPIC_REGISTRY[event.topic];
        const isSelected = selectedEvent?.id === event.id;
        const isHovered = hoveredEvent?.id === event.id;
        const markerRadius = Math.max(4, event.severity * 2.2);

        // Outer pulsing ring for high severity (>=3) or selected/hovered events
        if (event.severity >= 3 || isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(px, py, markerRadius * (1.6 + Math.sin(Date.now() / 250) * 0.2), 0, Math.PI * 2);
          ctx.strokeStyle = isSelected ? '#FFFFFF' : topicConfig.color;
          ctx.lineWidth = 1.25;
          ctx.globalAlpha = 0.65;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }

        // Inner solid marker dot
        ctx.beginPath();
        ctx.arc(px, py, markerRadius, 0, Math.PI * 2);
        ctx.fillStyle = topicConfig.color;
        ctx.fill();
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.strokeStyle = isSelected ? '#FFFFFF' : '#0A0D14';
        ctx.stroke();

        // Center dark pin core
        ctx.beginPath();
        ctx.arc(px, py, 1.25, 0, Math.PI * 2);
        ctx.fillStyle = '#0A0D14';
        ctx.fill();
      }

      // 8. Render Floating Tooltip for Hovered/Selected Event
      const activeEvent = hoveredEvent || (selectedEvent && projection([selectedEvent.lng, selectedEvent.lat]) ? selectedEvent : null);
      if (activeEvent) {
        const coords = projection([activeEvent.lng, activeEvent.lat]);
        if (coords) {
          const [tx, ty] = coords;
          const label = activeEvent.title.length > 30 ? activeEvent.title.substring(0, 28) + '...' : activeEvent.title;
          ctx.font = '600 10px Inter, system-ui, sans-serif';
          const textMetrics = ctx.measureText(label);
          const boxWidth = textMetrics.width + 16;
          const boxHeight = 22;
          const boxX = Math.max(10, Math.min(canvasSize - boxWidth - 10, tx - boxWidth / 2));
          const boxY = Math.max(10, ty - 28);

          ctx.fillStyle = 'rgba(17, 22, 34, 0.95)';
          ctx.strokeStyle = '#06B6D4';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#F1F5F9';
          ctx.fillText(label, boxX + 8, boxY + 14);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [currentRadius, graticuleGeoJson, landGeoJson, events, selectedEvent, hoveredEvent, isAutoRotate, isMouseSteer, yaw, pitch]);

  return (
    <div className="relative w-full h-[440px] lg:h-[480px] flex items-center justify-center select-none overflow-hidden rounded-panel glass-card border border-border">
      {/* Background Starfield and Radial Falloff */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#111622_0%,#0A0D14_100%)] pointer-events-none" />

      {/* HTML5 Canvas with Real World Continent Projection */}
      <div className="relative z-10 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="cursor-grab active:cursor-grabbing max-w-full max-h-[440px] touch-none"
          aria-label="Interactive 3D Earth Globe with geographical continents, coastlines, and live telemetry markers"
          role="img"
        />
      </div>

      {/* Floating HUD Controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 z-20 bg-panel/90 border border-border rounded-xl p-1 backdrop-blur-md shadow-card">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(1.35, z + 0.1))}
          className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-panel-subtle transition-colors"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.75, z - 0.1))}
          className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-panel-subtle transition-colors"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setIsMouseSteer((s) => !s)}
          className={`p-1.5 rounded-lg transition-colors ${
            isMouseSteer ? 'text-accent bg-accent/15' : 'text-text-muted hover:text-text hover:bg-panel-subtle'
          }`}
          title={isMouseSteer ? 'Mouse-Steer Active (Move mouse across globe to rotate)' : 'Enable Mouse-Steer'}
          aria-label={isMouseSteer ? 'Mouse-Steer Active' : 'Enable Mouse-Steer'}
        >
          <MousePointer className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setIsAutoRotate((r) => !r)}
          className={`p-1.5 rounded-lg transition-colors ${
            isAutoRotate ? 'text-accent bg-accent/15' : 'text-text-muted hover:text-text hover:bg-panel-subtle'
          }`}
          title={isAutoRotate ? 'Pause Drift' : 'Resume Planetary Drift'}
          aria-label={isAutoRotate ? 'Pause Drift' : 'Resume Planetary Drift'}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            setYaw(0);
            setPitch(15);
            setZoom(1.0);
          }}
          className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-panel-subtle transition-colors"
          title="Reset Orientation to Prime Meridian"
          aria-label="Reset Orientation"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Left Telemetry Overlay */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-text bg-panel/85 border border-border px-2.5 py-1 rounded-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>Continents & Live Pins: {events.length}</span>
          <div className="pointer-events-auto">
            <InfoTooltip
              title="Geographical Earth Globe & Mouse Steering"
              description="Renders Natural Earth geographical continents, coastlines, and graticule coordinates. Hover and move your mouse across the globe to dynamically steer its rotation, or drag with your mouse for direct 3D orientation."
              source="Natural Earth 110m · d3-geo Orthographic Projection"
              baseline="Real Continental Geography | Hover Steering Active"
            />
          </div>
        </div>
        <div className="text-[10px] font-mono text-text-muted ml-1 flex items-center gap-2">
          <span>Window: Last {hoursWindow}h</span>
          <span>·</span>
          <span>Hover-Steer: {isMouseSteer ? 'On' : 'Off'}</span>
        </div>
      </div>
    </div>
  );
};
