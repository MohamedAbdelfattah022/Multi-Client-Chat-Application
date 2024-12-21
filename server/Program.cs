using dotenv.net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using server.Data;
using server.Hubs;
using System.Text;
namespace server
{
    public class Program
    {
        public static void Main(string[] args) {
            var builder = WebApplication.CreateBuilder(args);
            DotEnv.Load();
            builder.Configuration.AddEnvironmentVariables();

            builder.Configuration["Jwt:Issuer"] = Environment.GetEnvironmentVariable("Issuer");
            builder.Configuration["Jwt:Audience"] = Environment.GetEnvironmentVariable("Audience");
            builder.Configuration["Jwt:DurationInMin"] = Environment.GetEnvironmentVariable("DurationInMin");
            builder.Configuration["Jwt:SigningKey"] = Environment.GetEnvironmentVariable("SigningKey");


            builder.Services.AddDbContext<AppDbContext>();
            builder.Services.AddSignalR();
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddOpenApi();


            builder.Services.AddCors(options => {
                options.AddPolicy("AllowAll", policy => policy.AllowAnyHeader()
                .WithOrigins("http://localhost:5173")
                .AllowAnyMethod()
                .AllowCredentials());
            });

            var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>();
            builder.Services.AddSingleton(jwtOptions);


            builder.Services.AddAuthentication()
                .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => {
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters {
                        ValidateIssuer = true,
                        ValidIssuer = jwtOptions.Issuer,
                        ValidateAudience = true,
                        ValidAudience = jwtOptions.Audience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment()) {
                //app.UseSwagger();
                //app.UseSwaggerUI();
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowAll");
            app.UseAuthorization();


            app.MapControllers();
            app.MapHub<ChatHub>("/chatHub");
            app.Run();
        }
    }
}
