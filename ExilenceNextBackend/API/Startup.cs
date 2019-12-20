using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using API.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Shared;
using Shared.Interfaces;
using Shared.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using API.Services;
using API.Interfaces;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddAutoMapper(typeof(Startup));
            services.AddDbContext<ExilenceContext>(
                options => options.UseLazyLoadingProxies(false).UseSqlServer(Configuration.GetConnectionString("ExilenceConnection"), b => b.MigrationsAssembly("Shared"))
            );

            //Services
            services.AddScoped<IGroupService, GroupService>();
            services.AddScoped<ISnapshotService, SnapshotService>();
            services.AddScoped<IAccountService, AccountService>();

            // Repositories
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IGroupRepository, GroupRepository>();
            services.AddScoped<ISnapshotRepository, SnapshotRepository>();

            //services.AddSignalR().AddMessagePackProtocol();

            services.AddSignalR(o =>
            {
                o.EnableDetailedErrors = true;
                o.HandshakeTimeout = TimeSpan.FromSeconds(40);
            }).AddStackExchangeRedis(Configuration.GetConnectionString("Redis"), options =>
            {
                options.Configuration.ChannelPrefix = "ExilenceSignalR";
                options.Configuration.ConnectTimeout = 10000;
            });

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("Settings")["Secret"])),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
                // https://docs.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz?view=aspnetcore-3.0
                x.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            (path.StartsWithSegments("/hub")))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IConfiguration configuration, ExilenceContext exilenceContext)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<BaseHub>("/hub");
            });

            var instanceName = configuration.GetSection("Settings")["InstanceName"];
            exilenceContext.Database.ExecuteSqlRaw($"DELETE FROM Groups WHERE Id IN (SELECT GroupId FROM Connections WHERE InstanceName = '{instanceName}')");
            exilenceContext.Database.ExecuteSqlRaw($"DELETE FROM Connections WHERE InstanceName = '{instanceName}'");
        }
    }
}
