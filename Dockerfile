FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["project-infosoft.csproj", "."]
RUN dotnet restore "./project-infosoft.csproj"

COPY . .
WORKDIR "/src/."
RUN dotnet build "project-infosoft.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "project-infosoft.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
COPY --from=publish /app/publish .

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["dotnet", "project-infosoft.dll"]