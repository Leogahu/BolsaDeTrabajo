SELECT TOP (1000) [id]
      ,[cv_path]
      ,[carrera]
      ,[email]
      ,[foto_perfil]
      ,[institucion]
      ,[egresado]
      ,[nombres]
      ,[apellidos]
      ,[password]
      ,[telefono]
      ,[username]
      ,[descripcion]
  FROM [dbo].[postantes]


SELECT TOP (1000) [id]
      ,[descripcion]
      ,[fecha_publicacion]
      ,[requisitos]
      ,[salario_maximo]
      ,[salario_minimo]
      ,[tipo_modalidad]
      ,[tipo_puesto]
      ,[titulo]
      ,[ubicacion]
      ,[reclutador_id]
  FROM [dbo].[postulaciones]

DELETE FROM dbo.postantes 
WHERE id IN (1);

TRUNCATE TABLE dbo.postantes;
DBCC CHECKIDENT ('dbo.postantes', RESEED, 0);

SELECT TOP (1000) [id]
      ,[email]
      ,[empresa]
      ,[nombres]
      ,[apellidos]
      ,[password]
      ,[username]
  FROM [dbo].[reclutadores]
  
SELECT TOP (1000) [id]
      ,[titulo]
      ,[fecha_publicacion]
      ,[salario_maximo]
      ,[salario_minimo]
      ,[reclutador_id]
      ,[descripcion]
      ,[requisitos]
      ,[tipo_modalidad]
      ,[tipo_puesto]
      ,[ubicacion]
  FROM [dbo].[postulaciones]

SELECT TOP (1000) [id]
      ,[estado]
      ,[fecha_actualizacion]
      ,[fecha_postulacion]
      ,[motivo]
      ,[postante_id]
      ,[postulacion_id]
  FROM [dbo].[postulacion_estado]


DBCC CHECKIDENT ('postulaciones', RESEED);

DELETE FROM dbo.postulaciones 
WHERE id IN (7);

TRUNCATE TABLE dbo.postulaciones;
DBCC CHECKIDENT ('dbo.postulaciones', RESEED, 0);

SELECT TOP (1000) [id]
      ,[nombre]
      ,[tipo_habilidad]
      ,[verificada]
      ,[postante_id]
  FROM [dbo].[habilidades]

SELECT TOP (1000) [id]
      ,[cargo_institucion]
      ,[comentario_aval]
      ,[contacto_email]
      ,[nombre_avalador]
      ,[postante_id]
  FROM [dbo].[avales_academicos]

SELECT TOP (1000) [id]
      ,[fecha_emision]
      ,[institucion_emisora]
      ,[nombre_curso]
      ,[postante_id]
  FROM [dbo].[certificaciones]

DROP TABLE IF EXISTS habilidades;
DROP TABLE IF EXISTS avales_academicos;
DROP TABLE IF EXISTS certificaciones;
DROP TABLE IF EXISTS proyectos_academicos;
DROP TABLE IF EXISTS postantes;
DROP TABLE IF EXISTS postulaciones;
DROP TABLE IF EXISTS postulacion_estado;
DROP TABLE IF EXISTS reclutadores;