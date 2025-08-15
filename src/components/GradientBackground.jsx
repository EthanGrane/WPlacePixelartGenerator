import "./GradientBackground.css";

export default function GradientBackground() {
  return (
    <div className="gradient-background">
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: 'scaleY(-1)',   // voltea verticalmente
          backgroundImage: "url('/WPlacePixelartGenerator/looper-pattern.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          zIndex: -1
        }}
      />
      <div
        className="gradient-layer"
        style={{
          background: `
            radial-gradient(circle at 180% 70%, rgba(255, 0, 212, 0.3), transparent 550px),
            radial-gradient(circle at 120% 80%, rgba(0, 110, 255, 0.3), transparent 750px),
            radial-gradient(circle at 90% 100%, rgba(255, 0, 212, 0.3), transparent 550px),

            radial-gradient(circle at -20% 30%, rgba(255, 0, 212, 0.3), transparent 550px),
            radial-gradient(circle at 0% 20%, rgba(0, 110, 255, 0.3), transparent 750px),
            radial-gradient(circle at -10% 0%, rgba(255, 0, 212, 0.3), transparent 550px)
          `
        }}
      />
    </div>
  );
}
