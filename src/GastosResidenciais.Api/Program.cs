using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Application.Services;
using GastosResidenciais.Infrastructure.Data;
using GastosResidenciais.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// CORS para o React (Vite: http://localhost:5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


builder.Services.AddControllers().AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // XML do projeto da API
    var apiXml = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var apiXmlPath = Path.Combine(AppContext.BaseDirectory, apiXml);
    if (File.Exists(apiXmlPath)) c.IncludeXmlComments(apiXmlPath);

    // XML do projeto Application (onde estão os DTOs)
    var appAssembly = typeof(GastosResidenciais.Application.DTOs.TransacaoCreateDto).Assembly;
    var appXml = $"{appAssembly.GetName().Name}.xml";
    var appXmlPath = Path.Combine(AppContext.BaseDirectory, appXml);
    if (File.Exists(appXmlPath)) c.IncludeXmlComments(appXmlPath);

    c.SchemaFilter<GastosResidenciais.Api.Swagger.EnumSchemaFilter>();
});

// Add DbContext with MySQL
var mysqlconnection = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(mysqlconnection, ServerVersion.AutoDetect(mysqlconnection)));

// Dependency Injection
builder.Services.AddScoped<IPessoaRepository, PessoaRepository>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();
builder.Services.AddScoped<ITransacaoRepository, TransacaoRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Application Services
builder.Services.AddScoped<TransacaoService>();
builder.Services.AddScoped<RelatorioService>();
builder.Services.AddScoped<PessoaService>();
builder.Services.AddScoped<CategoriaService>();

// Customização das respostas de erro de validação de modelo
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = new List<object>();

        foreach (var entry in context.ModelState)
        {
            var key = entry.Key; // ex: "dto", "$.idade", "Nome"
            var state = entry.Value;
            if (state == null || state.Errors.Count == 0) continue;

            // Normaliza o nome do campo (remove "$.", "dto", etc.)
            var field = NormalizeField(key);

            foreach (var err in state.Errors)
            {
                var msg = BuildFriendlyMessage(field, err.ErrorMessage, err.Exception);

                // evita duplicar mensagens iguais
                if (!errors.Any(e => e.ToString() == new { field, message = msg }.ToString()))
                    errors.Add(new { field, message = msg });
            }
        }

        if (errors.Any(e => e.GetType().GetProperty("field")?.GetValue(e)?.ToString() != "body"))
        {
            errors = errors
                .Where(e => e.GetType().GetProperty("field")?.GetValue(e)?.ToString() != "body")
                .ToList();
        }

        // fallback caso não tenha nada
        if (errors.Count == 0)
            errors.Add(new { field = "body", message = "Dados inválidos." });

        return new BadRequestObjectResult(new
        {
            message = "Dados inválidos.",
            errors
        });
    };

    static string NormalizeField(string key)
    {
        if (string.IsNullOrWhiteSpace(key))
            return "body";

        // quando o body vem nulo, aparece "dto"
        if (key.Equals("dto", StringComparison.OrdinalIgnoreCase))
            return "body";

        // erros do System.Text.Json vêm assim: "$.idade"
        if (key.StartsWith("$."))
            key = key.Substring(2);

        // se vier algo como "dto.Nome"
        if (key.StartsWith("dto.", StringComparison.OrdinalIgnoreCase))
            key = key.Substring(4);

        // pega o último segmento caso venha "pessoa.nome" etc.
        var last = key.Split('.').LastOrDefault();
        return string.IsNullOrWhiteSpace(last) ? "body" : last;
    }

    static string BuildFriendlyMessage(string field, string rawMessage, Exception? ex)
    {
        // body ausente
        if (field == "body" && rawMessage.Contains("field is required", StringComparison.OrdinalIgnoreCase))
            return "O corpo da requisição é obrigatório.";

        // Se for erro de JSON (tipo inválido / formato)
        if (ex is JsonException || rawMessage.Contains("invalid start of a value", StringComparison.OrdinalIgnoreCase))
        {
            // mensagens específicas por campo 
            if (field.Equals("idade", StringComparison.OrdinalIgnoreCase))
                return "Idade deve ser um número válido.";

            if (field.Equals("nome", StringComparison.OrdinalIgnoreCase))
                return "Nome deve ser um texto válido.";

            return $"Formato inválido para o campo '{field}'.";
        }

        // Não conseguiu converter para string/int/etc
        if (rawMessage.Contains("could not be converted", StringComparison.OrdinalIgnoreCase))
        {
            if (field.Equals("idade", StringComparison.OrdinalIgnoreCase))
                return "Idade deve ser um número válido.";

            if (field.Equals("nome", StringComparison.OrdinalIgnoreCase))
                return "Nome deve ser um texto válido.";

            return $"Tipo inválido para o campo '{field}'.";
        }

        // Required (DataAnnotations)
        if (rawMessage.Contains("required", StringComparison.OrdinalIgnoreCase))
            return $"O campo '{field}' é obrigatório.";

        if (rawMessage.Contains("invalid JSON literal", StringComparison.OrdinalIgnoreCase))
            return $"Conteúdo inválido no campo '{field}'. Verifique aspas e formato do texto.";

        if (ex is JsonException || rawMessage.Contains("invalid start of a value", StringComparison.OrdinalIgnoreCase))
        {
            if (field.Equals("valor", StringComparison.OrdinalIgnoreCase))
                return "Valor deve ser numérico (ex: 120.50).";

            if (field.Equals("descricao", StringComparison.OrdinalIgnoreCase))
                return "Descrição deve ser um texto válido, sem quebra de JSON.";

            if (field.Equals("tipo", StringComparison.OrdinalIgnoreCase))
                return "Tipo deve ser 'Receita' ou 'Despesa'.";

            return $"Formato inválido para o campo '{field}'.";
        }

        if (rawMessage.Contains("could not be converted", StringComparison.OrdinalIgnoreCase))
        {
            if (field.Equals("valor", StringComparison.OrdinalIgnoreCase))
                return "Valor deve ser numérico.";

            if (field.Equals("data", StringComparison.OrdinalIgnoreCase))
                return "Data deve estar no formato ISO, ex: 2026-01-16T12:30:00Z.";

            return $"Tipo inválido para o campo '{field}'.";
        }

        // fallback: mantém mensagem original 
        return rawMessage;
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();          

app.UseCors("Frontend");   

app.UseAuthorization();

app.MapControllers();

app.Run();
