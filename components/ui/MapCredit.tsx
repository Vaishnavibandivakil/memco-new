export function MapCredit({ className = "" }: { className?: string }) {
  return (
    <details className={`map-credit ${className}`}>
      <summary aria-label="Map attribution" title="Map attribution">i</summary>
      <div className="map-credit-details">
        <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a>
        <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener noreferrer">© OpenMapTiles</a>
        <span>Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a></span>
      </div>
    </details>
  );
}
