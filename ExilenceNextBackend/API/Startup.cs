using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using API.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
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
using Microsoft.AspNetCore.SignalR;
using API.Providers;

namespace API
{
    //Test
    public class Startup
    {
        public IConfiguration _configuration { get; }
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddAutoMapper(typeof(Startup));
            services.AddDbContext<ExilenceContext>(
                options => options.UseLazyLoadingProxies(false).UseSqlServer(_configuration.GetConnectionString("ExilenceConnection"), b => b.MigrationsAssembly("Shared"))
            );

            //Services
            services.AddScoped<IGroupService, GroupService>();
            services.AddScoped<ISnapshotService, SnapshotService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ICacheService, CacheService>();

            // Repositories
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IGroupRepository, GroupRepository>();
            services.AddScoped<ISnapshotRepository, SnapshotRepository>();
            services.AddScoped<ICacheRepository, CacheRepository>();

            services.AddSignalR(o =>
            {
                o.EnableDetailedErrors = true;
                o.HandshakeTimeout = TimeSpan.FromSeconds(40);
                o.MaximumReceiveMessageSize = 50 * 1024 * 1024;
            }).AddStackExchangeRedis(_configuration.GetConnectionString("Redis"), options =>
            {
                options.Configuration.ChannelPrefix = "ExilenceNextSignalR";
                options.Configuration.ConnectTimeout = 10000;
            }).AddMessagePackProtocol(options =>
            {
                options.FormatterResolvers = new List<MessagePack.IFormatterResolver>()
                {
                    MessagePack.Resolvers.StandardResolver.Instance
                };
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
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration.GetSection("Settings")["Secret"])),
                    ValidateAudience = false,
                    ValidateIssuer = false

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

            services.AddSingleton<IUserIdProvider, NameUserIdProvider>();
            services.AddHttpClient();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IConfiguration configuration, ExilenceContext exilenceContext, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<BaseHub>("/hub");
            });

            string instanceName = configuration.GetSection("Settings")["InstanceName"];


            logger.LogInformation("Removing dead connections with instance: {0}", instanceName);
            //Remove faulty connections to this node on startup if node crasched
            exilenceContext.Database.ExecuteSqlRaw($"DELETE FROM Connections WHERE InstanceName = '{instanceName}'");

            logger.LogInformation("Removing dead groups with instance: {0}", instanceName);
            //Remove groups with no connections after connection cleanup
            exilenceContext.Database.ExecuteSqlRaw($"DELETE FROM Groups WHERE Id IN (SELECT g.Id FROM Groups g WHERE (SELECT COUNT(*) FROM Connections WHERE GroupId = g.Id) = 0)");

            //Apply mongo migrations on start if neeeded
            logger.LogInformation("Starting to apply MongoDB migrations.");
            var migrationResult = MongoMigrationHandler.Run(configuration.GetSection("ConnectionStrings")["Mongo"], configuration.GetSection("Mongo")["Database"]);
            foreach (var migration in migrationResult.InterimSteps)
            {
                logger.LogInformation($"Applied migration version: {migration.TargetVersion} and name: {migration.MigrationName} to database: {migration.DatabaseName} on host: {migration.ServerAdress}");
            }
            if (migrationResult.InterimSteps.Count() == 0)
            {
                logger.LogInformation($"No pending migrations found. Using MongoDB {migrationResult.DatabaseName} on {migrationResult.ServerAdress} version: {migrationResult.CurrentVersion}.");
            }
            logger.LogInformation("Finished applying MongoDB migrations.");
        }
    }
}
