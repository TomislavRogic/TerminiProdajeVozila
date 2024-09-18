using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.SwaggerUI;
using TerminiProdajeVozila.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// nakon builder.Services.AddSwaggerGen(); a prije var app = builder.Build(); dodati sljedeće linije koda kako bi se generirao swagger.json file i kako bi se mogao koristiti swagger UI
// dodavanje baze podataka
builder.Services.AddDbContext<TerminiProdajeVozilaContext>(opcije =>
{
    opcije.UseSqlServer(builder.Configuration.GetConnectionString("TerminiProdajeVozilaContext"));
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    // moramo dodat u app.UseSwaggerUI(); kako bi mogli koristiti swagger UI
    app.UseSwaggerUI(o =>
    { o.ConfigObject.AdditionalItems.Add("requestSnippetsEnabled", true);
        o.EnableTryItOutByDefault();
        });
    //// o =>
    //{
    //    o.ConfigObject.AdditionalItems.Add("requestSnippetsEnabled", true);
    //    o.EnableTryItOutByDefault()
    //    }); ovaj dio nam pokaze da maknemo u Swaggeru opciju Try it out, i da nam se prikazuju samo podaci, i da nam da opciju da kopiramo podatke
    // pomaze nam da u Command Promptu mozemo koristiti curl komande
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
