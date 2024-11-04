using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Controllers.Tour.Bussiness;
using ADAVIGO_FRONTEND.Infrastructure.Extensions;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.Services.CacheService;
using B2B.Utilities.Contants;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Net;
using System.Text;

namespace ADAVIGO_FRONTEND
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
            services.AddControllersWithViews()
                .AddRazorRuntimeCompilation()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions
                    .PropertyNamingPolicy = null;
                });

            services.AddRazorPages();
            /// Thêm nén các file css/js/... theo chuẩn Br và Gzip --> Web load nhanh hơn
            services.AddResponseCompression(options =>
            {
                options.Providers.Add<BrotliCompressionProvider>();
                options.Providers.Add<GzipCompressionProvider>();
            });

            services.AddHttpContextAccessor();

            services.AddSession();
            services.AddMemoryCache();

            // Setting Redis                     
            services.AddScoped<ApiConnector>();

            #region SETTING JWT
            //Provide a secret key to Encrypt and Decrypt the Token 
            var SecretKey = Encoding.ASCII.GetBytes(JWTConstants.SecretKey); // JWTConstants.SecretKey: KHÓA PRIVATE
            services.AddAuthentication(auth =>
            {
                auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(token =>
            {
                token.RequireHttpsMetadata = false;
                token.SaveToken = true; // Lưu trữ mã thông báo trong http context để truy cập mã thông báo khi cần thiết trong controller
                token.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(SecretKey), // private key
                    ValidateIssuer = true,
                    ValidIssuer = Configuration["Authentication:Issuer"], // địa chỉ nơi cung cấp dịch vụ
                    ValidateAudience = true,
                    //Here we are creating and using JWT within the same application. In this case base URL is fine 
                    //If the JWT is created using a web service then this could be the consumer URL 
                    ValidAudience = Configuration["Authentication:Audience"], // nơi sử dụng dịch vụ
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });
            #endregion END SETTING JWT    
            services.AddSettings(Configuration);
            services.AddTransient<HomeService>();
            services.AddTransient<HotelService>();
            services.AddTransient<NewsService>();
            services.AddTransient<FundService>();
            services.AddTransient<BookingService>();
            services.AddTransient<AccountService>();
            services.AddTransient<B2CFlightService>();
            services.AddTransient<LocationService>();
            services.AddHttpClient<DataComService>();
            services.AddHttpClient<AdavigoTourService>();

            services.AddScoped<ICacheService, CacheService>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseSession();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();

            app.UseStatusCodePages(async context =>
            {
                var response = context.HttpContext.Response;
                if (response.StatusCode == (int)HttpStatusCode.Unauthorized || response.StatusCode == (int)HttpStatusCode.Forbidden || response.StatusCode == (int)HttpStatusCode.MethodNotAllowed)
                    response.Redirect("/Login");
            });

            app.UseRouting();

            app.Use(async (context, next) =>
            {
                var JWToken = context.Request.Cookies[JWTConstants.AccessTokenKey];//Lấy ra token lưu dưới máy client                                                                     
                if (!string.IsNullOrEmpty(JWToken))
                {
                    context.Request.Headers.Add("Authorization", "Bearer " + JWToken);
                }
                await next();
            });

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                  name: "Login",
                  pattern: "{controller=Client}/{action=Login}/{url?}");
                endpoints.MapControllerRoute(
                   name: "default",
                   pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                 name: "tourDetail",
                 pattern: "tour/{slug_location}/{slug}--{id}",
                 defaults: new { controller = "Tour", action = "Detail" }
                );
            });

          
        }
    }
}
