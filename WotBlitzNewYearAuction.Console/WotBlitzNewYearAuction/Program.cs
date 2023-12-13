// TankName | Tier-Nation-Type | Price | Left

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
        // 117: |17|19|19|17|17|21|
        Console.WriteLine("|    Tank info    |     Tank name     |   Current price   |    Available    |   Next price    | Availability period |");
        Console.WriteLine(new string('-', 117));

        foreach (var auctionItem in auctionData.AuctionItems.Where(i => i.Available && i.Vehicle != null && i.CurrentCount > 0).OrderBy(i => i.AvailableBefore))
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
    var vehicleNation = vehicle.Nation.Length <= 8 ? vehicle.Nation.ToUpper() : $"{vehicle.Nation.ToUpper().Substring(0, 6)}..";
    Console.Write($"| {vehicle.Tier.PadLeft(4)}");
    Console.ForegroundColor = vehicle.IsCollectible ? ConsoleColor.DarkBlue : (vehicle.IsPremium ? ConsoleColor.Yellow : ConsoleColor.DarkGray);
    Console.Write($" {vehicleType} ");
    Console.ResetColor();
    Console.Write($"{vehicleNation.PadRight(8)}|");

    // Tank Name
    Console.ForegroundColor = ConsoleColor.Blue;
    var vehicleName = vehicle.Name.Length <= 18 ? vehicle.Name : $"{vehicle.Name.Substring(0, 15)}...";
    Console.Write($" {vehicleName.PadRight(18)}");
    Console.ResetColor();
    Console.Write("|");

    // Tank price
    int currentPrice = auctionItem.Price!.PriceValue;
    Console.ForegroundColor = ConsoleColor.DarkYellow;
    Console.Write($"{currentPrice.ToString().PadLeft(7)}");
    Console.ResetColor();
    // TankPrice drop (if any)
    if (currentPrice != auctionItem.InitialPrice)
    {
        int diff = auctionItem.InitialPrice - currentPrice;
        int diffPercent = Convert.ToInt32(100 * (Convert.ToDecimal(diff) / Convert.ToDecimal(auctionItem.InitialPrice)));
        Console.Write($" -{diff} ({diffPercent}%)".PadRight(12));
    }
    else
    {
        Console.Write(" ".PadRight(12));
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
    Console.ForegroundColor = ConsoleColor.DarkYellow;
    Console.Write($"{nextPrice.ToString().PadLeft(7)}");
    Console.ResetColor();
    var timeToNextPrice = auctionItem.NextPriceDropAt - DateTime.UtcNow;
    Console.Write(" in ");
    Console.Write(timeToNextPrice.ToString(@"hh\:mm"));

    Console.Write(" |");

    // AvailabilityDates
    Console.Write ($" {auctionItem.AvailableFrom.ToString("dd.MM.yy")} - {auctionItem.AvailableBefore.ToString("dd.MM.yy")} |");

    Console.WriteLine();
}

