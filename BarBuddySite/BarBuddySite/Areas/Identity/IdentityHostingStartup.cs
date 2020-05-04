using System;
using BarBuddySite.Areas.Identity.Data;
using BarBuddySite.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: HostingStartup(typeof(BarBuddySite.Areas.Identity.IdentityHostingStartup))]
namespace BarBuddySite.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) => {
                services.AddDbContext<BarBuddyDbContext>(options =>
                    options.UseSqlServer(
                        context.Configuration.GetConnectionString("BarBuddyDbContextConnection")));

                services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
                .AddEntityFrameworkStores<BarBuddyDbContext>();
            });
        }
    }
}