using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace GastosResidenciais.Api.Swagger
{
    public class EnumSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (!context.Type.IsEnum) return;

            schema.Type = "string";
            schema.Format = null;
            schema.Enum = Enum.GetNames(context.Type)
                .Select(n => (IOpenApiAny)new OpenApiString(n))
                .ToList();
        }
    }
}
