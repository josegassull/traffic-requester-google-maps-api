let map: google.maps.Map;
async function initMap(): Promise<void> {
  const latitud = -32.83660854374648;
  const longitud = -68.84040182662206;

  const { Map } = (await google.maps.importLibrary(
    "maps"
  )) as google.maps.MapsLibrary;

  // Inicializa el mapa
  map = new Map(document.getElementById("map") as HTMLElement, {
    center: { lat: latitud, lng: longitud },
    zoom: 18,
  });

  // Añadir la capa de tráfico
  const trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  // Añadir un marcador en el centro del mapa
  const marker = new google.maps.Marker({
    position: { lat: latitud, lng: longitud },
    map: map,
    title: "Ubicación seleccionada",
  });

  // Función para actualizar el HUD sin redondeo
  function updateHud(lat: number, lng: number): void {
    (document.getElementById("lat") as HTMLElement).innerText = lat.toString();
    (document.getElementById("lng") as HTMLElement).innerText = lng.toString();
  }

  // Actualiza el HUD al mover el marcador
  marker.addListener("position_changed", () => {
    const position = marker.getPosition();
    if (position) {
      updateHud(position.lat(), position.lng());
    }
  });

  // Agregar debounce para evitar actualizaciones constantes del HUD
  let centerChangedTimeout: number | undefined;
  map.addListener("center_changed", () => {
    if (centerChangedTimeout) {
      clearTimeout(centerChangedTimeout);
    }
    centerChangedTimeout = window.setTimeout(() => {
      const center = map.getCenter();
      if (center) {
        updateHud(center.lat(), center.lng());
      }
    }, 300); // Espera 300 ms antes de actualizar el HUD
  });

  // Inicializa el HUD con la posición inicial
  updateHud(latitud, longitud);
}

initMap();
