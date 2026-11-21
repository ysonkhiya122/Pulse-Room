import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PulseEvent } from '@/features/events/schema';
import { TOPIC_REGISTRY } from '@/features/news/topics';
import { RotateCw, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { InfoTooltip } from '@/components/atoms/InfoTooltip';

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
  const [rotation, setRotation] = useState<number>(0);
  const [tilt, setTilt] = useState<number>(15);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);

  // Auto-rotation loop
  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.35) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoRotate]);

  // Convert lat/lng to 2D orthographic sphere projection
  const projectPoint = (lat: number, lng: number, rotDeg: number, tiltDeg: number) => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = ((lng + rotDeg) * Math.PI) / 180;
    const tiltRad = (tiltDeg * Math.PI) / 180;

    // 3D coordinates on unit sphere
    const x = Math.cos(latRad) * Math.sin(lngRad);
    const y0 = Math.sin(latRad);
    const z0 = Math.cos(latRad) * Math.cos(lngRad);

    // Apply tilt around X axis
    const y = y0 * Math.cos(tiltRad) - z0 * Math.sin(tiltRad);
    const z = y0 * Math.sin(tiltRad) + z0 * Math.cos(tiltRad);

    const isVisible = z > 0; // Front side of sphere
    return { x, y, z, isVisible };
  };

  const globeRadius = 170 * zoom;
  const center = 210;

  // Handle drag to rotate globe
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    setIsAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;

    setRotation((prev) => (prev + dx * 0.5 + 360) % 360);
    setTilt((prev) => Math.max(-60, Math.min(60, prev - dy * 0.5)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Projected markers
  const renderedMarkers = useMemo(() => {
    return events.map((event) => {
      const proj = projectPoint(event.lat, event.lng, rotation, tilt);
      const px = center + proj.x * globeRadius;
      const py = center - proj.y * globeRadius;
      const isSelected = selectedEvent?.id === event.id;
      const topicConfig = TOPIC_REGISTRY[event.topic];
      const markerSize = Math.max(7, event.severity * 3.5);

      return {
        event,
        px,
        py,
        proj,
        isSelected,
        topicConfig,
        markerSize,
      };
    });
  }, [events, rotation, tilt, globeRadius, selectedEvent]);

  return (
    <div className="relative w-full h-[440px] lg:h-[480px] flex items-center justify-center select-none overflow-hidden rounded-panel glass-card border border-border">
      {/* Background Starfield and Radial Falloff */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#111622_0%,#0A0D14_100%)] pointer-events-none" />

      {/* Interactive Projection Canvas */}
      <div
        className="relative z-10 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        tabIndex={0}
        role="region"
        aria-label="Interactive 3D Earth Globe with live event markers"
      >
        <svg
          width="420"
          height="420"
          viewBox="0 0 420 420"
          className="overflow-visible"
        >
          <defs>
            {/* Professional Globe Sphere Gradient */}
            <radialGradient id="globeSphere" cx="42%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#1E273A" />
              <stop offset="50%" stopColor="#121824" />
              <stop offset="100%" stopColor="#0B0F17" />
            </radialGradient>

            {/* Atmosphere glow */}
            <radialGradient id="atmoGlow" cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor="transparent" />
              <stop offset="98%" stopColor="#06B6D4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>

            {/* Radar beam gradient */}
            <linearGradient id="radarBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.18" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Outer Atmosphere Ring */}
          <circle
            cx={center}
            cy={center}
            r={globeRadius + 6}
            fill="url(#atmoGlow)"
            className="pointer-events-none"
          />

          {/* Base Globe Body */}
          <circle
            cx={center}
            cy={center}
            r={globeRadius}
            fill="url(#globeSphere)"
            stroke="#1F2636"
            strokeWidth="1.25"
          />

          {/* Graticule Latitude Lines */}
          {[-45, -20, 0, 20, 45].map((latDeg) => {
            const yOffset = (Math.sin((latDeg * Math.PI) / 180) * globeRadius * Math.cos((tilt * Math.PI) / 180));
            const ringRadiusX = Math.cos((latDeg * Math.PI) / 180) * globeRadius;
            const ringRadiusY = ringRadiusX * Math.sin((tilt * Math.PI) / 180);
            return (
              <ellipse
                key={latDeg}
                cx={center}
                cy={center - yOffset}
                rx={Math.max(0, ringRadiusX)}
                ry={Math.max(0, Math.abs(ringRadiusY))}
                fill="none"
                stroke="#242E42"
                strokeWidth="0.75"
                strokeDasharray="3 3"
                opacity="0.45"
              />
            );
          })}

          {/* Equator Highlight */}
          <ellipse
            cx={center}
            cy={center}
            rx={globeRadius}
            ry={globeRadius * Math.sin((tilt * Math.PI) / 180)}
            fill="none"
            stroke="#2E3A52"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Rotating Radar Sweep Cone */}
          <g transform={`rotate(${rotation * 1.5}, ${center}, ${center})`} className="pointer-events-none opacity-30">
            <path
              d={`M ${center} ${center} L ${center + globeRadius} ${center} A ${globeRadius} ${globeRadius} 0 0 1 ${center} ${center + globeRadius} Z`}
              fill="url(#radarBeam)"
            />
          </g>

          {/* Event Markers */}
          {renderedMarkers.map(({ event, px, py, proj, isSelected, topicConfig, markerSize }) => {
            if (!proj.isVisible) return null; // Hidden on back face

            return (
              <g
                key={event.id}
                transform={`translate(${px}, ${py})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(event);
                }}
                className="cursor-pointer group"
                tabIndex={0}
                role="button"
                aria-label={`${event.title}, severity ${event.severity}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectEvent(event);
                  }
                }}
              >
                {/* Pulsing ring for high severity or selected */}
                {(event.severity >= 3 || isSelected) ? (
                  <circle
                    r={markerSize * 1.7}
                    fill="none"
                    stroke={topicConfig.color}
                    strokeWidth="1.2"
                    className="animate-ping opacity-50"
                  />
                ) : null}

                {/* Marker Body */}
                <circle
                  r={markerSize}
                  fill={topicConfig.color}
                  stroke={isSelected ? '#FFFFFF' : '#0A0D14'}
                  strokeWidth={isSelected ? 2 : 1.25}
                  className="transition-transform group-hover:scale-125 duration-150 drop-shadow-md"
                />

                {/* Center Core Dot */}
                <circle r={1.5} fill="#0A0D14" />

                {/* Tooltip on hover/select */}
                {isSelected ? (
                  <g transform="translate(0, -18)" className="pointer-events-none">
                    <rect
                      x="-70"
                      y="-22"
                      width="140"
                      height="20"
                      rx="4"
                      fill="#111622"
                      stroke="#06B6D4"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-8"
                      fill="#F1F5F9"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="font-mono truncate"
                    >
                      {event.title.substring(0, 22)}...
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Controls HUD */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 z-20 bg-panel/90 border border-border rounded-xl p-1 backdrop-blur-md shadow-card">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
          className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-panel-subtle transition-colors"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
          className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-panel-subtle transition-colors"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setIsAutoRotate((r) => !r)}
          className={`p-1.5 rounded-lg transition-colors ${
            isAutoRotate ? 'text-accent bg-accent/15' : 'text-text-muted hover:text-text hover:bg-panel-subtle'
          }`}
          title={isAutoRotate ? 'Pause Rotation' : 'Resume Auto Rotation'}
          aria-label={isAutoRotate ? 'Pause Rotation' : 'Resume Auto Rotation'}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            setRotation(0);
            setTilt(15);
            setZoom(1.0);
          }}
          className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-panel-subtle transition-colors"
          title="Reset Orientation"
          aria-label="Reset Orientation"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Left Telemetry Overlay */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-text bg-panel/85 border border-border px-2.5 py-1 rounded-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>Events in View: {events.length}</span>
          <div className="pointer-events-auto">
            <InfoTooltip
              title="3D Globe Telemetry Projection"
              description="Real-time orthographic sphere mapping verified planetary coordinates. Drag with mouse or swipe on touch screens to inspect any quadrant of the globe."
              source="USGS · NASA EONET · Open-Meteo"
              baseline="Orthographic Projection | 15° Default Tilt"
            />
          </div>
        </div>
        <div className="text-[10px] font-mono text-text-muted ml-1">
          Window: Last {hoursWindow}h | Projection: Orthographic
        </div>
      </div>
    </div>
  );
};
