SELECT TOP (1000) [id]
      ,[carrera]
      ,[cv_path]
      ,[email]
      ,[foto_perfil]
      ,[nombre_completo]
      ,[password]
      ,[telefono]
      ,[username]
  FROM [dbo].[postantes]

DELETE FROM dbo.postulaciones 
WHERE id IN (4);

TRUNCATE TABLE dbo.postantes;
DBCC CHECKIDENT ('dbo.postantes', RESEED, 0);

SELECT TOP (1000) [id]
      ,[descripcion]
      ,[fecha_publicacion]
      ,[requisitos]
      ,[titulo]
      ,[ubicacion]
      ,[reclutador_id]
  FROM [dbo].[postulaciones]

DBCC CHECKIDENT ('postulaciones', RESEED);

DELETE FROM dbo.postulaciones 
WHERE id IN (7);

TRUNCATE TABLE dbo.postulaciones;
DBCC CHECKIDENT ('dbo.postulaciones', RESEED, 0);