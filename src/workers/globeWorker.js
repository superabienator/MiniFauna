// Web Worker para decodificar y suavizar la cartografía TopoJSON fuera del hilo principal

function smoothToyRingChaikin(rawPoints, iterations = 1) {
  if (rawPoints.length < 4) return rawPoints;

  const simplified = [rawPoints[0]];
  const minDistSq = 0.35 * 0.35;
  for (let i = 1; i < rawPoints.length - 1; i++) {
    const prev = simplified[simplified.length - 1];
    const cur = rawPoints[i];
    const dx = cur[0] - prev[0];
    const dy = cur[1] - prev[1];
    if (dx * dx + dy * dy >= minDistSq) {
      simplified.push(cur);
    }
  }
  simplified.push(rawPoints[rawPoints.length - 1]);
  if (simplified.length < 4) return rawPoints;

  let pts = simplified;
  for (let iter = 0; iter < iterations; iter++) {
    const next = [];
    const n = pts.length;
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      next.push([0.75 * p0[0] + 0.25 * p1[0], 0.75 * p0[1] + 0.25 * p1[1]]);
      next.push([0.25 * p0[0] + 0.75 * p1[0], 0.25 * p0[1] + 0.75 * p1[1]]);
    }
    next.push(next[0]);
    pts = next;
  }
  return pts;
}

function decodeTopoJsonLandUnwrapped(topology) {
  const tf = topology.transform;
  const decodedArcs = topology.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map((pt) => {
      x += pt[0];
      y += pt[1];
      return [x * tf.scale[0] + tf.translate[0], y * tf.scale[1] + tf.translate[1]];
    });
  });

  function arcToCoords(arcIndex) {
    if (arcIndex >= 0) return decodedArcs[arcIndex];
    return decodedArcs[~arcIndex].slice().reverse();
  }

  function unwrapAndCleanRing(rawRing) {
    if (rawRing.length < 4) return [];
    const unwrapped = [[rawRing[0][0], rawRing[0][1]]];
    let minLon = rawRing[0][0];
    let maxLon = rawRing[0][0];
    let minLat = rawRing[0][1];
    let maxLat = rawRing[0][1];

    for (let i = 1; i < rawRing.length; i++) {
      let lon = rawRing[i][0];
      const lat = rawRing[i][1];
      const prevLon = unwrapped[i - 1][0];
      while (lon - prevLon > 180) lon -= 360;
      while (lon - prevLon < -180) lon += 360;
      unwrapped.push([lon, lat]);
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }

    const bboxArea = (maxLon - minLon) * (maxLat - minLat);
    if (bboxArea < 0.6) return [];

    const first = unwrapped[0];
    const last = unwrapped[unwrapped.length - 1];
    if (Math.abs(last[0] - first[0]) > 200 && first[1] < -55) {
      unwrapped.push([last[0], -90]);
      unwrapped.push([first[0], -90]);
      return unwrapped;
    }

    return smoothToyRingChaikin(unwrapped, 1);
  }

  function decodeRing(indices) {
    let coords = [];
    indices.forEach((idx) => {
      coords = coords.concat(arcToCoords(idx));
    });
    return unwrapAndCleanRing(coords);
  }

  const geom = topology.objects.land;
  const polygons = [];
  const geoms = geom.type === 'GeometryCollection' ? geom.geometries : [geom];
  geoms.forEach((g) => {
    if (g.type === 'Polygon') {
      const rings = g.arcs.map(decodeRing).filter((r) => r.length >= 4);
      if (rings.length > 0) polygons.push(rings);
    } else if (g.type === 'MultiPolygon') {
      g.arcs.forEach((poly) => {
        const rings = poly.map(decodeRing).filter((r) => r.length >= 4);
        if (rings.length > 0) polygons.push(rings);
      });
    }
  });
  return polygons;
}

self.addEventListener('message', async (e) => {
  const { url } = e.data || {};
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const topology = await res.json();
    const polygons = decodeTopoJsonLandUnwrapped(topology);
    self.postMessage({ ok: true, polygons });
  } catch (err) {
    self.postMessage({ ok: false, error: err ? err.message : 'Worker fetch error' });
  }
});
