using Microsoft.EntityFrameworkCore;
using project_infosoft.Models;
using Microsoft.Extensions.DependencyInjection;
using project_infosoft.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<RentalContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("RentalContext") ?? throw new InvalidOperationException("Connection string 'RentalContext' not found.")));



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
