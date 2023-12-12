﻿// TankName | Tier-Nation-Type | Price | Left

using System.Text.Json;
using WotBlitzNewYearAuction;

const string AuctionUrl = "https://eu.wotblitz.com/en/auction/#/";
const string InitialPricesFileName = "initialPrices.json";

while (true)
{
    await ReadAuction();
    Thread.Sleep(TimeSpan.FromMinutes(10));
}

static async Task ReadAuction()
{
    var initialPricesFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, InitialPricesFileName);

    List<InitialPrices> initialPrices;
    if (Path.Exists(initialPricesFile))
    {
        var initialPricesJson = File.ReadAllText(initialPricesFile);
        initialPrices = JsonSerializer.Deserialize<List<InitialPrices>>(initialPricesJson!)!;
    }
    else
    {
        initialPrices = new();
    }

    var initialPriceChanged = false;

    var auctionData = await HttpHelper.GetAuctionData();
    if (auctionData?.AuctionItems != null)
    {
        Console.Clear();
        Console.WriteLine($"Auction data on '{DateTime.Now.ToString("dd.MM.yyyy HH:mm")}': {AuctionUrl}");
        Console.WriteLine();

        foreach (var auctionItem in auctionData.AuctionItems.Where(i => i.Available && i.Vehicle != null))
        {
            var initialPrice = initialPrices.FirstOrDefault(p => p.VehicleId == auctionItem.Vehicle!.Id);

            if (initialPrice != null)
            {
                auctionItem.InitialPrice = initialPrice.InitialPrice;
            }
            else
            {
                initialPrices.Add(new InitialPrices { VehicleId = auctionItem.Vehicle!.Id, InitialPrice = auctionItem.Price!.PriceValue});
                auctionItem.InitialPrice = auctionItem.Price!.PriceValue;
                initialPriceChanged = true;
            }

            WriteLineAuctionRow(auctionItem);
        }

        if(initialPriceChanged)
        {
            string initialPricesJson = JsonSerializer.Serialize(initialPrices);
            File.WriteAllText(initialPricesFile, initialPricesJson);
        }
    }
}

static void WriteLineAuctionRow(AuctionItem auctionItem)
{
    var vehicle = auctionItem.Vehicle!;
    string vehicleType; 
    switch (vehicle.Type)
    {
        case "heavyTank":
            vehicleType = "HT";
            break;
        case "mediumTank":
            vehicleType = "MT";
            break;
        case "lightTank":
            vehicleType = "LT";
            break;
        case "AT-SPG":
            vehicleType = "AT";
            break;
        default:
            vehicleType = vehicle.Type;
            break;
    }

    // Tank tier, nation and type
    var tankInfo = $"{vehicle.Tier}-{vehicleType}-{vehicle.Nation.ToUpper()}";
    Console.Write($"| {tankInfo.PadRight(15)}|");
    // Tank Name
    Console.ForegroundColor = ConsoleColor.Blue;
    Console.Write($" {vehicle.Name.PadRight(15)}");
    Console.ResetColor();
    Console.Write("|");

    // Tank price
    int currentPrice = auctionItem.Price!.PriceValue;
    Console.ForegroundColor = ConsoleColor.Yellow;
    Console.Write($"{currentPrice.ToString().PadLeft(7)}");
    Console.ResetColor();
    // TankPrice drop (if any)
    if (currentPrice != auctionItem.InitialPrice)
    {
        int diff = auctionItem.InitialPrice - currentPrice;
        int diffPercent = Convert.ToInt32(100 * (Convert.ToDecimal(diff) / Convert.ToDecimal(auctionItem.InitialPrice)));
        Console.Write($" -{diff} ({diffPercent}%)".PadRight(15));
    }
    else
    {
        Console.Write(" ".PadRight(15));
    }
    Console.Write("|");

    // Amount
    int amountDiffPercent = Convert.ToInt32(100 * (Convert.ToDecimal(auctionItem.CurrentCount)/ Convert.ToDecimal(auctionItem.InitialCount)));
    if (amountDiffPercent > 5)
    {
        Console.ForegroundColor = ConsoleColor.Green;
    }
    else
    {
        Console.ForegroundColor = ConsoleColor.Red;
    }
    Console.Write(auctionItem.CurrentCount.ToString().PadLeft(5));
    Console.ResetColor();

    Console.Write($"/{auctionItem.InitialCount} ({amountDiffPercent}%)".PadRight(12));

    Console.Write("|");

    // Next price
    int nextPrice = auctionItem.NextPrice!.PriceValue;
    Console.ForegroundColor = ConsoleColor.Yellow;
    Console.Write($"{nextPrice.ToString().PadLeft(7)}");
    Console.ResetColor();
    var timeToNextPrice = auctionItem.NextPriceDropAt - DateTime.Now;
    Console.Write(" in ");
    Console.Write(timeToNextPrice.ToString(@"hh\:mm\:ss"));

    Console.Write(" |");

    Console.WriteLine();
}

