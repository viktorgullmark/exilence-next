FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.0-buster AS build
WORKDIR /src
COPY ["ExilenceNextAPI/ExilenceNextAPI.csproj", "ExilenceNextAPI/"]
RUN dotnet restore "ExilenceNextAPI/ExilenceNextAPI.csproj"
COPY . .
WORKDIR "/src/ExilenceNextAPI"
RUN dotnet build "ExilenceNextAPI.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "ExilenceNextAPI.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "ExilenceNextAPI.dll"]