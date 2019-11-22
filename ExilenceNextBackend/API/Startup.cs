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
            services.AddSignalR();
            services.AddAutoMapper(typeof(Startup));
            services.AddDbContext<ExilenceContext>(
                options => options.UseLazyLoadingProxies().UseSqlServer(Configuration.GetConnectionString("ExilenceConnection"), b => b.MigrationsAssembly("Shared"))
            );
            
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IGroupRepository, GroupRepository>();

            services.AddSignalR().AddMessagePackProtocol();

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
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<BaseHub>("/hub");
            });

            var instanceName = configuration.GetSection("Settings")["InstanceName"];
            exilenceContext.Database.ExecuteSqlRaw($"DELETE FROM Connections WHERE InstanceName = '{instanceName}'");
        }
    }
}
