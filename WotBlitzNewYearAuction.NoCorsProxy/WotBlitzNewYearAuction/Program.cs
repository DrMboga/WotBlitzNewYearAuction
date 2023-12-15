using WotBlitzNewYearAuction;

var builder = WebApplication.CreateBuilder(args);
var AllowCors = "AllowCors";

builder.Services.AddCors(options =>
{
    options.AddPolicy(AllowCors,
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                ;
        });
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped(sp => new HttpClient());

var app = builder.Build();
app.UseCors(AllowCors);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // /swagger/index.html
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/auction", async (HttpClient http) =>
{
    return await http.GetAuctionData();
})
.WithName("Auction")
.WithOpenApi();

app.Run();

