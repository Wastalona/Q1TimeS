using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Q1TimeS.Controllers;
using Q1TimeS.Models;
using System.Data.Entity.Infrastructure;
using System.Data.Entity;
using Microsoft.EntityFrameworkCore;


/* Builder settings */
var builder = WebApplication.CreateBuilder(args);

// Connection string
var connection = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.Configure<JwtBearerOptions>(builder.Configuration.GetSection("JWTSettings"));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, // publisher validation
        ValidIssuer = JWTSettings.ISSUER, // publisher
        ValidateAudience = true,// token consumer validation
        ValidAudience = JWTSettings.AUDIENCE, // token consumer
        ValidateLifetime = true, // time of existence validation
        IssuerSigningKey = JWTSettings.GetSymmetricSecurityKey(), // set security key
        ValidateIssuerSigningKey = true,// security key validation
    };
});
builder.Services.AddDbContext<MySqlContext>(options => options.UseMySql(connection, ServerVersion.AutoDetect(connection)));
builder.Services.AddRazorPages();
builder.Services.AddSession();


/* App settings */
var app = builder.Build();

app.Use(async (context, next) =>
{
    if (context.Request.Cookies.TryGetValue("token", out string? token))
        context.Request.Headers.Authorization = $"Bearer {token}";

    await next();
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

/* Auth routes */
app.Map("admin/auth", (AdminAuthRequest model, HttpContext context, IConfiguration _configuration) => { 
    Hasher hasher = new Hasher();
    if (hasher.Verify(model.Password, _configuration["Admin:Password"]))
    {
        TockenController tokenCtl = new TockenController();
        var token_string = tokenCtl.GetTocken();
        // answer
        var response = new
        {
            token = token_string,
            username = "admin"
        };

        context.Response.Cookies.Append("token", token_string); // Add token to cookie
        return Results.Json(response);
    }
    else
    {
        return Results.Unauthorized();
    }
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
