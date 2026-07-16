CREATE TABLE volumenes (
  id TEXT PRIMARY KEY,
  revista TEXT NOT NULL,
  volumen INTEGER NOT NULL,
  numero TEXT NOT NULL,
  anio INTEGER NOT NULL,
  portada_url TEXT
);

CREATE TABLE articulos (
  id TEXT PRIMARY KEY,
  volumen_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  autores TEXT,
  paginas TEXT,
  anio_pub INTEGER,
  tipo TEXT,
  region TEXT,
  tema TEXT,
  url TEXT,
  resumen TEXT,
  FOREIGN KEY (volumen_id) REFERENCES volumenes(id)
);

CREATE INDEX idx_articulos_titulo ON articulos(titulo);
CREATE INDEX idx_articulos_region ON articulos(region);
CREATE INDEX idx_articulos_tema ON articulos(tema);
