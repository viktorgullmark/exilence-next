FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.0-buster AS build
WORKDIR /src
COPY ["ExilenceNextBackend.csproj", ""]
RUN dotnet restore "./ExilenceNextBackend.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "ExilenceNextBackend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ExilenceNextBackend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ExilenceNextBackend.dll"]