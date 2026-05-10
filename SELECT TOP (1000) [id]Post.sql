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