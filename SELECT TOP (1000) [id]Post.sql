SELECT TOP (1000) [id]
      ,[cv_path]
      ,[carrera]
      ,[email]
      ,[foto_perfil]
      ,[institucion]
      ,[egresado]
      ,[nombre_completo]
      ,[password]
      ,[telefono]
      ,[username]
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
      ,[nombre_completo]
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

DBCC CHECKIDENT ('postulaciones', RESEED);

DELETE FROM dbo.postulaciones 
WHERE id IN (7);

TRUNCATE TABLE dbo.postulaciones;
DBCC CHECKIDENT ('dbo.postulaciones', RESEED, 0);

