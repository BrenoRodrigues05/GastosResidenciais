FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY . .

RUN dotnet restore "src/GastosResidenciais.Api/GastosResidenciais.Api.csproj"
RUN dotnet publish "src/GastosResidenciais.Api/GastosResidenciais.Api.csproj" \
  -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "GastosResidenciais.Api.dll"]
